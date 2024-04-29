export interface IVector {
    /** @default 0 */
    x: number;
    /** @default 0 */
    y: number;
}
/**
 * The `Matter.Vector` module contains methods for creating and manipulating vectors.
 * Vectors are the basis of all the geometry related operations in the engine.
 * A `Matter.Vector` object is of the form `{ x: 0, y: 0 }`.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Vector {
    /**
     * Creates a new vector.
     * @method create
     * @param x
     * @param  y
     * @return  A new vector
     */
    static create(x?: number, y?: number): IVector;
    /**
     * Returns a new vector with `x` and `y` copied from the given `vector`.
     * @method clone
     * @param vector
     * @return A new cloned vector
     */
    static clone(vector: IVector): IVector;
    /**
     * Returns the magnitude (length) of a vector.
     * @method magnitude
     * @param vector
     * @return The magnitude of the vector
     */
    static magnitude(vector: IVector): number;
    /**
     * Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
     * @method magnitudeSquared
     * @param vector
     * @return The squared magnitude of the vector
     */
    static magnitudeSquared(vector: IVector): number;
    /**
     * Rotates the vector about (0, 0) by specified angle.
     * @method rotate
     * @param vector
     * @param angle
     * @param output
     * @return The vector rotated about (0, 0)
     */
    static rotate(vector: IVector, angle: number, output?: IVector): IVector;
    /**
     * Rotates the vector about a specified point by specified angle.
     * @method rotateAbout
     * @param vector
     * @param angle
     * @param point
     * @param output
     * @return A new vector rotated about the point
     */
    static rotateAbout(vector: IVector, angle: number, point: IVector, output?: IVector): IVector;
    /**
     * Normalises a vector (such that its magnitude is `1`).
     * @method normalise
     * @param vector
     * @return A new vector normalised
     */
    static normalise(vector: IVector): IVector;
    /**
     * Returns the dot-product of two vectors.
     * @param vectorA
     * @param vectorB
     * @return The dot product of the two vectors
     */
    static dot(vectorA: IVector, vectorB: IVector): number;
    /**
     * Returns the cross-product of two vectors.
     * @param vectorA
     * @param vectorB
     * @return The cross product of the two vectors
     */
    static cross(vectorA: IVector, vectorB: IVector): number;
    /**
     * Returns the cross-product of three vectors.
     * @param vectorA
     * @param vectorB
     * @param vectorC
     * @return The cross product of the three vectors
     */
    static cross3(vectorA: IVector, vectorB: IVector, vectorC: IVector): number;
    /**
     * Adds the two vectors.
     * @method add
     * @param vectorA
     * @param vectorB
     * @param output
     * @return A new vector of vectorA and vectorB added
     */
    static add(vectorA: IVector, vectorB: IVector, output?: IVector): IVector;
    /**
     * Subtracts the two vectors.
     * @param vectorA
     * @param vectorB
     * @param output
     * @return A new vector of vectorA and vectorB subtracted
     */
    static sub(vectorA: IVector, vectorB: IVector, output?: IVector): IVector;
    /**
     * Multiplies a vector and a scalar.
     * @method mult
     * @param vector
     * @param scalar
     * @return A new vector multiplied by scalar
     */
    static mult(vector: IVector, scalar: number): IVector;
    /**
     * Divides a vector and a scalar.
     * @method div
     * @param vector
     * @param scalar
     * @return A new vector divided by scalar
     */
    static div(vector: IVector, scalar: number): IVector;
    /**
     * Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
     * @method perp
     * @param vector
     * @param negate
     * @return The perpendicular vector
     */
    static perp(vector: IVector, negate?: boolean): IVector;
    /**
     * Negates both components of a vector such that it points in the opposite direction.
     * @method neg
     * @param vector
     * @return The negated vector
     */
    static neg(vector: IVector): IVector;
    /**
     * Returns the angle between the vector `vectorB - vectorA` and the x-axis in radians.
     * @method angle
     * @param vectorA
     * @param vectorB
     * @return The angle in radians
     */
    static angle(vectorA: IVector, vectorB: IVector): number;
    /**
     * Temporary vector pool (not thread-safe).
     */
    protected _temp: IVector[];
}
