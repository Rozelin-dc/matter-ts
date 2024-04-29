import { IBody } from '../body/Body';
import { IComposite } from '../body/Composite';
import { IPair } from '../collision/Pair';
import { IMouseConstraint } from '../constraint/MouseConstraint';
import { IRender } from '../render/Render';
import { IEngine } from './Engine';
import { IMouse } from './Mouse';
import { IRunner } from './Runner';
export type BodyEventName = 'sleepStart' | 'sleepEnd';
export type CompositeEventName = 'beforeAdd' | 'afterAdd' | 'beforeRemove' | 'afterRemove';
export type MouseEventName = 'mousedown' | 'mousemove' | 'mouseup' | 'startdrag' | 'enddrag';
export type EngineEventName = 'afterUpdate' | 'beforeUpdate' | 'collisionActive' | 'collisionEnd' | 'collisionStart' | 'beforeSolve';
export type RunnerEventName = 'beforeTick' | 'tick' | 'afterTick' | 'afterUpdate' | 'beforeUpdate';
export type RenderEventName = 'beforeRender' | 'afterRender';
export interface IEvent<S extends string, T> {
    /**
     * The name of the event
     */
    name: S;
    /**
     * The source object of the event
     */
    source: T;
}
type IBodyEvent = IEvent<BodyEventName, IBody>;
interface ICompositeEvent extends IEvent<CompositeEventName, IComposite> {
    object: any;
}
interface IMouseEvent extends IEvent<MouseEventName, IMouseConstraint> {
    mouse: IMouse;
    body?: IBody;
}
interface IEngineEvent extends IEvent<EngineEventName, IEngine> {
    /**
     * List of affected pairs
     */
    pairs: IPair[];
    /**
     * The timestamp of the event
     */
    timestamp: number;
    /**
     * The delta time in milliseconds value used in the update
     */
    delta: number;
}
interface IRunnerEvent extends IEvent<RunnerEventName, IRunner> {
    /**
     * The timestamp of the event
     */
    timestamp: number;
}
interface IRenderEvent extends IEvent<RenderEventName, IRunner> {
    /**
     * The timestamp of the event
     */
    timestamp?: number;
}
type EventFunction<T> = (event: T) => void;
export type BodyEventFunction = EventFunction<IBodyEvent>;
export type CompositeEventFunction = EventFunction<ICompositeEvent>;
export type MouseEventFunction = EventFunction<IMouseEvent>;
export type EngineEventFunction = EventFunction<IEngineEvent>;
export type RunnerEventFunction = EventFunction<IRunnerEvent>;
export type RenderEventFunction = EventFunction<IRenderEvent>;
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
    static on(body: IBody, eventName: BodyEventName, callback: BodyEventFunction): BodyEventFunction;
    static on(composite: IComposite, eventName: CompositeEventName, callback: CompositeEventFunction): CompositeEventFunction;
    static on(engine: IEngine, eventName: EngineEventName, callback: EngineEventFunction): EngineEventFunction;
    static on(mouse: IMouseConstraint, eventName: MouseEventName, callback: MouseEventFunction): MouseEventFunction;
    static on(runner: IRunner, eventName: RunnerEventName, callback: RunnerEventFunction): RunnerEventFunction;
    static on(runner: IRender, eventName: RenderEventName, callback: RenderEventFunction): RenderEventFunction;
    /**
     * Removes the given event callback. If no callback, clears all callbacks in `eventNames`. If no `eventNames`, clears all events.
     * @method off
     * @param object
     * @param eventNames
     * @param callback
     */
    static off(body: IBody, eventName: BodyEventName | BodyEventFunction, callback?: BodyEventFunction): void;
    static off(composite: IComposite, eventName: CompositeEventName | CompositeEventFunction, callback?: CompositeEventFunction): void;
    static off(engine: IEngine, eventName: EngineEventName | EngineEventFunction, callback?: EngineEventFunction): void;
    static off(mouse: IMouseConstraint, eventName: MouseEventName | MouseEventFunction, callback?: MouseEventFunction): void;
    static off(runner: IRunner, eventName: RunnerEventName | RunnerEventFunction, callback?: RunnerEventFunction): void;
    static off(runner: IRender, eventName: RenderEventName | RenderEventFunction, callback?: RenderEventFunction): void;
    /**
     * Fires all the callbacks subscribed to the given object's `eventName`, in the order they subscribed, if any.
     * @method trigger
     * @param object
     * @param eventNames
     * @param event
     */
    static trigger(body: IBody, eventName: BodyEventName, event?: Partial<IBodyEvent>): void;
    static trigger(composite: IComposite, eventName: CompositeEventName, event: Partial<ICompositeEvent>): void;
    static trigger(mouse: IMouseConstraint, eventName: MouseEventName, event: Partial<IMouseEvent>): void;
    static trigger(engine: IEngine, eventName: EngineEventName, event: Partial<IEngineEvent>): void;
    static trigger(runner: IRunner, eventName: RunnerEventName, event: Partial<IRunnerEvent>): void;
    static trigger(runner: IRender, eventName: RenderEventName, event: Partial<IRenderEvent>): void;
}
export {};
