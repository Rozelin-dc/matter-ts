import { BodyEventFunction, BodyEventName } from '../core/Events';
import { IBounds } from '../geometry/Bounds';
import { IVector } from '../geometry/Vector';
import { IAxes } from '../geometry/Axes';
import { IPlugin } from '../core/Plugin';
import { IVertices } from '../geometry/Vertices';
import { ICollisionFilter } from '../collision/Detector';
import { IRegion } from '../collision/Grid';
import { DeepPartial } from '../core/Common';
export interface IBody {
    /**
     * A `Number` specifying the angle of the body, in radians.
     *
     * @default 0
     */
    angle: number;
    anglePrev: number;
    /**
     * A `Number` that _measures_ the current angular speed of the body after the last `Body.update`. It is read-only and always positive (it's the magnitude of `body.angularVelocity`).
     *
     * @readOnly
     * @default 0
     */
    angularSpeed: number;
    /**
     * A `Number` that _measures_ the current angular velocity of the body after the last `Body.update`. It is read-only.
     * If you need to modify a body's angular velocity directly, you should apply a torque or simply change the body's `angle` (as the engine uses position-Verlet integration).
     *
     * @readOnly
     * @default 0
     */
    angularVelocity: number;
    /**
     * A `Number` that _measures_ the area of the body's convex hull, calculated at creation by `Body.create`.
     *
     * @default
     */
    area: number;
    /**
     * An array of unique axis vectors (edge normals) used for collision detection.
     * These are automatically calculated from the given convex hull (`vertices` array) in `Body.create`.
     * They are constantly updated by `Body.update` during the simulation.
     *
     */
    axes: IAxes;
    /**
     * A `Bounds` object that defines the AABB region for the body.
     * It is automatically calculated from the given convex hull (`vertices` array) in `Body.create` and constantly updated by `Body.update` during simulation.
     *
     */
    bounds: IBounds;
    /**
     * A `Number` that defines the density of the body, that is its mass per unit area.
     * If you pass the density via `Body.create` the `mass` property is automatically calculated for you based on the size (area) of the object.
     * This is generally preferable to simply setting mass and allows for more intuitive definition of materials (e.g. rock has a higher density than wood).
     *
     * @default 0.001
     */
    density: number;
    /**
     * A `Vector` that specifies the force to apply in the current step. It is zeroed after every `Body.update`. See also `Body.applyForce`.
     *
     * @default { x: 0, y: 0 }
     */
    force: IVector;
    /**
     * A `Number` that defines the friction of the body. The value is always positive and is in the range `(0, 1)`.
     * A value of `0` means that the body may slide indefinitely.
     * A value of `1` means the body may come to a stop almost instantly after a force is applied.
     *
     * The effects of the value may be non-linear.
     * High values may be unstable depending on the body.
     * The engine uses a Coulomb friction model including static and kinetic friction.
     * Note that collision response is based on _pairs_ of bodies, and that `friction` values are _combined_ with the following formula:
     *
     *     Math.min(bodyA.friction, bodyB.friction)
     *
     * @default 0.1
     */
    friction: number;
    /**
     * A `Number` that defines the air friction of the body (air resistance).
     * A value of `0` means the body will never slow as it moves through space.
     * The higher the value, the faster a body slows when moving through space.
     * The effects of the value are non-linear.
     *
     * @default 0.01
     */
    frictionAir: number;
    /**
     * An integer `Number` uniquely identifying number generated in `Body.create` by `Common.nextId`.
     *
     */
    id: number;
    /**
     * A `Number` that defines the moment of inertia (i.e. second moment of area) of the body.
     * It is automatically calculated from the given convex hull (`vertices` array) and density in `Body.create`.
     * If you modify this value, you must also modify the `body.inverseInertia` property (`1 / inertia`).
     *
     */
    inertia: number;
    /**
     * A `Number` that defines the inverse moment of inertia of the body (`1 / inertia`).
     * If you modify this value, you must also modify the `body.inertia` property.
     *
     */
    inverseInertia: number;
    /**
     * A `Number` that defines the inverse mass of the body (`1 / mass`).
     * If you modify this value, you must also modify the `body.mass` property.
     *
     */
    inverseMass: number;
    /**
     * A flag that indicates whether a body is a sensor. Sensor triggers collision events, but doesn't react with colliding body physically.
     *
     * @default false
     */
    isSensor: boolean;
    /**
     * A flag that indicates whether the body is considered sleeping. A sleeping body acts similar to a static body, except it is only temporary and can be awoken.
     * If you need to set a body as sleeping, you should use `Sleeping.set` as this requires more than just setting this flag.
     *
     * @default false
     */
    isSleeping: boolean;
    sleepCounter: number;
    /**
     * A flag that indicates whether a body is considered static. A static body can never change position or angle and is completely fixed.
     * If you need to set a body as static after its creation, you should use `Body.setStatic` as this requires more than just setting this flag.
     *
     * @default false
     */
    isStatic: boolean;
    /**
     * An arbitrary `String` name to help the user identify and manage bodies.
     *
     * @default "Body"
     */
    label: string;
    /**
     * A `Number` that defines the mass of the body, although it may be more appropriate to specify the `density` property instead.
     * If you modify this value, you must also modify the `body.inverseMass` property (`1 / mass`).
     *
     */
    mass: number;
    /**
     * A `Number` that _measures_ the amount of movement a body currently has (a combination of `speed` and `angularSpeed`). It is read-only and always positive.
     * It is used and updated by the `Matter.Sleeping` module during simulation to decide if a body has come to rest.
     *
     * @readOnly
     * @default 0
     */
    motion: number;
    /**
     * An object reserved for storing plugin-specific properties.
     *
     */
    plugin: IPlugin | {};
    /**
     * A `Vector` that specifies the current world-space position of the body.
     *
     * @default { x: 0, y: 0 }
     */
    position: IVector;
    positionPrev: IVector;
    positionImpulse: IVector;
    constraintImpulse: IVector & {
        angle: number;
    };
    /**
     * An `Object` that defines the rendering properties to be consumed by the module `Matter.Render`.
     *
     */
    render: IBodyRender;
    /**
     * A `Number` that defines the restitution (elasticity) of the body. The value is always positive and is in the range `(0, 1)`.
     * A value of `0` means collisions may be perfectly inelastic and no bouncing may occur.
     * A value of `0.8` means the body may bounce back with approximately 80% of its kinetic energy.
     * Note that collision response is based on _pairs_ of bodies, and that `restitution` values are _combined_ with the following formula:
     *
     *     Math.max(bodyA.restitution, bodyB.restitution)
     *
     * @default 0
     */
    restitution: number;
    /**
     * A `Number` that defines the number of updates in which this body must have near-zero velocity before it is set as sleeping by the `Matter.Sleeping` module (if sleeping is enabled by the engine).
     *
     * @default 60
     */
    sleepThreshold: number;
    /**
     * A `Number` that specifies a tolerance on how far a body is allowed to 'sink' or rotate into other bodies.
     * Avoid changing this value unless you understand the purpose of `slop` in physics engines.
     * The default should generally suffice, although very large bodies may require larger values for stable stacking.
     *
     * @default 0.05
     */
    slop: number;
    /**
     * A `Number` that _measures_ the current speed of the body after the last `Body.update`. It is read-only and always positive (it's the magnitude of `body.velocity`).
     *
     * @readOnly
     * @default 0
     */
    speed: number;
    /**
     * A `Number` that allows per-body time scaling, e.g. a force-field where bodies inside are in slow-motion, while others are at full speed.
     *
     * @default 1
     */
    timeScale: number;
    /**
     * A `Number` that specifies the torque (turning force) to apply in the current step. It is zeroed after every `Body.update`.
     *
     * @default 0
     */
    torque: number;
    /**
     * A `String` denoting the type of object.
     */
    type: 'body';
    /**
     * A `Vector` that _measures_ the current velocity of the body after the last `Body.update`. It is read-only.
     * If you need to modify a body's velocity directly, you should either apply a force or simply change the body's `position` (as the engine uses position-Verlet integration).
     *
     * @readOnly
     * @default { x: 0, y: 0 }
     */
    velocity: IVector;
    /**
     * An array of `Vector` objects that specify the convex hull of the rigid body.
     * These should be provided about the origin `(0, 0)`. E.g.
     *
     *     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
     *
     * When passed via `Body.create`, the vertices are translated relative to `body.position` (i.e. world-space, and constantly updated by `Body.update` during simulation).
     * The `Vector` objects are also augmented with additional properties required for efficient collision detection.
     *
     * Other properties such as `inertia` and `bounds` are automatically calculated from the passed vertices (unless provided via `options`).
     * Concave hulls are not currently supported. The module `Matter.Vertices` contains useful methods for working with vertices.
     *
     */
    vertices: IVertices;
    /**
     * An array of bodies that make up this body.
     * The first body in the array must always be a self reference to the current body instance.
     * All bodies in the `parts` array together form a single rigid compound body.
     * Parts are allowed to overlap, have gaps or holes or even form concave bodies.
     * Parts themselves should never be added to a `World`, only the parent body should be.
     * Use `Body.setParts` when setting parts to ensure correct updates of all properties.
     *
     */
    parts: IBody[];
    /**
     * A self reference if the body is _not_ a part of another body.
     * Otherwise this is a reference to the body that this is a part of.
     * See `body.parts`.
     *
     */
    parent: IBody;
    totalContacts: number;
    /**
     * A `Number` that defines the static friction of the body (in the Coulomb friction model).
     * A value of `0` means the body will never 'stick' when it is nearly stationary and only dynamic `friction` is used.
     * The higher the value (e.g. `10`), the more force it will take to initially get the body moving when nearly stationary.
     * This value is multiplied with the `friction` property to make it easier to change `friction` and maintain an appropriate amount of static friction.
     *
     * @default 0.5
     */
    frictionStatic: number;
    /**
     * An `Object` that specifies the collision filtering properties of this body.
     *
     * Collisions between two bodies will obey the following rules:
     * - If the two bodies have the same non-zero value of `collisionFilter.group`,
     *   they will always collide if the value is positive, and they will never collide
     *   if the value is negative.
     * - If the two bodies have different values of `collisionFilter.group` or if one
     *   (or both) of the bodies has a value of 0, then the category/mask rules apply as follows:
     *
     * Each body belongs to a collision category, given by `collisionFilter.category`. This
     * value is used as a bit field and the category should have only one bit set, meaning that
     * the value of this property is a power of two in the range [1, 2^31]. Thus, there are 32
     * different collision categories available.
     *
     * Each body also defines a collision bitmask, given by `collisionFilter.mask` which specifies
     * the categories it collides with (the value is the bitwise AND value of all these categories).
     *
     * Using the category/mask rules, two bodies `A` and `B` collide if each includes the other's
     * category in its mask, i.e. `(categoryA & maskB) !== 0` and `(categoryB & maskA) !== 0`
     * are both true.
     *
     */
    collisionFilter: ICollisionFilter;
    events: Record<BodyEventName, BodyEventFunction[]>;
    chamfer: IBodyChamfer;
    circleRadius: number | null;
    deltaTime: number;
    region?: IRegion;
    _original: IBodyOriginal | null;
}
interface IBodyRender {
    /**
     * A flag that indicates if the body should be rendered.
     *
     * @default true
     */
    visible: boolean;
    /**
     * An `Object` that defines the sprite properties to use when rendering, if any.
     *
     */
    sprite: IBodyRenderSprite;
    /**
       * A String that defines the fill style to use when rendering the body (if a sprite is not defined). It is the same as when using a canvas, so it accepts CSS style property values.
       Default: a random colour
      */
    fillStyle: string;
    /**
       * A Number that defines the line width to use when rendering the body outline (if a sprite is not defined). A value of 0 means no outline will be rendered.
       @default 1.5
      */
    lineWidth: number;
    /**
       * A String that defines the stroke style to use when rendering the body outline (if a sprite is not defined). It is the same as when using a canvas, so it accepts CSS style property values.
       Default: a random colour
      */
    strokeStyle: string;
    opacity: number;
}
interface IBodyRenderSprite {
    /**
     * An `String` that defines the path to the image to use as the sprite texture, if any.
     *
     */
    texture?: string;
    /**
     * A `Number` that defines the scaling in the x-axis for the sprite, if any.
     *
     * @default 1
     */
    xScale: number;
    /**
     * A `Number` that defines the scaling in the y-axis for the sprite, if any.
     *
     * @default 1
     */
    yScale: number;
    /**
     * A `Number` that defines the offset in the x-axis for the sprite (normalised by texture width).
     *
     * @default 0
     */
    xOffset: number;
    /**
     * A `Number` that defines the offset in the y-axis for the sprite (normalised by texture height).
     *
     * @default 0
     */
    yOffset: number;
}
interface IBodyChamfer {
    radius: number;
    quality: number;
    qualityMin: number;
    qualityMax: number;
}
interface IBodyOriginal {
    restitution: number;
    friction: number;
    mass: number;
    inertia: number;
    density: number;
    inverseMass: number;
    inverseInertia: number;
}
type DefaultBody = Omit<IBody, 'bounds' | 'axes' | 'inverseInertia' | 'inverseMass' | 'positionPrev' | 'parent' | 'chamfer' | 'render'> & {
    render: Partial<IBodyRender> & {
        sprite: IBodyRenderSprite;
    };
};
type InitBody = DefaultBody & Partial<Pick<IBody, 'bounds' | 'axes' | 'inverseInertia' | 'inverseMass' | 'positionPrev' | 'parent' | 'chamfer'>>;
/**
 * The `Matter.Body` module contains methods for creating and manipulating rigid bodies.
 * For creating bodies with common configurations such as rectangles, circles and other polygons see the module `Matter.Bodies`.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Body {
    protected static _timeCorrection: boolean;
    protected static _inertiaScale: number;
    protected static _nextCollidingGroupId: number;
    protected static _nextNonCollidingGroupId: number;
    protected static _nextCategory: number;
    protected static _baseDelta: number;
    /**
     * Creates a new rigid body model. The options parameter is an object that specifies any properties you wish to override the defaults.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * Vertices must be specified in clockwise order.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param options
     * @return body
     */
    static create(options?: DeepPartial<IBody>): IBody;
    /**
     * Initialises body properties.
     * @method _initProperties
     * @param body
     * @param options
     */
    protected static _initProperties(body: InitBody, options?: DeepPartial<IBody>): void;
    /**
     * Returns the next unique group index for which bodies will collide.
     * If `isNonColliding` is `true`, returns the next unique group index for which bodies will _not_ collide.
     * See `body.collisionFilter` for more information.
     * @method nextGroup
     * @param isNonColliding
     * @return Unique group index
     */
    static nextGroup(isNonColliding?: boolean): number;
    /**
     * Returns the next unique category bitfield (starting after the initial default category `0x0001`).
     * There are 32 available. See `body.collisionFilter` for more information.
     * @method nextCategory
     * @return Unique category bitfield
     */
    static nextCategory(): number;
    /**
     * Given a property and a value (or map of), sets the property(s) on the body, using the appropriate setter functions if they exist.
     * Prefer to use the actual setter functions in performance critical situations.
     * @method set
     * @param {body} body
     * @param {} settings A property name (or map of properties and values) to set on the body.
     * @param {} value The value to set if `settings` is a single property name.
     */
    static set(body: IBody, settings: Partial<IBody>): void;
    static set<K extends keyof IBody>(body: IBody, settings: K | 'centre', value: IBody[K]): void;
    protected static _setByKey<K extends keyof IBody>(body: IBody, key: K | 'centre', value: IBody[K]): void;
    /**
     * Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
     * @method setStatic
     * @param body
     * @param isStatic
     */
    static setStatic(body: IBody, isStatic: boolean): void;
    /**
     * Sets the mass of the body. Inverse mass, density and inertia are automatically updated to reflect the change.
     * @method setMass
     * @param body
     * @param mass
     */
    static setMass(body: IBody, mass: number): void;
    /**
     * Sets the density of the body. Mass and inertia are automatically updated to reflect the change.
     * @method setDensity
     * @param {body} body
     * @param {number} density
     */
    static setDensity(body: IBody, density: number): void;
    /**
     * Sets the moment of inertia of the body. This is the second moment of area in two dimensions.
     * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
     * @method setInertia
     * @param body
     * @param inertia
     */
    static setInertia(body: IBody, inertia: number): void;
    /**
     * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
     * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
     * They are then automatically translated to world space based on `body.position`.
     *
     * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
     * Vertices must form a convex hull. Concave vertices must be decomposed into convex parts.
     *
     * @method setVertices
     * @param body
     * @param vertices
     */
    static setVertices(body: IBody, vertices: IVertices): void;
    /**
     * Sets the parts of the `body`.
     *
     * See `body.parts` for details and requirements on how parts are used.
     *
     * See Bodies.fromVertices for a related utility.
     *
     * This function updates `body` mass, inertia and centroid based on the parts geometry.
     * Sets each `part.parent` to be this `body`.
     *
     * The convex hull is computed and set on this `body` (unless `autoHull` is `false`).
     * Automatically ensures that the first part in `body.parts` is the `body`.
     * @method setParts
     * @param body
     * @param parts
     * @param autoHull
     */
    static setParts(body: IBody, parts: IBody[], autoHull?: boolean): void;
    /**
     * Set the centre of mass of the body.
     * The `centre` is a vector in world-space unless `relative` is set, in which case it is a translation.
     * The centre of mass is the point the body rotates about and can be used to simulate non-uniform density.
     * This is equal to moving `body.position` but not the `body.vertices`.
     * Invalid if the `centre` falls outside the body's convex hull.
     * @method setCentre
     * @param body
     * @param centre
     * @param relative
     */
    static setCentre(body: IBody, centre: IVector, relative?: boolean): void;
    /**
     * Sets the position of the body. By default velocity is unchanged.
     * If `updateVelocity` is `true` then velocity is inferred from the change in position.
     * @method setPosition
     * @param body
     * @param position
     * @param updateVelocity
     */
    static setPosition(body: IBody, position: IVector, updateVelocity?: boolean): void;
    /**
     * Sets the angle of the body. By default angular velocity is unchanged.
     * If `updateVelocity` is `true` then angular velocity is inferred from the change in angle.
     * @method setAngle
     * @param body
     * @param angle
     * @param updateVelocity
     */
    static setAngle(body: IBody, angle: number, updateVelocity?: boolean): void;
    /**
     * Sets the current linear velocity of the body.
     * Affects body speed.
     * @method setVelocity
     * @param body
     * @param velocity
     */
    static setVelocity(body: IBody, velocity: IVector): void;
    /**
     * Gets the current linear velocity of the body.
     * @method getVelocity
     * @param {body} body
     * @return {vector} velocity
     */
    static getVelocity(body: IBody): IVector;
    /**
     * Gets the current linear speed of the body.
     * Equivalent to the magnitude of its velocity.
     * @method getSpeed
     * @param body
     * @return speed
     */
    static getSpeed(body: IBody): number;
    /**
     * Sets the current linear speed of the body.
     * Direction is maintained. Affects body velocity.
     * @method setSpeed
     * @param body
     * @param speed
     */
    static setSpeed(body: IBody, speed: number): void;
    /**
     * Sets the current rotational velocity of the body.
     * Affects body angular speed.
     * @method setAngularVelocity
     * @param body
     * @param velocity
     */
    static setAngularVelocity(body: IBody, velocity: number): void;
    /**
     * Gets the current rotational velocity of the body.
     * @method getAngularVelocity
     * @param body
     * @return angular velocity
     */
    static getAngularVelocity(body: IBody): number;
    /**
     * Gets the current rotational speed of the body.
     * Equivalent to the magnitude of its angular velocity.
     * @method getAngularSpeed
     * @param body
     * @return angular speed
     */
    static getAngularSpeed(body: IBody): number;
    /**
     * Sets the current rotational speed of the body.
     * Direction is maintained. Affects body angular velocity.
     * @method setAngularSpeed
     * @param body
     * @param speed
     */
    static setAngularSpeed(body: IBody, speed: number): void;
    /**
     * Moves a body by a given vector relative to its current position. By default velocity is unchanged.
     * If `updateVelocity` is `true` then velocity is inferred from the change in position.
     * @method translate
     * @param body
     * @param translation
     * @param updateVelocity
     */
    static translate(body: IBody, translation: IVector, updateVelocity?: boolean): void;
    /**
     * Rotates a body by a given angle relative to its current angle. By default angular velocity is unchanged.
     * If `updateVelocity` is `true` then angular velocity is inferred from the change in angle.
     * @method rotate
     * @param body
     * @param rotation
     * @param point
     * @param updateVelocity
     */
    static rotate(body: IBody, rotation: number, point?: IVector, updateVelocity?: boolean): void;
    /**
     * Scales the body, including updating physical properties (mass, area, axes, inertia), from a world-space point (default is body centre).
     * @method scale
     * @param body
     * @param scaleX
     * @param scaleY
     * @param point
     */
    static scale(body: IBody, scaleX: number, scaleY: number, point?: IVector): void;
    /**
     * Performs an update by integrating the equations of motion on the `body`.
     * This is applied every update by `Matter.Engine` automatically.
     * @method update
     * @param body
     * @param deltaTime
     */
    static update(body: IBody, deltaTime?: number): void;
    /**
     * Updates properties `body.velocity`, `body.speed`, `body.angularVelocity` and `body.angularSpeed` which are normalised in relation to `Body._baseDelta`.
     * @method updateVelocities
     * @param body
     */
    static updateVelocities(body: IBody): void;
    /**
     * Applies the `force` to the `body` from the force origin `position` in world-space, over a single timestep, including applying any resulting angular torque.
     *
     * Forces are useful for effects like gravity, wind or rocket thrust, but can be difficult in practice when precise control is needed. In these cases see `Body.setVelocity` and `Body.setPosition` as an alternative.
     *
     * The force from this function is only applied once for the duration of a single timestep, in other words the duration depends directly on the current engine update `delta` and the rate of calls to this function.
     *
     * Therefore to account for time, you should apply the force constantly over as many engine updates as equivalent to the intended duration.
     *
     * If all or part of the force duration is some fraction of a timestep, first multiply the force by `duration / timestep`.
     *
     * The force origin `position` in world-space must also be specified. Passing `body.position` will result in zero angular effect as the force origin would be at the centre of mass.
     *
     * The `body` will take time to accelerate under a force, the resulting effect depends on duration of the force, the body mass and other forces on the body including friction combined.
     * @method applyForce
     * @param body
     * @param position The force origin in world-space. Pass `body.position` to avoid angular torque.
     * @param force
     */
    static applyForce(body: IBody, position: IVector, force: IVector): void;
    /**
     * Returns the sums of the properties of all compound parts of the parent body.
     * @method _totalProperties
     * @param body
     */
    private static _totalProperties;
}
export {};
