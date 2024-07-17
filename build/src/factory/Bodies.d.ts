import { IBody, IBodyTextRender } from '../body/Body';
import { DeepPartial } from '../core/Common';
import { IVector } from '../geometry/Vector';
/**
 * The `Matter.Bodies` module contains factory methods for creating rigid body models
 * with commonly used body configurations (such as rectangles, circles and other polygons).
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Bodies {
    /**
     * Creates a new rigid body model with a rectangle hull.
     * The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
     * @method rectangle
     * @param x
     * @param y
     * @param width
     * @param height
     * @param options
     * @return A new rectangle body
     */
    static rectangle(x: number, y: number, width: number, height: number, options?: DeepPartial<IBody>): IBody;
    /**
     * Creates a new rigid body model with a trapezoid hull.
     * The `slope` is parameterised as a fraction of `width` and must be < 1 to form a valid trapezoid.
     * The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
     * @method trapezoid
     * @param x
     * @param y
     * @param width
     * @param height
     * @param slope Must be a number < 1.
     * @param options
     * @return A new trapezoid body
     */
    static trapezoid(x: number, y: number, width: number, height: number, slope: number, options?: DeepPartial<IBody>): IBody;
    /**
     * Creates a new rigid body model with a circle hull.
     * The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
     * @method circle
     * @param x
     * @param y
     * @param radius
     * @param options
     * @param maxSides
     * @return A new circle body
     */
    static circle(x: number, y: number, radius: number, options?: DeepPartial<IBody>, maxSides?: number): IBody;
    /**
     * Creates a new rigid body model with a regular polygon hull with the given number of sides.
     * The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
     * @method polygon
     * @param x
     * @param y
     * @param sides
     * @param radius
     * @param options
     * @return A new regular polygon body
     */
    static polygon(x: number, y: number, sides: number, radius: number, options?: DeepPartial<IBody>): IBody;
    /**
     * Creates a new rectangle body that fits the letters of the given text.
     * @method text
     * @param x
     * @param y
     * @param text
     * @param options
     * @return A new rectangle body with the given text
     */
    static text(x: number, y: number, text: string, options?: DeepPartial<Omit<IBody, 'render'>> & {
        render?: DeepPartial<IBodyTextRender>;
    }): IBody;
    /**
     * Measure max text width for a given font.
     * @method measureMaxTextWidth
     * @param text
     * @param font
     * @param size
     */
    static measureMaxTextWidth(text: string, font: string, size: number): number;
    /**
     * Utility to create a compound body based on set(s) of vertices.
     *
     * _Note:_ To optionally enable automatic concave vertices decomposition the [poly-decomp](https://github.com/schteppe/poly-decomp.js)
     * package must be first installed and provided see `Common.setDecomp`, otherwise the convex hull of each vertex set will be used.
     *
     * The resulting vertices are reorientated about their centre of mass,
     * and offset such that `body.position` corresponds to this point.
     *
     * The resulting offset may be found if needed by subtracting `body.bounds` from the original input bounds.
     * To later move the centre of mass see `Body.setCentre`.
     *
     * Note that automatic conconcave decomposition results are not always optimal.
     * For best results, simplify the input vertices as much as possible first.
     * By default this function applies some addtional simplification to help.
     *
     * Some outputs may also require further manual processing afterwards to be robust.
     * In particular some parts may need to be overlapped to avoid collision gaps.
     * Thin parts and sharp points should be avoided or removed where possible.
     *
     * The options parameter object specifies any `Matter.Body` properties you wish to override the defaults.
     *
     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
     * @method fromVertices
     * @param x
     * @param y
     * @param vertexSets One or more arrays of vertex points e.g. `[[{ x: 0, y: 0 }...], ...]`.
     * @param options The body options.
     * @param flagInternal Optionally marks internal edges with `isInternal`.
     * @param removeCollinear Threshold when simplifying vertices along the same edge.
     * @param minimumArea Threshold when removing small parts.
     * @param removeDuplicatePoints Threshold when simplifying nearby vertices.
     */
    static fromVertices(x: number, y: number, vertexSets: IVector[] | IVector[][], options?: DeepPartial<IBody>, flagInternal?: boolean, removeCollinear?: number | false, minimumArea?: number, removeDuplicatePoints?: number | false): IBody;
}
