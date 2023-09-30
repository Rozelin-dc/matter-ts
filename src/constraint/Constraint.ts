import { IBody } from '../body/Body'
import Common from '../core/Common'
import { IPlugin } from '../core/Plugin'
import Sleeping from '../core/Sleeping'
import Axes from '../geometry/Axes'
import Bounds from '../geometry/Bounds'
import Vector, { IVector } from '../geometry/Vector'
import Vertices from '../geometry/Vertices'

export interface IConstraint {
  /**
   * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
   */
  id: number

  /**
   * A `String` denoting the type of object.
   */
  type: 'constraint'

  /**
   * An arbitrary `String` name to help the user identify and manage bodies.
   *
   * @default "Constraint"
   */
  label: string

  /**
   * An `Object` that defines the rendering properties to be consumed by the module `Matter.Render`.
   */
  render: IConstraintRender

  /**
   * The first possible `Body` that this constraint is attached to.
   *
   * @default null
   */
  bodyA: IBody | null

  /**
   * The second possible `Body` that this constraint is attached to.
   *
   * @default null
   */
  bodyB: IBody | null

  /**
   * A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyA` if defined, otherwise a world-space position.
   *
   * @default { x: 0, y: 0 }
   */
  pointA: IVector

  /**
   * A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyB` if defined, otherwise a world-space position.
   *
   * @default { x: 0, y: 0 }
   */
  pointB: IVector

  /**
   * A `Number` that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`.
   * A value of `1` means the constraint should be very stiff.
   * A value of `0.2` means the constraint acts like a soft spring.
   *
   * @default 1
   */
  stiffness: number

  /**
   * A `Number` that specifies the damping of the constraint,
   * i.e. the amount of resistance applied to each body based on their velocities to limit the amount of oscillation.
   * Damping will only be apparent when the constraint also has a very low `stiffness`.
   * A value of `0.1` means the constraint will apply heavy damping, resulting in little to no oscillation.
   * A value of `0` means the constraint will apply no damping.
   *
   * @default 0
   */
  damping: number

  /**
   * A `Number` that specifies the target resting length of the constraint.
   * It is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`.
   */
  length: number

  /**
   * An object reserved for storing plugin-specific properties.
   */
  plugin: IPlugin | {}

  angularStiffness: number
  angleA: number
  angleB: number
}

interface IConstraintRender {
  /**
   * A flag that indicates if the constraint should be rendered.
   *
   * @default true
   */
  visible: boolean

  /**
   * A `Number` that defines the line width to use when rendering the constraint outline.
   * A value of `0` means no outline will be rendered.
   *
   * @default 2
   */
  lineWidth: number

  /**
   * A `String` that defines the stroke style to use when rendering the constraint outline.
   * It is the same as when using a canvas, so it accepts CSS style property values.
   *
   * @default random colour
   */
  strokeStyle: string

  /**
   * A `String` that defines the constraint rendering type.
   * The possible values are 'line', 'pin', 'spring'.
   * An appropriate render type will be automatically chosen unless one is given in options.
   *
   * @default 'line'
   */
  type: string

  /**
   * A `Boolean` that defines if the constraint's anchor points should be rendered.
   *
   * @default true
   */
  anchors: boolean
}

export type ConstraintOptions = Partial<Omit<IConstraint, 'render'>> & {
  render?: Partial<IConstraint['render']>
}

