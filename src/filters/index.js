/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Filters
 */

var Filters = {
    Controller: require('./Controller'),

    Barrel: require('./Barrel'),
    Blend: require('./Blend'),
    Blur: require('./Blur'),
    Bokeh: require('./Bokeh'),
    ColorMatrix: require('./ColorMatrix'),
    Displacement: require('./Displacement'),
    Glow: require('./Glow'),
    Mask: require('./Mask'),
    ParallelFilters: require('./ParallelFilters'),
    Pixelate: require('./Pixelate'),
    Sampler: require('./Sampler'),
    Shadow: require('./Shadow'),
    Threshold: require('./Threshold')
};

module.exports = Filters;