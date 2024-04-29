import { IBody } from '../body/Body';
import { IComposite } from '../body/Composite';
import { IDetector } from '../collision/Detector';
import { IGrid } from '../collision/Grid';
import { IPairs } from '../collision/Pairs';
import { IRender } from '../render/Render';
import { EngineEventFunction, EngineEventName } from './Events';
import { IMouse } from './Mouse';
import { IPlugin } from './Plugin';
import Runner from './Runner';
export interface IEngine {
    /**
     * An integer `Number` that specifies the number of position iterations to perform each update.
     * The higher the value, the higher quality the simulation will be at the expense of performance.
     *
     * @default 6
     */
    positionIterations: number;
    /**
     * An integer `Number` that specifies the number of velocity iterations to perform each update.
     * The higher the value, the higher quality the simulation will be at the expense of performance.
     *
     * @default 4
     */
    velocityIterations: number;
    /**
     * An integer `Number` that specifies the number of constraint iterations to perform each update.
     * The higher the value, the higher quality the simulation will be at the expense of performance.
     * The default value of `2` is usually very adequate.
     *
     * @default 2
     */
    constraintIterations: number;
    /**
     * A flag that specifies whether the engine should allow sleeping via the `Matter.Sleeping` module.
     * Sleeping can improve stability and performance, but often at the expense of accuracy.
     *
     * @default false
     */
    enableSleeping: boolean;
    /**
     * An `Object` containing properties regarding the timing systems of the engine.
     *
     * @property timing
     * @type object
     */
    timing: IEngineTiming;
    /**
     * A `Matter.Detector` instance.
     */
    detector: IDetector;
    /**
     * A `Matter.Grid` instance.
     *
     * @deprecated replaced by `engine.detector`
     */
    grid: IGrid;
    /**
     * Replaced by and now alias for `engine.grid`.
     *
     * @deprecated replaced by `engine.detector`
     */
    broadphase: IGrid;
    /**
     * The root `Matter.Composite` instance that will contain all bodies, constraints and other composites to be simulated by this engine.
     */
    world: IComposite;
    /**
     * An object reserved for storing plugin-specific properties.
     */
    plugin: IPlugin | {};
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
    gravity: IEngineGravity;
    events: Record<EngineEventName, EngineEventFunction>;
    pairs: IPairs;
    metrics: any;
    render?: IRender;
    mouse?: IMouse;
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
    timeScale: number;
    /**
     * A `Number` that specifies the current simulation-time in milliseconds starting from `0`.
     * It is incremented on every `Engine.update` by the given `delta` argument.
     *
     * @default 0
     */
    timestamp: number;
    /**
     * A `Number` that represents the total execution time elapsed during the last `Engine.update` in milliseconds.
     * It is updated by timing from the start of the last `Engine.update` call until it ends.
     *
     * This value will also include the total execution time of all event handlers directly or indirectly triggered by the engine update.
     *
     * @default 0
     */
    lastElapsed: number;
    /**
     * A `Number` that represents the `delta` value used in the last engine update.
     *
     * @default 0
     */
    lastDelta: number;
}
export interface IEngineGravity {
    /**
     * The gravitational direction normal `x` component, to be multiplied by `gravity.scale`.
     *
     * @default 0
     */
    x: number;
    /**
     * The gravitational direction normal `y` component, to be multiplied by `gravity.scale`.
     *
     * @default 1
     */
    y: number;
    /**
     * The magnitude of the gravitational acceleration.
     *
     * @default 0.001
     */
    scale: number;
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
    static create(options?: Partial<IEngine>): IEngine;
    /**
     * Moves the simulation forward in time by `delta` milliseconds.
     * Triggers `beforeUpdate`, `beforeSolve` and `afterUpdate` events.
     * Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
     * @method update
     * @param engine
     * @param delta
     */
    static update(engine: IEngine, delta?: number): IEngine;
    /**
     * Merges two engines by keeping the configuration of `engineA` but replacing the world with the one from `engineB`.
     * @method merge
     * @param engineA
     * @param engineB
     */
    static merge(engineA: IEngine, engineB: IEngine): void;
    /**
     * Clears the engine pairs and detector.
     * @method clear
     * @param engine
     */
    static clear(engine: IEngine): void;
    /**
     * Zeroes the `body.force` and `body.torque` force buffers.
     * @method _bodiesClearForces
     * @param bodies
     */
    protected static _bodiesClearForces(bodies: IBody[]): void;
    /**
     * Applies gravitational acceleration to all `bodies`.
     * This models a [uniform gravitational field](https://en.wikipedia.org/wiki/Gravity_of_Earth), similar to near the surface of a planet.
     *
     * @method _bodiesApplyGravity
     * @param bodies
     * @param gravity
     */
    protected static _bodiesApplyGravity(bodies: IBody[], gravity: Omit<IEngineGravity, 'scale'> & {
        scale?: number;
    }): void;
    /**
     * Applies `Body.update` to all given `bodies`.
     * @method _bodiesUpdate
     * @param bodies
     * @param delta The amount of time elapsed between updates
     */
    protected static _bodiesUpdate(bodies: IBody[], delta: number): void;
    /**
     * Applies `Body.updateVelocities` to all given `bodies`.
     * @method _bodiesUpdateVelocities
     * @param bodies
     */
    protected static _bodiesUpdateVelocities(bodies: IBody[]): void;
    /**
     * @deprecated
     */
    static run: typeof Runner.run;
}
