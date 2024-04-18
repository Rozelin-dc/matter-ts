import Common, { DeepPartial } from './Common'
import Engine, { IEngine } from './Engine'
import Events, { RunnerEventFunction, RunnerEventName } from './Events'

export interface IRunner {
  /**
   * A flag that specifies whether the runner is running or not.
   *
   * @default true
   */
  enabled: boolean

  /**
   * A `Boolean` that specifies if the runner should use a fixed timestep (otherwise it is variable).
   * If timing is fixed, then the apparent simulation speed will change depending on the frame rate (but behaviour will be deterministic).
   * If the timing is variable, then the apparent simulation speed will be constant (approximately, but at the cost of determininism).
   *
   * @default false
   */
  isFixed: boolean

  /**
   * A `Number` that specifies the time step between updates in milliseconds.
   * If `engine.timing.isFixed` is set to `true`, then `delta` is fixed.
   * If it is `false`, then `delta` can dynamically change to maintain the correct apparent simulation speed.
   *
   * @default 1000 / 60
   */
  delta: number

  events: Record<RunnerEventName, RunnerEventFunction[]>
  fps: number
  deltaSampleSize: number
  counterTimestamp: number
  frameCounter: number
  deltaHistory: number[]
  timePrev: number | null
  frameRequestId: number | null
  deltaMin: number
  deltaMax: number
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
  protected static _frameTimeout: NodeJS.Timeout
  protected static _requestAnimationFrame =
    window.requestAnimationFrame.bind(window) ||
    // @ts-ignore
    window.webkitRequestAnimationFrame.bind(window) ||
    // @ts-ignore
    window.mozRequestAnimationFrame.bind(window) ||
    // @ts-ignore
    window.msRequestAnimationFrame.bind(window) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function (callback: (time: number) => any) {
      Runner._frameTimeout = setTimeout(() => {
        callback(Common.now())
      }, 1000 / 60)
    }
  protected static _cancelAnimationFrame =
    window.cancelAnimationFrame.bind(window) ||
    // @ts-ignore
    window.mozCancelAnimationFrame.bind(window) ||
    // @ts-ignore
    window.webkitCancelAnimationFrame.bind(window) ||
    // @ts-ignore
    window.msCancelAnimationFrame.bind(window) ||
    function () {
      clearTimeout(Runner._frameTimeout)
    }

  /**
   * Creates a new Runner. The options parameter is an object that specifies any properties you wish to override the defaults.
   * @method create
   * @param options
   */
  public static create(options: DeepPartial<IRunner> = {}): IRunner {
    const defaults: Omit<IRunner, 'delta' | 'deltaMax' | 'deltaMin'> = {
      fps: 60,
      deltaSampleSize: 60,
      counterTimestamp: 0,
      frameCounter: 0,
      deltaHistory: [],
      timePrev: null,
      frameRequestId: null,
      isFixed: false,
      enabled: true,
      events: {} as IRunner['events'],
    }

    const runner = Common.extend(defaults, options)

    runner.delta = runner.delta || 1000 / runner.fps
    runner.deltaMin = runner.deltaMin || 1000 / runner.fps
    runner.deltaMax = runner.deltaMax || 1000 / (runner.fps * 0.5)
    runner.fps = 1000 / runner.delta

    return runner as IRunner
  }

  /**
   * Continuously ticks a `Matter.Engine` by calling `Runner.tick` on the `requestAnimationFrame` event.
   * @method run
   * @param target
   * @param engine
   */
  public static run(target: IRunner | IEngine, engine?: IEngine): IRunner {
    const isEngine = (v: IRunner | IEngine): v is IEngine =>
      'positionIterations' in v

    let runner: IRunner
    // create runner if engine is first argument
    if (isEngine(target)) {
      engine = target
      runner = Runner.create()
    } else {
      runner = target
    }

    const run = function (time?: number) {
      runner.frameRequestId = Runner._requestAnimationFrame(run)

      if (time && runner.enabled) {
        Runner.tick(runner, engine!, time)
      }
    }
    run()

    return runner
  }

  /**
   * A game loop utility that updates the engine and renderer by one step (a 'tick').
   * Features delta smoothing, time correction and fixed or dynamic timing.
   * Consider just `Engine.update(engine, delta)` if you're using your own loop.
   * @method tick
   * @param runner
   * @param engine
   * @param time
   */
  public static tick(runner: IRunner, engine: IEngine, time: number): void {
    const timing = engine.timing
    let delta: number

    if (runner.isFixed) {
      // fixed timestep
      delta = runner.delta
    } else {
      // dynamic timestep based on wall clock between calls
      delta = runner.timePrev ? time - runner.timePrev : runner.delta
      runner.timePrev = time

      // optimistically filter delta over a few frames, to improve stability
      runner.deltaHistory.push(delta)
      runner.deltaHistory = runner.deltaHistory.slice(-runner.deltaSampleSize)
      delta = Math.min.apply(null, runner.deltaHistory)

      // limit delta
      delta = delta < runner.deltaMin ? runner.deltaMin : delta
      delta = delta > runner.deltaMax ? runner.deltaMax : delta

      // update engine timing object
      runner.delta = delta
    }

    // create an event object
    const event = {
      timestamp: timing.timestamp,
    }

    Events.trigger(runner, 'beforeTick', event)

    // fps counter
    runner.frameCounter += 1
    if (time - runner.counterTimestamp >= 1000) {
      runner.fps =
        runner.frameCounter * ((time - runner.counterTimestamp) / 1000)
      runner.counterTimestamp = time
      runner.frameCounter = 0
    }

    Events.trigger(runner, 'tick', event)

    // update
    Events.trigger(runner, 'beforeUpdate', event)

    Engine.update(engine, delta)

    Events.trigger(runner, 'afterUpdate', event)

    Events.trigger(runner, 'afterTick', event)
  }

  /**
   * Ends execution of `Runner.run` on the given `runner`, by canceling the animation frame request event loop.
   * If you wish to only temporarily pause the runner, see `runner.enabled` instead.
   * @method stop
   * @param runner
   */
  public static stop(runner: IRunner): void {
    if (runner.frameRequestId) {
      Runner._cancelAnimationFrame(runner.frameRequestId)
    }
  }

  /**
   * Alias for `Runner.run`.
   * @method start
   * @param runner
   * @param engine
   */
  public static start(runner: IRunner, engine: IEngine): void {
    Runner.run(runner, engine)
  }
}
