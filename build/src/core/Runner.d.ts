/// <reference types="node" />
import { DeepPartial } from './Common';
import { IEngine } from './Engine';
import { RunnerEventFunction, RunnerEventName } from './Events';
export interface IRunner {
    /**
     * A flag that specifies whether the runner is running or not.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * A `Boolean` that specifies if the runner should use a fixed timestep (otherwise it is variable).
     * If timing is fixed, then the apparent simulation speed will change depending on the frame rate (but behaviour will be deterministic).
     * If the timing is variable, then the apparent simulation speed will be constant (approximately, but at the cost of determininism).
     *
     * @default false
     */
    isFixed: boolean;
    /**
     * A `Number` that specifies the time step between updates in milliseconds.
     * If `engine.timing.isFixed` is set to `true`, then `delta` is fixed.
     * If it is `false`, then `delta` can dynamically change to maintain the correct apparent simulation speed.
     *
     * @default 1000 / 60
     */
    delta: number;
    events: Record<RunnerEventName, RunnerEventFunction[]>;
    fps: number;
    deltaSampleSize: number;
    counterTimestamp: number;
    frameCounter: number;
    deltaHistory: number[];
    timePrev: number | null;
    frameRequestId: number | null;
    deltaMin: number;
    deltaMax: number;
}
/**
 * The `Matter.Runner` module is an optional utility which provides a game loop,
 * that handles continuously updating a `Matter.Engine` for you within a browser.
 * It is intended for development and debugging purposes, but may also be suitable for simple games.
 * If you are using your own game loop instead, then you do not need the `Matter.Runner` module.
 * Instead just call `Engine.update(engine, delta)` in your own loop.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Runner {
    protected static _frameTimeout: NodeJS.Timeout;
    protected static _requestAnimationFrame: ((callback: FrameRequestCallback) => number) & typeof requestAnimationFrame;
    protected static _cancelAnimationFrame: ((handle: number) => void) & typeof cancelAnimationFrame;
    /**
     * Creates a new Runner. The options parameter is an object that specifies any properties you wish to override the defaults.
     * @method create
     * @param options
     */
    static create(options?: DeepPartial<IRunner>): IRunner;
    /**
     * Continuously ticks a `Matter.Engine` by calling `Runner.tick` on the `requestAnimationFrame` event.
     * @method run
     * @param target
     * @param engine
     */
    static run(target: IRunner | IEngine, engine?: IEngine): IRunner;
    /**
     * A game loop utility that updates the engine and renderer by one step (a 'tick').
     * Features delta smoothing, time correction and fixed or dynamic timing.
     * Consider just `Engine.update(engine, delta)` if you're using your own loop.
     * @method tick
     * @param runner
     * @param engine
     * @param time
     */
    static tick(runner: IRunner, engine: IEngine, time: number): void;
    /**
     * Ends execution of `Runner.run` on the given `runner`, by canceling the animation frame request event loop.
     * If you wish to only temporarily pause the runner, see `runner.enabled` instead.
     * @method stop
     * @param runner
     */
    static stop(runner: IRunner): void;
    /**
     * Alias for `Runner.run`.
     * @method start
     * @param runner
     * @param engine
     */
    static start(runner: IRunner, engine: IEngine): void;
}
