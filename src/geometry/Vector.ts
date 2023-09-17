/**
 * contains methods for creating and manipulating vectors.
 * Vectors are the basis of all the geometry related operations in the engine.
 * A `Matter.Vector` object is of the form `{ x: 0, y: 0 }`.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export class Vector {
  public x: number
  public y: number

  /**
   * Temporary vector pool (not thread-safe).
   */
  private static _temp = [
    new Vector(),
    new Vector(),
    new Vector(),
    new Vector(),
    new Vector(),
    new Vector(),
  ]

  /**
   * Creates a new vector.
   * @param x
   * @param y
   * @return A new vector
   */
  constructor(x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }

  /**
   * Returns a new vector with `x` and `y` copied from the given `vector`.
   */
  public clone() {
    return new Vector(this.x, this.y)
  }

  /**
   * Returns the magnitude (length) of a vector.
   * @return The magnitude of the vector
   */
  public magnitude() {
    return Math.sqrt(this.magnitudeSquared())
  }

  /**
   * Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
   * @return The squared magnitude of the vector
   */
  public magnitudeSquared() {
    return this.x * this.x + this.y * this.y
  }

  /**
   * Rotates the vector about (0, 0) by specified angle.
   * @param angle
   * @return The vector rotated about (0, 0)
   */
  public rotate(angle: number) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x = this.x * cos - this.y * sin
    const y = this.x * sin + this.y * cos
    return new Vector(x, y)
  }

  /**
   * Rotates the vector about a specified point by specified angle.
   * @param angle
   * @param point
   * @return A new vector rotated about the point
   */
  public rotateAbout(
    angle: number,
    point: {
      x: number
      y: number
    }
  ) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x = point.x + ((this.x - point.x) * cos - (this.y - point.y) * sin)
    const y = point.y + ((this.x - point.x) * sin + (this.y - point.y) * cos)
    return new Vector(x, y)
  }

  /**
   * Normalizes a vector (such that its magnitude is `1`).
   * @return A new vector normalized
   */
  public normalize() {
    const magnitude = this.magnitude()
    if (magnitude === 0) {
      return new Vector(0, 0)
    }
    return new Vector(this.x / magnitude, this.y / magnitude)
  }

  /**
   * Returns the dot-product of two vectors.
   * @param vectorA
   * @param vectorB
   * @return The dot product of the two vectors
   */
  public static dot(vectorA: Vector, vectorB: Vector) {
    return vectorA.x * vectorB.x + vectorA.y * vectorB.y
  }

  /**
   * Returns the cross-product of two vectors.
   * @param vectorA
   * @param vectorB
   * @return The cross product of the two vectors
   */
  public static cross = function (vectorA: Vector, vectorB: Vector) {
    return vectorA.x * vectorB.y - vectorA.y * vectorB.x
  }

  /**
   * Returns the cross-product of three vectors.
   * @param vectorA
   * @param vectorB
   * @param vectorC
   * @return The cross product of the three vectors
   */
  public static cross3(vectorA: Vector, vectorB: Vector, vectorC: Vector) {
    return (
      (vectorB.x - vectorA.x) * (vectorC.y - vectorA.y) -
      (vectorB.y - vectorA.y) * (vectorC.x - vectorA.x)
    )
  }

  /**
   * Adds vectors.
   * @return A new vector of added
   */
  public static add(...vectors: Vector[]) {
    let x = 0
    let y = 0
    for (const vector of vectors) {
      x += vector.x
      y += vector.y
    }
    return new Vector(x, y)
  }

  /**
   * Subtracts the two vectors.
   * @param vectorA
   * @param vectorB
   * @return A new vector of vectorA and vectorB subtracted
   */
  public static sub(vectorA: Vector, vectorB: Vector) {
    const x = vectorA.x - vectorB.x
    const y = vectorA.y - vectorB.y
    return new Vector(x, y)
  }

  /**
   * Multiplies a vector and a scalar.
   * @param scalar
   * @return A new vector multiplied by scalar
   */
  public mult(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  /**
   * Divides a vector and a scalar.
   * @param scalar
   * @return A new vector divided by scalar
   */
  public div(scalar: number) {
    return new Vector(this.x / scalar, this.y / scalar)
  }

  /**
   * Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
   * @param negate
   * @return The perpendicular vector
   */
  public perp(negate = false) {
    const negateNum = negate === true ? -1 : 1
    return new Vector(negateNum * -this.y, negateNum * this.x)
  }

  /**
   * Negates both components of a vector such that it points in the opposite direction.
   * @return The negated vector
   */
  public neg() {
    return new Vector(-this.x, -this.y)
  }

  /**
   * Returns the angle between the vector `vectorB - vectorA` and the x-axis in radians.
   * @param vectorA
   * @param vectorB
   * @return The angle in radians
   */
  public static angle(vectorA: Vector, vectorB: Vector) {
    return Math.atan2(vectorB.y - vectorA.y, vectorB.x - vectorA.x)
  }
}
