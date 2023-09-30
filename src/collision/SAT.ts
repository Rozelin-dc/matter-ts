import { IBody } from '../body/Body'
import Common from '../core/Common'
import Collision, { ICollision } from './Collision'

/**
 * This module has now been replaced by `Matter.Collision`.
 *
 * All usage should be migrated to `Matter.Collision`.
 * For back-compatibility purposes this module will remain for a short term and then later removed in a future release.
 *
 * The `Matter.SAT` module contains methods for detecting collisions using the Separating Axis Theorem.
 *
 * @deprecated
 */
export default class SAT {
  /**
   * Detect collision between two bodies using the Separating Axis Theorem.
   * @deprecated replaced by Collision.collides
   * @method collides
   * @param bodyA
   * @param bodyB
   * @return collision
   */
  public static collides(bodyA: IBody, bodyB: IBody): ICollision | null {
    return Collision.collides(bodyA, bodyB)
  }
}

;(function () {
  Common.deprecated(
    SAT as Object as Record<string, Function>,
    'collides',
    'SAT.collides ➤ replaced by Collision.collides'
  )
})
