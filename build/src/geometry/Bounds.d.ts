import { IVector } from './Vector';
import { IVertices } from './Vertices';
export interface IBounds {
    min: IVector;
    max: IVector;
}
/**
 * The `Matter.Bounds` module contains methods for creating and manipulating axis-aligned bounding boxes (AABB).
 */
export default class Bounds {
    /**
     * Creates a new axis-aligned bounding box (AABB) for the given vertices.
     * @method create
     * @param vertices
     * @return A new bounds object
     */
    static create(vertices?: IVertices): IBounds;
    /**
     * Updates bounds using the given vertices and extends the bounds given a velocity.
     * @method update
     * @param bounds
     * @param vertices
     * @param velocity
     */
    static update(bounds: IBounds, vertices: IVertices, velocity?: IVector): void;
    /**
     * Returns true if the bounds contains the given point.
     * @method contains
     * @param bounds
     * @param point
     * @return True if the bounds contain the point, otherwise false
     */
    static contains(bounds: IBounds, point: IVector): boolean;
    /**
     * Returns true if the two bounds intersect.
     * @method overlaps
     * @param boundsA
     * @param boundsB
     * @return True if the bounds overlap, otherwise false
     */
    static overlaps(boundsA: IBounds, boundsB: IBounds): boolean;
    /**
     * Translates the bounds by the given vector.
     * @method translate
     * @param bounds
     * @param vector
     */
    static translate(bounds: IBounds, vector: IVector): void;
    /**
     * Shifts the bounds to the given position.
     * @method shift
     * @param bounds
     * @param position
     */
    static shift(bounds: IBounds, position: IVector): void;
}
