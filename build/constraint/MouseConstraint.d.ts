import { IBody } from '../body/Body';
import { ICollisionFilter } from '../collision/Detector';
import { MouseEventFunction, MouseEventName } from '../core/Events';
import { IMouse } from '../core/Mouse';
import { IConstraint } from './Constraint';
export interface IMouseConstraint {
    /**
     * A `String` denoting the type of object.
     */
    type: 'mouseConstraint';
    /**
     * The `Mouse` instance in use. If not supplied in `MouseConstraint.create`, one will be created.
     */
    mouse: IMouse;
    /**
     * The `Body` that is currently being moved by the user, or `null` if no body.
     *
     * @default null
     */
    body: IBody | null;
    /**
     * The `Constraint` object that is used to move the body during interaction.
     */
    constraint: IConstraint;
    /**
     * An `Object` that specifies the collision filter properties.
     * The collision filter allows the user to define which types of body this mouse constraint can interact with.
     * See `body.collisionFilter` for more information.
     */
    collisionFilter: ICollisionFilter;
    events: Record<MouseEventName, MouseEventFunction>;
    element: HTMLElement | null;
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
    static create(engine: any, options: Partial<IMouseConstraint>): IMouseConstraint;
    /**
     * Updates the given mouse constraint.
     * @method update
     * @param mouseConstraint
     * @param bodies
     */
    protected static update(mouseConstraint: IMouseConstraint, bodies: IBody[]): void;
    /**
     * Triggers mouse constraint events.
     * @method _triggerEvents
     * @param mouseConstraint
     */
    protected static _triggerEvents(mouseConstraint: IMouseConstraint): void;
}
