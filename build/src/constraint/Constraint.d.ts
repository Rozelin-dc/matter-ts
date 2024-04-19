import { IBody } from '../body/Body';
import { IPlugin } from '../core/Plugin';
import { IVector } from '../geometry/Vector';
export interface IConstraint {
    /**
     * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
     */
    id: number;
    /**
     * A `String` denoting the type of object.
     */
    type: 'constraint';
    /**
     * An arbitrary `String` name to help the user identify and manage bodies.
     *
     * @default "Constraint"
     */
    label: string;
    /**
     * An `Object` that defines the rendering properties to be consumed by the module `Matter.Render`.
     */
    render: IConstraintRender;
    /**
     * The first possible `Body` that this constraint is attached to.
     *
     * @default null
     */
    bodyA: IBody | null;
    /**
     * The second possible `Body` that this constraint is attached to.
     *
     * @default null
     */
    bodyB: IBody | null;
    /**
     * A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyA` if defined, otherwise a world-space position.
     *
     * @default { x: 0, y: 0 }
     */
    pointA: IVector;
    /**
     * A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyB` if defined, otherwise a world-space position.
     *
     * @default { x: 0, y: 0 }
     */
    pointB: IVector;
    /**
     * A `Number` that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`.
     * A value of `1` means the constraint should be very stiff.
     * A value of `0.2` means the constraint acts like a soft spring.
     *
     * @default 1
     */
    stiffness: number;
    /**
     * A `Number` that specifies the damping of the constraint,
     * i.e. the amount of resistance applied to each body based on their velocities to limit the amount of oscillation.
     * Damping will only be apparent when the constraint also has a very low `stiffness`.
     * A value of `0.1` means the constraint will apply heavy damping, resulting in little to no oscillation.
     * A value of `0` means the constraint will apply no damping.
     *
     * @default 0
     */
    damping: number;
    /**
     * A `Number` that specifies the target resting length of the constraint.
     * It is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`.
     */
    length: number;
    /**
     * An object reserved for storing plugin-specific properties.
     */
    plugin: IPlugin | {};
    angularStiffness: number;
    angleA: number;
    angleB: number;
}
interface IConstraintRender {
    /**
     * A flag that indicates if the constraint should be rendered.
     *
     * @default true
     */
    visible: boolean;
    /**
     * A `Number` that defines the line width to use when rendering the constraint outline.
     * A value of `0` means no outline will be rendered.
     *
     * @default 2
     */
    lineWidth: number;
    /**
     * A `String` that defines the stroke style to use when rendering the constraint outline.
     * It is the same as when using a canvas, so it accepts CSS style property values.
     *
     * @default random colour
     */
    strokeStyle: string;
    /**
     * A `String` that defines the constraint rendering type.
     * The possible values are 'line', 'pin', 'spring'.
     * An appropriate render type will be automatically chosen unless one is given in options.
     *
     * @default 'line'
     */
    type: string;
    /**
     * A `Boolean` that defines if the constraint's anchor points should be rendered.
     *
     * @default true
     */
    anchors: boolean;
}
export type ConstraintOptions = Partial<Omit<IConstraint, 'render'>> & {
    render?: Partial<IConstraint['render']>;
};
/**
 * The `Matter.Constraint` module contains methods for creating and manipulating constraints.
 * Constraints are used for specifying that a fixed distance must be maintained between two bodies (or a body and a fixed world-space position).
 * The stiffness of constraints can be modified to create springs or elastic.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Constraint {
    protected static _warming: number;
    protected static _torqueDampen: number;
    protected static _minLength: number;
    /**
     * Creates a new constraint.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * To simulate a revolute constraint (or pin joint) set `length: 0` and a high `stiffness` value (e.g. `0.7` or above).
     * If the constraint is unstable, try lowering the `stiffness` value and / or increasing `engine.constraintIterations`.
     * For compound bodies, constraints must be applied to the parent body (not one of its parts).
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param options
     * @return constraint
     */
    static create(options: ConstraintOptions): IConstraint;
    /**
     * Prepares for solving by constraint warming.
     * @private
     * @method preSolveAll
     * @param bodies
     */
    static preSolveAll(bodies: IBody[]): void;
    /**
     * Solves all constraints in a list of collisions.
     * @private
     * @method solveAll
     * @param {constraint[]} constraints
     * @param {number} delta
     */
    static solveAll(constraints: IConstraint[], delta: number): void;
    /**
     * Solves a distance constraint with Gauss-Siedel method.
     * @method solve
     * @param constraint
     * @param timeScale
     */
    protected static solve(constraint: IConstraint, timeScale: number): void;
    /**
     * Performs body updates required after solving constraints.
     * @method postSolveAll
     * @param bodies
     */
    static postSolveAll(bodies: IBody[]): void;
    /**
     * Returns the world-space position of `constraint.pointA`, accounting for `constraint.bodyA`.
     * @method pointAWorld
     * @param constraint
     * @returns the world-space position
     */
    static pointAWorld(constraint: IConstraint): IVector;
    /**
     * Returns the world-space position of `constraint.pointB`, accounting for `constraint.bodyB`.
     * @method pointBWorld
     * @param constraint
     * @returns the world-space position
     */
    static pointBWorld(constraint: IConstraint): IVector;
    /**
     * Returns the current length of the constraint.
     * This is the distance between both of the constraint's end points.
     * See `constraint.length` for the target rest length.
     * @method currentLength
     * @param {constraint} constraint
     * @returns {number} the current length
     */
    static currentLength(constraint: IConstraint): number;
}
export {};