/**
 * The `Matter.Constraint` module contains methods for creating and manipulating constraints.
 * Constraints are used for specifying that a fixed distance must be maintained between two bodies (or a body and a fixed world-space position).
 * The stiffness of constraints can be modified to create springs or elastic.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Constraint {
  protected static _warming = 0.4
  protected static _torqueDampen = 1
  protected static _minLength = 0.000001

  /**
   * Creates a new constraint.
   * All properties have default values, and many are pre-calculated automatically based on other properties.
   * To simulate a revolute constraint (or pin joint) set `length: 0` and a high `stiffness` value (e.g. `0.7` or above).
   * If the constraint is unstable, try lowering the `stiffness` value and / or increasing `engine.constraintIterations`.
   * For compound bodies, constraints must be applied to the parent body (not one of its parts).
   * See the properties section below for detailed information on what you can pass via the `options` object.
   * @method create
   * @param options
   * @return constraint
   */
  public static create(
    options: ConstraintOptions
  ): IConstraint {
    const constraint = options

    // if bodies defined but no points, use body centre
    if (constraint.bodyA && !constraint.pointA) {
      constraint.pointA = { x: 0, y: 0 }
    }
    if (constraint.bodyB && !constraint.pointB) {
      constraint.pointB = { x: 0, y: 0 }
    }

    // calculate static length using initial world space points
    const initialPointA = constraint.bodyA
      ? Vector.add(constraint.bodyA.position, constraint.pointA!)
      : constraint.pointA!
    const initialPointB = constraint.bodyB
      ? Vector.add(constraint.bodyB.position, constraint.pointB!)
      : constraint.pointB!
    const length = Vector.magnitude(Vector.sub(initialPointA, initialPointB))

    constraint.length = constraint.length ?? length

    // option defaults
    constraint.id = constraint.id || Common.nextId()
    constraint.label = constraint.label || 'Constraint'
    constraint.type = 'constraint'
    constraint.stiffness =
      constraint.stiffness || (constraint.length > 0 ? 1 : 0.7)
    constraint.damping = constraint.damping || 0
    constraint.angularStiffness = constraint.angularStiffness || 0
    constraint.angleA = constraint.bodyA
      ? constraint.bodyA.angle
      : constraint.angleA
    constraint.angleB = constraint.bodyB
      ? constraint.bodyB.angle
      : constraint.angleB
    constraint.plugin = {}

    // render
    const render = {
      visible: true,
      lineWidth: 2,
      strokeStyle: '#ffffff',
      type: 'line',
      anchors: true,
    }

    if (constraint.length === 0 && constraint.stiffness > 0.1) {
      render.type = 'pin'
      render.anchors = false
    } else if (constraint.stiffness < 0.9) {
      render.type = 'spring'
    }

    constraint.render = Common.extend(render, constraint.render)

    return constraint as IConstraint
  }

  /**
   * Prepares for solving by constraint warming.
   * @private
   * @method preSolveAll
   * @param bodies
   */
  public static preSolveAll(bodies: IBody[]): void {
    for (const body of bodies) {
      const impulse = body.constraintImpulse

      if (
        body.isStatic ||
        (impulse.x === 0 && impulse.y === 0 && impulse.angle === 0)
      ) {
        continue
      }

      body.position.x += impulse.x
      body.position.y += impulse.y
      body.angle += impulse.angle
    }
  }

  /**
   * Solves all constraints in a list of collisions.
   * @private
   * @method solveAll
   * @param {constraint[]} constraints
   * @param {number} delta
   */
  public static solveAll(constraints: IConstraint[], delta: number): void {
    const timeScale = Common.clamp(delta / Common._baseDelta, 0, 1)

    // Solve fixed constraints first.
    for (const constraint of constraints) {
      const fixedA =
        !constraint.bodyA || (constraint.bodyA && constraint.bodyA.isStatic)
      const fixedB =
        !constraint.bodyB || (constraint.bodyB && constraint.bodyB.isStatic)

      if (fixedA || fixedB) {
        Constraint.solve(constraint, timeScale)
      }
    }

    // Solve free constraints last.
    for (const constraint of constraints) {
      const fixedA =
        !constraint.bodyA || (constraint.bodyA && constraint.bodyA.isStatic)
      const fixedB =
        !constraint.bodyB || (constraint.bodyB && constraint.bodyB.isStatic)

      if (!fixedA && !fixedB) {
        Constraint.solve(constraint, timeScale)
      }
    }
  }

  /**
   * Solves a distance constraint with Gauss-Siedel method.
   * @method solve
   * @param constraint
   * @param timeScale
   */
  protected static solve(constraint: IConstraint, timeScale: number): void {
    const bodyA = constraint.bodyA
    const bodyB = constraint.bodyB
    const pointA = constraint.pointA
    const pointB = constraint.pointB

    if (!bodyA && !bodyB) {
      return
    }

    // update reference angle
    if (bodyA && !bodyA.isStatic) {
      Vector.rotate(pointA, bodyA.angle - constraint.angleA, pointA)
      constraint.angleA = bodyA.angle
    }

    // update reference angle
    if (bodyB && !bodyB.isStatic) {
      Vector.rotate(pointB, bodyB.angle - constraint.angleB, pointB)
      constraint.angleB = bodyB.angle
    }

    let pointAWorld = pointA
    let pointBWorld = pointB

    if (bodyA) {
      pointAWorld = Vector.add(bodyA.position, pointA)
    }
    if (bodyB) {
      pointBWorld = Vector.add(bodyB.position, pointB)
    }

    if (!pointAWorld || !pointBWorld) {
      return
    }

    const delta = Vector.sub(pointAWorld, pointBWorld)
    let currentLength = Vector.magnitude(delta)

    // prevent singularity
    if (currentLength < Constraint._minLength) {
      currentLength = Constraint._minLength
    }

    // solve distance constraint with Gauss-Siedel method
    const difference = (currentLength - constraint.length) / currentLength
    const isRigid = constraint.stiffness >= 1 || constraint.length === 0
    const stiffness = isRigid
      ? constraint.stiffness * timeScale
      : constraint.stiffness * timeScale * timeScale
    const damping = constraint.damping * timeScale
    const force = Vector.mult(delta, difference * stiffness)
    const massTotal =
      (bodyA ? bodyA.inverseMass : 0) + (bodyB ? bodyB.inverseMass : 0)
    const inertiaTotal =
      (bodyA ? bodyA.inverseInertia : 0) + (bodyB ? bodyB.inverseInertia : 0)
    const resistanceTotal = massTotal + inertiaTotal

    let normal: IVector
    let normalVelocity: number
    let relativeVelocity: IVector

    if (damping > 0) {
      const zero = Vector.create()
      normal = Vector.div(delta, currentLength)

      relativeVelocity = Vector.sub(
        (bodyB && Vector.sub(bodyB.position, bodyB.positionPrev)) || zero,
        (bodyA && Vector.sub(bodyA.position, bodyA.positionPrev)) || zero
      )

      normalVelocity = Vector.dot(normal, relativeVelocity)
    }

    if (bodyA && !bodyA.isStatic) {
      const share = bodyA.inverseMass / massTotal

      // keep track of applied impulses for post solving
      bodyA.constraintImpulse.x -= force.x * share
      bodyA.constraintImpulse.y -= force.y * share

      // apply forces
      bodyA.position.x -= force.x * share
      bodyA.position.y -= force.y * share

      // apply damping
      if (damping > 0) {
        bodyA.positionPrev.x -= damping * normal!.x * normalVelocity! * share
        bodyA.positionPrev.y -= damping * normal!.y * normalVelocity! * share
      }

      // apply torque
      const torque =
        (Vector.cross(pointA, force) / resistanceTotal) *
        Constraint._torqueDampen *
        bodyA.inverseInertia *
        (1 - constraint.angularStiffness)
      bodyA.constraintImpulse.angle -= torque
      bodyA.angle -= torque
    }

    if (bodyB && !bodyB.isStatic) {
      const share = bodyB.inverseMass / massTotal

      // keep track of applied impulses for post solving
      bodyB.constraintImpulse.x += force.x * share
      bodyB.constraintImpulse.y += force.y * share

      // apply forces
      bodyB.position.x += force.x * share
      bodyB.position.y += force.y * share

      // apply damping
      if (damping > 0) {
        bodyB.positionPrev.x += damping * normal!.x * normalVelocity! * share
        bodyB.positionPrev.y += damping * normal!.y * normalVelocity! * share
      }

      // apply torque
      const torque =
        (Vector.cross(pointB, force) / resistanceTotal) *
        Constraint._torqueDampen *
        bodyB.inverseInertia *
        (1 - constraint.angularStiffness)
      bodyB.constraintImpulse.angle += torque
      bodyB.angle += torque
    }
  }

  /**
   * Performs body updates required after solving constraints.
   * @method postSolveAll
   * @param bodies
   */
  public static postSolveAll(bodies: IBody[]): void {
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]
      const impulse = body.constraintImpulse

      if (
        body.isStatic ||
        (impulse.x === 0 && impulse.y === 0 && impulse.angle === 0)
      ) {
        continue
      }

      Sleeping.set(body, false)

      // update geometry and reset
      for (var j = 0; j < body.parts.length; j++) {
        const part = body.parts[j]

        Vertices.translate(part.vertices, impulse)

        if (j > 0) {
          part.position.x += impulse.x
          part.position.y += impulse.y
        }

        if (impulse.angle !== 0) {
          Vertices.rotate(part.vertices, impulse.angle, body.position)
          Axes.rotate(part.axes, impulse.angle)
          if (j > 0) {
            Vector.rotateAbout(
              part.position,
              impulse.angle,
              body.position,
              part.position
            )
          }
        }

        Bounds.update(part.bounds, part.vertices, body.velocity)
      }

      // dampen the cached impulse for warming next step
      impulse.angle *= Constraint._warming
      impulse.x *= Constraint._warming
      impulse.y *= Constraint._warming
    }
  }

  /**
   * Returns the world-space position of `constraint.pointA`, accounting for `constraint.bodyA`.
   * @method pointAWorld
   * @param constraint
   * @returns the world-space position
   */
  public static pointAWorld(constraint: IConstraint): IVector {
    return {
      x:
        (constraint.bodyA ? constraint.bodyA.position.x : 0) +
        (constraint.pointA ? constraint.pointA.x : 0),
      y:
        (constraint.bodyA ? constraint.bodyA.position.y : 0) +
        (constraint.pointA ? constraint.pointA.y : 0),
    }
  }

  /**
   * Returns the world-space position of `constraint.pointB`, accounting for `constraint.bodyB`.
   * @method pointBWorld
   * @param constraint
   * @returns the world-space position
   */
  public static pointBWorld(constraint: IConstraint): IVector {
    return {
      x:
        (constraint.bodyB ? constraint.bodyB.position.x : 0) +
        (constraint.pointB ? constraint.pointB.x : 0),
      y:
        (constraint.bodyB ? constraint.bodyB.position.y : 0) +
        (constraint.pointB ? constraint.pointB.y : 0),
    }
  }

  /**
   * Returns the current length of the constraint.
   * This is the distance between both of the constraint's end points.
   * See `constraint.length` for the target rest length.
   * @method currentLength
   * @param {constraint} constraint
   * @returns {number} the current length
   */
  public static currentLength(constraint: IConstraint): number {
    const pointAX =
      (constraint.bodyA ? constraint.bodyA.position.x : 0) +
      (constraint.pointA ? constraint.pointA.x : 0)
    const pointAY =
      (constraint.bodyA ? constraint.bodyA.position.y : 0) +
      (constraint.pointA ? constraint.pointA.y : 0)

    const pointBX =
      (constraint.bodyB ? constraint.bodyB.position.x : 0) +
      (constraint.pointB ? constraint.pointB.x : 0)
    const pointBY =
      (constraint.bodyB ? constraint.bodyB.position.y : 0) +
      (constraint.pointB ? constraint.pointB.y : 0)

    const deltaX = pointAX - pointBX
    const deltaY = pointAY - pointBY

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }
}
