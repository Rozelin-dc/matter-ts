import Common, { DeepPartial } from '../core/Common'
import Events, { CompositeEventName } from '../core/Events'
import { IPlugin } from '../core/Plugin'
import Bounds, { IBounds } from '../geometry/Bounds'
import { IVector } from '../geometry/Vector'
import Vertices from '../geometry/Vertices'
import Body, { IBody } from './Body'
import { IConstraint } from '../constraint/Constraint'
import { IMouseConstraint } from '../constraint/MouseConstraint'
import { IEngineGravity } from '../core/Engine'

export interface IComposite {
  /**
   * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
   */
  id: number

  /**
   * A `String` denoting the type of object.
   */
  type: 'composite'

  /**
   * An arbitrary `String` name to help the user identify and manage composites.
   *
   * @default "Composite"
   */
  label: string

  /**
   * A flag that specifies whether the composite has been modified during the current step.
   * This is automatically managed when bodies, constraints or composites are added or removed.
   *
   * @default false
   */
  isModified: boolean

  /**
   * The `Composite` that is the parent of this composite. It is automatically managed by the `Matter.Composite` methods.
   *
   * @default null
   */
  parent: IComposite | null

  /**
   * An array of `Body` that are _direct_ children of this composite.
   * To add or remove bodies you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
   * If you wish to recursively find all descendants, you should use the `Composite.allBodies` method.
   *
   * @default []
   */
  bodies: IBody[]

  /**
   * An array of `Constraint` that are _direct_ children of this composite.
   * To add or remove constraints you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
   * If you wish to recursively find all descendants, you should use the `Composite.allConstraints` method.
   *
   * @default []
   */
  constraints: IConstraint[]

  /**
   * An array of `Composite` that are _direct_ children of this composite.
   * To add or remove composites you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
   * If you wish to recursively find all descendants, you should use the `Composite.allComposites` method.
   *
   * @default []
   */
  composites: IComposite[]

  /**
   * An object reserved for storing plugin-specific properties.
   *
   * @default {}
   */
  plugin: IPlugin | {}

  /**
   * An object used for storing cached results for performance reasons.
   * This is used internally only and is automatically managed.
   */
  cache: {
    allBodies: IBody[] | null
    allConstraints: IConstraint[] | null
    allComposites: IComposite[] | null
  }

  events: Record<CompositeEventName, Function[]>
  gravity?: IEngineGravity
}

type CompositeAddableObject =
  | IBody
  | IComposite
  | IConstraint
  | IMouseConstraint

