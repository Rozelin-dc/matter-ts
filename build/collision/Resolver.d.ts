import { IBody } from '../body/Body';
import { IPair } from './Pair';
/**
 * The `Matter.Resolver` module contains methods for resolving collision pairs.
 */
export default class Resolver {
    protected static _restingThresh: number;
    protected static _restingThreshTangent: number;
    protected static _positionDampen: number;
    protected static _positionWarming: number;
    protected static _frictionNormalMultiplier: number;
    protected static _frictionMaxStatic: number;
    /**
     * Prepare pairs for position solving.
     * @method preSolvePosition
     * @param pairs
     */
    static preSolvePosition(pairs: IPair[]): void;
    /**
     * Find a solution for pair positions.
     * @method solvePosition
     * @param pairs
     * @param delta
     * @param damping
     */
    static solvePosition(pairs: IPair[], delta: number, damping?: number): void;
    /**
     * Apply position resolution.
     * @method postSolvePosition
     * @param bodies
     */
    static postSolvePosition(bodies: IBody[]): void;
    /**
     * Prepare pairs for velocity solving.
     * @method preSolveVelocity
     * @param pairs
     */
    static preSolveVelocity(pairs: IPair[]): void;
    /**
     * Find a solution for pair velocities.
     * @method solveVelocity
     * @param pairs
     * @param delta
     */
    static solveVelocity(pairs: IPair[], delta: number): void;
}
