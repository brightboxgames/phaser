/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CameraEvents = require('../../../cameras/2d/events');
var GetColor32 = require('../../../display/color/GetColor32');
var Rectangle = require('../../../geom/rectangle/Rectangle');
var Class = require('../../../utils/Class');
var Utils = require('../Utils.js');
var RenderNode = require('./RenderNode');

function getAlphaTint (alpha)
{
    return Utils.getTintAppendFloatAlpha(0xffffff, alpha);
}

var blankRenderOptions = {};

/**
 * @class Camera
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var Camera = new Class({
    Extends: RenderNode,

    initialize: function Camera (manager)
    {
        RenderNode.call(this, 'Camera', manager);

        /**
         * The RenderNode that handles batching quads.
         * This is used when a camera is rendering to a framebuffer,
         * and the framebuffer needs to be drawn to the parent context.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Camera#batchHandlerQuadNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad}
         * @since 4.0.0
         */
        this.batchHandlerQuadNode = manager.getNode('BatchHandlerQuad');

        /**
         * The RenderNode that handles filling the camera with a
         * flat color. This is used to render the camera background,
         * flash effects, and fade effects.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Camera#fillCameraNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.FillCamera}
         * @since 4.0.0
         */
        this.fillCameraNode = manager.getNode('FillCamera');

        /**
         * The RenderNode that handles rendering lists of children.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Camera#listCompositorNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.ListCompositor}
         * @since 4.0.0
         */
        this.listCompositorNode = manager.getNode('ListCompositor');
    },

    /**
     * Renders the children through this camera.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.Camera#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.GameObjects.GameObject[]} children - The list of children to render.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - Current Camera.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - This transform matrix is defined if the game object is nested
     * @param {boolean} [forceFramebuffer=false] - Should the camera always draw to a new framebuffer? This will also be activated if the camera has filters enabled.
     */
    run: function (drawingContext, children, camera, parentTransformMatrix, forceFramebuffer)
    {
        this.onRunBegin(drawingContext);

        var currentContext;
        var drawingContextPool = drawingContext.renderer.drawingContextPool;
        var manager = this.manager;

        var alpha = camera.alpha;

        // Check if the camera has any active filters.
        var internalFilters = camera.filters.internal.getActive();
        var externalFilters = camera.filters.external.getActive();

        var useFramebuffers = forceFramebuffer || internalFilters.length || externalFilters.length || alpha < 1;

        var cx = camera.x;
        var cy = camera.y;
        var cw = camera.width;
        var ch = camera.height;

        // Generate a drawing context.
        var baseContext = drawingContext.getClone();
        baseContext.setScissorBox(0, 0, drawingContext.width, drawingContext.height);
        baseContext.setCamera(camera);

        if (useFramebuffers)
        {
            currentContext = drawingContextPool.get(cw, ch);
            currentContext.setScissorBox(cx, cy, cw, ch);
            currentContext.setCamera(camera);
        }
        else
        {
            currentContext = baseContext;
        }

        // Enter drawing context.
        currentContext.use();

        var fillCamera = this.fillCameraNode;

        // Draw camera background.
        if (camera.backgroundColor.alphaGL > 0)
        {
            var bg = camera.backgroundColor;
            var col = GetColor32(bg.red, bg.green, bg.blue, bg.alpha);
            fillCamera.run(currentContext, col);
        }

        // Draw children.
        this.listCompositorNode.run(currentContext, children, useFramebuffers ? null : parentTransformMatrix);

        // Draw camera post effects.

        var flashEffect = camera.flashEffect;
        if (flashEffect.postRenderWebGL())
        {
            col = GetColor32(flashEffect.red, flashEffect.green, flashEffect.blue, flashEffect.alpha * 255);
            fillCamera.run(currentContext, col);
        }

        var fadeEffect = camera.fadeEffect;
        if (fadeEffect.postRenderWebGL())
        {
            col = GetColor32(fadeEffect.red, fadeEffect.green, fadeEffect.blue, fadeEffect.alpha * 255);
            fillCamera.run(currentContext, col);
        }

        // Finish rendering children.
        manager.finishBatch();


        // Filters and framebuffers.
        if (useFramebuffers)
        {
            var index, filter, padding, renderNode, tint;

            // Draw internal filters.
            var coverageInternal = new Rectangle(0, 0, currentContext.width, currentContext.height);
            for (index = 0; index < internalFilters.length; index++)
            {
                filter = internalFilters[index];

                // Execute the filter RenderNode.
                renderNode = manager.getNode(filter.renderNode);
                currentContext = renderNode.run(filter, currentContext);

                // Record padding.
                padding = filter.getPadding();
                coverageInternal.setTo(
                    coverageInternal.x + padding.x,
                    coverageInternal.y + padding.y,
                    coverageInternal.width + padding.width,
                    coverageInternal.height + padding.height
                );
            }
            var outputContext = currentContext;

            // Begin external filters.
            var drawExternalFilters = externalFilters.length > 0;
            var copyInternal = !drawExternalFilters;
            var coverageExternal = new Rectangle(0, 0, baseContext.width, baseContext.height);
            if (drawExternalFilters)
            {
                // Calculate coverage, starting from the final filter.
                for (index = externalFilters.length - 1; index >= 0; index--)
                {
                    filter = externalFilters[index];

                    if (!filter.active) { continue; }

                    padding = filter.getPadding();

                    // Increase coverage.
                    coverageExternal.setTo(
                        coverageExternal.x + padding.x,
                        coverageExternal.y + padding.y,
                        coverageExternal.width + padding.width,
                        coverageExternal.height + padding.height
                    );
                }

                // Will the texture need to be repositioned for the external filters?
                copyInternal = coverageExternal.width !== currentContext.width || coverageExternal.height !== currentContext.height || parentTransformMatrix;

                if (copyInternal)
                {
                    // Create external context.
                    currentContext = drawingContextPool.get(coverageExternal.width, coverageExternal.height);
                    currentContext.setScissorBox(0, 0, coverageExternal.width, coverageExternal.height);
                    currentContext.setCamera(baseContext.camera);
                    currentContext.use();
                }
            }
            else
            {
                currentContext = baseContext;
            }

            if (copyInternal)
            {
                // Draw the framebuffer to the external context.
                // If there are no external filters, this will be the final draw.
                var quad;
                if (parentTransformMatrix)
                {
                    parentTransformMatrix.setQuad(
                        coverageInternal.x - coverageExternal.x,
                        coverageInternal.y - coverageExternal.y,
                        coverageInternal.width + coverageInternal.x - coverageExternal.x,
                        coverageInternal.height + coverageInternal.y - coverageExternal.y
                    );
                    quad = parentTransformMatrix.quad;
                }
                else
                {
                    var offsetX = (currentContext.width - outputContext.width) / 2;
                    var offsetY = (currentContext.height - outputContext.height) / 2;
                    var w = currentContext.width - offsetX;
                    var h = currentContext.height - offsetY;
                    quad = [
                        offsetX, offsetY,
                        offsetX, h,
                        w, h,
                        w, offsetY
                    ];
                }

                tint = drawExternalFilters ? 0xffffffff : getAlphaTint(alpha);

                this.batchHandlerQuadNode.batch(
                    currentContext,

                    // Texture.
                    // While this comes from a temporary framebuffer,
                    // and this is a batch operation,
                    // so the texture might not be accessed immediately,
                    // any operation that accesses the framebuffer pool
                    // will cause the batch to flush before the texture is reassigned.
                    outputContext.texture,

                    // Transformed quad in order TL, BL, TR, BR:
                    quad[0], quad[1],
                    quad[2], quad[3],
                    quad[6], quad[7],
                    quad[4], quad[5],

                    // Texture coordinates in X, Y, Width, Height:
                    0, 0, 1, 1,

                    // Tint color:
                    tint,

                    // Tint colors in order TL, BL, TR, BR:
                    tint, tint, tint, tint,

                    // Render options:
                    blankRenderOptions
                );
            }

            if (outputContext !== currentContext)
            {
                outputContext.release();
            }


            // Draw external filters.
            if (drawExternalFilters)
            {
                var skipDrawOut = false;
                outputContext = null;
                padding = new Rectangle();

                for (index = 0; index < externalFilters.length; index++)
                {
                    filter = externalFilters[index];

                    if (
                        // The filter supports drawing to the base context.
                        filter.allowBaseDraw &&

                        // The texture is the same size as the base context.
                        currentContext.width === baseContext.width &&
                        currentContext.height === baseContext.height &&

                        // Last filter.
                        index === externalFilters.length - 1 &&

                        // Alpha is 1.
                        alpha === 1
                    )
                    {
                        // Draw the final filter straight to the base context.
                        skipDrawOut = true;
                        outputContext = baseContext;
                    }

                    // Execute the filter RenderNode.
                    renderNode = manager.getNode(filter.renderNode);
                    currentContext = renderNode.run(filter, currentContext, outputContext, padding);

                    // Get and invert the padding for the next step.
                    padding = filter.currentPadding;

                    padding.x = -padding.x;
                    padding.y = -padding.y;
                    padding.width = -padding.width;
                    padding.height = -padding.height;
                }

                if (!skipDrawOut)
                {
                    // Draw external stack to parent context.
                    tint = getAlphaTint(alpha);

                    var x1 = -padding.x;
                    var y1 = -padding.y;
                    var x2 = currentContext.width + padding.right;
                    var y2 = currentContext.height + padding.bottom;

                    this.batchHandlerQuadNode.batch(
                        baseContext,

                        // Texture.
                        currentContext.texture,

                        // Transformed quad in order TL, BL, TR, BR:
                        x1, y1,
                        x1, y2,
                        x2, y1,
                        x2, y2,

                        // Texture coordinates in X, Y, Width, Height:
                        0, 0, 1, 1,

                        // Tint color:
                        tint,

                        // Tint colors in order TL, BL, TR, BR:
                        tint, tint, tint, tint,

                        // Render options:
                        blankRenderOptions
                    );

                    currentContext.release();
                }
            }

        }

        camera.dirty = false;

        camera.emit(CameraEvents.POST_RENDER, camera);

        this.onRunEnd(drawingContext);
    }
});

module.exports = Camera;