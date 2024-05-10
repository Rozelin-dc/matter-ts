import { IVector } from './Vector';
export type IAxes = IVector[];
/**
 * The `Matter.Axes` module contains methods for creating and manipulating sets of axes.
 */
export default class Axes {
    /**
     * Creates a new set of axes from the given vertices.
     * @method fromVertices
     * @param vertices
     * @return A new axes from the given vertices
     */
    static fromVertices(vertices: IVector[]): IAxes;
    /**
     * Rotates a set of axes by the given angle.
     * @method rotate
     * @param axes
     * @param angle
     */
    static rotate(axes: IAxes, angle: number): void;
}
