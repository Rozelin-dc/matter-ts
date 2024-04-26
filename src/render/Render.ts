import Body, { IBody } from '../body/Body'
import Composite from '../body/Composite'
import { IPair } from '../collision/Pair'
import { IConstraint } from '../constraint/Constraint'
import Common from '../core/Common'
import Engine, { IEngine } from '../core/Engine'
import Events, { RenderEventFunction, RenderEventName } from '../core/Events'
import Mouse, { IMouse } from '../core/Mouse'
import Bounds, { IBounds } from '../geometry/Bounds'
import Vector, { IVector } from '../geometry/Vector'

export interface IRender {
  /**
   * A back-reference to the `Matter.Render` module.
   *
   * @deprecated
   */
  controller: Render

  /**
   * A reference to the `Matter.Engine` instance to be used.
   */
  engine: IEngine

  /**
   * A reference to the element where the canvas is to be inserted (if `render.canvas` has not been specified)
   *
   * @default null
   */
  element: HTMLElement | null

  /**
   * The canvas element to render to. If not specified, one will be created if `render.element` has been specified.
   */
  canvas: HTMLCanvasElement

  /**
   * A `Bounds` object that specifies the drawing view region.
   * Rendering will be automatically transformed and scaled to fit within the canvas size (`render.options.width` and `render.options.height`).
   * This allows for creating views that can pan or zoom around the scene.
   * You must also set `render.options.hasBounds` to `true` to enable bounded rendering.
   */
  bounds: IBounds

  /**
   * The 2d rendering context from the `render.canvas` element.
   */
  context: CanvasRenderingContext2D

  /**
   * The sprite texture cache.
   */
  textures: Record<string, HTMLImageElement>

  /**
   * The mouse to render if `render.options.showMousePosition` is enabled.
   *
   * @default null
   */
  mouse: IMouse | null

  /**
   * The configuration options of the renderer.
   */
  options: IRenderOptions

  frameRequestId: number | null
  timing: IRenderTiming
  currentBackground?: string
  events: Record<RenderEventName, RenderEventFunction[]>
}

export interface IRenderOptions {
  /**
   * The target width in pixels of the `render.canvas` to be created.
   * See also the `options.pixelRatio` property to change render quality.
   *
   * @default 800
   */
  width: number

  /**
   * The target height in pixels of the `render.canvas` to be created.
   * See also the `options.pixelRatio` property to change render quality.
   *
   * @default 600
   */
  height: number

  /**
   * The [pixel ratio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) to use when rendering.
   *
   * @default 1
   */
  pixelRatio: number

  /**
   * A CSS background color string to use when `render.options.wireframes` is disabled.
   * This may be also set to `'transparent'` or equivalent.
   *
   * @default '#14151f'
   */
  background: string

  /**
   * A CSS color string to use for background when `render.options.wireframes` is enabled.
   * This may be also set to `'transparent'` or equivalent.
   *
   * @default '#14151f'
   */
  wireframeBackground: string

  /**
   * A CSS color string to use for stroke when `render.options.wireframes` is enabled.
   * This may be also set to `'transparent'` or equivalent.
   *
   * @default '#bbb'
   */
  wireframeStrokeStyle: string

  /**
   * A flag that specifies if `render.bounds` should be used when rendering.
   *
   * @default false
   */
  hasBounds: boolean

  /**
   * A flag to enable or disable all debug information overlays together.
   * This includes and has priority over the values of:
   *
   * - `render.options.showStats`
   * - `render.options.showPerformance`
   *
   * @default false
   */
  showDebug: boolean

  /**
   * A flag to enable or disable the engine stats info overlay.
   * From left to right, the values shown are:
   *
   * - body parts total
   * - body total
   * - constraints total
   * - composites total
   * - collision pairs total
   *
   * @default false
   */
  showStats: boolean

  /**
   * A flag to enable or disable performance charts.
   * From left to right, the values shown are:
   *
   * - average render frequency (e.g. 60 fps)
   * - exact engine delta time used for last update (e.g. 16.66ms)
   * - average engine execution duration (e.g. 5.00ms)
   * - average render execution duration (e.g. 0.40ms)
   * - average effective play speed (e.g. '1.00x' is 'real-time')
   *
   * Each value is recorded over a fixed sample of past frames (60 frames).
   *
   * A chart shown below each value indicates the variance from the average over the sample.
   * The more stable or fixed the value is the flatter the chart will appear.
   *
   * @default false
   */
  showPerformance: boolean

  /**
   * A flag to enable or disable rendering entirely.
   *
   * @default false
   */
  enabled: boolean

  /**
   * A flag to toggle wireframe rendering otherwise solid fill rendering is used.
   *
   * @default true
   */
  wireframes: boolean

  /**
   * A flag to enable or disable sleeping bodies indicators.
   *
   * @default true
   */
  showSleeping: boolean

  /**
   * A flag to enable or disable the collision broadphase debug overlay.
   *
   * @deprecated no longer implemented
   * @default false
   */
  showBroadphase: boolean

  /**
   * A flag to enable or disable the body bounds debug overlay.
   *
   * @default false
   */
  showBounds: boolean

  /**
   * A flag to enable or disable the body velocity debug overlay.
   *
   * @default false
   */
  showVelocity: boolean

  /**
   * A flag to enable or disable the body collisions debug overlay.
   *
   * @default false
   */
  showCollisions: boolean

  /**
   * A flag to enable or disable the collision resolver separations debug overlay.
   *
   * @default false
   */
  showSeparations: boolean

  /**
   * A flag to enable or disable the body axes debug overlay.
   *
   * @default false
   */
  showAxes: boolean

  /**
   * A flag to enable or disable the body positions debug overlay.
   *
   * @default false
   */
  showPositions: boolean

  /**
   * A flag to enable or disable the body angle debug overlay.
   *
   * @default false
   */
  showAngleIndicator: boolean

  /**
   * A flag to enable or disable the body and part ids debug overlay.
   *
   * @default false
   */
  showIds: boolean

  /**
   * A flag to enable or disable the body vertex numbers debug overlay.
   *
   * @default false
   */
  showVertexNumbers: boolean

  /**
   * A flag to enable or disable the body convex hulls debug overlay.
   *
   * @default false
   */
  showConvexHulls: boolean

