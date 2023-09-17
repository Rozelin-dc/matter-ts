import { Vector } from './Vector'
import { Vertices } from './Vertices'

/**
 * contains methods for creating and manipulating axis-aligned bounding boxes (AABB).
 */
export class Bounds {
  public min: { x: number; y: number }
  public max: { x: number; y: number }

  /**
   * Creates a new axis-aligned bounding box (AABB) for the given vertices.
   * @param vertices
   */
  constructor(vertices?: Vertices) {
    this.min = { x: 0, y: 0 }
    this.max = { x: 0, y: 0 }

    if (vertices) {
      this.update(vertices)
    }
  }

  /**
   * Updates bounds using the given vertices and extends the bounds given a velocity.
   * @param vertices
   * @param velocity
   */
  public update(vertices: Vertices, velocity?: Vector) {
    this.min.x = Infinity
    this.max.x = -Infinity
    this.min.y = Infinity
    this.max.y = -Infinity

    for (const vertex of vertices.vertices) {
      if (vertex.vector.x > this.max.x) {
        this.max.x = vertex.vector.x
      }
      if (vertex.vector.x < this.min.x) {
        this.min.x = vertex.vector.x
      }
      if (vertex.vector.y > this.max.y) {
        this.max.y = vertex.vector.y
      }
      if (vertex.vector.y < this.min.y) {
        this.min.y = vertex.vector.y
      }
    }

    if (velocity) {
      if (velocity.x > 0) {
        this.max.x += velocity.x
      } else {
        this.min.x += velocity.x
      }

      if (velocity.y > 0) {
        this.max.y += velocity.y
      } else {
        this.min.y += velocity.y
      }
    }
  }

  /**
   * Returns true if the bounds contains the given point.
   * @param point
   * @return True if the bounds contain the point, otherwise false
   */
  public contains(point: Vector) {
    return (
      point.x >= this.min.x &&
      point.x <= this.max.x &&
      point.y >= this.min.y &&
      point.y <= this.max.y
    )
  }

  /**
   * Returns true if the two bounds intersect.
   * @param boundsA
   * @param boundsB
   * @return True if the bounds overlap, otherwise false
   */
  public static overlaps(boundsA: Bounds, boundsB: Bounds) {
    return (
      boundsA.min.x <= boundsB.max.x &&
      boundsA.max.x >= boundsB.min.x &&
      boundsA.max.y >= boundsB.min.y &&
      boundsA.min.y <= boundsB.max.y
    )
  }

  /**
   * Translates the bounds by the given vector.
   * @method translate
   * @param vector
   */
  public translate(vector: Vector) {
    this.min.x += vector.x
    this.max.x += vector.x
    this.min.y += vector.y
    this.max.y += vector.y
  }

  /**
   * Shifts the bounds to the given position.
   * @param position
   */
  public shift(position: Vector) {
    const deltaX = this.max.x - this.min.x
    const deltaY = this.max.y - this.min.y

    this.min.x = position.x
    this.max.x = position.x + deltaX
    this.min.y = position.y
    this.max.y = position.y + deltaY
  }
}
