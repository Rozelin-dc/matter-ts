import Body, { IBody } from '../body/Body'
import Composite, { IComposite } from '../body/Composite'
import Detector, { IDetector } from '../collision/Detector'
import Grid, { IGrid } from '../collision/Grid'
import Pairs, { IPairs } from '../collision/Pairs'
import Resolver from '../collision/Resolver'
import Constraint from '../constraint/Constraint'
import { IRender } from '../render/Render'
import Common from './Common'
import Events, { EngineEventFunction, EngineEventName } from './Events'
import { IMouse } from './Mouse'
import { IPlugin } from './Plugin'
import Runner from './Runner'
import Sleeping from './Sleeping'

export interface IEngine {
  /**
   * An integer `Number` that specifies the number of position iterations to perform each update.
   * The higher the value, the higher quality the simulation will be at the expense of performance.
   *
   * @default 6
   */
  positionIterations: number

  /**
   * An integer `Number` that specifies the number of velocity iterations to perform each update.
   * The higher the value, the higher quality the simulation will be at the expense of performance.
   *
   * @default 4
   */
  velocityIterations: number

  /**
   * An integer `Number` that specifies the number of constraint iterations to perform each update.
   * The higher the value, the higher quality the simulation will be at the expense of performance.
   * The default value of `2` is usually very adequate.
   *
   * @default 2
   */
  constraintIterations: number

  /**
   * A flag that specifies whether the engine should allow sleeping via the `Matter.Sleeping` module.
   * Sleeping can improve stability and performance, but often at the expense of accuracy.
   *
   * @default false
   */
  enableSleeping: boolean

  /**
   * An `Object` containing properties regarding the timing systems of the engine.
   *
   * @property timing
   * @type object
   */
  timing: IEngineTiming

  /**
   * A `Matter.Detector` instance.
   */
  detector: IDetector

  /**
   * A `Matter.Grid` instance.
   *
   * @deprecated replaced by `engine.detector`
   */
  grid: IGrid

  /**
   * Replaced by and now alias for `engine.grid`.
   *
   * @deprecated replaced by `engine.detector`
   */
  broadphase: IGrid

  /**
   * The root `Matter.Composite` instance that will contain all bodies, constraints and other composites to be simulated by this engine.
   */
  world: IComposite

  /**
   * An object reserved for storing plugin-specific properties.
   */
  plugin: IPlugin | {}

  /**
   * An optional gravitational acceleration applied to all bodies in `engine.world` on every update.
   *
   * This models a [uniform gravitational field](https://en.wikipedia.org/wiki/Gravity_of_Earth), similar to near the surface of a planet. For gravity in other contexts, disable this and apply forces as needed.
   *
   * To disable set the `scale` component to `0`.
   *
   * This is split into three components for ease of use:
   * a normalised direction (`x` and `y`) and magnitude (`scale`).
   */
  gravity: IEngineGravity

  events: Record<EngineEventName, EngineEventFunction>
  pairs: IPairs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metrics: any
  render?: IRender
  mouse?: IMouse
}

export interface IEngineTiming {
  /**
   * A `Number` that specifies the global scaling factor of time for all bodies.
   * A value of `0` freezes the simulation.
   * A value of `0.1` gives a slow-motion effect.
   * A value of `1.2` gives a speed-up effect.
   *
   * @default 1
   */
  timeScale: number

  /**
   * A `Number` that specifies the current simulation-time in milliseconds starting from `0`.
   * It is incremented on every `Engine.update` by the given `delta` argument.
   *
   * @default 0
   */
  timestamp: number

  /**
   * A `Number` that represents the total execution time elapsed during the last `Engine.update` in milliseconds.
   * It is updated by timing from the start of the last `Engine.update` call until it ends.
   *
   * This value will also include the total execution time of all event handlers directly or indirectly triggered by the engine update.
   *
   * @default 0
   */
  lastElapsed: number

  /**
   * A `Number` that represents the `delta` value used in the last engine update.
   *
   * @default 0
   */
  lastDelta: number
}

export interface IEngineGravity {
  /**
   * The gravitational direction normal `x` component, to be multiplied by `gravity.scale`.
   *
   * @default 0
   */
  x: number

  /**
   * The gravitational direction normal `y` component, to be multiplied by `gravity.scale`.
   *
   * @default 1
   */
  y: number

