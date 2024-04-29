import { IBody } from '../body/Body';
import { IPair } from '../collision/Pair';
import { IConstraint } from '../constraint/Constraint';
import { IEngine } from '../core/Engine';
import { RenderEventFunction, RenderEventName } from '../core/Events';
import { IMouse } from '../core/Mouse';
import { IBounds } from '../geometry/Bounds';
import { IVector } from '../geometry/Vector';
export interface IRender {
    /**
     * A back-reference to the `Matter.Render` module.
     *
     * @deprecated
     */
    controller: Render;
    /**
     * A reference to the `Matter.Engine` instance to be used.
     */
    engine: IEngine;
    /**
     * A reference to the element where the canvas is to be inserted (if `render.canvas` has not been specified)
     *
     * @default null
     */
    element: HTMLElement | null;
    /**
     * The canvas element to render to. If not specified, one will be created if `render.element` has been specified.
     */
    canvas: HTMLCanvasElement;
    /**
     * A `Bounds` object that specifies the drawing view region.
     * Rendering will be automatically transformed and scaled to fit within the canvas size (`render.options.width` and `render.options.height`).
     * This allows for creating views that can pan or zoom around the scene.
     * You must also set `render.options.hasBounds` to `true` to enable bounded rendering.
     */
    bounds: IBounds;
    /**
     * The 2d rendering context from the `render.canvas` element.
     */
    context: CanvasRenderingContext2D;
    /**
     * The sprite texture cache.
     */
    textures: Record<string, HTMLImageElement>;
    /**
     * The mouse to render if `render.options.showMousePosition` is enabled.
     *
     * @default null
     */
    mouse: IMouse | null;
    /**
     * The configuration options of the renderer.
     */
    options: IRenderOptions;
    frameRequestId: number | null;
    timing: IRenderTiming;
    currentBackground?: string;
    events: Record<RenderEventName, RenderEventFunction[]>;
}
export interface IRenderOptions {
    /**
     * The target width in pixels of the `render.canvas` to be created.
     * See also the `options.pixelRatio` property to change render quality.
     *
     * @default 800
     */
    width: number;
    /**
     * The target height in pixels of the `render.canvas` to be created.
     * See also the `options.pixelRatio` property to change render quality.
     *
     * @default 600
     */
    height: number;
    /**
     * The [pixel ratio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) to use when rendering.
     *
     * @default 1
     */
    pixelRatio: number;
    /**
     * A CSS background color string to use when `render.options.wireframes` is disabled.
     * This may be also set to `'transparent'` or equivalent.
     *
     * @default '#14151f'
     */
    background: string;
    /**
     * A CSS color string to use for background when `render.options.wireframes` is enabled.
     * This may be also set to `'transparent'` or equivalent.
     *
     * @default '#14151f'
     */
    wireframeBackground: string;
    /**
     * A CSS color string to use for stroke when `render.options.wireframes` is enabled.
     * This may be also set to `'transparent'` or equivalent.
     *
     * @default '#bbb'
     */
    wireframeStrokeStyle: string;
    /**
     * A flag that specifies if `render.bounds` should be used when rendering.
     *
     * @default false
     */
    hasBounds: boolean;
    /**
     * A flag to enable or disable all debug information overlays together.
     * This includes and has priority over the values of:
     *
     * - `render.options.showStats`
     * - `render.options.showPerformance`
     *
     * @default false
     */
    showDebug: boolean;
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
    showStats: boolean;
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
    showPerformance: boolean;
    /**
     * A flag to enable or disable rendering entirely.
     *
     * @default false
     */
    enabled: boolean;
    /**
     * A flag to toggle wireframe rendering otherwise solid fill rendering is used.
     *
     * @default true
     */
    wireframes: boolean;
    /**
     * A flag to enable or disable sleeping bodies indicators.
     *
     * @default true
     */
    showSleeping: boolean;
    /**
     * A flag to enable or disable the collision broadphase debug overlay.
     *
     * @deprecated no longer implemented
     * @default false
     */
    showBroadphase: boolean;
    /**
     * A flag to enable or disable the body bounds debug overlay.
     *
     * @default false
     */
    showBounds: boolean;
    /**
     * A flag to enable or disable the body velocity debug overlay.
     *
     * @default false
     */
    showVelocity: boolean;
    /**
     * A flag to enable or disable the body collisions debug overlay.
     *
     * @default false
     */
    showCollisions: boolean;
    /**
     * A flag to enable or disable the collision resolver separations debug overlay.
     *
     * @default false
     */
    showSeparations: boolean;
    /**
     * A flag to enable or disable the body axes debug overlay.
     *
     * @default false
     */
    showAxes: boolean;
    /**
     * A flag to enable or disable the body positions debug overlay.
     *
     * @default false
     */
    showPositions: boolean;
    /**
     * A flag to enable or disable the body angle debug overlay.
     *
     * @default false
     */
    showAngleIndicator: boolean;
    /**
     * A flag to enable or disable the body and part ids debug overlay.
     *
     * @default false
     */
    showIds: boolean;
    /**
     * A flag to enable or disable the body vertex numbers debug overlay.
     *
     * @default false
     */
    showVertexNumbers: boolean;
    /**
     * A flag to enable or disable the body convex hulls debug overlay.
     *
     * @default false
     */
    showConvexHulls: boolean;
    /**
     * A flag to enable or disable the body internal edges debug overlay.
     *
     * @default false
     */
    showInternalEdges: boolean;
    /**
     * A flag to enable or disable the mouse position debug overlay.
     *
     * @default false
     */
    showMousePosition: boolean;
}
export interface IRenderTiming {
    historySize: number;
    delta: number;
    deltaHistory: number[];
    lastTime?: number;
    lastTimestamp?: number;
    lastElapsed: number;
    timestampElapsed: number;
    timestampElapsedHistory: number[];
    engineDeltaHistory: number[];
    engineElapsedHistory: number[];
    elapsedHistory: number[];
}
export interface IInspector {
    selected: {
        data: IBody | IConstraint;
    }[];
    render: IRender;
    selectStart: any;
    selectBounds: IBounds;
}
/**
 * The `Matter.Render` module is a simple canvas based renderer for visualising instances of `Matter.Engine`.
 * It is intended for development and debugging purposes, but may also be suitable for simple games.
 * It includes a number of drawing options including wireframe, vector with support for sprites and viewports.
 */
