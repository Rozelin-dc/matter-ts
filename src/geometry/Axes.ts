import { Vector } from './Vector'
import { Vertices } from './Vertices'

/**
 * contains methods for creating and manipulating sets of axes.
 */
export class Axes {
  public axes: Vector[] = []

  /**
   * Creates a new set of axes from the given vertices.
   * @param vertices
   * @return A new axes from the given vertices
   */
  constructor(vertices: Vertices) {
    const record: Record<string, Vector> = {}
    // find the unique axes, using edge normal gradients
    for (let i = 0; i < vertices.vertices.length; i++) {
      const j = (i + 1) % vertices.vertices.length
      const normal = new Vector(
        vertices.vertices[j].vector.y - vertices.vertices[i].vector.y,
        vertices.vertices[i].vector.x - vertices.vertices[j].vector.x
      ).normalize()
      const gradient = normal.y === 0 ? Infinity : normal.x / normal.y

      record[gradient.toFixed(3).toString()] = normal
    }
    this.axes = Object.values(record)
  }

  /**
   * Rotates a set of axes by the given angle.
   * @param angle
   */
  public rotate(angle: number) {
    if (angle === 0) {
      return
    }

    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    for (const axis of this.axes) {
      const xx = axis.x * cos - axis.y * sin
      axis.y = axis.x * sin + axis.y * cos
      axis.x = xx
    }
  }
}