  /**
   * A flag to enable or disable the body internal edges debug overlay.
   *
   * @default false
   */
  showInternalEdges: boolean

  /**
   * A flag to enable or disable the mouse position debug overlay.
   *
   * @default false
   */
  showMousePosition: boolean
}

export interface IRenderTiming {
  historySize: number
  delta: number
  deltaHistory: number[]
  lastTime?: number
  lastTimestamp?: number
  lastElapsed: number
  timestampElapsed: number
  timestampElapsedHistory: number[]
  engineDeltaHistory: number[]
  engineElapsedHistory: number[]
  elapsedHistory: number[]
}

export interface IInspector {
  selected: { data: IBody | IConstraint }[]
  render: IRender
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectStart: any
  selectBounds: IBounds
}

/**
 * The `Matter.Render` module is a simple canvas based renderer for visualising instances of `Matter.Engine`.
 * It is intended for development and debugging purposes, but may also be suitable for simple games.
 * It includes a number of drawing options including wireframe, vector with support for sprites and viewports.
 */
export default class Render {
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
      window.setTimeout(function () {
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
    window.msCancelAnimationFrame.bind(window)

  protected static _goodFps = 30
  protected static _goodDelta = 1000 / 60

  /**
   * Creates a new renderer. The options parameter is an object that specifies any properties you wish to override the defaults.
   * All properties have default values, and many are pre-calculated automatically based on other properties.
   * See the properties section below for detailed information on what you can pass via the `options` object.
   * @method create
   * @param options
   * @return A new renderer
   */
  public static create(
    options: Partial<Omit<IRender, 'options'>> & {
      options?: Partial<IRenderOptions>
    } = {}
  ): IRender {
    const defaults: Omit<
      IRender,
      'engine' | 'canvas' | 'controller' | 'bounds' | 'context' | 'textures'
    > = {
      element: null,
      mouse: null,
      frameRequestId: null,
      timing: {
        historySize: 60,
        delta: 0,
        deltaHistory: [],
        lastTime: 0,
        lastTimestamp: 0,
        lastElapsed: 0,
        timestampElapsed: 0,
        timestampElapsedHistory: [],
        engineDeltaHistory: [],
        engineElapsedHistory: [],
        elapsedHistory: [],
      },
      options: {
        width: 800,
        height: 600,
        pixelRatio: 1,
        background: '#14151f',
        wireframeBackground: '#14151f',
        wireframeStrokeStyle: '#bbb',
        hasBounds: !!options.bounds,
        enabled: true,
        wireframes: true,
        showSleeping: true,
        showDebug: false,
        showStats: false,
        showPerformance: false,
        showBounds: false,
        showVelocity: false,
        showCollisions: false,
        showSeparations: false,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showVertexNumbers: false,
        showConvexHulls: false,
        showInternalEdges: false,
        showMousePosition: false,
        showBroadphase: false,
      },
      events: {} as IRender['events'],
    }

    const render = Common.extend(defaults, options)

    if (render.canvas) {
      render.canvas.width = render.options.width || render.canvas.width
      render.canvas.height = render.options.height || render.canvas.height
    }

    render.mouse = options.mouse ?? null
    render.engine = options.engine ?? Engine.create()
    render.canvas =
      render.canvas ||
      Render._createCanvas(render.options.width, render.options.height)
    render.context = render.canvas!.getContext('2d')!
    render.textures = {}

    render.bounds = render.bounds || {
      min: {
        x: 0,
        y: 0,
      },
      max: {
        x: render.canvas!.width,
        y: render.canvas!.height,
      },
    }

    // for temporary back compatibility only
    render.controller = Render
    render.options.showBroadphase = false

    if (render.options.pixelRatio !== 1) {
      Render.setPixelRatio(render as IRender, render.options.pixelRatio)
    }

    if (Common.isElement(render.element)) {
      render.element.appendChild(render.canvas!)
    }

    return render as IRender
  }

  /**
   * Continuously updates the render canvas on the `requestAnimationFrame` event.
   * @method run
   * @param render
   */
  public static run(render: IRender): void {
    const loop = (time?: number) => {
      render.frameRequestId = Render._requestAnimationFrame(loop)

      Render._updateTiming(render, time)

      Render.world(render, time)

      if (render.options.showStats || render.options.showDebug) {
        Render.stats(render, render.context, time)
      }

      if (render.options.showPerformance || render.options.showDebug) {
        Render.performance(render, render.context)
      }
    }
    loop()
  }

  /**
   * Ends execution of `Render.run` on the given `render`, by canceling the animation frame request event loop.
   * @method stop
   * @param render
   */
  public static stop(render: IRender): void {
    if (render.frameRequestId) {
      Render._cancelAnimationFrame(render.frameRequestId)
    }
  }

  /**
   * Sets the pixel ratio of the renderer and updates the canvas.
   * To automatically detect the correct ratio, pass the string `'auto'` for `pixelRatio`.
   * @method setPixelRatio
   * @param render
   * @param pixelRatio
   */
  public static setPixelRatio(render: IRender, pr: number | 'auto'): void {
    const options = render.options
    const canvas = render.canvas

    let pixelRatio: number
    if (pr === 'auto') {
      pixelRatio = Render._getPixelRatio(canvas)
    } else {
      pixelRatio = pr
    }

    options.pixelRatio = pixelRatio
    canvas.setAttribute('data-pixel-ratio', String(pixelRatio))
    canvas.width = options.width * pixelRatio
    canvas.height = options.height * pixelRatio
    canvas.style.width = options.width + 'px'
    canvas.style.height = options.height + 'px'
  }

  /**
   * Sets the render `width` and `height`.
   *
   * Updates the canvas accounting for `render.options.pixelRatio`.
   *
   * Updates the bottom right render bound `render.bounds.max` relative to the provided `width` and `height`.
   * The top left render bound `render.bounds.min` isn't changed.
   *
   * Follow this call with `Render.lookAt` if you need to change the render bounds.
   *
   * See also `Render.setPixelRatio`.
   * @method setSize
   * @param render
   * @param width The width (in CSS pixels)
   * @param height The height (in CSS pixels)
   */
  public static setSize(render: IRender, width: number, height: number): void {
    render.options.width = width
    render.options.height = height
    render.bounds.max.x = render.bounds.min.x + width
    render.bounds.max.y = render.bounds.min.y + height

    if (render.options.pixelRatio !== 1) {
      Render.setPixelRatio(render, render.options.pixelRatio)
    } else {
      render.canvas.width = width
      render.canvas.height = height
    }
  }

  /**
   * Positions and sizes the viewport around the given object bounds.
   * Objects must have at least one of the following properties:
   * - `object.bounds`
   * - `object.position`
   * - `object.min` and `object.max`
   * - `object.x` and `object.y`
   * @method lookAt
   * @param render
   * @param objects
   * @param padding
   * @param center
   */
  public static lookAt(
    render: IRender,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objects: any | any[],
    padding: IVector = Vector.create(0, 0),
    center: boolean = true
  ): void {
    objects = Common.isArray(objects) ? objects : [objects]

    // find bounds of all objects
    const bounds = {
      min: { x: Infinity, y: Infinity },
      max: { x: -Infinity, y: -Infinity },
    }

    for (const object of objects) {
      const min = object.bounds
        ? object.bounds.min
        : object.min || object.position || object
      const max = object.bounds
        ? object.bounds.max
        : object.max || object.position || object

      if (min && max) {
        if (min.x < bounds.min.x) {
          bounds.min.x = min.x
        }

        if (max.x > bounds.max.x) {
          bounds.max.x = max.x
        }

        if (min.y < bounds.min.y) {
          bounds.min.y = min.y
        }

        if (max.y > bounds.max.y) {
          bounds.max.y = max.y
        }
      }
    }

    // find ratios
    const width = bounds.max.x - bounds.min.x + 2 * padding.x
    const height = bounds.max.y - bounds.min.y + 2 * padding.y
    const viewHeight = render.canvas.height
    const viewWidth = render.canvas.width
    const outerRatio = viewWidth / viewHeight
    const innerRatio = width / height
    let scaleX = 1
    let scaleY = 1

    // find scale factor
    if (innerRatio > outerRatio) {
      scaleY = innerRatio / outerRatio
    } else {
      scaleX = outerRatio / innerRatio
    }

    // enable bounds
    render.options.hasBounds = true

    // position and size
    render.bounds.min.x = bounds.min.x
    render.bounds.max.x = bounds.min.x + width * scaleX
    render.bounds.min.y = bounds.min.y
    render.bounds.max.y = bounds.min.y + height * scaleY

    // center
    if (center) {
      render.bounds.min.x += width * 0.5 - width * scaleX * 0.5
      render.bounds.max.x += width * 0.5 - width * scaleX * 0.5
      render.bounds.min.y += height * 0.5 - height * scaleY * 0.5
      render.bounds.max.y += height * 0.5 - height * scaleY * 0.5
    }

    // padding
    render.bounds.min.x -= padding.x
    render.bounds.max.x -= padding.x
    render.bounds.min.y -= padding.y
    render.bounds.max.y -= padding.y

    // update mouse
    if (render.mouse) {
      Mouse.setScale(render.mouse, {
        x: (render.bounds.max.x - render.bounds.min.x) / render.canvas.width,
        y: (render.bounds.max.y - render.bounds.min.y) / render.canvas.height,
      })

      Mouse.setOffset(render.mouse, render.bounds.min)
    }
  }

  /**
   * Applies viewport transforms based on `render.bounds` to a render context.
   * @method startViewTransform
   * @param render
   */
  public static startViewTransform(render: IRender): void {
    const boundsWidth = render.bounds.max.x - render.bounds.min.x
    const boundsHeight = render.bounds.max.y - render.bounds.min.y
    const boundsScaleX = boundsWidth / render.options.width
    const boundsScaleY = boundsHeight / render.options.height

    render.context.setTransform(
      render.options.pixelRatio / boundsScaleX,
      0,
      0,
      render.options.pixelRatio / boundsScaleY,
      0,
      0
    )

    render.context.translate(-render.bounds.min.x, -render.bounds.min.y)
  }

  /**
   * Resets all transforms on the render context.
   * @method endViewTransform
   * @param render
   */
  public static endViewTransform(render: IRender): void {
    render.context.setTransform(
      render.options.pixelRatio,
      0,
      0,
      render.options.pixelRatio,
      0,
      0
    )
  }

  /**
   * Renders the given `engine`'s `Matter.World` object.
   * This is the entry point for all rendering and should be called every time the scene changes.
   * @method world
   * @param render
   * @param time
   */
  public static world(render: IRender, _time?: number): void {
    const startTime = Common.now()
    const engine = render.engine
    const world = engine.world
    const canvas = render.canvas
    const context = render.context
    const options = render.options
    const timing = render.timing

    const allBodies = world ? Composite.allBodies(world) : []
    const allConstraints = world ? Composite.allConstraints(world) : []
    const background = options.wireframes
      ? options.wireframeBackground
      : options.background
    let bodies: IBody[] = []
    let constraints: IConstraint[] = []

    const event = {
      timestamp: engine.timing.timestamp,
    }

    Events.trigger(render, 'beforeRender', event)

    // apply background if it has changed
    if (render.currentBackground !== background)
      Render._applyBackground(render, background)

    // clear the canvas with a transparent fill, to allow the canvas background to show
    context.globalCompositeOperation = 'source-in'
    context.fillStyle = 'transparent'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.globalCompositeOperation = 'source-over'

    // handle bounds
    if (options.hasBounds) {
      // filter out bodies that are not in view
      for (const body of allBodies) {
        if (Bounds.overlaps(body.bounds, render.bounds)) {
          bodies.push(body)
        }
      }

      // filter out constraints that are not in view
      for (const constraint of allConstraints) {
        const bodyA = constraint.bodyA
        const bodyB = constraint.bodyB
        let pointAWorld = constraint.pointA
        let pointBWorld = constraint.pointB

        if (bodyA) {
          pointAWorld = Vector.add(bodyA.position, constraint.pointA)
        }
        if (bodyB) {
          pointBWorld = Vector.add(bodyB.position, constraint.pointB)
        }

        if (!pointAWorld || !pointBWorld) {
          continue
        }

        if (
          Bounds.contains(render.bounds, pointAWorld) ||
          Bounds.contains(render.bounds, pointBWorld)
        ) {
          constraints.push(constraint)
        }
      }

      // transform the view
      Render.startViewTransform(render)

      // update mouse
      if (render.mouse) {
        Mouse.setScale(render.mouse, {
          x: (render.bounds.max.x - render.bounds.min.x) / render.options.width,
          y:
            (render.bounds.max.y - render.bounds.min.y) / render.options.height,
        })

        Mouse.setOffset(render.mouse, render.bounds.min)
      }
    } else {
      constraints = allConstraints
      bodies = allBodies

      if (render.options.pixelRatio !== 1) {
        render.context.setTransform(
          render.options.pixelRatio,
          0,
          0,
          render.options.pixelRatio,
          0,
          0
        )
      }
    }

    if (
      !options.wireframes ||
      (engine.enableSleeping && options.showSleeping)
    ) {
      // fully featured rendering of bodies
      Render.bodies(render, bodies, context)
    } else {
      if (options.showConvexHulls) {
        Render.bodyConvexHulls(render, bodies, context)
      }

      // optimised method for wireframes only
      Render.bodyWireframes(render, bodies, context)
    }

    if (options.showBounds) {
      Render.bodyBounds(render, bodies, context)
    }

    if (options.showAxes || options.showAngleIndicator) {
      Render.bodyAxes(render, bodies, context)
    }

    if (options.showPositions) {
      Render.bodyPositions(render, bodies, context)
    }

    if (options.showVelocity) {
      Render.bodyVelocity(render, bodies, context)
    }

    if (options.showIds) {
      Render.bodyIds(render, bodies, context)
    }

    if (options.showSeparations) {
      Render.separations(render, engine.pairs.list, context)
    }

    if (options.showCollisions) {
      Render.collisions(render, engine.pairs.list, context)
    }

    if (options.showVertexNumbers) {
      Render.vertexNumbers(render, bodies, context)
    }

    if (options.showMousePosition && render.mouse) {
      Render.mousePosition(render, render.mouse, context)
    }

    Render.constraints(constraints, context)

    if (options.hasBounds) {
      // revert view transforms
      Render.endViewTransform(render)
    }

    Events.trigger(render, 'afterRender', event)

    // log the time elapsed computing this update
    timing.lastElapsed = Common.now() - startTime
  }

  /**
   * Renders statistics about the engine and world useful for debugging.
   * @method stats
   * @param render
   * @param context
   * @param time
   */
  protected static stats(
    render: IRender,
    context: CanvasRenderingContext2D,
    _time?: number
  ): void {
    const engine = render.engine
    const world = engine.world
    const bodies = world ? Composite.allBodies(world) : []
    let parts = 0
    const width = 55
    const height = 44
    let x = 0
    const y = 0

    // count parts
    for (let i = 0; i < bodies.length; i += 1) {
      parts += bodies[i].parts.length
    }

    // sections
    const sections = {
      Part: parts,
      Body: bodies.length,
      Cons: world ? Composite.allConstraints(world).length : undefined,
      Comp: world ? Composite.allComposites(world).length : undefined,
      Pair: engine.pairs.list.length,
    }

    // background
    context.fillStyle = '#0e0f19'
    context.fillRect(x, y, width * 5.5, height)

    context.font = '12px Arial'
    context.textBaseline = 'top'
    context.textAlign = 'right'

    // sections
    for (const key in sections) {
      const section = sections[key as keyof typeof sections]
      // label
      context.fillStyle = '#aaa'
      context.fillText(key, x + width, y + 8)

      // value
      context.fillStyle = '#eee'
      context.fillText(String(section), x + width, y + 26)

      x += width
    }
  }

  /**
   * Renders engine and render performance information.
   * @method performance
   * @param render
   * @param context
   */
  protected static performance(
    render: IRender,
    context: CanvasRenderingContext2D
  ): void {
    const engine = render.engine
    const timing = render.timing
    const deltaHistory = timing.deltaHistory
    const elapsedHistory = timing.elapsedHistory
    const timestampElapsedHistory = timing.timestampElapsedHistory
    const engineDeltaHistory = timing.engineDeltaHistory
    const engineElapsedHistory = timing.engineElapsedHistory
    const lastEngineDelta = engine.timing.lastDelta

    const deltaMean = Render._mean(deltaHistory)
    const elapsedMean = Render._mean(elapsedHistory)
    const engineDeltaMean = Render._mean(engineDeltaHistory)
    const engineElapsedMean = Render._mean(engineElapsedHistory)
    const timestampElapsedMean = Render._mean(timestampElapsedHistory)
    const rateMean = timestampElapsedMean / deltaMean || 0
    const fps = 1000 / deltaMean || 0

    const graphHeight = 4
    const gap = 12
    const width = 60
    const height = 34
    const x = 10
    const y = 69

    // background
    context.fillStyle = '#0e0f19'
    context.fillRect(0, 50, gap * 4 + width * 5 + 22, height)

    // show FPS
    Render.status(
      context,
      x,
      y,
      width,
      graphHeight,
      deltaHistory.length,
      Math.round(fps) + ' fps',
      fps / Render._goodFps,
      (i: number) => {
        return deltaHistory[i] / deltaMean - 1
      }
    )

    // show engine delta
    Render.status(
      context,
      x + gap + width,
      y,
      width,
      graphHeight,
      engineDeltaHistory.length,
      lastEngineDelta?.toFixed(2) + ' dt',
      Render._goodDelta / (lastEngineDelta ?? NaN),
      (i: number) => {
        return engineDeltaHistory[i] / engineDeltaMean - 1
      }
    )

    // show engine update time
    Render.status(
      context,
      x + (gap + width) * 2,
      y,
      width,
      graphHeight,
      engineElapsedHistory.length,
      engineElapsedMean.toFixed(2) + ' ut',
      1 - engineElapsedMean / Render._goodFps,
      (i: number) => {
        return engineElapsedHistory[i] / engineElapsedMean - 1
      }
    )

    // show render time
    Render.status(
      context,
      x + (gap + width) * 3,
      y,
      width,
      graphHeight,
      elapsedHistory.length,
      elapsedMean.toFixed(2) + ' rt',
      1 - elapsedMean / Render._goodFps,
      (i: number) => {
        return elapsedHistory[i] / elapsedMean - 1
      }
    )

    // show effective speed
    Render.status(
      context,
      x + (gap + width) * 4,
      y,
      width,
      graphHeight,
      timestampElapsedHistory.length,
      rateMean.toFixed(2) + ' x',
      rateMean * rateMean * rateMean,
      (i: number) => {
        return (
          (timestampElapsedHistory[i] / deltaHistory[i] / rateMean || 0) - 1
        )
      }
    )
  }

  /**
   * Renders a label, indicator and a chart.
   * @method status
   * @param context
   * @param x
   * @param y
   * @param width
   * @param height
   * @param count
   * @param label
   * @param indicator
   * @param plotY
   */
  protected static status(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    count: number,
    label: string,
    indicator: number,
    plotY: (idx: number) => number
  ): void {
    // background
    context.strokeStyle = '#888'
    context.fillStyle = '#444'
    context.lineWidth = 1
    context.fillRect(x, y + 7, width, 1)

    // chart
    context.beginPath()
    context.moveTo(x, y + 7 - height * Common.clamp(0.4 * plotY(0), -2, 2))
    for (let i = 0; i < width; i += 1) {
      context.lineTo(
        x + i,
        y + 7 - (i < count ? height * Common.clamp(0.4 * plotY(i), -2, 2) : 0)
      )
    }
    context.stroke()

    // indicator
    context.fillStyle =
      'hsl(' + Common.clamp(25 + 95 * indicator, 0, 120) + ',100%,60%)'
    context.fillRect(x, y - 7, 4, 4)

    // label
    context.font = '12px Arial'
    context.textBaseline = 'middle'
    context.textAlign = 'right'
    context.fillStyle = '#eee'
    context.fillText(label, x + width, y - 5)
  }

  /**
   * Description
   * @method constraints
   * @param constraints
   * @param context
   */
  protected static constraints(
    constraints: IConstraint[],
    context: CanvasRenderingContext2D
  ): void {
    for (const constraint of constraints) {
      if (
        !constraint.render.visible ||
        !constraint.pointA ||
        !constraint.pointB
      ) {
        continue
      }

      const bodyA = constraint.bodyA
      const bodyB = constraint.bodyB
      let start: IVector
      let end: IVector | undefined

      if (bodyA) {
        start = Vector.add(bodyA.position, constraint.pointA)
      } else {
        start = constraint.pointA
      }

      if (constraint.render.type === 'pin') {
        context.beginPath()
        context.arc(start.x, start.y, 3, 0, 2 * Math.PI)
        context.closePath()
      } else {
        if (bodyB) {
          end = Vector.add(bodyB.position, constraint.pointB)
        } else {
          end = constraint.pointB
        }

        context.beginPath()
        context.moveTo(start.x, start.y)

        if (constraint.render.type === 'spring') {
          const delta = Vector.sub(end, start)
          const normal = Vector.perp(Vector.normalise(delta))
          const coils = Math.ceil(Common.clamp(constraint.length / 5, 12, 20))
          let offset: number

          for (let j = 1; j < coils; j += 1) {
            offset = j % 2 === 0 ? 1 : -1

            context.lineTo(
              start.x + delta.x * (j / coils) + normal.x * offset * 4,
              start.y + delta.y * (j / coils) + normal.y * offset * 4
            )
          }
        }

        context.lineTo(end.x, end.y)
      }

      if (constraint.render.lineWidth) {
        context.lineWidth = constraint.render.lineWidth
        context.strokeStyle = constraint.render.strokeStyle
        context.stroke()
      }

      if (constraint.render.anchors) {
        context.fillStyle = constraint.render.strokeStyle
        context.beginPath()
        context.arc(start.x, start.y, 3, 0, 2 * Math.PI)
        if (end) {
          context.arc(end.x, end.y, 3, 0, 2 * Math.PI)
        }
        context.closePath()
        context.fill()
      }
    }
  }

  /**
   * Description
   * @method bodies
   * @param render
   * @param bodies
   * @param context
   */
  protected static bodies(
    render: IRender,
    bodies: IBody[],
    context: CanvasRenderingContext2D
  ): void {
    const options = render.options
    const showInternalEdges = options.showInternalEdges || !options.wireframes

    for (const body of bodies) {
      if (!body.render.visible) {
        continue
      }

      // handle compound parts
      for (let k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
        const part = body.parts[k]

        if (!part.render.visible) {
          continue
        }

        if (options.showSleeping && body.isSleeping) {
          context.globalAlpha = 0.5 * part.render.opacity
        } else if (part.render.opacity !== 1) {
          context.globalAlpha = part.render.opacity
        }

        if (Body.isSpriteRender(part.render) && !options.wireframes) {
          // part sprite
          const sprite = part.render.sprite
          const texture = Render._getTexture(render, sprite.texture!)

          context.translate(part.position.x, part.position.y)
          context.rotate(part.angle)

          context.drawImage(
            texture,
            texture.width * -sprite.xOffset * sprite.xScale,
            texture.height * -sprite.yOffset * sprite.yScale,
            texture.width * sprite.xScale,
            texture.height * sprite.yScale
          )

          // revert translation, hopefully faster than save / restore
          context.rotate(-part.angle)
          context.translate(-part.position.x, -part.position.y)
        } else {
          // part polygon
          if (part.circleRadius) {
            context.beginPath()
            context.arc(
              part.position.x,
              part.position.y,
              part.circleRadius,
              0,
              2 * Math.PI
            )
          } else {
            context.beginPath()
            context.moveTo(part.vertices[0].x, part.vertices[0].y)

            for (let j = 1; j < part.vertices.length; j++) {
              if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                context.lineTo(part.vertices[j].x, part.vertices[j].y)
              } else {
                context.moveTo(part.vertices[j].x, part.vertices[j].y)
              }

              if (part.vertices[j].isInternal && !showInternalEdges) {
                context.moveTo(
                  part.vertices[(j + 1) % part.vertices.length].x,
                  part.vertices[(j + 1) % part.vertices.length].y
                )
              }
            }

            context.lineTo(part.vertices[0].x, part.vertices[0].y)
            context.closePath()
          }

          if (!options.wireframes) {
            context.fillStyle = part.render.fillStyle

            if (part.render.lineWidth) {
              context.lineWidth = part.render.lineWidth
              context.strokeStyle = part.render.strokeStyle
              context.stroke()
            }

            context.fill()
          } else {
            context.lineWidth = 1
            context.strokeStyle = render.options.wireframeStrokeStyle
            context.stroke()
          }

          if (Body.isTextRender(part.render)) {
            // render text
            context.font = `${part.render.text.isBold ? 'bold ' : ''}${
              part.render.text.size
            }px ${part.render.text.font}`
            context.fillStyle = part.render.text.color
            context.textAlign = part.render.text.align
            context.textBaseline = part.render.text.baseline

            context.translate(part.position.x, part.position.y)
            context.rotate(part.angle)

            if (part.render.text.isStroke) {
              context.strokeText(part.render.text.content, 0, 0)
            } else {
              context.fillText(part.render.text.content, 0, 0)
            }

            // revert translation, hopefully faster than save / restore
            context.rotate(-part.angle)
            context.translate(-part.position.x, -part.position.y)
          }
        }

        context.globalAlpha = 1
      }
    }
  }

  /**
   * Optimised method for drawing body wireframes in one pass
   * @method bodyWireframes
   * @param render
   * @param bodies
   * @param context
   */
  protected static bodyWireframes(
    render: IRender,
    bodies: IBody[],
    context: CanvasRenderingContext2D
  ): void {
    const showInternalEdges = render.options.showInternalEdges

    context.beginPath()

    // render all bodies
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]

      if (!body.render.visible) {
        continue
      }

      // handle compound parts
      for (let k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
        const part = body.parts[k]

        context.moveTo(part.vertices[0].x, part.vertices[0].y)

        for (let j = 1; j < part.vertices.length; j++) {
          if (!part.vertices[j - 1].isInternal || showInternalEdges) {
            context.lineTo(part.vertices[j].x, part.vertices[j].y)
          } else {
            context.moveTo(part.vertices[j].x, part.vertices[j].y)
          }

          if (part.vertices[j].isInternal && !showInternalEdges) {
            context.moveTo(
              part.vertices[(j + 1) % part.vertices.length].x,
              part.vertices[(j + 1) % part.vertices.length].y
            )
          }
        }

        context.lineTo(part.vertices[0].x, part.vertices[0].y)
      }
    }

