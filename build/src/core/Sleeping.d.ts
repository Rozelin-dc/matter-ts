import { IBody } from '../body/Body';
import { IPair } from '../collision/Pair';
/**
 * The `Matter.Sleeping` module contains methods to manage the sleeping state of bodies.
 */
export default class Sleeping {
    protected static _motionWakeThreshold: number;
    protected static _motionSleepThreshold: number;
    protected static _minBias: number;
    /**
     * Puts bodies to sleep or wakes them up depending on their motion.
     * @method update
     * @param bodies
     * @param delta
     */
    static update(bodies: IBody[], delta: number): void;
    /**
     * Given a set of colliding pairs, wakes the sleeping bodies involved.
     * @method afterCollisions
     * @param pairs
     */
    static afterCollisions(pairs: IPair[]): void;
    /**
     * Set a body as sleeping or awake.
     * @method set
     * @param body
     * @param isSleeping
     */
    static set(body: IBody, isSleeping: boolean): void;
}
