import Vector, { IVector } from '../geometry/Vector'
import Common from './Common'

export type MouseEventType = MouseEvent | TouchEvent

export interface IMouse {
  element: HTMLElement
  absolute: IVector
  position: IVector
  mousedownPosition: IVector
  mouseupPosition: IVector
  offset: IVector
  scale: IVector
  wheelDelta: number
  button: number
  pixelRatio: number
  sourceEvents: {
    mousemove: MouseEventType | null
    mousedown: MouseEventType | null
    mouseup: MouseEventType | null
    mousewheel: MouseEventType | null
  }
  mousemove: (event: MouseEventType) => void
  mousedown: (event: MouseEventType) => void
  mouseup: (event: MouseEventType) => void
  mousewheel: (event: WheelEvent) => void
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
  public static create(element?: HTMLElement): IMouse {
    if (!element) {
      Common.log(
        'Mouse.create: element was undefined, defaulting to document.body',
        'warn'
      )
    }

    const mouse: IMouse = {
      element: element || document.body,
      absolute: Vector.create(0, 0),
      position: Vector.create(0, 0),
      mousedownPosition: Vector.create(0, 0),
      mouseupPosition: Vector.create(0, 0),
      offset: Vector.create(0, 0),
      scale: Vector.create(1, 1),
      wheelDelta: 0,
      button: -1,
      pixelRatio: parseInt(
        (element || document.body).getAttribute('data-pixel-ratio') ?? '1',
        10
      ),
      sourceEvents: {
        mousemove: null,
        mousedown: null,
        mouseup: null,
        mousewheel: null,
      },
      mousemove: (event: MouseEventType) => {
        const position = Mouse._getRelativeMousePosition(
          event,
          mouse.element,
          mouse.pixelRatio
        )
        if (Mouse.isTouchEvent(event)) {
          mouse.button = 0
          event.preventDefault()
        }

        mouse.absolute.x = position.x
        mouse.absolute.y = position.y
        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x
        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y
        mouse.sourceEvents.mousemove = event
      },
      mousedown: (event: MouseEventType) => {
        const position = Mouse._getRelativeMousePosition(
          event,
          mouse.element,
          mouse.pixelRatio
        )

        if (Mouse.isTouchEvent(event)) {
          mouse.button = 0
          event.preventDefault()
        } else {
          mouse.button = event.button
        }

        mouse.absolute.x = position.x
        mouse.absolute.y = position.y
        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x
        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y
        mouse.mousedownPosition.x = mouse.position.x
        mouse.mousedownPosition.y = mouse.position.y
        mouse.sourceEvents.mousedown = event
      },
      mouseup: (event: MouseEventType) => {
        const position = Mouse._getRelativeMousePosition(
          event,
          mouse.element,
          mouse.pixelRatio
        )

        if (Mouse.isTouchEvent(event)) {
          event.preventDefault()
        }

        mouse.button = -1
        mouse.absolute.x = position.x
        mouse.absolute.y = position.y
        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x
        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y
        mouse.mouseupPosition.x = mouse.position.x
        mouse.mouseupPosition.y = mouse.position.y
        mouse.sourceEvents.mouseup = event
      },
      mousewheel: (event: WheelEvent) => {
        mouse.wheelDelta = Math.max(-1, Math.min(1, -event.detail))
        event.preventDefault()
        mouse.sourceEvents.mousewheel = event
      },
    }

    Mouse.setElement(mouse, mouse.element)

    return mouse
  }

  public static isTouchEvent(event: MouseEventType): event is TouchEvent {
    return 'changedTouches' in event
  }

  /**
   * Sets the element the mouse is bound to (and relative to).
   * @method setElement
   * @param mouse
   * @param element
   */
  public static setElement(mouse: IMouse, element: HTMLElement): void {
    mouse.element = element

    element.addEventListener('mousemove', mouse.mousemove, { passive: true })
    element.addEventListener('mousedown', mouse.mousedown, { passive: true })
    element.addEventListener('mouseup', mouse.mouseup, { passive: true })

    element.addEventListener('wheel', mouse.mousewheel, { passive: false })

    element.addEventListener('touchmove', mouse.mousemove, { passive: false })
    element.addEventListener('touchstart', mouse.mousedown, { passive: false })
    element.addEventListener('touchend', mouse.mouseup, { passive: false })
  }

  /**
   * Clears all captured source events.
   * @method clearSourceEvents
   * @param mouse
   */
  public static clearSourceEvents(mouse: IMouse): void {
    mouse.sourceEvents.mousemove = null
    mouse.sourceEvents.mousedown = null
    mouse.sourceEvents.mouseup = null
    mouse.sourceEvents.mousewheel = null
    mouse.wheelDelta = 0
  }

  /**
   * Sets the mouse position offset.
   * @method setOffset
   * @param mouse
   * @param offset
   */
  public static setOffset(mouse: IMouse, offset: IVector): void {
    mouse.offset.x = offset.x
    mouse.offset.y = offset.y
    mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x
    mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y
  }

  /**
   * Sets the mouse position scale.
   * @method setScale
   * @param mouse
   * @param scale
   */
  public static setScale(mouse: IMouse, scale: IVector): void {
    mouse.scale.x = scale.x
    mouse.scale.y = scale.y
    mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x
    mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y
  }

  /**
   * Gets the mouse position relative to an element given a screen pixel ratio.
   * @method _getRelativeMousePosition
   * @param event
   * @param element
   * @param pixelRatio
   * @return The mouse position
   */
  protected static _getRelativeMousePosition(
    event: MouseEventType,
    element: HTMLElement,
    pixelRatio: number
  ): IVector {
    const elementBounds = element.getBoundingClientRect()
    const rootNode =
      document.documentElement || document.body.parentNode || document.body
    const scrollX =
      window.scrollX !== undefined ? window.scrollX : rootNode.scrollLeft
    const scrollY =
      window.scrollY !== undefined ? window.scrollY : rootNode.scrollTop
    let x: number
    let y: number

    if (Mouse.isTouchEvent(event)) {
      const touches = event.changedTouches
      x = touches[0].pageX - elementBounds.left - scrollX
      y = touches[0].pageY - elementBounds.top - scrollY
    } else {
      x = event.pageX - elementBounds.left - scrollX
      y = event.pageY - elementBounds.top - scrollY
    }

    return Vector.create(
      x / ((element.clientWidth / element.clientWidth) * pixelRatio),
      y / ((element.clientHeight / element.clientHeight) * pixelRatio)
    )
  }
}
