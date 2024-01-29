/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

require('./polyfills/requestVideoFrame.js');

var CONST = require('./const.js');
var Extend = require('./utils/object/Extend.js');

/**
 * @namespace Phaser
 */

var Phaser = {
    // Actions: require('./actions'),
    Animations: require('./animations/index.js'),
    BlendModes: require('./renderer/BlendModes.js'),
    Cache: require('./cache/index.js'),
    Cameras: {
        Scene2D: require('./cameras/2d/index.js')
    },
    Core: {
        Config: require('./core/Config.js'),
        CreateRenderer: require('./core/CreateRenderer.js'),

        // DebugHeader: require('./core/DebugHeader'),
        Events: require('./core/events/index.js'),
        TimeStep: require('./core/TimeStep.js'),
        VisibilityHandler: require('./core/VisibilityHandler.js')
    },
    Class: require('./utils/Class.js'),
    Create: require('./create/index.js'),
    Curves: require('./curves/index.js'),
    Data: require('./data/index.js'),
    Display: require('./display/index.js'),
    DOM: require('./dom/index.js'),
    Events: require('./events/index'),
    FX: require('./fx/index.js'),
    Game: require('./core/Game.js'),

    //  GameObjects: require('./gameobjects'),
    GameObjects: {
        Events: require('./gameobjects/events/index.js'),

        DisplayList: require('./gameobjects/DisplayList.js'),
        GameObjectCreator: require('./gameobjects/GameObjectCreator.js'),
        GameObjectFactory: require('./gameobjects/GameObjectFactory.js'),
        UpdateList: require('./gameobjects/UpdateList.js'),

        Components: require('./gameobjects/components/index.js'),
        GetCalcMatrix: require('./gameobjects/GetCalcMatrix.js'),

        BuildGameObject: require('./gameobjects/BuildGameObject.js'),
        BuildGameObjectAnimation: require('./gameobjects/BuildGameObjectAnimation.js'),
        GameObject: require('./gameobjects/GameObject.js'),
        BitmapText: require('./gameobjects/bitmaptext/static/BitmapText.js'),

        //  Blitter: require('./gameobjects/blitter/Blitter'),
        //   Bob: require('./gameobjects/blitter/Bob'),
        Container: require('./gameobjects/container/Container.js'),
        DOMElement: require('./gameobjects/domelement/DOMElement.js'),
        DynamicBitmapText: require('./gameobjects/bitmaptext/dynamic/DynamicBitmapText.js'),

        // Extern: require('./gameobjects/extern/Extern.js'),
        Graphics: require('./gameobjects/graphics/Graphics.js'),
        Group: require('./gameobjects/group/Group.js'),
        Image: require('./gameobjects/image/Image.js'),
        Layer: require('./gameobjects/layer/Layer.js'),
        NineSlice: require('./gameobjects/nineslice/NineSlice.js'),
        Particles: require('./gameobjects/particles/index.js'),

        // PathFollower: require('./gameobjects/pathfollower/PathFollower'),
        RenderTexture: require('./gameobjects/rendertexture/RenderTexture.js'),

        //  RetroFont: require('./gameobjects/bitmaptext/RetroFont'),
        // Rope: require('./gameobjects/rope/Rope'),
        Sprite: require('./gameobjects/sprite/Sprite.js'),

        Text: require('./gameobjects/text/Text.js'),
        GetTextSize: require('./gameobjects/text/GetTextSize.js'),
        MeasureText: require('./gameobjects/text/MeasureText.js'),
        TextStyle: require('./gameobjects/text/TextStyle.js'),

        TileSprite: require('./gameobjects/tilesprite/TileSprite.js'),

        // Zone: require('./gameobjects/zone/Zone'),
        // Video: require('./gameobjects/video/Video'),

        //  Shapes

        Shape: require('./gameobjects/shape/Shape.js'),

        // Arc: require('./gameobjects/shape/arc/Arc'),
        // Curve: require('./gameobjects/shape/curve/Curve'),
        // Ellipse: require('./gameobjects/shape/ellipse/Ellipse'),
        // Grid: require('./gameobjects/shape/grid/Grid'),
        // IsoBox: require('./gameobjects/shape/isobox/IsoBox'),
        // IsoTriangle: require('./gameobjects/shape/isotriangle/IsoTriangle'),
        Line: require('./gameobjects/shape/line/Line.js'),
        Polygon: require('./gameobjects/shape/polygon/Polygon.js'),
        Rectangle: require('./gameobjects/shape/rectangle/Rectangle.js'),

        // Star: require('./gameobjects/shape/star/Star'),
        // Triangle: require('./gameobjects/shape/triangle/Triangle'),

        //  Game Object Factories

        Factories: {
            // Blitter: require('./gameobjects/blitter/BlitterFactory'),
            Container: require('./gameobjects/container/ContainerFactory.js'),
            DOMElement: require('./gameobjects/domelement/DOMElementFactory.js'),
            DynamicBitmapText: require('./gameobjects/bitmaptext/dynamic/DynamicBitmapTextFactory.js'),
            Extern: require('./gameobjects/extern/ExternFactory.js'),
            Graphics: require('./gameobjects/graphics/GraphicsFactory.js'),
            Group: require('./gameobjects/group/GroupFactory.js'),
            Image: require('./gameobjects/image/ImageFactory.js'),
            Layer: require('./gameobjects/layer/LayerFactory.js'),
            NineSlice: require('./gameobjects/nineslice/NineSliceFactory.js'),
            Particles: require('./gameobjects/particles/ParticleEmitterFactory.js'),

            // PathFollower: require('./gameobjects/pathfollower/PathFollowerFactory'),
            RenderTexture: require('./gameobjects/rendertexture/RenderTextureFactory.js'),

            // Rope: require('./gameobjects/rope/RopeFactory'),
            Sprite: require('./gameobjects/sprite/SpriteFactory.js'),
            StaticBitmapText: require('./gameobjects/bitmaptext/static/BitmapTextFactory.js'),
            Text: require('./gameobjects/text/TextFactory.js'),
            TileSprite: require('./gameobjects/tilesprite/TileSpriteFactory.js'),

            //  Zone: require('./gameobjects/zone/ZoneFactory'),
            //   Video: require('./gameobjects/video/VideoFactory'),

            //  Shapes
            // Arc: require('./gameobjects/shape/arc/ArcFactory'),
            // Curve: require('./gameobjects/shape/curve/CurveFactory'),
            // Ellipse: require('./gameobjects/shape/ellipse/EllipseFactory'),
            // Grid: require('./gameobjects/shape/grid/GridFactory'),
            // IsoBox: require('./gameobjects/shape/isobox/IsoBoxFactory'),
            //  IsoTriangle: require('./gameobjects/shape/isotriangle/IsoTriangleFactory'),
            Line: require('./gameobjects/shape/line/LineFactory.js'),
            Polygon: require('./gameobjects/shape/polygon/PolygonFactory.js'),
            Rectangle: require('./gameobjects/shape/rectangle/RectangleFactory.js'),

            //  Star: require('./gameobjects/shape/star/StarFactory'),
            //  Triangle: require('./gameobjects/shape/triangle/TriangleFactory'),

            Shader: require('./gameobjects/shader/ShaderFactory.js'),
            Mesh: require('./gameobjects/mesh/MeshFactory.js')

            //   PointLight: require('./gameobjects/pointlight/PointLightFactory')
        },

        Creators: {
            // Blitter: require('./gameobjects/blitter/BlitterCreator'),
            Container: require('./gameobjects/container/ContainerCreator.js'),
            DynamicBitmapText: require('./gameobjects/bitmaptext/dynamic/DynamicBitmapTextCreator.js'),
            Graphics: require('./gameobjects/graphics/GraphicsCreator.js'),
            Group: require('./gameobjects/group/GroupCreator.js'),
            Image: require('./gameobjects/image/ImageCreator.js'),
            Layer: require('./gameobjects/layer/LayerCreator.js'),
            NineSlice: require('./gameobjects/nineslice/NineSliceCreator.js'),
            Particles: require('./gameobjects/particles/ParticleEmitterCreator.js'),
            RenderTexture: require('./gameobjects/rendertexture/RenderTextureCreator.js'),

            //   Rope: require('./gameobjects/rope/RopeCreator'),
            Sprite: require('./gameobjects/sprite/SpriteCreator.js'),
            StaticBitmapText: require('./gameobjects/bitmaptext/static/BitmapTextCreator.js'),
            Text: require('./gameobjects/text/TextCreator.js'),
            TileSprite: require('./gameobjects/tilesprite/TileSpriteCreator.js'),

            // Zone: require('./gameobjects/zone/ZoneCreator'),
            //   Video: require('./gameobjects/video/VideoCreator'),
            Shader: require('./gameobjects/shader/ShaderCreator.js'),
            Mesh: require('./gameobjects/mesh/MeshCreator.js')

            //  PointLight: require('./gameobjects/pointlight/PointLightCreator')
        },

        Shader: require('./gameobjects/shader/Shader.js'),
        Mesh: require('./gameobjects/mesh/Mesh.js')

        // PointLight: require('./gameobjects/pointlight/PointLight'),

    // Light: require('./gameobjects/lights/Light'),
    // LightsManager: require('./gameobjects/lights/LightsManager'),
    // LightsPlugin: require('./gameobjects/lights/LightsPlugin')
    },
    Geom: require('./geom/index.js'),
    Input: require('./input/index.js'),

    // Loader: require('./loader'),// Changed this
    Loader: {
        Events: require('./loader/events/index.js'),

        // FileTypes: require('./loader/filetypes'),
        FileTypes: {
            AnimationJSONFile: require('./loader/filetypes/AnimationJSONFile.js'),

            // AsepriteFile: require('./loader/filetypes/AsepriteFile'),
            AtlasJSONFile: require('./loader/filetypes/AtlasJSONFile.js'),
            AtlasXMLFile: require('./loader/filetypes/AtlasXMLFile.js'),
            AudioFile: require('./loader/filetypes/AudioFile.js'),
            AudioSpriteFile: require('./loader/filetypes/AudioSpriteFile.js'),

            // BinaryFile: require('./loader/filetypes/BinaryFile'),
            BitmapFontFile: require('./loader/filetypes/BitmapFontFile.js'),

            //  CompressedTextureFile: require('./loader/filetypes/CompressedTextureFile'),
            // CSSFile: require('./loader/filetypes/CSSFile'),
            // GLSLFile: require('./loader/filetypes/GLSLFile'),
            //  HTML5AudioFile: require('./loader/filetypes/HTML5AudioFile'),
            //  HTMLFile: require('./loader/filetypes/HTMLFile'),
            //  HTMLTextureFile: require('./loader/filetypes/HTMLTextureFile'),
            ImageFile: require('./loader/filetypes/ImageFile.js'),
            JSONFile: require('./loader/filetypes/JSONFile.js'),
            MultiAtlasFile: require('./loader/filetypes/MultiAtlasFile.js'),

            //  MultiScriptFile: require('./loader/filetypes/MultiScriptFile'),
            //  OBJFile: require('./loader/filetypes/OBJFile'),
            //  PackFile: require('./loader/filetypes/PackFile'),
            // PluginFile: require('./loader/filetypes/PluginFile'),
            // SceneFile: require('./loader/filetypes/SceneFile'),
            //  ScenePluginFile: require('./loader/filetypes/ScenePluginFile'),
            ScriptFile: require('./loader/filetypes/ScriptFile.js'),

            //  SpriteSheetFile: require('./loader/filetypes/SpriteSheetFile'),
            //  SVGFile: require('./loader/filetypes/SVGFile'),
            //  TextFile: require('./loader/filetypes/TextFile'),
            //  TilemapCSVFile: require('./loader/filetypes/TilemapCSVFile'),
            //  TilemapImpactFile: require('./loader/filetypes/TilemapImpactFile'),
            TilemapJSONFile: require('./loader/filetypes/TilemapJSONFile.js'),

            //  UnityAtlasFile: require('./loader/filetypes/UnityAtlasFile'),
            // VideoFile: require('./loader/filetypes/VideoFile'),
            XMLFile: require('./loader/filetypes/XMLFile.js')
        },
        File: require('./loader/File.js'),
        FileTypesManager: require('./loader/FileTypesManager.js'),
        GetURL: require('./loader/GetURL.js'),
        LoaderPlugin: require('./loader/LoaderPlugin.js'),
        MergeXHRSettings: require('./loader/MergeXHRSettings.js'),
        MultiFile: require('./loader/MultiFile.js'),
        XHRLoader: require('./loader/XHRLoader.js'),
        XHRSettings: require('./loader/XHRSettings.js')
    },
    Math: require('./math/index.js'),

    //  Physics: require('./physics'), // Changed this
    Plugins: require('./plugins/index.js'),

    // Renderer: require('./renderer'), // Changed this
    Renderer: {
    // Canvas: require('./renderer/canvas'),
        Events: require('./renderer/events/index.js'),

        //   Snapshot: require('./renderer/snapshot'),
        WebGL: require('./renderer/webgl/index.js')
    },
    Scale: require('./scale/index.js'),
    ScaleModes: require('./renderer/ScaleModes.js'),
    Scene: require('./scene/Scene.js'),
    Scenes: require('./scene/index.js'),
    Structs: require('./structs/index.js'),
    Textures: require('./textures/index.js'),

    // Tilemaps: require('./tilemaps'),
    Time: require('./time/index.js'),
    Tweens: require('./tweens/index.js'),
    Utils: require('./utils/index.js')
};

//  Merge in the optional plugins and WebGL only features

if (typeof FEATURE_SOUND)
{
    Phaser.Sound = require('./sound/index.js');
}

//   Merge in the consts

Phaser = Extend(false, Phaser, CONST);

/**
 * The root types namespace.
 *
 * @namespace Phaser.Types
 * @since 3.17.0
 */

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;

/*
 * "Documentation is like pizza: when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */
