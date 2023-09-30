import { IBody } from '../body/Body'
import Common from '../core/Common'
import Bounds from '../geometry/Bounds'
import Vertices from '../geometry/Vertices'
import { IPair } from './Pair'

/**
 * The `Matter.Resolver` module contains methods for resolving collision pairs.
 */
export default class Resolver {
  protected static _restingThresh = 2
  protected static _restingThreshTangent = Math.sqrt(6)
  protected static _positionDampen = 0.9
  protected static _positionWarming = 0.8
  protected static _frictionNormalMultiplier = 5
  protected static _frictionMaxStatic = Number.MAX_VALUE

  /**
   * Prepare pairs for position solving.
   * @method preSolvePosition
   * @param pairs
   */
  public static preSolvePosition(pairs: IPair[]): void {
    // find total contacts on each body
    for (const pair of pairs) {
      if (!pair.isActive) {
        continue
      }

      const activeCount = pair.activeContacts.length
      pair.collision.parentA.totalContacts += activeCount
      pair.collision.parentB.totalContacts += activeCount
    }
  }

  /**
   * Find a solution for pair positions.
   * @method solvePosition
   * @param pairs
   * @param delta
   * @param damping
   */
  public static solvePosition(
    pairs: IPair[],
    delta: number,
    damping: number = 1
  ): void {
    const positionDampen = Resolver._positionDampen * (damping || 1)
    const slopDampen = Common.clamp(delta / Common._baseDelta, 0, 1)

    // find impulses required to resolve penetration
    for (const pair of pairs) {
      if (!pair.isActive || pair.isSensor) {
        continue
      }

      const collision = pair.collision
      const bodyA = collision.parentA
      const bodyB = collision.parentB
      const normal = collision.normal

      // get current separation between body edges involved in collision
      pair.separation =
        normal.x *
          (bodyB.positionImpulse.x +
            collision.penetration.x -
            bodyA.positionImpulse.x) +
        normal.y *
          (bodyB.positionImpulse.y +
            collision.penetration.y -
            bodyA.positionImpulse.y)
    }

    for (const pair of pairs) {
      if (!pair.isActive || pair.isSensor) {
        continue
      }

      const collision = pair.collision
      const bodyA = collision.parentA
      const bodyB = collision.parentB
      const normal = collision.normal
      let positionImpulse = pair.separation - pair.slop * slopDampen

      if (bodyA.isStatic || bodyB.isStatic) {
        positionImpulse *= 2
      }

      if (!(bodyA.isStatic || bodyA.isSleeping)) {
        const contactShare = positionDampen / bodyA.totalContacts
        bodyA.positionImpulse.x += normal.x * positionImpulse * contactShare
        bodyA.positionImpulse.y += normal.y * positionImpulse * contactShare
      }

      if (!(bodyB.isStatic || bodyB.isSleeping)) {
        const contactShare = positionDampen / bodyB.totalContacts
        bodyB.positionImpulse.x -= normal.x * positionImpulse * contactShare
        bodyB.positionImpulse.y -= normal.y * positionImpulse * contactShare
      }
    }
  }

  /**
   * Apply position resolution.
   * @method postSolvePosition
   * @param bodies
   */
  public static postSolvePosition(bodies: IBody[]): void {
    const positionWarming = Resolver._positionWarming

    for (const body of bodies) {
      const positionImpulse = body.positionImpulse
      const positionImpulseX = positionImpulse.x
      const positionImpulseY = positionImpulse.y
      const velocity = body.velocity

      // reset contact count
      body.totalContacts = 0

      if (positionImpulseX !== 0 || positionImpulseY !== 0) {
        // update body geometry
        for (const part of body.parts) {
          Vertices.translate(part.vertices, positionImpulse)
          Bounds.update(part.bounds, part.vertices, velocity)
          part.position.x += positionImpulseX
          part.position.y += positionImpulseY
        }

        // move the body without changing velocity
        body.positionPrev.x += positionImpulseX
        body.positionPrev.y += positionImpulseY

        if (positionImpulseX * velocity.x + positionImpulseY * velocity.y < 0) {
          // reset cached impulse if the body has velocity along it
          positionImpulse.x = 0
          positionImpulse.y = 0
        } else {
          // warm the next iteration
          positionImpulse.x *= positionWarming
          positionImpulse.y *= positionWarming
        }
      }
    }
  }

  /**
   * Prepare pairs for velocity solving.
   * @method preSolveVelocity
   * @param pairs
   */
  public static preSolveVelocity(pairs: IPair[]): void {
    for (const pair of pairs) {
      if (!pair.isActive || pair.isSensor) {
        continue
      }
      const collision = pair.collision
      const bodyA = collision.parentA
      const bodyB = collision.parentB
      const normal = collision.normal
      const tangent = collision.tangent

      // resolve each contact
      for (const contact of pair.activeContacts) {
        const contactVertex = contact.vertex
        const normalImpulse = contact.normalImpulse
        const tangentImpulse = contact.tangentImpulse

        if (normalImpulse !== 0 || tangentImpulse !== 0) {
          // total impulse from contact
          const impulseX = normal.x * normalImpulse + tangent.x * tangentImpulse
          const impulseY = normal.y * normalImpulse + tangent.y * tangentImpulse

          // apply impulse from contact
          if (!(bodyA.isStatic || bodyA.isSleeping)) {
            bodyA.positionPrev.x += impulseX * bodyA.inverseMass
            bodyA.positionPrev.y += impulseY * bodyA.inverseMass
            bodyA.anglePrev +=
              bodyA.inverseInertia *
              ((contactVertex.x - bodyA.position.x) * impulseY -
                (contactVertex.y - bodyA.position.y) * impulseX)
          }

          if (!(bodyB.isStatic || bodyB.isSleeping)) {
            bodyB.positionPrev.x -= impulseX * bodyB.inverseMass
            bodyB.positionPrev.y -= impulseY * bodyB.inverseMass
            bodyB.anglePrev -=
              bodyB.inverseInertia *
              ((contactVertex.x - bodyB.position.x) * impulseY -
                (contactVertex.y - bodyB.position.y) * impulseX)
          }
        }
      }
    }
  }

  /**
   * Find a solution for pair velocities.
   * @method solveVelocity
   * @param pairs
   * @param delta
   */
  public static solveVelocity(pairs: IPair[], delta: number): void {
    const timeScale = delta / Common._baseDelta
    const timeScaleSquared = timeScale * timeScale
    const timeScaleCubed = timeScaleSquared * timeScale
    const restingThresh = -Resolver._restingThresh * timeScale
    const restingThreshTangent = Resolver._restingThreshTangent
    const frictionNormalMultiplier =
      Resolver._frictionNormalMultiplier * timeScale
    const frictionMaxStatic = Resolver._frictionMaxStatic
    let tangentImpulse: number
    let maxFriction: number

    for (const pair of pairs) {
      if (!pair.isActive || pair.isSensor) {
        continue
      }

      const collision = pair.collision
      const bodyA = collision.parentA
      const bodyB = collision.parentB
      const bodyAVelocity = bodyA.velocity
      const bodyBVelocity = bodyB.velocity
      const normalX = collision.normal.x
      const normalY = collision.normal.y
      const tangentX = collision.tangent.x
      const tangentY = collision.tangent.y
      const contacts = pair.activeContacts
      const contactsLength = contacts.length
      const contactShare = 1 / contactsLength
      const inverseMassTotal = bodyA.inverseMass + bodyB.inverseMass
      const friction =
        pair.friction * pair.frictionStatic * frictionNormalMultiplier

      // update body velocities
      bodyAVelocity.x = bodyA.position.x - bodyA.positionPrev.x
      bodyAVelocity.y = bodyA.position.y - bodyA.positionPrev.y
      bodyBVelocity.x = bodyB.position.x - bodyB.positionPrev.x
      bodyBVelocity.y = bodyB.position.y - bodyB.positionPrev.y
      bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev
      bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev

      // resolve each contact
      for (const contact of pair.activeContacts) {
        const contactVertex = contact.vertex

        const offsetAX = contactVertex.x - bodyA.position.x
        const offsetAY = contactVertex.y - bodyA.position.y
        const offsetBX = contactVertex.x - bodyB.position.x
        const offsetBY = contactVertex.y - bodyB.position.y

        const velocityPointAX =
          bodyAVelocity.x - offsetAY * bodyA.angularVelocity
        const velocityPointAY =
          bodyAVelocity.y + offsetAX * bodyA.angularVelocity
        const velocityPointBX =
          bodyBVelocity.x - offsetBY * bodyB.angularVelocity
        const velocityPointBY =
          bodyBVelocity.y + offsetBX * bodyB.angularVelocity
        const relativeVelocityX = velocityPointAX - velocityPointBX,
          relativeVelocityY = velocityPointAY - velocityPointBY
        const normalVelocity =
          normalX * relativeVelocityX + normalY * relativeVelocityY
        const tangentVelocity =
          tangentX * relativeVelocityX + tangentY * relativeVelocityY

        // coulomb friction
        const normalOverlap = pair.separation + normalVelocity
        let normalForce = Math.min(normalOverlap, 1)
        normalForce = normalOverlap < 0 ? 0 : normalForce

        const frictionLimit = normalForce * friction

        if (
          tangentVelocity < -frictionLimit ||
          tangentVelocity > frictionLimit
        ) {
          maxFriction = tangentVelocity > 0 ? tangentVelocity : -tangentVelocity
          tangentImpulse =
            pair.friction * (tangentVelocity > 0 ? 1 : -1) * timeScaleCubed

          if (tangentImpulse < -maxFriction) {
            tangentImpulse = -maxFriction
          } else if (tangentImpulse > maxFriction) {
            tangentImpulse = maxFriction
          }
        } else {
          tangentImpulse = tangentVelocity
          maxFriction = frictionMaxStatic
        }

        // account for mass, inertia and contact offset
        const oAcN = offsetAX * normalY - offsetAY * normalX
        const oBcN = offsetBX * normalY - offsetBY * normalX
        const share =
          contactShare /
          (inverseMassTotal +
            bodyA.inverseInertia * oAcN * oAcN +
            bodyB.inverseInertia * oBcN * oBcN)

        // raw impulses
        let normalImpulse = (1 + pair.restitution) * normalVelocity * share
        tangentImpulse *= share

        // handle high velocity and resting collisions separately
        if (normalVelocity < restingThresh) {
          // high normal velocity so clear cached contact normal impulse
          contact.normalImpulse = 0
        } else {
          // solve resting collision constraints using Erin Catto's method (GDC08)
          // impulse constraint tends to 0
          const contactNormalImpulse = contact.normalImpulse
          contact.normalImpulse += normalImpulse
          if (contact.normalImpulse > 0) {
            contact.normalImpulse = 0
          }
          normalImpulse = contact.normalImpulse - contactNormalImpulse
        }

        // handle high velocity and resting collisions separately
        if (
          tangentVelocity < -restingThreshTangent ||
          tangentVelocity > restingThreshTangent
        ) {
          // high tangent velocity so clear cached contact tangent impulse
          contact.tangentImpulse = 0
        } else {
          // solve resting collision constraints using Erin Catto's method (GDC08)
          // tangent impulse tends to -tangentSpeed or +tangentSpeed
          const contactTangentImpulse = contact.tangentImpulse
          contact.tangentImpulse += tangentImpulse
          if (contact.tangentImpulse < -maxFriction) {
            contact.tangentImpulse = -maxFriction
          }
          if (contact.tangentImpulse > maxFriction) {
            contact.tangentImpulse = maxFriction
          }
          tangentImpulse = contact.tangentImpulse - contactTangentImpulse
        }

        // total impulse from contact
        const impulseX = normalX * normalImpulse + tangentX * tangentImpulse
        const impulseY = normalY * normalImpulse + tangentY * tangentImpulse

        // apply impulse from contact
        if (!(bodyA.isStatic || bodyA.isSleeping)) {
          bodyA.positionPrev.x += impulseX * bodyA.inverseMass
          bodyA.positionPrev.y += impulseY * bodyA.inverseMass
          bodyA.anglePrev +=
            (offsetAX * impulseY - offsetAY * impulseX) * bodyA.inverseInertia
        }

        if (!(bodyB.isStatic || bodyB.isSleeping)) {
          bodyB.positionPrev.x -= impulseX * bodyB.inverseMass
          bodyB.positionPrev.y -= impulseY * bodyB.inverseMass
          bodyB.anglePrev -=
            (offsetBX * impulseY - offsetBY * impulseX) * bodyB.inverseInertia
        }
      }
    }
  }
}
