import { IBody } from '../body/Body';
import { DeepPartial } from '../core/Common';
import { ICollision } from './Collision';
import { IPairs } from './Pairs';
export interface IDetector {
    bodies: IBody[];
    pairs: IPairs | null;
}
export interface ICollisionFilter {
    category: number;
    mask: number;
    group: number;
}
/**
 * The `Matter.Detector` module contains methods for efficiently detecting collisions between a list of bodies using a broadphase algorithm.
 */
export default class Detector {
    /**
     * Creates a new collision detector.
     * @method create
     * @param options
     * @return A new collision detector
     */
    static create(options?: DeepPartial<IDetector>): IDetector;
    /**
     * Sets the list of bodies in the detector.
     * @method setBodies
     * @param detector
     * @param bodies
     */
    static setBodies(detector: IDetector, bodies: IBody[]): void;
    /**
     * Clears the detector including its list of bodies.
     * @method clear
     * @param detector
     */
    static clear(detector: IDetector): void;
    /**
     * Efficiently finds all collisions among all the bodies in `detector.bodies` using a broadphase algorithm.
     *
     * _Note:_ The specific ordering of collisions returned is not guaranteed between releases and may change for performance reasons.
     * If a specific ordering is required then apply a sort to the resulting array.
     * @method collisions
     * @param detector
     * @return collisions
     */
    static collisions(detector: IDetector): ICollision[];
    /**
     * Returns `true` if both supplied collision filters will allow a collision to occur.
     * See `body.collisionFilter` for more information.
     * @method canCollide
     * @param filterA
     * @param filterB
     * @return `true` if collision can occur
     */
    static canCollide(filterA: ICollisionFilter, filterB: ICollisionFilter): boolean;
    /**
     * The comparison function used in the broadphase algorithm.
     * Returns the signed delta of the bodies bounds on the x-axis.
     * @method _sortCompare
     * @param bodyA
     * @param bodyB
     * @return The signed delta used for sorting
     */
    protected static _compareBoundsX(bodyA: IBody, bodyB: IBody): number;
}
