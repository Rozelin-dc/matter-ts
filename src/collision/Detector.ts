import { IBody } from '../body/Body'
import Common, { DeepPartial } from '../core/Common'
import { IEngine } from '../core/Engine'
import Bounds from '../geometry/Bounds'
import Collision, { ICollision } from './Collision'
import { IPairs } from './Pairs'
import SAT from './SAT'

export interface IDetector {
  bodies: IBody[]
  pairs: IPairs | null
}

export interface ICollisionFilter {
  category: number
  mask: number
  group: number
}

/**
 * The `Matter.Detector` module contains methods for efficiently detecting collisions between a list of bodies using a broadphase algorithm.
 */
export default class Detector {
  /**
   * Creates a new collision detector.
   * @method create
   * @param options
   * @return A new collision detector
   */
  public static create(options?: DeepPartial<IDetector>): IDetector {
    const defaults = {
      bodies: [],
      pairs: null,
    }

    return Common.extend(defaults, options)
  }

  /**
   * Sets the list of bodies in the detector.
   * @method setBodies
   * @param detector
   * @param bodies
   */
  public static setBodies(detector: IDetector, bodies: IBody[]): void {
    detector.bodies = bodies.slice(0)
  }

  /**
   * Clears the detector including its list of bodies.
   * @method clear
   * @param detector
   */
  public static clear(detector: IDetector): void {
    detector.bodies = []
  }

  /**
   * Efficiently finds all collisions among all the bodies in `detector.bodies` using a broadphase algorithm.
   *
   * _Note:_ The specific ordering of collisions returned is not guaranteed between releases and may change for performance reasons.
   * If a specific ordering is required then apply a sort to the resulting array.
   * @method collisions
   * @param detector
   * @return collisions
   */
  public static collisions(detector: IDetector): ICollision[] {
    const collisions = []
    const pairs = detector.pairs
    const bodies = detector.bodies
    const bodiesLength = bodies.length

    bodies.sort(Detector._compareBoundsX)

    for (let i = 0; i < bodiesLength; i++) {
      const bodyA = bodies[i]
      const boundXMax = bodyA.bounds.max.x
      const boundYMax = bodyA.bounds.max.y
      const boundYMin = bodyA.bounds.min.y
      const bodyAStatic = bodyA.isStatic || bodyA.isSleeping
      const partsALength = bodyA.parts.length
      const partsASingle = partsALength === 1

      for (let j = i + 1; j < bodiesLength; j++) {
        const bodyB = bodies[j]
        const boundsB = bodyB.bounds

        if (boundsB.min.x > boundXMax) {
          break
        }
        if (boundYMax < boundsB.min.y || boundYMin > boundsB.max.y) {
          continue
        }
        if (bodyAStatic && (bodyB.isStatic || bodyB.isSleeping)) {
          continue
        }

        if (
          !Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter)
        ) {
          continue
        }

        const partsBLength = bodyB.parts.length
        if (partsASingle && partsBLength === 1) {
          const collision = Collision.collides(bodyA, bodyB, pairs)

          if (collision) {
            collisions.push(collision)
          }
        } else {
          const partsAStart = partsALength > 1 ? 1 : 0
          const partsBStart = partsBLength > 1 ? 1 : 0

          for (let k = partsAStart; k < partsALength; k++) {
            const partA = bodyA.parts[k]
            const boundsA = partA.bounds

            for (let z = partsBStart; z < partsBLength; z++) {
              const partB = bodyB.parts[z]
              const boundsB = partB.bounds

              if (
                boundsA.min.x > boundsB.max.x ||
                boundsA.max.x < boundsB.min.x ||
                boundsA.max.y < boundsB.min.y ||
                boundsA.min.y > boundsB.max.y
              ) {
                continue
              }

              const collision = Collision.collides(partA, partB, pairs)
              if (collision) {
                collisions.push(collision)
              }
            }
          }
        }
      }
    }

    return collisions
  }

  /**
   * Returns `true` if both supplied collision filters will allow a collision to occur.
   * See `body.collisionFilter` for more information.
   * @method canCollide
   * @param filterA
   * @param filterB
   * @return `true` if collision can occur
   */
  public static canCollide(
    filterA: ICollisionFilter,
    filterB: ICollisionFilter
  ): boolean {
    if (filterA.group === filterB.group && filterA.group !== 0) {
      return filterA.group > 0
    }

    return (
      (filterA.mask & filterB.category) !== 0 &&
      (filterB.mask & filterA.category) !== 0
    )
  }

  /**
   * @method bruteForce
   * @param bodies
   * @param engine
   * @return collisions
   */
  public static bruteForce(bodies: IBody[], engine: IEngine) {
    const collisions: ICollision[] = []

    // @if DEBUG
    const metrics = engine.metrics
    // @endif

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const bodyA = bodies[i]
        const bodyB = bodies[j]

        // NOTE: could share a function for the below, but may drop performance?

        if (
          (bodyA.isStatic || bodyA.isSleeping) &&
          (bodyB.isStatic || bodyB.isSleeping)
        ) {
          continue
        }

        if (
          !Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter)
        ) {
          continue
        }

        // @if DEBUG
        metrics.midphaseTests += 1
        // @endif

        // mid phase
        if (Bounds.overlaps(bodyA.bounds, bodyB.bounds)) {
          // narrow phase
          const collision = SAT.collides(bodyA, bodyB)

          if (!collision) {
            continue
          }

          // @if DEBUG
          metrics.narrowphaseTests += 1
          if ('reused' in collision) {
            metrics.narrowReuseCount += 1
          }
          // @endif

          if (collision.collided) {
            collisions.push(collision)
            // @if DEBUG
            metrics.narrowDetections += 1
            // @endif
          }
        }
      }
    }

    return collisions
  }

  /**
   * The comparison function used in the broadphase algorithm.
   * Returns the signed delta of the bodies bounds on the x-axis.
   * @method _sortCompare
   * @param bodyA
   * @param bodyB
   * @return The signed delta used for sorting
   */
  protected static _compareBoundsX(bodyA: IBody, bodyB: IBody): number {
    return bodyA.bounds.min.x - bodyB.bounds.min.x
  }
}
