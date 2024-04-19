import { IVector } from '../geometry/Vector';
type MouseEventType = MouseEvent | TouchEvent;
export interface IMouse {
    element: HTMLElement;
    absolute: IVector;
    position: IVector;
    mousedownPosition: IVector;
    mouseupPosition: IVector;
    offset: IVector;
    scale: IVector;
    wheelDelta: number;
    button: number;
    pixelRatio: number;
    sourceEvents: {
        mousemove: MouseEventType | null;
        mousedown: MouseEventType | null;
        mouseup: MouseEventType | null;
        mousewheel: MouseEventType | null;
    };
    mousemove: (event: MouseEventType) => void;
    mousedown: (event: MouseEventType) => void;
    mouseup: (event: MouseEventType) => void;
    mousewheel: (event: WheelEvent) => void;
}
/**
 * The `Matter.Mouse` module contains methods for creating and manipulating mouse inputs.
 */
export default class Mouse {
    /**
     * Creates a mouse input.
     * @method create
     * @param element
     * @return A new mouse
     */
    static create(element?: HTMLElement): IMouse;
    static isTouchEvent(event: MouseEventType): event is TouchEvent;
    /**
     * Sets the element the mouse is bound to (and relative to).
     * @method setElement
     * @param mouse
     * @param element
     */
    static setElement(mouse: IMouse, element: HTMLElement): void;
    /**
     * Clears all captured source events.
     * @method clearSourceEvents
     * @param mouse
     */
    static clearSourceEvents(mouse: IMouse): void;
    /**
     * Sets the mouse position offset.
     * @method setOffset
     * @param mouse
     * @param offset
     */
    static setOffset(mouse: IMouse, offset: IVector): void;
    /**
     * Sets the mouse position scale.
     * @method setScale
     * @param mouse
     * @param scale
     */
    static setScale(mouse: IMouse, scale: IVector): void;
    /**
     * Gets the mouse position relative to an element given a screen pixel ratio.
     * @method _getRelativeMousePosition
     * @private
     * @param {} event
     * @param {} element
     * @param {number} pixelRatio
     * @return {}
     */
    protected static _getRelativeMousePosition(event: MouseEventType, element: HTMLElement, pixelRatio: number): IVector;
}
export {};
