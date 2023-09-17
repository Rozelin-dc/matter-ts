import { Common } from './Common'

interface IMousePoint {
  x: number
  y: number
}

type MouseEventType = MouseEvent | TouchEvent

/**
 * contains methods for creating and manipulating mouse inputs.
 */
export class Mouse {
  public element: HTMLElement
  public absolute: IMousePoint
  public position: IMousePoint
  public mousedownPosition: IMousePoint
  public mouseupPosition: IMousePoint
  public offset: IMousePoint
  public scale: IMousePoint
  public wheelDelta: number
  public button: number
  public pixelRatio: number
  public sourceEvents: {
    mousemove: MouseEventType | null
    mousedown: MouseEventType | null
    mouseup: MouseEventType | null
    mousewheel: MouseEventType | null
  }

  /**
   * Creates a mouse input.
   * @param element
   * @return A new mouse
   */
  constructor(element?: HTMLElement) {
    if (!element) {
      Common.log(
        'Mouse.create: element was undefined, defaulting to document.body',
        'warn'
      )
    }

    this.element = element || document.body
    this.absolute = { x: 0, y: 0 }
    this.position = { x: 0, y: 0 }
    this.mousedownPosition = { x: 0, y: 0 }
    this.mouseupPosition = { x: 0, y: 0 }
    this.offset = { x: 0, y: 0 }
    this.scale = { x: 1, y: 1 }
    this.wheelDelta = 0
    this.button = -1
    this.pixelRatio = parseInt(
      this.element.getAttribute('data-pixel-ratio') ?? '1',
      10
    )

    this.sourceEvents = {
      mousemove: null,
      mousedown: null,
      mouseup: null,
      mousewheel: null,
    }

    this.setElement()
  }

  /**
   * Sets the element the mouse is bound to (and relative to).
   */
  public setElement() {
    this.element.addEventListener('mousemove', this.mousemove, {
      passive: true,
    })
    this.element.addEventListener('mousedown', this.mousedown, {
      passive: true,
    })
    this.element.addEventListener('mouseup', this.mouseup, { passive: true })

    this.element.addEventListener('wheel', this.mousewheel, { passive: false })

    this.element.addEventListener('touchmove', this.mousemove, {
      passive: false,
    })
    this.element.addEventListener('touchstart', this.mousedown, {
      passive: false,
    })
    this.element.addEventListener('touchend', this.mouseup, { passive: false })
  }

  /**
   * Clears all captured source events.
   */
  public clearSourceEvents() {
    this.sourceEvents.mousemove = null
    this.sourceEvents.mousedown = null
    this.sourceEvents.mouseup = null
    this.sourceEvents.mousewheel = null
    this.wheelDelta = 0
  }

  /**
   * Sets the mouse position offset.
   * @param offset
   */
  public setOffset(offset: IMousePoint) {
    this.offset.x = offset.x
    this.offset.y = offset.y
    this.position.x = this.absolute.x * this.scale.x + this.offset.x
    this.position.y = this.absolute.y * this.scale.y + this.offset.y
  }

  /**
   * Sets the mouse position scale.
   * @param scale
   */
  public setScale(scale: IMousePoint) {
    this.scale.x = scale.x
    this.scale.y = scale.y
    this.position.x = this.absolute.x * this.scale.x + this.offset.x
    this.position.y = this.absolute.y * this.scale.y + this.offset.y
  }

  /**
   * Gets the mouse position relative to an element given a screen pixel ratio.
   * @param event
   * @param element
   * @param pixelRatio
   */
  private _getRelativeMousePosition(
    event: MouseEventType,
    element: HTMLElement,
    pixelRatio: number
  ) {
    const elementBounds = element.getBoundingClientRect()
    const rootNode =
      document.documentElement || document.body.parentNode || document.body
    const scrollX = window.scrollX ?? rootNode.scrollLeft
    const scrollY = window.scrollY ?? rootNode.scrollTop
    let x, y: number

    if (Mouse.isTouchEvent(event)) {
      x = event.changedTouches[0].pageX - elementBounds.left - scrollX
      y = event.changedTouches[0].pageY - elementBounds.top - scrollY
    } else {
      x = event.pageX - elementBounds.left - scrollX
      y = event.pageY - elementBounds.top - scrollY
    }

    return {
      x: x / ((element.clientWidth / element.clientWidth) * pixelRatio),
      y: y / ((element.clientHeight / element.clientHeight) * pixelRatio),
    }
  }

  public static isTouchEvent(event: MouseEventType): event is TouchEvent {
    return 'changedTouches' in event
  }

  public mousemove(event: MouseEventType) {
    const position = this._getRelativeMousePosition(
      event,
      this.element,
      this.pixelRatio
    )

    if (Mouse.isTouchEvent(event)) {
      this.button = 0
      event.preventDefault()
    }

    this.absolute.x = position.x
    this.absolute.y = position.y
    this.position.x = this.absolute.x * this.scale.x + this.offset.x
    this.position.y = this.absolute.y * this.scale.y + this.offset.y
    this.sourceEvents.mousemove = event
  }

  public mousedown(event: MouseEventType) {
    const position = this._getRelativeMousePosition(
      event,
      this.element,
      this.pixelRatio
    )

    if (Mouse.isTouchEvent(event)) {
      this.button = 0
      event.preventDefault()
    } else {
      this.button = event.button
    }

    this.absolute.x = position.x
    this.absolute.y = position.y
    this.position.x = this.absolute.x * this.scale.x + this.offset.x
    this.position.y = this.absolute.y * this.scale.y + this.offset.y
    this.mousedownPosition.x = this.position.x
    this.mousedownPosition.y = this.position.y
    this.sourceEvents.mousedown = event
  }

  public mouseup(event: MouseEventType) {
    const position = this._getRelativeMousePosition(
      event,
      this.element,
      this.pixelRatio
    )

    if (Mouse.isTouchEvent(event)) {
      event.preventDefault()
    }

    this.button = -1
    this.absolute.x = position.x
    this.absolute.y = position.y
    this.position.x = this.absolute.x * this.scale.x + this.offset.x
    this.position.y = this.absolute.y * this.scale.y + this.offset.y
    this.mouseupPosition.x = this.position.x
    this.mouseupPosition.y = this.position.y
    this.sourceEvents.mouseup = event
  }

  public mousewheel(event: WheelEvent) {
    this.wheelDelta = Math.max(-1, Math.min(1, -event.detail))
    event.preventDefault()
    this.sourceEvents.mousewheel = event
  }
}
