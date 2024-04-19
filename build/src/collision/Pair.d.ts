import { IBody } from '../body/Body';
import { ICollision } from './Collision';
import { IContact } from './Contact';
export interface IPair {
    id: string;
    bodyA: IBody;
    bodyB: IBody;
    collision: ICollision;
    contacts: IContact[];
    activeContacts: IContact[];
    separation: number;
    isActive: boolean;
    confirmedActive: boolean;
    isSensor: boolean;
    timeCreated: number;
    timeUpdated: number;
    inverseMass: number;
    friction: number;
    frictionStatic: number;
    restitution: number;
    slop: number;
}
/**
 * The `Matter.Pair` module contains methods for creating and manipulating collision pairs.
 */
export default class Pair {
    /**
     * Creates a pair.
     * @method create
     * @param collision
     * @param timestamp
     * @return A new pair
     */
    static create(collision: ICollision, timestamp: number): IPair;
    /**
     * Updates a pair given a collision.
     * @method update
     * @param pair
     * @param collision
     * @param timestamp
     */
    static update(pair: IPair, collision: ICollision, timestamp: number): void;
    /**
     * Set a pair as active or inactive.
     * @method setActive
     * @param pair
     * @param isActive
     * @param timestamp
     */
    static setActive(pair: IPair, isActive: boolean, timestamp: number): void;
    /**
     * Get the id for the given pair.
     * @method id
     * @param bodyA
     * @param bodyB
     * @return Unique pairId
     */
    static id(bodyA: IBody, bodyB: IBody): string;
}
