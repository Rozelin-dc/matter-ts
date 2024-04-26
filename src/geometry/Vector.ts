export interface IVector {
  /** @default 0 */
  x: number
  /** @default 0 */
  y: number
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
  public static create(x?: number, y?: number): IVector {
    return { x: x || 0, y: y || 0 }
  }

  /**
   * Returns a new vector with `x` and `y` copied from the given `vector`.
   * @method clone
   * @param vector
   * @return A new cloned vector
   */
  public static clone(vector: IVector): IVector {
    return { x: vector.x, y: vector.y }
  }

  /**
   * Returns the magnitude (length) of a vector.
   * @method magnitude
   * @param vector
   * @return The magnitude of the vector
   */
  public static magnitude(vector: IVector): number {
    return Math.sqrt(Vector.magnitudeSquared(vector))
  }

  /**
   * Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
   * @method magnitudeSquared
   * @param vector
   * @return The squared magnitude of the vector
   */
  public static magnitudeSquared(vector: IVector): number {
    return vector.x * vector.x + vector.y * vector.y
  }

  /**
   * Rotates the vector about (0, 0) by specified angle.
   * @method rotate
   * @param vector
   * @param angle
   * @param output
   * @return The vector rotated about (0, 0)
   */
  public static rotate(
    vector: IVector,
    angle: number,
    output: IVector = Vector.create()
  ): IVector {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x = vector.x * cos - vector.y * sin
    output.y = vector.x * sin + vector.y * cos
    output.x = x
    return output
  }

  /**
   * Rotates the vector about a specified point by specified angle.
   * @method rotateAbout
   * @param vector
   * @param angle
   * @param point
   * @param output
   * @return A new vector rotated about the point
   */
  public static rotateAbout(
    vector: IVector,
    angle: number,
    point: IVector,
    output: IVector = Vector.create()
  ): IVector {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x =
      point.x + ((vector.x - point.x) * cos - (vector.y - point.y) * sin)
    output.y =
      point.y + ((vector.x - point.x) * sin + (vector.y - point.y) * cos)
    output.x = x
    return output
  }

  /**
   * Normalises a vector (such that its magnitude is `1`).
   * @method normalise
   * @param vector
   * @return A new vector normalised
   */
  public static normalise(vector: IVector): IVector {
    const magnitude = Vector.magnitude(vector)
    if (magnitude === 0) {
      return { x: 0, y: 0 }
    }
    return { x: vector.x / magnitude, y: vector.y / magnitude }
  }

  /**
   * Returns the dot-product of two vectors.
   * @param vectorA
   * @param vectorB
   * @return The dot product of the two vectors
   */
  public static dot(vectorA: IVector, vectorB: IVector): number {
    return vectorA.x * vectorB.x + vectorA.y * vectorB.y
  }

  /**
   * Returns the cross-product of two vectors.
   * @param vectorA
   * @param vectorB
   * @return The cross product of the two vectors
   */
  public static cross(vectorA: IVector, vectorB: IVector): number {
    return vectorA.x * vectorB.y - vectorA.y * vectorB.x
  }

  /**
   * Returns the cross-product of three vectors.
   * @param vectorA
   * @param vectorB
   * @param vectorC
   * @return The cross product of the three vectors
   */
  public static cross3(vectorA: IVector, vectorB: IVector, vectorC: IVector): number {
    return (
      (vectorB.x - vectorA.x) * (vectorC.y - vectorA.y) -
      (vectorB.y - vectorA.y) * (vectorC.x - vectorA.x)
    )
  }

  /**
   * Adds the two vectors.
   * @method add
   * @param vectorA
   * @param vectorB
   * @param output
   * @return A new vector of vectorA and vectorB added
   */
  public static add(
    vectorA: IVector,
    vectorB: IVector,
    output: IVector = Vector.create()
  ): IVector {
    output.x = vectorA.x + vectorB.x
    output.y = vectorA.y + vectorB.y
    return output
  }

  /**
   * Subtracts the two vectors.
   * @param vectorA
   * @param vectorB
   * @param output
   * @return A new vector of vectorA and vectorB subtracted
   */
  public static sub(
    vectorA: IVector,
    vectorB: IVector,
    output: IVector = Vector.create()
  ): IVector {
    output.x = vectorA.x - vectorB.x
    output.y = vectorA.y - vectorB.y
    return output
  }

  /**
   * Multiplies a vector and a scalar.
   * @method mult
   * @param vector
   * @param scalar
   * @return A new vector multiplied by scalar
   */
  public static mult(vector: IVector, scalar: number): IVector {
    return { x: vector.x * scalar, y: vector.y * scalar }
  }

  /**
   * Divides a vector and a scalar.
   * @method div
   * @param vector
   * @param scalar
   * @return A new vector divided by scalar
   */
  public static div(vector: IVector, scalar: number): IVector {
    return { x: vector.x / scalar, y: vector.y / scalar }
  }

  /**
   * Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
   * @method perp
   * @param vector
   * @param negate
   * @return The perpendicular vector
   */
  public static perp(vector: IVector, negate: boolean = false): IVector {
    const negateNum = negate ? -1 : 1
    return { x: negateNum * -vector.y, y: negateNum * vector.x }
  }

  /**
   * Negates both components of a vector such that it points in the opposite direction.
   * @method neg
   * @param vector
   * @return The negated vector
   */
  public static neg(vector: IVector): IVector {
    return { x: -vector.x, y: -vector.y }
  }

  /**
   * Returns the angle between the vector `vectorB - vectorA` and the x-axis in radians.
   * @method angle
   * @param vectorA
   * @param vectorB
   * @return The angle in radians
   */
  public static angle(vectorA: IVector, vectorB: IVector): number {
    return Math.atan2(vectorB.y - vectorA.y, vectorB.x - vectorA.x)
  }

  /**
   * Temporary vector pool (not thread-safe).
   */
  protected _temp = [
    Vector.create(),
    Vector.create(),
    Vector.create(),
    Vector.create(),
    Vector.create(),
    Vector.create(),
  ]
}
