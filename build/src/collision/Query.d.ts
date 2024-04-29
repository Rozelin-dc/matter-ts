import { IBody } from '../body/Body';
import { IBounds } from '../geometry/Bounds';
import { IVector } from '../geometry/Vector';
import { ICollision } from './Collision';
/**
 * The `Matter.Query` module contains methods for performing collision queries.
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Query {
    /**
     * Returns a list of collisions between `body` and `bodies`.
     * @method collides
     * @param body
     * @param bodies
     * @return Collisions
     */
    static collides(body: IBody, bodies: IBody[]): ICollision[];
    /**
     * Casts a ray segment against a set of bodies and returns all collisions, ray width is optional. Intersection points are not provided.
     * @method ray
     * @param bodies
     * @param startPoint
     * @param endPoint
     * @param rayWidth
     * @return Collisions
     */
    static ray(bodies: IBody[], startPoint: IVector, endPoint: IVector, rayWidth?: number): ICollision[];
    /**
     * Returns all bodies whose bounds are inside (or outside if set) the given set of bounds, from the given set of bodies.
     * @method region
     * @param bodies
     * @param bounds
     * @param outside
     * @return The bodies matching the query
     */
    static region(bodies: IBody[], bounds: IBounds, outside?: boolean): IBody[];
    /**
     * Returns all bodies whose vertices contain the given point, from the given set of bodies.
     * @method point
     * @param bodies
     * @param point
     * @return The bodies matching the query
     */
    static point(bodies: IBody[], point: IVector): IBody[];
}
