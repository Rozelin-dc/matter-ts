import { IBody } from '../body/Body'
import { IComposite } from '../body/Composite'
import { IPair } from '../collision/Pair'
import { IMouseConstraint } from '../constraint/MouseConstraint'
import { IRender } from '../render/Render'
import Common from './Common'
import { IEngine } from './Engine'
import { IMouse } from './Mouse'
import { IRunner } from './Runner'

export type BodyEventName = 'sleepStart' | 'sleepEnd'

export type CompositeEventName =
  | 'beforeAdd'
  | 'afterAdd'
  | 'beforeRemove'
  | 'afterRemove'

export type MouseEventName =
  | 'mousedown'
  | 'mousemove'
  | 'mouseup'
  | 'startdrag'
  | 'enddrag'

export type EngineEventName =
  | 'afterUpdate'
  | 'beforeUpdate'
  | 'collisionActive'
  | 'collisionEnd'
  | 'collisionStart'
  | 'beforeSolve'

export type RunnerEventName =
  | 'beforeTick'
  | 'tick'
  | 'afterTick'
  | 'afterUpdate'
  | 'beforeUpdate'

export type RenderEventName = 'beforeRender' | 'afterRender'

export interface IEvent<S extends string, T> {
  /**
   * The name of the event
   */
  name: S
  /**
   * The source object of the event
   */
  source: T
}

type IBodyEvent = IEvent<BodyEventName, IBody>

interface ICompositeEvent extends IEvent<CompositeEventName, IComposite> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
}

interface IMouseEvent extends IEvent<MouseEventName, IMouseConstraint> {
  mouse: IMouse
  body?: IBody
}

interface IEngineEvent extends IEvent<EngineEventName, IEngine> {
  /**
   * List of affected pairs
   */
  pairs: IPair[]

  /**
   * The timestamp of the event
   */
  timestamp: number

  /**
   * The delta time in milliseconds value used in the update
   */
  delta: number
}

interface IRunnerEvent extends IEvent<RunnerEventName, IRunner> {
  /**
   * The timestamp of the event
   */
  timestamp: number
}

interface IRenderEvent extends IEvent<RenderEventName, IRunner> {
  /**
   * The timestamp of the event
   */
  timestamp?: number
}

export type EventFunction<T> = (event: T) => void
export type BodyEventFunction = EventFunction<IBodyEvent>
export type CompositeEventFunction = EventFunction<ICompositeEvent>
export type MouseEventFunction = EventFunction<IMouseEvent>
export type EngineEventFunction = EventFunction<IEngineEvent>
export type RunnerEventFunction = EventFunction<IRunnerEvent>
export type RenderEventFunction = EventFunction<IRenderEvent>