  /**
   * The magnitude of the gravitational acceleration.
   *
   * @default 0.001
   */
  scale: number
}

/**
 * The `Matter.Engine` module contains methods for creating and manipulating engines.
 * An engine is a controller that manages updating the simulation of the world.
 * See `Matter.Runner` for an optional game loop utility.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Engine {
  /**
   * Creates a new engine. The options parameter is an object that specifies any properties you wish to override the defaults.
   * All properties have default values, and many are pre-calculated automatically based on other properties.
   * See the properties section below for detailed information on what you can pass via the `options` object.
   * @method create
   * @param options
   * @return engine
   */
  public static create(options: Partial<IEngine> = {}): IEngine {
    const defaults: Omit<
      IEngine,
      'world' | 'detector' | 'pairs' | 'grid' | 'broadphase' | 'metrics'
    > = {
      positionIterations: 6,
      velocityIterations: 4,
      constraintIterations: 2,
      enableSleeping: false,
      events: {} as IEngine['events'],
      plugin: {},
      gravity: {
        x: 0,
        y: 1,
        scale: 0.001,
      },
      timing: {
        timestamp: 0,
        timeScale: 1,
        lastDelta: 0,
        lastElapsed: 0,
      },
    }

    const engine = Common.extend(defaults, options)

    engine.world = options.world || Composite.create({ label: 'World' })
    engine.pairs = options.pairs || Pairs.create()
    engine.detector = options.detector || Detector.create()

    // for temporary back compatibility only
    engine.grid = Grid.create()
    engine.world.gravity = engine.gravity
    engine.broadphase = engine.grid
    engine.metrics = {}

    return engine as IEngine
  }

  /**
   * Moves the simulation forward in time by `delta` milliseconds.
   * Triggers `beforeUpdate`, `beforeSolve` and `afterUpdate` events.
   * Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
   * @method update
   * @param engine
   * @param delta
   */
  public static update(
    engine: IEngine,
    delta: number = Common._baseDelta
  ): IEngine {
    const startTime = Common.now()

    const world = engine.world
    const detector = engine.detector
    const pairs = engine.pairs
    const timing = engine.timing
    const timestamp = timing.timestamp

    delta *= timing.timeScale

    // increment timestamp
    timing.timestamp += delta
    timing.lastDelta = delta

    // create an event object
    const event = {
      timestamp: timing.timestamp,
      delta: delta,
    }

    Events.trigger(engine, 'beforeUpdate', event)

    // get all bodies and all constraints in the world
    const allBodies = Composite.allBodies(world)
    const allConstraints = Composite.allConstraints(world)

    // if the world has changed
    if (world.isModified) {
      // update the detector bodies
      Detector.setBodies(detector, allBodies)

      // reset all composite modified flags
      Composite.setModified(world, false, false, true)
    }

    // update sleeping if enabled
    if (engine.enableSleeping) {
      Sleeping.update(allBodies, delta)
    }

    // apply gravity to all bodies
    Engine._bodiesApplyGravity(allBodies, engine.gravity)

    // update all body position and rotation by integration
    if (delta > 0) {
      Engine._bodiesUpdate(allBodies, delta)
    }

    Events.trigger(engine, 'beforeSolve', event)

    // update all constraints (first pass)
    Constraint.preSolveAll(allBodies)
    for (let i = 0; i < engine.constraintIterations; i++) {
      Constraint.solveAll(allConstraints, delta)
    }
    Constraint.postSolveAll(allBodies)

    // find all collisions
    detector.pairs = engine.pairs
    const collisions = Detector.collisions(detector)

    // update collision pairs
    Pairs.update(pairs, collisions, timestamp)

    // wake up bodies involved in collisions
    if (engine.enableSleeping) Sleeping.afterCollisions(pairs.list)

    // trigger collision events
    if (pairs.collisionStart.length > 0) {
      Events.trigger(engine, 'collisionStart', {
        pairs: pairs.collisionStart,
        timestamp: timing.timestamp,
        delta: delta,
      })
    }

    // iteratively resolve position between collisions
    const positionDamping = Common.clamp(20 / engine.positionIterations, 0, 1)

    Resolver.preSolvePosition(pairs.list)
    for (let i = 0; i < engine.positionIterations; i++) {
      Resolver.solvePosition(pairs.list, delta, positionDamping)
    }
    Resolver.postSolvePosition(allBodies)

    // update all constraints (second pass)
    Constraint.preSolveAll(allBodies)
    for (let i = 0; i < engine.constraintIterations; i++) {
      Constraint.solveAll(allConstraints, delta)
    }
    Constraint.postSolveAll(allBodies)

    // iteratively resolve velocity between collisions
    Resolver.preSolveVelocity(pairs.list)
    for (let i = 0; i < engine.velocityIterations; i++) {
      Resolver.solveVelocity(pairs.list, delta)
    }

    // update body speed and velocity properties
    Engine._bodiesUpdateVelocities(allBodies)

    // trigger collision events
    if (pairs.collisionActive.length > 0) {
      Events.trigger(engine, 'collisionActive', {
        pairs: pairs.collisionActive,
        timestamp: timing.timestamp,
        delta: delta,
      })
    }

    if (pairs.collisionEnd.length > 0) {
      Events.trigger(engine, 'collisionEnd', {
        pairs: pairs.collisionEnd,
        timestamp: timing.timestamp,
        delta: delta,
      })
    }

    // clear force buffers
    Engine._bodiesClearForces(allBodies)

    Events.trigger(engine, 'afterUpdate', event)

    // log the time elapsed computing this update
    engine.timing.lastElapsed = Common.now() - startTime

    return engine
  }

  /**
   * Merges two engines by keeping the configuration of `engineA` but replacing the world with the one from `engineB`.
   * @method merge
   * @param engineA
   * @param engineB
   */
  public static merge(engineA: IEngine, engineB: IEngine): void {
    Common.extend(engineA, engineB)

    if (engineB.world) {
      engineA.world = engineB.world

      Engine.clear(engineA)

      const bodies = Composite.allBodies(engineA.world)

      for (const body of bodies) {
        Sleeping.set(body, false)
        body.id = Common.nextId()
      }
    }
  }

  /**
   * Clears the engine pairs and detector.
   * @method clear
   * @param engine
   */
  public static clear(engine: IEngine): void {
    Pairs.clear(engine.pairs)
    Detector.clear(engine.detector)
  }

  /**
   * Zeroes the `body.force` and `body.torque` force buffers.
   * @method _bodiesClearForces
   * @param bodies
   */
  protected static _bodiesClearForces(bodies: IBody[]): void {
    for (const body of bodies) {
      // reset force buffers
      body.force.x = 0
      body.force.y = 0
      body.torque = 0
    }
  }

  /**
   * Applies gravitational acceleration to all `bodies`.
   * This models a [uniform gravitational field](https://en.wikipedia.org/wiki/Gravity_of_Earth), similar to near the surface of a planet.
   *
   * @method _bodiesApplyGravity
   * @param bodies
   * @param gravity
   */
  protected static _bodiesApplyGravity(
    bodies: IBody[],
    gravity: Omit<IEngineGravity, 'scale'> & { scale?: number }
  ): void {
    const gravityScale = gravity.scale ?? 0.001

    if ((gravity.x === 0 && gravity.y === 0) || gravityScale === 0) {
      return
    }

    for (const body of bodies) {
      if (body.isStatic || body.isSleeping) {
        continue
      }

      // add the resultant force of gravity
      body.force.y += body.mass * gravity.y * gravityScale
      body.force.x += body.mass * gravity.x * gravityScale
    }
  }

  /**
   * Applies `Body.update` to all given `bodies`.
   * @method _bodiesUpdate
   * @param bodies
   * @param delta The amount of time elapsed between updates
   */
  protected static _bodiesUpdate(bodies: IBody[], delta: number): void {
    for (const body of bodies) {
      if (body.isStatic || body.isSleeping) {
        continue
      }

      Body.update(body, delta)
    }
  }

  /**
   * Applies `Body.updateVelocities` to all given `bodies`.
   * @method _bodiesUpdateVelocities
   * @param bodies
   */
  protected static _bodiesUpdateVelocities(bodies: IBody[]): void {
    for (const body of bodies) {
      Body.updateVelocities(body)
    }
  }

  /**
   * @deprecated
   */
  public static run = Runner.run
}

// eslint-disable-next-line no-extra-semi
;(() => {
  Common.deprecated(
    Engine as Object as Record<string, Function>,
    'run',
    'Engine.run ➤ use public static Runner.run(engine) instead'
  )
})()
