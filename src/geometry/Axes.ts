import Vector, { IVector } from './Vector'
import { IVertices } from './Vertices'

export type IAxes = IVector[]

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
  public static fromVertices(vertices: IVertices): IAxes {
    const axes: Record<string, IVector> = {}

    // find the unique axes, using edge normal gradients
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length
      const normal = Vector.normalise({
        x: vertices[j].y - vertices[i].y,
        y: vertices[i].x - vertices[j].x,
      })
      const gradient = normal.y === 0 ? Infinity : normal.x / normal.y

      // limit precision
      const gradientStr = gradient.toFixed(3).toString()
      axes[gradientStr] = normal
    }

    return Object.values(axes)
  }

  /**
   * Rotates a set of axes by the given angle.
   * @method rotate
   * @param axes
   * @param angle
   */
  public static rotate(axes: IAxes, angle: number): void {
    if (angle === 0) {
      return
    }

    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    for (const axis of axes) {
      const xx = axis.x * cos - axis.y * sin
      axis.y = axis.x * sin + axis.y * cos
      axis.x = xx
    }
  }
}
