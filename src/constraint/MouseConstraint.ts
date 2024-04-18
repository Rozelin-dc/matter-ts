import { IBody } from '../body/Body'
import Composite from '../body/Composite'
import Detector, { ICollisionFilter } from '../collision/Detector'
import Common from '../core/Common'
import { IEngine } from '../core/Engine'
import Events, { MouseEventFunction, MouseEventName } from '../core/Events'
import Mouse, { IMouse } from '../core/Mouse'
import Sleeping from '../core/Sleeping'
import Bounds from '../geometry/Bounds'
import Vector from '../geometry/Vector'
import Vertices from '../geometry/Vertices'
import Constraint, { IConstraint } from './Constraint'

export interface IMouseConstraint {
  /**
   * A `String` denoting the type of object.
   */
  type: 'mouseConstraint'

  /**
   * The `Mouse` instance in use. If not supplied in `MouseConstraint.create`, one will be created.
   */
  mouse: IMouse

  /**
   * The `Body` that is currently being moved by the user, or `null` if no body.
   *
   * @default null
   */
  body: IBody | null

  /**
   * The `Constraint` object that is used to move the body during interaction.
   */
  constraint: IConstraint

  /**
   * An `Object` that specifies the collision filter properties.
   * The collision filter allows the user to define which types of body this mouse constraint can interact with.
   * See `body.collisionFilter` for more information.
   */
  collisionFilter: ICollisionFilter

  events: Record<MouseEventName, MouseEventFunction>
  element: HTMLElement | null
}

/**
 * The `Matter.MouseConstraint` module contains methods for creating mouse constraints.
 * Mouse constraints are used for allowing user interaction, providing the ability to move bodies via the mouse or touch.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class MouseConstraint {
  /**
   * Creates a new mouse constraint.
   * All properties have default values, and many are pre-calculated automatically based on other properties.
   * See the properties section below for detailed information on what you can pass via the `options` object.
   * @method create
   * @param engine
   * @param options
   * @return A new MouseConstraint
   */
  public static create(
    engine: IEngine,
    options: Partial<IMouseConstraint>
  ): IMouseConstraint {
    let mouse =
      (engine ? engine.mouse ?? null : null) || (options ? options.mouse : null)

    if (!mouse) {
      if (engine && engine.render && engine.render.canvas) {
        mouse = Mouse.create(engine.render.canvas)
      } else if (options && options.element) {
        mouse = Mouse.create(options.element)
      } else {
        mouse = Mouse.create()
        Common.warn(
          'MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected'
        )
      }
    }

    const constraint = Constraint.create({
      label: 'Mouse Constraint',
      pointA: mouse.position,
      pointB: { x: 0, y: 0 },
      length: 0.01,
      stiffness: 0.1,
      angularStiffness: 1,
      render: {
        strokeStyle: '#90EE90',
        lineWidth: 3,
      },
    })

    const defaults: IMouseConstraint = {
      type: 'mouseConstraint',
      mouse: mouse,
      element: null,
      body: null,
      constraint: constraint,
      collisionFilter: {
        category: 0x0001,
        mask: 0xffffffff,
        group: 0,
      },
      events: {} as IMouseConstraint['events']
    }

    const mouseConstraint = Common.extend(defaults, options)

    Events.on(engine, 'beforeUpdate', () => {
      const allBodies = Composite.allBodies(engine.world)
      MouseConstraint.update(mouseConstraint, allBodies)
      MouseConstraint._triggerEvents(mouseConstraint)
    })

    mouseConstraint.events = mouseConstraint.events ?? {}

    return mouseConstraint
  }

  /**
   * Updates the given mouse constraint.
   * @method update
   * @param mouseConstraint
   * @param bodies
   */
  protected static update(
    mouseConstraint: IMouseConstraint,
    bodies: IBody[]
  ): void {
    const mouse = mouseConstraint.mouse
    const constraint = mouseConstraint.constraint

    if (mouse.button === 0) {
      if (!constraint.bodyB) {
        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i]
          if (
            Bounds.contains(body.bounds, mouse.position) &&
            Detector.canCollide(
              body.collisionFilter,
              mouseConstraint.collisionFilter
            )
          ) {
            for (
              let j = body.parts.length > 1 ? 1 : 0;
              j < body.parts.length;
              j++
            ) {
              const part = body.parts[j]
              if (Vertices.contains(part.vertices, mouse.position)) {
                constraint.pointA = mouse.position
                constraint.bodyB = mouseConstraint.body = body
                constraint.pointB = {
                  x: mouse.position.x - body.position.x,
                  y: mouse.position.y - body.position.y,
                }
                constraint.angleB = body.angle

                Sleeping.set(body, false)
                Events.trigger(mouseConstraint, 'startdrag', {
                  mouse: mouse,
                  body: body,
                })

                break
              }
            }
          }
        }
      } else {
        Sleeping.set(constraint.bodyB, false)
        constraint.pointA = mouse.position
      }
    } else {
      const body = mouseConstraint.body
      constraint.bodyB = mouseConstraint.body = null
      constraint.pointB = Vector.create()

      if (body) {
        Events.trigger(mouseConstraint, 'enddrag', { mouse: mouse, body: body })
      }
    }
  }

  /**
   * Triggers mouse constraint events.
   * @method _triggerEvents
   * @param mouseConstraint
   */
  protected static _triggerEvents(mouseConstraint: IMouseConstraint): void {
    const mouse = mouseConstraint.mouse
    const mouseEvents = mouse.sourceEvents

    if (mouseEvents.mousemove) {
      Events.trigger(mouseConstraint, 'mousemove', { mouse: mouse })
    }

    if (mouseEvents.mousedown) {
      Events.trigger(mouseConstraint, 'mousedown', { mouse: mouse })
    }

    if (mouseEvents.mouseup) {
      Events.trigger(mouseConstraint, 'mouseup', { mouse: mouse })
    }

    // reset the mouse state ready for the next step
    Mouse.clearSourceEvents(mouse)
  }
}