export default class Render {
    protected static _requestAnimationFrame: ((callback: FrameRequestCallback) => number) & typeof requestAnimationFrame;
    protected static _cancelAnimationFrame: ((handle: number) => void) & typeof cancelAnimationFrame;
    protected static _goodFps: number;
    protected static _goodDelta: number;
    /**
     * Creates a new renderer. The options parameter is an object that specifies any properties you wish to override the defaults.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param options
     * @return A new renderer
     */
    static create(options?: Partial<Omit<IRender, 'options'>> & {
        options?: Partial<IRenderOptions>;
    }): IRender;
    /**
     * Continuously updates the render canvas on the `requestAnimationFrame` event.
     * @method run
     * @param render
     */
    static run(render: IRender): void;
    /**
     * Ends execution of `Render.run` on the given `render`, by canceling the animation frame request event loop.
     * @method stop
     * @param render
     */
    static stop(render: IRender): void;
    /**
     * Sets the pixel ratio of the renderer and updates the canvas.
     * To automatically detect the correct ratio, pass the string `'auto'` for `pixelRatio`.
     * @method setPixelRatio
     * @param render
     * @param pixelRatio
     */
    static setPixelRatio(render: IRender, pr: number | 'auto'): void;
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
    static setSize(render: IRender, width: number, height: number): void;
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
    static lookAt(render: IRender, objects: any | any[], padding?: IVector, center?: boolean): void;
    /**
     * Applies viewport transforms based on `render.bounds` to a render context.
     * @method startViewTransform
     * @param render
     */
    static startViewTransform(render: IRender): void;
    /**
     * Resets all transforms on the render context.
     * @method endViewTransform
     * @param render
     */
    static endViewTransform(render: IRender): void;
    /**
     * Renders the given `engine`'s `Matter.World` object.
     * This is the entry point for all rendering and should be called every time the scene changes.
     * @method world
     * @param render
     * @param time
     */
    static world(render: IRender, _time?: number): void;
    /**
     * Renders statistics about the engine and world useful for debugging.
     * @method stats
     * @param render
     * @param context
     * @param time
     */
    protected static stats(render: IRender, context: CanvasRenderingContext2D, _time?: number): void;
    /**
     * Renders engine and render performance information.
     * @method performance
     * @param render
     * @param context
     */
    protected static performance(render: IRender, context: CanvasRenderingContext2D): void;
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
    protected static status(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, count: number, label: string, indicator: number, plotY: (idx: number) => number): void;
    /**
     * Description
     * @method constraints
     * @param constraints
     * @param context
     */
    protected static constraints(constraints: IConstraint[], context: CanvasRenderingContext2D): void;
    /**
     * Description
     * @method bodies
     * @param render
     * @param bodies
     * @param context
     */
    protected static bodies(render: IRender, bodies: IBody[], context: CanvasRenderingContext2D): void;
    /**
     * Optimised method for drawing body wireframes in one pass
     * @method bodyWireframes
     * @param render
     * @param bodies
     * @param context
     */
    protected static bodyWireframes(render: IRender, bodies: IBody[], context: CanvasRenderingContext2D): void;
    /**
     * Optimised method for drawing body convex hull wireframes in one pass
     * @method bodyConvexHulls
     * @param render
     * @param bodies
     * @param context
     */
    protected static bodyConvexHulls(_render: IRender, bodies: IBody[], context: CanvasRenderingContext2D): void;
    /**
     * Renders body vertex numbers.
     * @method vertexNumbers
     * @param render
     * @param bodies
     * @param context
     */
    protected static vertexNumbers(_render: IRender, bodies: IBody[], context: CanvasRenderingContext2D): void;
    /**
     * Renders mouse position.
     * @method mousePosition
     * @param render
     * @param mouse
     * @param context
     */
    protected static mousePosition(_render: IRender, mouse: IMouse, context: CanvasRenderingContext2D): void;
    /**
     * Draws body bounds
     * @method bodyBounds
     * @param render
     * @param bodies
     * @param context
     */
    protected static bodyBounds(render: IRender, bodies: IBody[], context: CanvasRenderingContext2D): void;
    /**
     * Draws body angle indicators and axes
     * @method bodyAxes
     * @param render
     * @param bodies
     * @param context
     */
    protected static bodyAxes(render: IRender, bodies: IBody[], context: CanvasRenderingContext2D): void;
    /**
     * Draws body positions
     * @method bodyPositions
     * @param render
     * @param bodies
     * @param context
     */
    protected static bodyPositions(render: IRender, bodies: IBody[], context: CanvasRenderingContext2D): void;
    /**
     * Draws body velocity
     * @method bodyVelocity
     * @param render
     * @param bodies
     * @param context
     */
    protected static bodyVelocity(_render: IRender, bodies: IBody[], context: CanvasRenderingContext2D): void;
    /**
     * Draws body ids
     * @method bodyIds
     * @param render
     * @param bodies
     * @param context
     */
    protected static bodyIds(_render: IRender, bodies: IBody[], context: CanvasRenderingContext2D): void;
    /**
     * Description
     * @method collisions
     * @param render
     * @param pairs
     * @param context
     */
    protected static collisions(render: IRender, pairs: IPair[], context: CanvasRenderingContext2D): void;
    /**
     * Description
     * @method separations
     * @param render
     * @param pairs
     * @param context
     */
    protected static separations(render: IRender, pairs: IPair[], context: CanvasRenderingContext2D): void;
    /**
     * Description
     * @method inspector
     * @param inspector
     * @param context
     */
    protected static inspector(inspector: IInspector, context: CanvasRenderingContext2D): void;
    /**
     * Updates render timing.
     * @method _updateTiming
     * @param render
     * @param time
     */
    protected static _updateTiming(render: IRender, time?: number): void;
    /**
     * Returns the mean value of the given numbers.
     * @method _mean
     * @param values
     * @return the mean of given values
     */
    protected static _mean(values: number[]): number;
    /**
     * @method _createCanvas
     * @param width
     * @param height
     * @return canvas
     */
    protected static _createCanvas(width: number, height: number): HTMLCanvasElement;
    /**
     * Gets the pixel ratio of the canvas.
     * @method _getPixelRatio
     * @param canvas
     * @return pixel ratio
     */
    protected static _getPixelRatio(canvas: HTMLCanvasElement): number;
    /**
     * Gets the requested texture (an Image) via its path
     * @method _getTexture
     * @param render
     * @param imagePath
     * @return texture
     */
    protected static _getTexture(render: IRender, imagePath: string): HTMLImageElement;
    /**
     * Applies the background to the canvas using CSS.
     * @method applyBackground
     * @param render
     * @param background
     */
    protected static _applyBackground(render: IRender, background: string): void;
}
