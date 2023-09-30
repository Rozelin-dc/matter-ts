import Body, { IBody } from '../body/Body'
import { IPair } from '../collision/Pair'
import Common from './Common'
import Events from './Events'

/**
 * The `Matter.Sleeping` module contains methods to manage the sleeping state of bodies.
 */
export default class Sleeping {
  protected static _motionWakeThreshold = 0.18
  protected static _motionSleepThreshold = 0.08
  protected static _minBias = 0.9

  /**
   * Puts bodies to sleep or wakes them up depending on their motion.
   * @method update
   * @param bodies
   * @param delta
   */
  public static update(bodies: IBody[], delta: number): void {
    const timeScale = delta / Common._baseDelta
    const motionSleepThreshold = Sleeping._motionSleepThreshold

    // update bodies sleeping status
    for (const body of bodies) {
      const speed = Body.getSpeed(body)
      const angularSpeed = Body.getAngularSpeed(body)
      const motion = speed * speed + angularSpeed * angularSpeed

      // wake up bodies if they have a force applied
      if (body.force.x !== 0 || body.force.y !== 0) {
        Sleeping.set(body, false)
        continue
      }

      const minMotion = Math.min(body.motion, motion)
      const maxMotion = Math.max(body.motion, motion)

      // biased average motion estimation between frames
      body.motion =
        Sleeping._minBias * minMotion + (1 - Sleeping._minBias) * maxMotion

      if (body.sleepThreshold > 0 && body.motion < motionSleepThreshold) {
        body.sleepCounter += 1

        if (body.sleepCounter >= body.sleepThreshold / timeScale) {
          Sleeping.set(body, true)
        }
      } else if (body.sleepCounter > 0) {
        body.sleepCounter -= 1
      }
    }
  }

  /**
   * Given a set of colliding pairs, wakes the sleeping bodies involved.
   * @method afterCollisions
   * @param pairs
   */
  public static afterCollisions(pairs: IPair[]): void {
    const motionSleepThreshold = Sleeping._motionSleepThreshold

    // wake up bodies involved in collisions
    for (const pair of pairs) {
      // don't wake inactive pairs
      if (!pair.isActive) {
        continue
      }

      const collision = pair.collision
      const bodyA = collision.bodyA.parent
      const bodyB = collision.bodyB.parent

      // don't wake if at least one body is static
      if (
        (bodyA.isSleeping && bodyB.isSleeping) ||
        bodyA.isStatic ||
        bodyB.isStatic
      ) {
        continue
      }

      if (bodyA.isSleeping || bodyB.isSleeping) {
        const sleepingBody = bodyA.isSleeping && !bodyA.isStatic ? bodyA : bodyB
        const movingBody = sleepingBody === bodyA ? bodyB : bodyA

        if (
          !sleepingBody.isStatic &&
          movingBody.motion > motionSleepThreshold
        ) {
          Sleeping.set(sleepingBody, false)
        }
      }
    }
  }

  /**
   * Set a body as sleeping or awake.
   * @method set
   * @param body
   * @param isSleeping
   */
  public static set(body: IBody, isSleeping: boolean): void {
    const wasSleeping = body.isSleeping

    if (isSleeping) {
      body.isSleeping = true
      body.sleepCounter = body.sleepThreshold

      body.positionImpulse.x = 0
      body.positionImpulse.y = 0

      body.positionPrev.x = body.position.x
      body.positionPrev.y = body.position.y

      body.anglePrev = body.angle
      body.speed = 0
      body.angularSpeed = 0
      body.motion = 0

      if (!wasSleeping) {
        Events.trigger(body, 'sleepStart')
      }
    } else {
      body.isSleeping = false
      body.sleepCounter = 0

      if (wasSleeping) {
        Events.trigger(body, 'sleepEnd')
      }
    }
  }
}
