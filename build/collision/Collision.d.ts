import { IBody } from '../body/Body';
import { IAxes } from '../geometry/Axes';
import { IVector } from '../geometry/Vector';
import { IVertices } from '../geometry/Vertices';
import { IPair } from './Pair';
import { IPairs } from './Pairs';
export interface ICollision {
    pair: IPair | null;
    collided: boolean;
    body?: IBody;
    bodyA: IBody;
    bodyB: IBody;
    parentA: IBody;
    parentB: IBody;
    depth: number;
    normal: IVector;
    tangent: IVector;
    penetration: IVector;
    supports: IVertices;
}
interface IOverlap {
    overlap: number;
    axis: IVector | null;
}
/**
 * The `Matter.Collision` module contains methods for detecting collisions between a given pair of bodies.
 *
 * For efficient detection between a list of bodies, see `Matter.Detector` and `Matter.Query`.
 *
 * See `Matter.Engine` for collision events.
 */
export default class Collision {
    protected static _supports: IVertices;
    protected static _overlapAB: IOverlap;
    protected static _overlapBA: IOverlap;
    /**
     * Creates a new collision record.
     * @method create
     * @param bodyA The first body part represented by the collision record
     * @param bodyB The second body part represented by the collision record
     * @return A new collision record
     */
    static create(bodyA: IBody, bodyB: IBody): ICollision;
    /**
     * Detect collision between two bodies.
     * @method collides
     * @param bodyA
     * @param bodyB
     * @param pairs Optionally reuse collision records from existing pairs.
     * @return A collision record if detected, otherwise null
     */
    static collides(bodyA: IBody, bodyB: IBody, pairs?: IPairs | null): ICollision | null;
    /**
     * Find the overlap between two sets of vertices.
     * @method _overlapAxes
     * @param result
     * @param verticesA
     * @param verticesB
     * @param axes
     */
    protected static _overlapAxes(result: IOverlap, verticesA: IVertices, verticesB: IVertices, axes: IAxes): void;
    /**
     * Projects vertices on an axis and returns an interval.
     * @method _projectToAxis
     * @param projection
     * @param vertices
     * @param axis
     */
    protected static _projectToAxis(projection: {
        min: number;
        max: number;
    }, vertices: IVertices, axis: IVector): void;
    /**
     * Finds supporting vertices given two bodies along a given direction using hill-climbing.
     * @method _findSupports
     * @param bodyA
     * @param bodyB
     * @param normal
     * @param direction
     */
    protected static _findSupports(bodyA: IBody, bodyB: IBody, normal: IVector, direction: number): IVertices;
}
export {};
