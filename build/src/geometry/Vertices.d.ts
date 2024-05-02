import { IBody } from '../body/Body';
import { IVector } from './Vector';
export interface IVertex extends IVector {
    index: number;
    body?: IBody;
    isInternal: boolean;
}
export type IVertices = IVertex[];
/**
 * The `Matter.Vertices` module contains methods for creating and manipulating sets of vertices.
 * A set of vertices is an array of `Matter.Vector` with additional indexing properties inserted by `Vertices.create`.
 * A `Matter.Body` maintains a set of vertices to represent the shape of the object (its convex hull).
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Vertices {
    /**
     * Creates a new set of `Matter.Body` compatible vertices.
     * The `points` argument accepts an array of `Matter.Vector` points orientated around the origin `(0, 0)`, for example:
     *
     *     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
     *
     * The `Vertices.create` method returns a new array of vertices, which are similar to Matter.Vector objects,
     * but with some additional references required for efficient collision detection routines.
     *
     * Vertices must be specified in clockwise order.
     *
     * Note that the `body` argument is not optional, a `Matter.Body` reference must be provided.
     *
     * @method create
     * @param points
     * @param body
     */
    static create(points: IVector[], body?: IBody): IVertices;
    /**
     * Parses a string containing ordered x y pairs separated by spaces (and optionally commas),
     * into a `Matter.Vertices` object for the given `Matter.Body`.
     * For parsing SVG paths, see `Svg.pathToVertices`.
     * @method fromPath
     * @param path
     * @param body
     * @return vertices
     */
    static fromPath(path: string, body?: IBody): IVertices;
    /**
     * Returns the centre (centroid) of the set of vertices.
     * @method centre
     * @param vertices
     * @return The centre point
     */
    static centre(vertices: IVertices): IVector;
    /**
     * Returns the average (mean) of the set of vertices.
     * @method mean
     * @param vertices
     * @return The average point
     */
    static mean(vertices: IVertices): IVector;
    /**
     * Returns the area of the set of vertices.
     * @method area
     * @param vertices
     * @param signed
     * @return The area
     */
    static area(vertices: IVertices, signed?: boolean): number;
    /**
     * Returns the moment of inertia (second moment of area) of the set of vertices given the total mass.
     * @method inertia
     * @param vertices
     * @param mass
     * @return  The polygon's moment of inertia
     */
    static inertia(vertices: IVertices, mass: number): number;
    /**
     * Translates the set of vertices in-place.
     * @method translate
     * @param vertices
     * @param vector
     * @param scalar
     */
    static translate(vertices: IVertices, vector: IVector, scalar?: number): IVertices;
    /**
     * Rotates the set of vertices in-place.
     * @method rotate
     * @param vertices
     * @param angle
     * @param point
     */
    static rotate(vertices: IVertices, angle: number, point: IVector): IVertices | void;
    /**
     * Returns `true` if the `point` is inside the set of `vertices`.
     * @method contains
     * @param vertices
     * @param point
     * @return True if the vertices contains point, otherwise false
     */
    static contains(vertices: IVertices, point: IVector): boolean;
    /**
     * Scales the vertices from a point (default is centre) in-place.
     * @method scale
     * @param vertices
     * @param scaleX
     * @param scaleY
     * @param point
     */
    static scale(vertices: IVertices, scaleX: number, scaleY: number, point?: IVector): IVertices;
    /**
     * Chamfers a set of vertices by giving them rounded corners, returns a new set of vertices.
     * The radius parameter is a single number or an array to specify the radius for each vertex.
     * @method chamfer
     * @param vertices
     * @param radius
     * @param quality
     * @param qualityMin
     * @param qualityMax
     */
    static chamfer(vertices: IVertices, radius?: number[] | number, quality?: number, qualityMin?: number, qualityMax?: number): IVertices;
    /**
     * Sorts the input vertices into clockwise order in place.
     * @method clockwiseSort
     * @param vertices
     * @return vertices
     */
    static clockwiseSort(vertices: IVertices): IVertices;
    /**
     * Returns true if the vertices form a convex shape (vertices must be in clockwise order).
     * @method isConvex
     * @param vertices
     * @return `true` if the `vertices` are convex, `false` if not (or `null` if not computable).
     */
    static isConvex(vertices: IVertices): boolean | null;
    /**
     * Returns the convex hull of the input vertices as a new array of points.
     * @method hull
     * @param vertices
     * @return vertices
     */
    static hull(vertices: IVertices): IVertices;
}