/**
 * The `Matter.Events` module contains methods to fire and listen to events on other objects.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Events {
  /**
   * Subscribes a callback function to the given object's `eventName`.
   * @method on
   * @param object
   * @param eventNames
   * @param callback
   */
  public static on(
    body: IBody,
    eventName: BodyEventName,
    callback: BodyEventFunction
  ): BodyEventFunction
  public static on(
    composite: IComposite,
    eventName: CompositeEventName,
    callback: CompositeEventFunction
  ): CompositeEventFunction
  public static on(
    engine: IEngine,
    eventName: EngineEventName,
    callback: EngineEventFunction
  ): EngineEventFunction
  public static on(
    mouse: IMouseConstraint,
    eventName: MouseEventName,
    callback: MouseEventFunction
  ): MouseEventFunction
  public static on(
    runner: IRunner,
    eventName: RunnerEventName,
    callback: RunnerEventFunction
  ): RunnerEventFunction
  public static on(
    runner: IRender,
    eventName: RenderEventName,
    callback: RenderEventFunction
  ): RenderEventFunction
  public static on<
    F extends Function,
    T extends { events: Record<string, F[]> }
  >(object: T, eventNames: string, callback: F): F
  public static on<
    F extends Function,
    T extends { events: Record<string, F[]> }
  >(object: T, eventNames: string, callback: F): F {
    const names = eventNames.split(' ')

    for (const name of names) {
      object.events = object.events || {}
      object.events[name] = object.events[name] || []
      object.events[name].push(callback)
    }

    return callback
  }

  /**
   * Removes the given event callback. If no callback, clears all callbacks in `eventNames`. If no `eventNames`, clears all events.
   * @method off
   * @param object
   * @param eventNames
   * @param callback
   */
  public static off(
    body: IBody,
    eventName: BodyEventName | BodyEventFunction,
    callback?: BodyEventFunction
  ): void
  public static off(
    composite: IComposite,
    eventName: CompositeEventName | CompositeEventFunction,
    callback?: CompositeEventFunction
  ): void
  public static off(
    engine: IEngine,
    eventName: EngineEventName | EngineEventFunction,
    callback?: EngineEventFunction
  ): void
  public static off(
    mouse: IMouseConstraint,
    eventName: MouseEventName | MouseEventFunction,
    callback?: MouseEventFunction
  ): void
  public static off(
    runner: IRunner,
    eventName: RunnerEventName | RunnerEventFunction,
    callback?: RunnerEventFunction
  ): void
  public static off(
    runner: IRender,
    eventName: RenderEventName | RenderEventFunction,
    callback?: RenderEventFunction
  ): void
  public static off<
    T extends { events: Record<string, F[]> },
    F extends EventFunction<T>
  >(object: T, eventNames?: string | F, callback?: F): void
  public static off<
    T extends { events: Record<string, F[]> },
    F extends EventFunction<T>
  >(object: T, eventNames?: string | F, callback?: F): void {
    if (!eventNames) {
      object.events = {} as Record<string, F[]>
      return
    }

    let names: string[]
    // handle Events.off(object, callback)
    if (typeof eventNames === 'function') {
      callback = eventNames
      names = Common.keys(object.events)
    } else {
      names = (eventNames as string).split(' ')
    }

    for (let i = 0; i < names.length; i++) {
      const callbacks = object.events[names[i]]
      const newCallbacks: F[] = []

      if (callback && callbacks) {
        for (let j = 0; j < callbacks.length; j++) {
          if (callbacks[j] !== callback) {
            newCallbacks.push(callbacks[j])
          }
        }
      }

      object.events[names[i]] = newCallbacks
    }
  }

  /**
   * Fires all the callbacks subscribed to the given object's `eventName`, in the order they subscribed, if any.
   * @method trigger
   * @param object
   * @param eventNames
   * @param event
   */
  public static trigger(
    body: IBody,
    eventName: BodyEventName,
    event?: Partial<IBodyEvent>
  ): void
  public static trigger(
    composite: IComposite,
    eventName: CompositeEventName,
    event: Partial<ICompositeEvent>
  ): void
  public static trigger(
    mouse: IMouseConstraint,
    eventName: MouseEventName,
    event: Partial<IMouseEvent>
  ): void
  public static trigger(
    engine: IEngine,
    eventName: EngineEventName,
    event: Partial<IEngineEvent>
  ): void
  public static trigger(
    runner: IRunner,
    eventName: RunnerEventName,
    event: Partial<IRunnerEvent>
  ): void
  public static trigger(
    runner: IRender,
    eventName: RenderEventName,
    event: Partial<IRenderEvent>
  ): void
  public static trigger<
    T extends { events: Record<string, Function[]> },
    E extends IEvent<string, T>
  >(object: T, eventNames: string, event?: Partial<E>): void
  public static trigger<
    T extends { events: Record<string, Function[]> },
    E extends IEvent<string, T>
  >(object: T, eventNames: string, event: Partial<E> = {}): void {
    const events = object.events
    if (events && Common.keys(events).length > 0) {
      const names = eventNames.split(' ')
      for (const name of names) {
        const callbacks = events[name]

        if (callbacks) {
          const eventClone = Common.clone(event, false)
          eventClone.name = name
          eventClone.source = object

          for (let j = 0; j < callbacks.length; j++) {
            callbacks[j].apply(object, [eventClone])
          }
        }
      }
    }
  }
}
