import { IVector } from './Vector';
/**
 * The `Matter.Svg` module contains methods for converting SVG images into an array of vector points.
 *
 * To use this module you also need the SVGPathSeg polyfill: https://github.com/progers/pathseg
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Svg {
    /**
     * Converts an SVG path into an array of vector points.
     * If the input path forms a concave shape, you must decompose the result into convex parts before use.
     * See `Bodies.fromVertices` which provides support for this.
     * Note that this function is not guaranteed to support complex paths (such as those with holes).
     * You must load the `pathseg.js` polyfill on newer browsers.
     * @method pathToVertices
     * @param path
     * @param sampleLength
     * @return points
     */
    static pathToVertices(path: SVGPathElement, sampleLength?: number): IVector[];
    protected static _svgPathToAbsolute(path: SVGPathElement): void;
}