/**
 * A composite is a collection of `Matter.Body`, `Matter.Constraint` and other `Matter.Composite` objects.
 *
 * They are a container that can represent complex objects made of multiple parts, even if they are not physically connected.
 * A composite could contain anything from a single body all the way up to a whole world.
 *
 * When making any changes to composites, use the included functions rather than changing their properties directly.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Composite {
  /**
   * Creates a new composite. The options parameter is an object that specifies any properties you wish to override the defaults.
   * See the properites section below for detailed information on what you can pass via the `options` object.
   * @method create
   * @param options
   * @return A new composite
   */
  public static create(options: DeepPartial<IComposite> = {}): IComposite {
    const defaults: IComposite = {
      id: Common.nextId(),
      type: 'composite',
      parent: null,
      isModified: false,
      bodies: [],
      constraints: [],
      composites: [],
      label: 'Composite',
      plugin: {},
      cache: {
        allBodies: null,
        allConstraints: null,
        allComposites: null,
      },
      events: {} as IComposite['events'],
    }
    return Common.extend(defaults, options)
  }

  /**
   * Sets the composite's `isModified` flag.
   * If `updateParents` is true, all parents will be set (default: false).
   * If `updateChildren` is true, all children will be set (default: false).
   * @method setModified
   * @param composite
   * @param isModified
   * @param updateParents
   * @param updateChildren
   */
  public static setModified(
    composite: IComposite,
    isModified: boolean,
    updateParents: boolean = false,
    updateChildren: boolean = false
  ): void {
    composite.isModified = isModified

    if (isModified && composite.cache) {
      composite.cache.allBodies = null
      composite.cache.allConstraints = null
      composite.cache.allComposites = null
    }

    if (updateParents && composite.parent) {
      Composite.setModified(
        composite.parent,
        isModified,
        updateParents,
        updateChildren
      )
    }

    if (updateChildren) {
      for (const childComposite of composite.composites) {
        Composite.setModified(
          childComposite,
          isModified,
          updateParents,
          updateChildren
        )
      }
    }
  }

  /**
   * Generic single or multi-add function. Adds a single or an array of body(s), constraint(s) or composite(s) to the given composite.
   * Triggers `beforeAdd` and `afterAdd` events on the `composite`.
   * @method add
   * @param composite
   * @param object A single or an array of body(s), constraint(s) or composite(s)
   * @return The original composite with the objects added
   */
  public static add(
    composite: IComposite,
    object: CompositeAddableObject | CompositeAddableObject[]
  ): IComposite {
    const objects = ([] as CompositeAddableObject[]).concat(object)

    Events.trigger(composite, 'beforeAdd', { object: object })

    for (const obj of objects) {
      switch (obj.type) {
        case 'body':
          // skip adding compound parts
          if (obj.parent !== obj) {
            Common.warn(
              'Composite.add: skipped adding a compound body part (you must add its parent instead)'
            )
            break
          }

          Composite.addBody(composite, obj)
          break
        case 'constraint':
          Composite.addConstraint(composite, obj)
          break
        case 'composite':
          Composite.addComposite(composite, obj)
          break
        case 'mouseConstraint':
          Composite.addConstraint(composite, obj.constraint)
          break
      }
    }

    Events.trigger(composite, 'afterAdd', { object: object })

    return composite
  }

  /**
   * Generic remove function. Removes one or many body(s), constraint(s) or a composite(s) to the given composite.
   * Optionally searching its children recursively.
   * Triggers `beforeRemove` and `afterRemove` events on the `composite`.
   * @method remove
   * @param composite
   * @param object
   * @param deep
   * @return The original composite with the objects removed
   */
  public static remove(
    composite: IComposite,
    object: CompositeAddableObject | CompositeAddableObject[],
    deep: boolean = false
  ): IComposite {
    const objects = ([] as CompositeAddableObject[]).concat(object)

    Events.trigger(composite, 'beforeRemove', { object: object })

    for (const obj of objects) {
      switch (obj.type) {
        case 'body':
          Composite.removeBody(composite, obj, deep)
          break
        case 'constraint':
          Composite.removeConstraint(composite, obj, deep)
          break
        case 'composite':
          Composite.removeComposite(composite, obj, deep)
          break
        case 'mouseConstraint':
          Composite.removeConstraint(composite, obj.constraint)
          break
      }
    }

    Events.trigger(composite, 'afterRemove', { object: object })

    return composite
  }

  /**
   * Adds a composite to the given composite.
   * @method addComposite
   * @param compositeA
   * @param compositeB
   * @return The original compositeA with the objects from compositeB added
   */
  public static addComposite(
    compositeA: IComposite,
    compositeB: IComposite
  ): IComposite {
    compositeA.composites.push(compositeB)
    compositeB.parent = compositeA
    Composite.setModified(compositeA, true, true, false)
    return compositeA
  }

  /**
   * Removes a composite from the given composite, and optionally searching its children recursively.
   * @method removeComposite
   * @param compositeA
   * @param compositeB
   * @param deep
   * @return The original compositeA with the composite removed
   */
  protected static removeComposite(
    compositeA: IComposite,
    compositeB: IComposite,
    deep: boolean = false
  ): IComposite {
    const position = compositeA.composites.indexOf(compositeB)
    if (position !== -1) {
      Composite.removeCompositeAt(compositeA, position)
    }

    if (deep) {
      for (const composite of compositeA.composites) {
        Composite.removeComposite(composite, compositeB, true)
      }
    }

    return compositeA
  }

  /**
   * Removes a composite from the given composite.
   * @method removeCompositeAt
   * @param composite
   * @param position
   * @return The original composite with the composite removed
   */
  protected static removeCompositeAt(
    composite: IComposite,
    position: number
  ): IComposite {
    composite.composites.splice(position, 1)
    Composite.setModified(composite, true, true, false)
    return composite
  }

  /**
   * Adds a body to the given composite.
   * @method addBody
   * @param composite
   * @param body
   * @return The original composite with the body added
   */
  public static addBody(composite: IComposite, body: IBody): IComposite {
    composite.bodies.push(body)
    Composite.setModified(composite, true, true, false)
    return composite
  }

  /**
   * Removes a body from the given composite, and optionally searching its children recursively.
   * @method removeBody
   * @param composite
   * @param body
   * @param deep
   * @return The original composite with the body removed
   */
  protected static removeBody(
    composite: IComposite,
    body: IBody,
    deep: boolean = false
  ): IComposite {
    const position = composite.bodies.indexOf(body)
    if (position !== -1) {
      Composite.removeBodyAt(composite, position)
    }

    if (deep) {
      for (const c of composite.composites) {
        Composite.removeBody(c, body, true)
      }
    }

    return composite
  }

  /**
   * Removes a body from the given composite.
   * @method removeBodyAt
   * @param composite
   * @param position
   * @return The original composite with the body removed
   */
  protected static removeBodyAt(
    composite: IComposite,
    position: number
  ): IComposite {
    composite.bodies.splice(position, 1)
    Composite.setModified(composite, true, true, false)
    return composite
  }

  /**
   * Adds a constraint to the given composite.
   * @method addConstraint
   * @param composite
   * @param constraint
   * @return The original composite with the constraint added
   */
  public static addConstraint(
    composite: IComposite,
    constraint: IConstraint
  ): IComposite {
    composite.constraints.push(constraint)
    Composite.setModified(composite, true, true, false)
    return composite
  }

  /**
   * Removes a constraint from the given composite, and optionally searching its children recursively.
   * @method removeConstraint
   * @param composite
   * @param constraint
   * @param deep
   * @return The original composite with the constraint removed
   */
  protected static removeConstraint(
    composite: IComposite,
    constraint: IConstraint,
    deep: boolean = false
  ): IComposite {
    const position = composite.constraints.indexOf(constraint)
    if (position !== -1) {
      Composite.removeConstraintAt(composite, position)
    }

    if (deep) {
      for (const c of composite.composites) {
        Composite.removeConstraint(c, constraint, true)
      }
    }

    return composite
  }

  /**
   * Removes a body from the given composite.
   * @private
   * @method removeConstraintAt
   * @param composite
   * @param position
   * @return The original composite with the constraint removed
   */
  protected static removeConstraintAt(
    composite: IComposite,
    position: number
  ): IComposite {
    composite.constraints.splice(position, 1)
    Composite.setModified(composite, true, true, false)
    return composite
  }

  /**
   * Removes all bodies, constraints and composites from the given composite.
   * Optionally clearing its children recursively.
   * @method clear
   * @param composite
   * @param keepStatic
   * @param deep
   */
  public static clear(
    composite: IComposite,
    keepStatic: boolean,
    deep: boolean = false
  ): IComposite {
    if (deep) {
      for (const c of composite.composites) {
        Composite.clear(c, keepStatic, true)
      }
    }

    if (keepStatic) {
      composite.bodies = composite.bodies.filter((body) => {
        return body.isStatic
      })
    } else {
      composite.bodies.length = 0
    }

    composite.constraints.length = 0
    composite.composites.length = 0

    Composite.setModified(composite, true, true, false)

    return composite
  }

  /**
   * Returns all bodies in the given composite, including all bodies in its children, recursively.
   * @method allBodies
   * @param composite
   * @return All the bodies
   */
  public static allBodies(composite: IComposite): IBody[] {
    if (composite.cache && composite.cache.allBodies) {
      return composite.cache.allBodies
    }

    let bodies = ([] as IBody[]).concat(composite.bodies)

    for (const c of composite.composites)
      bodies = bodies.concat(Composite.allBodies(c))

    if (composite.cache) {
      composite.cache.allBodies = bodies
    }

    return bodies
  }

  /**
   * Returns all constraints in the given composite, including all constraints in its children, recursively.
   * @method allConstraints
   * @param composite
   * @return All the constraints
   */
  public static allConstraints(composite: IComposite): IConstraint[] {
    if (composite.cache && composite.cache.allConstraints) {
      return composite.cache.allConstraints
    }

    let constraints = ([] as IConstraint[]).concat(composite.constraints)

    for (const c of composite.composites)
      constraints = constraints.concat(Composite.allConstraints(c))

    if (composite.cache) {
      composite.cache.allConstraints = constraints
    }

    return constraints
  }

  /**
   * Returns all composites in the given composite, including all composites in its children, recursively.
   * @method allComposites
   * @param composite
   * @return All the composites
   */
  public static allComposites(composite: IComposite): IComposite[] {
    if (composite.cache && composite.cache.allComposites) {
      return composite.cache.allComposites
    }

    let composites = ([] as IComposite[]).concat(composite.composites)

    for (const c of composite.composites)
      composites = composites.concat(Composite.allComposites(c))

    if (composite.cache) {
      composite.cache.allComposites = composites
    }

    return composites
  }

  /**
   * Searches the composite recursively for an object matching the type and id supplied, null if not found.
   * @method get
   * @param composite
   * @param id
   * @param type
   * @return The requested object, if found
   */
  public static get(
    composite: IComposite,
    id: number,
    type: 'body' | 'constraint' | 'composite'
  ): IBody | IConstraint | IComposite | null {
    let objects: IBody[] | IConstraint[] | IComposite[] | undefined
    switch (type) {
      case 'body':
        objects = Composite.allBodies(composite)
        break
      case 'constraint':
        objects = Composite.allConstraints(composite)
        break
      case 'composite':
        objects = Composite.allComposites(composite).concat(composite)
        break
    }
    if (!objects) {
      return null
    }

    const object = objects.filter((object) => {
      return object.id.toString() === id.toString()
    })
    return object.length === 0 ? null : object[0]
  }

  /**
   * Moves the given object(s) from compositeA to compositeB (equal to a remove followed by an add).
   * @method move
   * @param compositeA
   * @param objects
   * @param compositeB
   * @return Returns compositeA
   */
  public static move(
    compositeA: IComposite,
    objects: CompositeAddableObject | CompositeAddableObject[],
    compositeB: IComposite
  ): IComposite {
    Composite.remove(compositeA, objects)
    Composite.add(compositeB, objects)
    return compositeA
  }

  /**
   * Assigns new ids for all objects in the composite, recursively.
   * @method rebase
   * @param composite
   * @return Returns composite
   */
  public static rebase(composite: IComposite): IComposite {
    const objects = ([] as (IBody | IConstraint | IComposite)[])
      .concat(Composite.allBodies(composite))
      .concat(Composite.allConstraints(composite))
      .concat(Composite.allComposites(composite))

    for (let i = 0; i < objects.length; i++) {
      objects[i].id = Common.nextId()
    }

    return composite
  }

  /**
   * Translates all children in the composite by a given vector relative to their current positions,
   * without imparting any velocity.
   * @method translate
   * @param composite
   * @param translation
   * @param recursive
   */
  public static translate(
    composite: IComposite,
    translation: IVector,
    recursive: boolean = true
  ): IComposite {
    const bodies = recursive ? Composite.allBodies(composite) : composite.bodies
    for (const body of bodies) {
      Body.translate(body, translation)
    }
    return composite
  }

  /**
   * Rotates all children in the composite by a given angle about the given point, without imparting any angular velocity.
   * @method rotate
   * @param composite
   * @param rotation
   * @param point
   * @param recursive
   */
  public static rotate(
    composite: IComposite,
    rotation: number,
    point: IVector,
    recursive: boolean = true
  ): IComposite {
    const cos = Math.cos(rotation)
    const sin = Math.sin(rotation)
    const bodies = recursive ? Composite.allBodies(composite) : composite.bodies

    for (const body of bodies) {
      const dx = body.position.x - point.x
      const dy = body.position.y - point.y

      Body.setPosition(body, {
        x: point.x + (dx * cos - dy * sin),
        y: point.y + (dx * sin + dy * cos),
      })

      Body.rotate(body, rotation)
    }

    return composite
  }

  /**
   * Scales all children in the composite, including updating physical properties (mass, area, axes, inertia), from a world-space point.
   * @method scale
   * @param composite
   * @param scaleX
   * @param scaleY
   * @param point
   * @param recursive
   */
  public static scale(
    composite: IComposite,
    scaleX: number,
    scaleY: number,
    point: IVector,
    recursive: boolean = true
  ): IComposite {
    const bodies = recursive ? Composite.allBodies(composite) : composite.bodies

    for (const body of bodies) {
      const dx = body.position.x - point.x
      const dy = body.position.y - point.y

      Body.setPosition(body, {
        x: point.x + dx * scaleX,
        y: point.y + dy * scaleY,
      })

      Body.scale(body, scaleX, scaleY)
    }

    return composite
  }

  /**
   * Returns the union of the bounds of all of the composite's bodies.
   * @method bounds
   * @param composite The composite.
   * @returns The composite bounds.
   */
  public static bounds(composite: IComposite): IBounds {
    const bodies = Composite.allBodies(composite)
    const points: IVector[] = []

    for (const body of bodies) {
      points.push(body.bounds.min, body.bounds.max)
    }

    return Bounds.create(Vertices.create(points))
  }
}
