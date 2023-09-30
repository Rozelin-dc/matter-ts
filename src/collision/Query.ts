import { IBody } from '../body/Body'
import Bodies from '../factory/Bodies'
import Bounds, { IBounds } from '../geometry/Bounds'
import Vector, { IVector } from '../geometry/Vector'
import Vertices from '../geometry/Vertices'
import Collision, { ICollision } from './Collision'

/**
 * The `Matter.Query` module contains methods for performing collision queries.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Query {
  /**
   * Returns a list of collisions between `body` and `bodies`.
   * @method collides
   * @param body
   * @param bodies
   * @return Collisions
   */
  public static collides(body: IBody, bodies: IBody[]): ICollision[] {
    const collisions: ICollision[] = []
    const bounds = body.bounds

    for (const bodyA of bodies) {
      const partsALength = bodyA.parts.length
      const partsAStart = partsALength === 1 ? 0 : 1

      if (Bounds.overlaps(bodyA.bounds, bounds)) {
        for (let j = partsAStart; j < partsALength; j++) {
          const part = bodyA.parts[j]

          if (Bounds.overlaps(part.bounds, bounds)) {
            const collision = Collision.collides(part, body)

            if (collision) {
              collisions.push(collision)
              break
            }
          }
        }
      }
    }

    return collisions
  }

  /**
   * Casts a ray segment against a set of bodies and returns all collisions, ray width is optional. Intersection points are not provided.
   * @method ray
   * @param bodies
   * @param startPoint
   * @param endPoint
   * @param rayWidth
   * @return Collisions
   */
  public static ray(
    bodies: IBody[],
    startPoint: IVector,
    endPoint: IVector,
    rayWidth: number = 1e-100
  ): ICollision[] {
    const rayAngle = Vector.angle(startPoint, endPoint)
    const rayLength = Vector.magnitude(Vector.sub(startPoint, endPoint))
    const rayX = (endPoint.x + startPoint.x) * 0.5
    const rayY = (endPoint.y + startPoint.y) * 0.5
    const ray = Bodies.rectangle(rayX, rayY, rayLength, rayWidth, {
      angle: rayAngle,
    })
    const collisions = Query.collides(ray, bodies)

    for (const collision of collisions) {
      collision.body = collision.bodyB = collision.bodyA
    }

    return collisions
  }

  /**
   * Returns all bodies whose bounds are inside (or outside if set) the given set of bounds, from the given set of bodies.
   * @method region
   * @param bodies
   * @param bounds
   * @param outside
   * @return The bodies matching the query
   */
  public static region(
    bodies: IBody[],
    bounds: IBounds,
    outside: boolean = false
  ): IBody[] {
    const result: IBody[] = []

    for (const body of bodies) {
      const overlaps = Bounds.overlaps(body.bounds, bounds)
      if ((overlaps && !outside) || (!overlaps && outside)) {
        result.push(body)
      }
    }

    return result
  }

  /**
   * Returns all bodies whose vertices contain the given point, from the given set of bodies.
   * @method point
   * @param {body[]} bodies
   * @param {vector} point
   * @return {body[]} The bodies matching the query
   */
  public static point(bodies: IBody[], point: IVector): IBody[] {
    const result: IBody[] = []
    for (const body of bodies) {
      if (Bounds.contains(body.bounds, point)) {
        const initJ = body.parts.length === 1 ? 0 : 1
        for (let j = initJ; j < body.parts.length; j++) {
          const part = body.parts[j]
          if (
            Bounds.contains(part.bounds, point) &&
            Vertices.contains(part.vertices, point)
          ) {
            result.push(body)
            break
          }
        }
      }
    }

    return result
  }
}
