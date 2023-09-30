import Vector, { IVector } from './Vector'
import { IVertices } from './Vertices'

export interface IBounds {
  min: IVector
  max: IVector
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
  public static create(vertices: IVertices): IBounds {
    const bounds: IBounds = {
      min: Vector.create(0, 0),
      max: Vector.create(0, 0),
    }

    if (vertices) {
      Bounds.update(bounds, vertices)
    }

    return bounds
  }

  /**
   * Updates bounds using the given vertices and extends the bounds given a velocity.
   * @method update
   * @param bounds
   * @param vertices
   * @param velocity
   */
  public static update(
    bounds: IBounds,
    vertices: IVertices,
    velocity?: IVector
  ): void {
    bounds.min.x = Infinity
    bounds.max.x = -Infinity
    bounds.min.y = Infinity
    bounds.max.y = -Infinity

    for (const vertex of vertices) {
      if (vertex.x > bounds.max.x) {
        bounds.max.x = vertex.x
      }
      if (vertex.x < bounds.min.x) {
        bounds.min.x = vertex.x
      }
      if (vertex.y > bounds.max.y) {
        bounds.max.y = vertex.y
      }
      if (vertex.y < bounds.min.y) {
        bounds.min.y = vertex.y
      }
    }

    if (velocity) {
      if (velocity.x > 0) {
        bounds.max.x += velocity.x
      } else {
        bounds.min.x += velocity.x
      }

      if (velocity.y > 0) {
        bounds.max.y += velocity.y
      } else {
        bounds.min.y += velocity.y
      }
    }
  }

  /**
   * Returns true if the bounds contains the given point.
   * @method contains
   * @param bounds
   * @param point
   * @return True if the bounds contain the point, otherwise false
   */
  public static contains(bounds: IBounds, point: IVector): boolean {
    return (
      point.x >= bounds.min.x &&
      point.x <= bounds.max.x &&
      point.y >= bounds.min.y &&
      point.y <= bounds.max.y
    )
  }

  /**
   * Returns true if the two bounds intersect.
   * @method overlaps
   * @param boundsA
   * @param boundsB
   * @return True if the bounds overlap, otherwise false
   */
  public static overlaps(boundsA: IBounds, boundsB: IBounds): boolean {
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
   * @param bounds
   * @param vector
   */
  public static translate(bounds: IBounds, vector: IVector): void {
    bounds.min.x += vector.x
    bounds.max.x += vector.x
    bounds.min.y += vector.y
    bounds.max.y += vector.y
  }

  /**
   * Shifts the bounds to the given position.
   * @method shift
   * @param bounds
   * @param position
   */
  public static shift(bounds: IBounds, position: IVector): void {
    const deltaX = bounds.max.x - bounds.min.x
    const deltaY = bounds.max.y - bounds.min.y

    bounds.min.x = position.x
    bounds.max.x = position.x + deltaX
    bounds.min.y = position.y
    bounds.max.y = position.y + deltaY
  }
}