    context.lineWidth = 1
    context.strokeStyle = render.options.wireframeStrokeStyle
    context.stroke()
  }

  /**
   * Optimised method for drawing body convex hull wireframes in one pass
   * @method bodyConvexHulls
   * @param render
   * @param bodies
   * @param context
   */
  protected static bodyConvexHulls(
    _render: IRender,
    bodies: IBody[],
    context: CanvasRenderingContext2D
  ): void {
    context.beginPath()

    // render convex hulls
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]

      if (!body.render.visible || body.parts.length === 1) {
        continue
      }

      context.moveTo(body.vertices[0].x, body.vertices[0].y)

      for (let j = 1; j < body.vertices.length; j++) {
        context.lineTo(body.vertices[j].x, body.vertices[j].y)
      }

      context.lineTo(body.vertices[0].x, body.vertices[0].y)
    }

    context.lineWidth = 1
    context.strokeStyle = 'rgba(255,255,255,0.2)'
    context.stroke()
  }

  /**
   * Renders body vertex numbers.
   * @method vertexNumbers
   * @param render
   * @param bodies
   * @param context
   */
  protected static vertexNumbers(
    _render: IRender,
    bodies: IBody[],
    context: CanvasRenderingContext2D
  ): void {
    for (let i = 0; i < bodies.length; i++) {
      const parts = bodies[i].parts

      for (let k = parts.length > 1 ? 1 : 0; k < parts.length; k++) {
        const part = parts[k]

        for (let j = 0; j < part.vertices.length; j++) {
          context.fillStyle = 'rgba(255,255,255,0.2)'
          context.fillText(
            i + '_' + j,
            part.position.x + (part.vertices[j].x - part.position.x) * 0.8,
            part.position.y + (part.vertices[j].y - part.position.y) * 0.8
          )
        }
      }
    }
  }

  /**
   * Renders mouse position.
   * @method mousePosition
   * @param render
   * @param mouse
   * @param context
   */
  protected static mousePosition(
    _render: IRender,
    mouse: IMouse,
    context: CanvasRenderingContext2D
  ): void {
    context.fillStyle = 'rgba(255,255,255,0.8)'
    context.fillText(
      mouse.position.x + '  ' + mouse.position.y,
      mouse.position.x + 5,
      mouse.position.y - 5
    )
  }

  /**
   * Draws body bounds
   * @method bodyBounds
   * @param render
   * @param bodies
   * @param context
   */
  protected static bodyBounds(
    render: IRender,
    bodies: IBody[],
    context: CanvasRenderingContext2D
  ): void {
    const options = render.options

    context.beginPath()

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]

      if (body.render.visible) {
        const parts = bodies[i].parts

        for (let j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
          const part = parts[j]
          context.rect(
            part.bounds.min.x,
            part.bounds.min.y,
            part.bounds.max.x - part.bounds.min.x,
            part.bounds.max.y - part.bounds.min.y
          )
        }
      }
    }

    if (options.wireframes) {
      context.strokeStyle = 'rgba(255,255,255,0.08)'
    } else {
      context.strokeStyle = 'rgba(0,0,0,0.1)'
    }

    context.lineWidth = 1
    context.stroke()
  }

  /**
   * Draws body angle indicators and axes
   * @method bodyAxes
   * @param render
   * @param bodies
   * @param context
   */
  protected static bodyAxes(
    render: IRender,
    bodies: IBody[],
    context: CanvasRenderingContext2D
  ): void {
    const options = render.options

    context.beginPath()

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]
      const parts = body.parts

      if (!body.render.visible) {
        continue
      }

      if (options.showAxes) {
        // render all axes
        for (let j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
          const part = parts[j]

          for (let k = 0; k < part.axes.length; k++) {
            const axis = part.axes[k]
            context.moveTo(part.position.x, part.position.y)
            context.lineTo(
              part.position.x + axis.x * 20,
              part.position.y + axis.y * 20
            )
          }
        }
      } else {
        for (let j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
          const part = parts[j]

          for (let k = 0; k < part.axes.length; k++) {
            // render a single axis indicator
            context.moveTo(part.position.x, part.position.y)
            context.lineTo(
              (part.vertices[0].x + part.vertices[part.vertices.length - 1].x) /
                2,
              (part.vertices[0].y + part.vertices[part.vertices.length - 1].y) /
                2
            )
          }
        }
      }
    }

    if (options.wireframes) {
      context.strokeStyle = 'indianred'
      context.lineWidth = 1
    } else {
      context.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      context.globalCompositeOperation = 'overlay'
      context.lineWidth = 2
    }

    context.stroke()
    context.globalCompositeOperation = 'source-over'
  }

  /**
   * Draws body positions
   * @method bodyPositions
   * @param render
   * @param bodies
   * @param context
   */
  protected static bodyPositions(
    render: IRender,
    bodies: IBody[],
    context: CanvasRenderingContext2D
  ): void {
    const options = render.options

    context.beginPath()

    // render current positions
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]

      if (!body.render.visible) {
        continue
      }

      // handle compound parts
      for (let k = 0; k < body.parts.length; k++) {
        const part = body.parts[k]
        context.arc(part.position.x, part.position.y, 3, 0, 2 * Math.PI, false)
        context.closePath()
      }
    }

    if (options.wireframes) {
      context.fillStyle = 'indianred'
    } else {
      context.fillStyle = 'rgba(0,0,0,0.5)'
    }
    context.fill()

    context.beginPath()

    // render previous positions
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]

      if (body.render.visible) {
        context.arc(
          body.positionPrev.x,
          body.positionPrev.y,
          2,
          0,
          2 * Math.PI,
          false
        )
        context.closePath()
      }
    }

    context.fillStyle = 'rgba(255,165,0,0.8)'
    context.fill()
  }

  /**
   * Draws body velocity
   * @method bodyVelocity
   * @param render
   * @param bodies
   * @param context
   */
  protected static bodyVelocity(
    _render: IRender,
    bodies: IBody[],
    context: CanvasRenderingContext2D
  ): void {
    context.beginPath()

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]

      if (!body.render.visible) {
        continue
      }

      const velocity = Body.getVelocity(body)

      context.moveTo(body.position.x, body.position.y)
      context.lineTo(body.position.x + velocity.x, body.position.y + velocity.y)
    }

    context.lineWidth = 3
    context.strokeStyle = 'cornflowerblue'
    context.stroke()
  }

  /**
   * Draws body ids
   * @method bodyIds
   * @param render
   * @param bodies
   * @param context
   */
  protected static bodyIds(
    _render: IRender,
    bodies: IBody[],
    context: CanvasRenderingContext2D
  ): void {
    for (let i = 0; i < bodies.length; i++) {
      if (!bodies[i].render.visible) {
        continue
      }

      const parts = bodies[i].parts
      for (let j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
        const part = parts[j]
        context.font = '12px Arial'
        context.fillStyle = 'rgba(255,255,255,0.5)'
        context.fillText(
          String(part.id),
          part.position.x + 10,
          part.position.y - 10
        )
      }
    }
  }

  /**
   * Description
   * @method collisions
   * @param render
   * @param pairs
   * @param context
   */
  protected static collisions(
    render: IRender,
    pairs: IPair[],
    context: CanvasRenderingContext2D
  ): void {
    const options = render.options

    context.beginPath()

    // render collision positions
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i]

      if (!pair.isActive) {
        continue
      }

      for (let j = 0; j < pair.activeContacts.length; j++) {
        const contact = pair.activeContacts[j]
        const vertex = contact.vertex
        context.rect(vertex.x - 1.5, vertex.y - 1.5, 3.5, 3.5)
      }
    }

    if (options.wireframes) {
      context.fillStyle = 'rgba(255,255,255,0.7)'
    } else {
      context.fillStyle = 'orange'
    }
    context.fill()

    context.beginPath()

    // render collision normals
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i]

      if (!pair.isActive) {
        continue
      }

      const collision = pair.collision

      if (pair.activeContacts.length > 0) {
        let normalPosX = pair.activeContacts[0].vertex.x
        let normalPosY = pair.activeContacts[0].vertex.y

        if (pair.activeContacts.length === 2) {
          normalPosX =
            (pair.activeContacts[0].vertex.x +
              pair.activeContacts[1].vertex.x) /
            2
          normalPosY =
            (pair.activeContacts[0].vertex.y +
              pair.activeContacts[1].vertex.y) /
            2
        }

        if (
          collision.bodyB === collision.supports[0].body ||
          collision.bodyA.isStatic === true
        ) {
          context.moveTo(
            normalPosX - collision.normal.x * 8,
            normalPosY - collision.normal.y * 8
          )
        } else {
          context.moveTo(
            normalPosX + collision.normal.x * 8,
            normalPosY + collision.normal.y * 8
          )
        }

        context.lineTo(normalPosX, normalPosY)
      }
    }

    if (options.wireframes) {
      context.strokeStyle = 'rgba(255,165,0,0.7)'
    } else {
      context.strokeStyle = 'orange'
    }

    context.lineWidth = 1
    context.stroke()
  }

  /**
   * Description
   * @method separations
   * @param render
   * @param pairs
   * @param context
   */
  protected static separations(
    render: IRender,
    pairs: IPair[],
    context: CanvasRenderingContext2D
  ): void {
    const options = render.options

    context.beginPath()

    // render separations
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i]

      if (!pair.isActive) {
        continue
      }

      const collision = pair.collision
      const bodyA = collision.bodyA
      const bodyB = collision.bodyB

      let k = 1
      if (!bodyB.isStatic && !bodyA.isStatic) {
        k = 0.5
      }
      if (bodyB.isStatic) {
        k = 0
      }

      context.moveTo(bodyB.position.x, bodyB.position.y)
      context.lineTo(
        bodyB.position.x - collision.penetration.x * k,
        bodyB.position.y - collision.penetration.y * k
      )

      k = 1
      if (!bodyB.isStatic && !bodyA.isStatic) {
        k = 0.5
      }
      if (bodyA.isStatic) {
        k = 0
      }

      context.moveTo(bodyA.position.x, bodyA.position.y)
      context.lineTo(
        bodyA.position.x + collision.penetration.x * k,
        bodyA.position.y + collision.penetration.y * k
      )
    }

    if (options.wireframes) {
      context.strokeStyle = 'rgba(255,165,0,0.5)'
    } else {
      context.strokeStyle = 'orange'
    }
    context.stroke()
  }

  /**
   * Description
   * @method inspector
   * @param inspector
   * @param context
   */
  protected static inspector(
    inspector: IInspector,
    context: CanvasRenderingContext2D
  ): void {
    const selected = inspector.selected
    const render = inspector.render
    const options = render.options

    if (options.hasBounds) {
      const boundsWidth = render.bounds.max.x - render.bounds.min.x
      const boundsHeight = render.bounds.max.y - render.bounds.min.y
      const boundsScaleX = boundsWidth / render.options.width
      const boundsScaleY = boundsHeight / render.options.height

      context.scale(1 / boundsScaleX, 1 / boundsScaleY)
      context.translate(-render.bounds.min.x, -render.bounds.min.y)
    }

    for (let i = 0; i < selected.length; i++) {
      const item = selected[i].data

      context.translate(0.5, 0.5)
      context.lineWidth = 1
      context.strokeStyle = 'rgba(255,165,0,0.9)'
      context.setLineDash([1, 2])

      switch (item.type) {
        case 'body':
          // render body selections
          const bounds = item.bounds
          context.beginPath()
          context.rect(
            Math.floor(bounds.min.x - 3),
            Math.floor(bounds.min.y - 3),
            Math.floor(bounds.max.x - bounds.min.x + 6),
            Math.floor(bounds.max.y - bounds.min.y + 6)
          )
          context.closePath()
          context.stroke()

          break

        case 'constraint':
          // render constraint selections
          let point = item.pointA
          if (item.bodyA) {
            point = item.pointB
          }
          context.beginPath()
          context.arc(point.x, point.y, 10, 0, 2 * Math.PI)
          context.closePath()
          context.stroke()

          break
      }

      context.setLineDash([])
      context.translate(-0.5, -0.5)
    }

    // render selection region
    if (inspector.selectStart !== null) {
      context.translate(0.5, 0.5)
      context.lineWidth = 1
      context.strokeStyle = 'rgba(255,165,0,0.6)'
      context.fillStyle = 'rgba(255,165,0,0.1)'
      const bounds = inspector.selectBounds
      context.beginPath()
      context.rect(
        Math.floor(bounds.min.x),
        Math.floor(bounds.min.y),
        Math.floor(bounds.max.x - bounds.min.x),
        Math.floor(bounds.max.y - bounds.min.y)
      )
      context.closePath()
      context.stroke()
      context.fill()
      context.translate(-0.5, -0.5)
    }

    if (options.hasBounds) {
      context.setTransform(1, 0, 0, 1, 0, 0)
    }
  }

  /**
   * Updates render timing.
   * @method _updateTiming
   * @param render
   * @param time
   */
  protected static _updateTiming(render: IRender, time?: number): void {
    const engine = render.engine
    const timing = render.timing
    const historySize = timing.historySize
    const timestamp = engine.timing.timestamp

    timing.delta =
      timing.lastTime && time ? time - timing.lastTime : Render._goodDelta
    timing.lastTime = time

    timing.timestampElapsed =
      timestamp && timing.lastTimestamp ? timestamp - timing.lastTimestamp : 0
    timing.lastTimestamp = timestamp

    timing.deltaHistory.unshift(timing.delta)
    timing.deltaHistory.length = Math.min(
      timing.deltaHistory.length,
      historySize
    )

    timing.engineDeltaHistory.unshift(engine.timing.lastDelta)
    timing.engineDeltaHistory.length = Math.min(
      timing.engineDeltaHistory.length,
      historySize
    )

    timing.timestampElapsedHistory.unshift(timing.timestampElapsed)
    timing.timestampElapsedHistory.length = Math.min(
      timing.timestampElapsedHistory.length,
      historySize
    )

    timing.engineElapsedHistory.unshift(engine.timing.lastElapsed)
    timing.engineElapsedHistory.length = Math.min(
      timing.engineElapsedHistory.length,
      historySize
    )

    timing.elapsedHistory.unshift(timing.lastElapsed)
    timing.elapsedHistory.length = Math.min(
      timing.elapsedHistory.length,
      historySize
    )
  }

  /**
   * Returns the mean value of the given numbers.
   * @method _mean
   * @param values
   * @return the mean of given values
   */
  protected static _mean(values: number[]): number {
    let result = 0
    for (let i = 0; i < values.length; i += 1) {
      result += values[i]
    }
    return result / values.length || 0
  }

  /**
   * @method _createCanvas
   * @param width
   * @param height
   * @return canvas
   */
  protected static _createCanvas(
    width: number,
    height: number
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.oncontextmenu = function () {
      return false
    }
    canvas.onselectstart = function () {
      return false
    }
    return canvas
  }

  /**
   * Gets the pixel ratio of the canvas.
   * @method _getPixelRatio
   * @param canvas
   * @return pixel ratio
   */
  protected static _getPixelRatio(canvas: HTMLCanvasElement): number {
    const devicePixelRatio = window.devicePixelRatio || 1
    const backingStorePixelRatio = 1

    return devicePixelRatio / backingStorePixelRatio
  }

  /**
   * Gets the requested texture (an Image) via its path
   * @method _getTexture
   * @param render
   * @param imagePath
   * @return texture
   */
  protected static _getTexture(
    render: IRender,
    imagePath: string
  ): HTMLImageElement {
    let image = render.textures[imagePath]

    if (image) {
      return image
    }

    image = render.textures[imagePath] = new Image()
    image.src = imagePath

    return image
  }

  /**
   * Applies the background to the canvas using CSS.
   * @method applyBackground
   * @param render
   * @param background
   */
  protected static _applyBackground(render: IRender, background: string): void {
    let cssBackground = background

    if (/(jpg|gif|png)$/.test(background)) {
      cssBackground = 'url(' + background + ')'
    }

    render.canvas.style.background = cssBackground
    render.canvas.style.backgroundSize = 'contain'
    render.currentBackground = background
  }
}
