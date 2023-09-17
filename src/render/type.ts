export interface IRenderDefinition {
  /**
   * A back-reference to the `Matter.Render` module.
   *
   */
  controller: any

  /**
   * A reference to the `Matter.Engine` instance to be used.
   *
   */
  engine: Engine

  /**
   * A reference to the element where the canvas is to be inserted (if `render.canvas` has not been specified)
   *
   * @default null
   */
  element?: HTMLElement

  /**
   * The canvas element to render to. If not specified, one will be created if `render.element` has been specified.
   */
  canvas: HTMLCanvasElement

  /**
   * The configuration options of the renderer.
   *
   */
  options: Partial<IRendererOptions>

  /**
   * A `Bounds` object that specifies the drawing view region.
   * Rendering will be automatically transformed and scaled to fit within the canvas size (`render.options.width` and `render.options.height`).
   * This allows for creating views that can pan or zoom around the scene.
   * You must also set `render.options.hasBounds` to `true` to enable bounded rendering.
   *
   */
  bounds: Bounds

  /**
   * The mouse to render if `render.options.showMousePosition` is enabled.
   *
   * @default null
   */
  mouse: Mouse | null

  /**
   * The 2d rendering context from the `render.canvas` element.
   *
   */
  context: CanvasRenderingContext2D

  /**
   * The sprite texture cache.
   *
   */
  textures: any
}

export interface IRendererOptions {
  /**
   * The target width in pixels of the `render.canvas` to be created.
   *
   * @default 800
   */
  width: number

  /**
   * The target height in pixels of the `render.canvas` to be created.
   *
   * @default 600
   */
  height: number

  /**
   * A flag that specifies if `render.bounds` should be used when rendering.
   *
   * @default false
   */
  hasBounds: boolean

  /**
   * Render wireframes only
   * @default true
   */
  wireframes: boolean

  /**
   * Sets scene background
   *
   * @default '#14151f'
   */
  background: string

  /**
   * A flag to enable or disable rendering entirely.
   *
   * @default false
   */
  enabled: boolean

  /**
   * Sets wireframe background if `render.options.wireframes` is enabled
   *
   * @default '#14151f'
   */
  wireframeBackground: string

  /**
   * Sets wireframe stroke style if `render.options.wireframes` is enabled
   *
   * @default '#bbb'
   */
  wireframeStrokeStyle: string

  /**
   * Sets opacity of sleeping body if `render.options.showSleeping` is enabled
   *
   * default true
   */
  showSleeping: boolean

  /**
   * A flag to enable or disable the body vertex numbers debug overlay.
   * @default false
   */
  showVertexNumbers: boolean

  /**
   * A flag to enable or disable the body velocity debug overlay.
   * @default false
   */
  showVelocity: boolean

  /**
   * A flag to enable or disable the engine stats info overlay.
   * From left to right, the values shown are:
   * - body parts total
   * - body total
   * - constraints total
   * - composites total
   * - collision pairs total
   * @default false
   */
  showStats: boolean

  /**
   * A flag to enable or disable the collision resolver separations debug overlay.
   * @default false
   */
  showSeparations: boolean

  /**
   * A flag to enable or disable the body positions debug overlay.
   * @default false
   */
  showPositions: boolean

  /**
   * A flag to enable or disable performance charts.
   * From left to right, the values shown are:
   * - average render frequency (e.g. 60 fps)
   * - exact engine delta time used for last update (e.g. 16.66ms)
   * - average engine execution duration (e.g. 5.00ms)
   * - average render execution duration (e.g. 0.40ms)
   * - average effective play speed (e.g. '1.00x' is 'real-time')
   * Each value is recorded over a fixed sample of past frames (60 frames).
   * A chart shown below each value indicates the variance from the average over the sample. The more stable or fixed the value is the flatter the chart will appear.
   * @default false
   */
  showPerformance: boolean

  /**
   * A flag to enable or disable the mouse position debug overlay.
   * @default false
   */
  showMousePosition: boolean

  /**
   * A flag to enable or disable the body internal edges debug overlay.
   * @default false
   */
  showInternalEdges: boolean

  /**
   * A flag to enable or disable the body and part ids debug overlay.
   * @default false
   */
  showIds: boolean

  /**
   * A flag to enable or disable the debug information overlay.
   * This includes and has priority over the values of:
   * - render.options.showStats
   * - render.options.showPerformance
   * @default false
   */
  showDebug: boolean

  /**
   * A flag to enable or disable the body convex hulls debug overlay.
   * @default false
   */
  showConvexHulls: boolean

  /**
   * A flag to enable or disable the body collisions debug overlay.
   * @default false
   */
  showCollisions: boolean

  /**
   * A flag to enable or disable the collision broadphase debug overlay.
   * @deprecated no longer implemented
   * @default false
   */
  showBroadphase: boolean

  /**
   * A flag to enable or disable the body bounds debug overlay.
   * @default false
   */
  showBounds: boolean

  /**
   * A flag to enable or disable the body axes debug overlay.
   * @default false
   */
  showAxes: boolean

  /**
   * A flag to enable or disable the body angle debug overlay.
   * @default false
   */
  showAngleIndicator: boolean

  /**
   * The pixel ratio to use when rendering.
   * @default 1
   */
  pixelRatio: number
}

interface IRenderLookAtObject {
  bounds: Bounds
  position:
    | {
        x: number
        y: number
      }

  min:
    | {
        x: number
        y: number
      }

  max:
    | {
        x: number
        y: number
      }

}
