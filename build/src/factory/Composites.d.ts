import { IBody } from '../body/Body';
import { IComposite } from '../body/Composite';
import { ConstraintOptions, IConstraint } from '../constraint/Constraint';
import { DeepPartial } from '../core/Common';
/**
 * The `Matter.Composites` module contains factory methods for creating composite bodies
 * with commonly used configurations (such as stacks and chains).
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Composites {
    /**
     * Create a new composite containing bodies created in the callback in a grid arrangement.
     * This function uses the body's bounds to prevent overlaps.
     * @method stack
     * @param x Starting position in X.
     * @param y Starting position in Y.
     * @param columns
     * @param rows
     * @param columnGap
     * @param rowGap
     * @param callback
     * @return A new composite containing objects created in the callback
     */
    static stack(x: number, y: number, columns: number, rows: number, columnGap: number, rowGap: number, callback: (currentX: number, currentY: number, column: number, row: number, lastBody: IBody | undefined, i: number) => IBody | void): IComposite;
    /**
     * Chains all bodies in the given composite together using constraints.
     * @method chain
     * @param composite
     * @param xOffsetA
     * @param yOffsetA
     * @param xOffsetB
     * @param yOffsetB
     * @param options
     * @return A new composite containing objects chained together with constraints
     */
    static chain(composite: IComposite, xOffsetA: number, yOffsetA: number, xOffsetB: number, yOffsetB: number, options?: DeepPartial<IConstraint>): IComposite;
    /**
     * Connects bodies in the composite with constraints in a grid pattern, with optional cross braces.
     * @method mesh
     * @param composite
     * @param columns
     * @param rows
     * @param crossBrace
     * @param options
     * @return The composite containing objects meshed together with constraints
     */
    static mesh(composite: IComposite, columns: number, rows: number, crossBrace: boolean, options?: ConstraintOptions): IComposite;
    /**
     * Create a new composite containing bodies created in the callback in a pyramid arrangement.
     * This function uses the body's bounds to prevent overlaps.
     * @method pyramid
     * @param x Starting position in X.
     * @param y Starting position in Y.
     * @param columns
     * @param rows
     * @param columnGap
     * @param rowGap
     * @param callback
     * @return A new composite containing objects created in the callback
     */
    static pyramid(x: number, y: number, columns: number, rows: number, columnGap: number, rowGap: number, callback: (stackX: number, stackY: number, column: number, row: number, lastBody: IBody | undefined, i: number) => IBody): IComposite;
    /**
     * This has now moved to the [newtonsCradle example](https://github.com/liabru/matter-js/blob/master/examples/newtonsCradle.js), follow that instead as this function is deprecated here.
     * @deprecated moved to newtonsCradle example
     * @method newtonsCradle
     * @param x Starting position in X.
     * @param y Starting position in Y.
     * @param number
     * @param size
     * @param length
     * @return A new composite newtonsCradle body
     */
    static newtonsCradle(x: number, y: number, number: number, size: number, length: number): IComposite;
    /**
     * This has now moved to the [car example](https://github.com/liabru/matter-js/blob/master/examples/car.js), follow that instead as this function is deprecated here.
     * @deprecated moved to car example
     * @method car
     * @param x Starting position in X.
     * @param y Starting position in Y.
     * @param width
     * @param height
     * @param wheelSize
     * @return A new composite car body
     */
    static car(x: number, y: number, width: number, height: number, wheelSize: number): IComposite;
    /**
     * This has now moved to the [softBody example](https://github.com/liabru/matter-js/blob/master/examples/softBody.js)
     * and the [cloth example](https://github.com/liabru/matter-js/blob/master/examples/cloth.js), follow those instead as this function is deprecated here.
     * @deprecated moved to softBody and cloth examples
     * @method softBody
     * @param x Starting position in X.
     * @param y Starting position in Y.
     * @param columns
     * @param rows
     * @param columnGap
     * @param rowGap
     * @param crossBrace
     * @param particleRadius
     * @param particleOptions
     * @param constraintOptions
     * @return A new composite softBody
     */
    static softBody(x: number, y: number, columns: number, rows: number, columnGap: number, rowGap: number, crossBrace: boolean, particleRadius: number, particleOptions: DeepPartial<IBody>, constraintOptions: ConstraintOptions): IComposite;
}
