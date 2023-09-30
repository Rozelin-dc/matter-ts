import { DeepPartial } from '../core/Common';
import { ICollision } from './Collision';
import { IPair } from './Pair';
export interface IPairs {
    table: Record<string, IPair>;
    list: IPair[];
    collisionStart: IPair[];
    collisionActive: IPair[];
    collisionEnd: IPair[];
}
/**
 * The `Matter.Pairs` module contains methods for creating and manipulating collision pair sets.
 */
export default class Pairs {
    /**
     * Creates a new pairs structure.
     * @method create
     * @param options
     * @return A new pairs structure
     */
    static create(options?: DeepPartial<IPairs>): IPairs;
    /**
     * Updates pairs given a list of collisions.
     * @method update
     * @param pairs
     * @param collisions
     * @param timestamp
     */
    static update(pairs: IPairs, collisions: ICollision[], timestamp: number): void;
    /**
     * Clears the given pairs structure.
     * @method clear
     * @param pairs
     * @return pairs
     */
    static clear(pairs: IPairs): IPairs;
}
