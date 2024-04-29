import { DeepPartial } from '../core/Common';
import { CompositeEventName } from '../core/Events';
import { IPlugin } from '../core/Plugin';
import { IBounds } from '../geometry/Bounds';
import { IVector } from '../geometry/Vector';
import { IBody } from './Body';
import { IConstraint } from '../constraint/Constraint';
import { IMouseConstraint } from '../constraint/MouseConstraint';
import { IEngineGravity } from '../core/Engine';
export interface IComposite {
    /**
     * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
     */
    id: number;
    /**
     * A `String` denoting the type of object.
     */
    type: 'composite';
    /**
     * An arbitrary `String` name to help the user identify and manage composites.
     *
     * @default "Composite"
     */
    label: string;
    /**
     * A flag that specifies whether the composite has been modified during the current step.
     * This is automatically managed when bodies, constraints or composites are added or removed.
     *
     * @default false
     */
    isModified: boolean;
    /**
     * The `Composite` that is the parent of this composite. It is automatically managed by the `Matter.Composite` methods.
     *
     * @default null
     */
    parent: IComposite | null;
    /**
     * An array of `Body` that are _direct_ children of this composite.
     * To add or remove bodies you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
     * If you wish to recursively find all descendants, you should use the `Composite.allBodies` method.
     *
     * @default []
     */
    bodies: IBody[];
    /**
     * An array of `Constraint` that are _direct_ children of this composite.
     * To add or remove constraints you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
     * If you wish to recursively find all descendants, you should use the `Composite.allConstraints` method.
     *
     * @default []
     */
    constraints: IConstraint[];
    /**
     * An array of `Composite` that are _direct_ children of this composite.
     * To add or remove composites you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
     * If you wish to recursively find all descendants, you should use the `Composite.allComposites` method.
     *
     * @default []
     */
    composites: IComposite[];
    /**
     * An object reserved for storing plugin-specific properties.
     *
     * @default {}
     */
    plugin: IPlugin | {};
    /**
     * An object used for storing cached results for performance reasons.
     * This is used internally only and is automatically managed.
     */
    cache: {
        allBodies: IBody[] | null;
        allConstraints: IConstraint[] | null;
        allComposites: IComposite[] | null;
    };
    events: Record<CompositeEventName, Function[]>;
    gravity?: IEngineGravity;
}
export type CompositeAddableObject = IBody | IComposite | IConstraint | IMouseConstraint;
/**
 * A composite is a collection of `Matter.Body`, `Matter.Constraint` and other `Matter.Composite` objects.
 *
 * They are a container that can represent complex objects made of multiple parts, even if they are not physically connected.
 * A composite could contain anything from a single body all the way up to a whole world.
 *
 * When making any changes to composites, use the included functions rather than changing their properties directly.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Composite {
    /**
     * Creates a new composite. The options parameter is an object that specifies any properties you wish to override the defaults.
     * See the properites section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param options
     * @return A new composite
     */
    static create(options?: DeepPartial<IComposite>): IComposite;
    /**
     * Sets the composite's `isModified` flag.
     * If `updateParents` is true, all parents will be set (default: false).
     * If `updateChildren` is true, all children will be set (default: false).
     * @method setModified
     * @param composite
     * @param isModified
     * @param updateParents
     * @param updateChildren
     */
    static setModified(composite: IComposite, isModified: boolean, updateParents?: boolean, updateChildren?: boolean): void;
    /**
     * Generic single or multi-add function. Adds a single or an array of body(s), constraint(s) or composite(s) to the given composite.
     * Triggers `beforeAdd` and `afterAdd` events on the `composite`.
     * @method add
     * @param composite
     * @param object A single or an array of body(s), constraint(s) or composite(s)
     * @return The original composite with the objects added
     */
    static add(composite: IComposite, object: CompositeAddableObject | CompositeAddableObject[]): IComposite;
    /**
     * Generic remove function. Removes one or many body(s), constraint(s) or a composite(s) to the given composite.
     * Optionally searching its children recursively.
     * Triggers `beforeRemove` and `afterRemove` events on the `composite`.
     * @method remove
     * @param composite
     * @param object
     * @param deep
     * @return The original composite with the objects removed
     */
    static remove(composite: IComposite, object: CompositeAddableObject | CompositeAddableObject[], deep?: boolean): IComposite;
    /**
     * Adds a composite to the given composite.
     * @method addComposite
     * @param compositeA
     * @param compositeB
     * @return The original compositeA with the objects from compositeB added
     */
    static addComposite(compositeA: IComposite, compositeB: IComposite): IComposite;
    /**
     * Removes a composite from the given composite, and optionally searching its children recursively.
     * @method removeComposite
     * @param compositeA
     * @param compositeB
     * @param deep
     * @return The original compositeA with the composite removed
     */
    protected static removeComposite(compositeA: IComposite, compositeB: IComposite, deep?: boolean): IComposite;
    /**
     * Removes a composite from the given composite.
     * @method removeCompositeAt
     * @param composite
     * @param position
     * @return The original composite with the composite removed
     */
    protected static removeCompositeAt(composite: IComposite, position: number): IComposite;
    /**
     * Adds a body to the given composite.
     * @method addBody
     * @param composite
     * @param body
     * @return The original composite with the body added
     */
    static addBody(composite: IComposite, body: IBody): IComposite;
    /**
     * Removes a body from the given composite, and optionally searching its children recursively.
     * @method removeBody
     * @param composite
     * @param body
     * @param deep
     * @return The original composite with the body removed
     */
    protected static removeBody(composite: IComposite, body: IBody, deep?: boolean): IComposite;
    /**
     * Removes a body from the given composite.
     * @method removeBodyAt
     * @param composite
     * @param position
     * @return The original composite with the body removed
     */
    protected static removeBodyAt(composite: IComposite, position: number): IComposite;
    /**
     * Adds a constraint to the given composite.
     * @method addConstraint
     * @param composite
     * @param constraint
     * @return The original composite with the constraint added
     */
    static addConstraint(composite: IComposite, constraint: IConstraint): IComposite;
    /**
     * Removes a constraint from the given composite, and optionally searching its children recursively.
     * @method removeConstraint
     * @param composite
     * @param constraint
     * @param deep
     * @return The original composite with the constraint removed
     */
    protected static removeConstraint(composite: IComposite, constraint: IConstraint, deep?: boolean): IComposite;
    /**
     * Removes a body from the given composite.
     * @private
     * @method removeConstraintAt
     * @param composite
     * @param position
     * @return The original composite with the constraint removed
     */
    protected static removeConstraintAt(composite: IComposite, position: number): IComposite;
    /**
     * Removes all bodies, constraints and composites from the given composite.
     * Optionally clearing its children recursively.
     * @method clear
     * @param composite
     * @param keepStatic
     * @param deep
     */
    static clear(composite: IComposite, keepStatic: boolean, deep?: boolean): IComposite;
    /**
     * Returns all bodies in the given composite, including all bodies in its children, recursively.
     * @method allBodies
     * @param composite
     * @return All the bodies
     */
    static allBodies(composite: IComposite): IBody[];
    /**
     * Returns all constraints in the given composite, including all constraints in its children, recursively.
     * @method allConstraints
     * @param composite
     * @return All the constraints
     */
    static allConstraints(composite: IComposite): IConstraint[];
    /**
     * Returns all composites in the given composite, including all composites in its children, recursively.
     * @method allComposites
     * @param composite
     * @return All the composites
     */
    static allComposites(composite: IComposite): IComposite[];
    /**
     * Searches the composite recursively for an object matching the type and id supplied, null if not found.
     * @method get
     * @param composite
     * @param id
     * @param type
     * @return The requested object, if found
     */
    static get(composite: IComposite, id: number, type: 'body' | 'constraint' | 'composite'): IBody | IConstraint | IComposite | null;
    /**
     * Moves the given object(s) from compositeA to compositeB (equal to a remove followed by an add).
     * @method move
     * @param compositeA
     * @param objects
     * @param compositeB
     * @return Returns compositeA
     */
    static move(compositeA: IComposite, objects: CompositeAddableObject | CompositeAddableObject[], compositeB: IComposite): IComposite;
    /**
     * Assigns new ids for all objects in the composite, recursively.
     * @method rebase
     * @param composite
     * @return Returns composite
     */
    static rebase(composite: IComposite): IComposite;
    /**
     * Translates all children in the composite by a given vector relative to their current positions,
     * without imparting any velocity.
     * @method translate
     * @param composite
     * @param translation
     * @param recursive
     */
    static translate(composite: IComposite, translation: IVector, recursive?: boolean): IComposite;
    /**
     * Rotates all children in the composite by a given angle about the given point, without imparting any angular velocity.
     * @method rotate
     * @param composite
     * @param rotation
     * @param point
     * @param recursive
     */
    static rotate(composite: IComposite, rotation: number, point: IVector, recursive?: boolean): IComposite;
    /**
     * Scales all children in the composite, including updating physical properties (mass, area, axes, inertia), from a world-space point.
     * @method scale
     * @param composite
     * @param scaleX
     * @param scaleY
     * @param point
     * @param recursive
     */
    static scale(composite: IComposite, scaleX: number, scaleY: number, point: IVector, recursive?: boolean): IComposite;
    /**
     * Returns the union of the bounds of all of the composite's bodies.
     * @method bounds
     * @param composite The composite.
     * @returns The composite bounds.
     */
    static bounds(composite: IComposite): IBounds;
}
