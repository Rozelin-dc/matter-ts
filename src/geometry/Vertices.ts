import Common from '../core/Common'
import { IBody } from '../body/Body'
import Vector, { IVector } from './Vector'

export interface IVertex {
  x: number
  y: number
  index: number
  body?: IBody
  isInternal: boolean
}

export type IVertices = IVertex[]

/**
 * The `Matter.Vertices` module contains methods for creating and manipulating sets of vertices.
 * A set of vertices is an array of `Matter.Vector` with additional indexing properties inserted by `Vertices.create`.
 * A `Matter.Body` maintains a set of vertices to represent the shape of the object (its convex hull).
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export default class Vertices {
  /**
   * Creates a new set of `Matter.Body` compatible vertices.
   * The `points` argument accepts an array of `Matter.Vector` points orientated around the origin `(0, 0)`, for example:
   *
   *     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
   *
   * The `Vertices.create` method returns a new array of vertices, which are similar to Matter.Vector objects,
   * but with some additional references required for efficient collision detection routines.
   *
   * Vertices must be specified in clockwise order.
   *
   * Note that the `body` argument is not optional, a `Matter.Body` reference must be provided.
   *
   * @method create
   * @param points
   * @param body
   */
  public static create(points: IVector[], body?: IBody): IVertices {
    const vertices: IVertices = []

    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const vertex = {
        x: point.x,
        y: point.y,
        index: i,
        body: body,
        isInternal: false,
      }

      vertices.push(vertex)
    }

    return vertices
  }

  /**
   * Parses a string containing ordered x y pairs separated by spaces (and optionally commas),
   * into a `Matter.Vertices` object for the given `Matter.Body`.
   * For parsing SVG paths, see `Svg.pathToVertices`.
   * @method fromPath
   * @param path
   * @param body
   * @return vertices
   */
  public static fromPath(path: string, body?: IBody): IVertices {
    const pathPattern = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/gi
    const points: IVector[] = []

    path.replace(pathPattern, (_, x, y) => {
      points.push({ x: parseFloat(x), y: parseFloat(y) })
      return ''
    })

    return Vertices.create(points, body)
  }

  /**
   * Returns the centre (centroid) of the set of vertices.
   * @method centre
   * @param vertices
   * @return The centre point
   */
  public static centre(vertices: IVertices): IVector {
    const area = Vertices.area(vertices, true)
    let centre = Vector.create(0, 0)

    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length
      const cross = Vector.cross(vertices[i], vertices[j])
      const temp = Vector.mult(Vector.add(vertices[i], vertices[j]), cross)
      centre = Vector.add(centre, temp)
    }

    return Vector.div(centre, 6 * area)
  }

  /**
   * Returns the average (mean) of the set of vertices.
   * @method mean
   * @param vertices
   * @return The average point
   */
  public static mean(vertices: IVertices): IVector {
    const average = Vector.create(0, 0)

    for (const vertex of vertices) {
      average.x += vertex.x
      average.y += vertex.y
    }

    return Vector.div(average, vertices.length)
  }

  /**
   * Returns the area of the set of vertices.
   * @method area
   * @param vertices
   * @param signed
   * @return The area
   */
  public static area(vertices: IVertices, signed?: boolean): number {
    let area = 0
    let j = vertices.length - 1

    for (let i = 0; i < vertices.length; i++) {
      area += (vertices[j].x - vertices[i].x) * (vertices[j].y + vertices[i].y)
      j = i
    }

    if (signed) {
      return area / 2
    }

    return Math.abs(area) / 2
  }

  /**
   * Returns the moment of inertia (second moment of area) of the set of vertices given the total mass.
   * @method inertia
   * @param vertices
   * @param mass
   * @return  The polygon's moment of inertia
   */
  public static inertia(vertices: IVertices, mass: number): number {
    let numerator = 0
    let denominator = 0

    // find the polygon's moment of inertia, using second moment of area
    // from equations at http://www.physicsforums.com/showthread.php?t=25293
    for (let n = 0; n < vertices.length; n++) {
      const j = (n + 1) % vertices.length
      const cross = Math.abs(Vector.cross(vertices[j], vertices[n]))
      numerator +=
        cross *
        (Vector.dot(vertices[j], vertices[j]) +
          Vector.dot(vertices[j], vertices[n]) +
          Vector.dot(vertices[n], vertices[n]))
      denominator += cross
    }

    return (mass / 6) * (numerator / denominator)
  }

  /**
   * Translates the set of vertices in-place.
   * @method translate
   * @param vertices
   * @param vector
   * @param scalar
   */
  public static translate(
    vertices: IVertices,
    vector: IVector,
    scalar: number = 1
  ): IVertices {
    const translateX = vector.x * scalar
    const translateY = vector.y * scalar

    for (let i = 0; i < vertices.length; i++) {
      vertices[i].x += translateX
      vertices[i].y += translateY
    }

    return vertices
  }

  /**
   * Rotates the set of vertices in-place.
   * @method rotate
   * @param vertices
   * @param angle
   * @param point
   */
  public static rotate(
    vertices: IVertices,
    angle: number,
    point: IVector
  ): IVertices | void {
    if (angle === 0) {
      return
    }

    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    for (const vertex of vertices) {
      const dx = vertex.x - point.x
      const dy = vertex.y - point.y
      vertex.x = point.x + (dx * cos - dy * sin)
      vertex.y = point.y + (dx * sin + dy * cos)
    }

    return vertices
  }

  /**
   * Returns `true` if the `point` is inside the set of `vertices`.
   * @method contains
   * @param vertices
   * @param point
   * @return True if the vertices contains point, otherwise false
   */
  public static contains(vertices: IVertices, point: IVector): boolean {
    let vertex = vertices[vertices.length - 1]
    let nextVertex: IVertex

    for (let i = 0; i < vertices.length; i++) {
      nextVertex = vertices[i]
      if (
        (point.x - vertex.x) * (nextVertex.y - vertex.y) +
          (point.y - vertex.y) * (vertex.x - nextVertex.x) >
        0
      ) {
        return false
      }

      vertex = nextVertex
    }

    return true
  }

  /**
   * Scales the vertices from a point (default is centre) in-place.
   * @method scale
   * @param vertices
   * @param scaleX
   * @param scaleY
   * @param point
   */
  public static scale(
    vertices: IVertices,
    scaleX: number,
    scaleY: number,
    point: IVector = Vertices.centre(vertices)
  ): IVertices {
    if (scaleX === 1 && scaleY === 1) {
      return vertices
    }

    for (let i = 0; i < vertices.length; i++) {
      const vertex = vertices[i]
      const delta = Vector.sub(vertex, point)
      vertices[i].x = point.x + delta.x * scaleX
      vertices[i].y = point.y + delta.y * scaleY
    }

    return vertices
  }

  /**
   * Chamfers a set of vertices by giving them rounded corners, returns a new set of vertices.
   * The radius parameter is a single number or an array to specify the radius for each vertex.
   * @method chamfer
   * @param vertices
   * @param radius
   * @param quality
   * @param qualityMin
   * @param qualityMax
   */
  public static chamfer(
    vertices: IVertices,
    radius: number[] | number = [8],
    quality: number = -1,
    qualityMin: number = 2,
    qualityMax: number = 14
  ): IVertices {
    if (typeof radius === 'number') {
      radius = [radius]
    }

    const newVertices: IVertices = []

    for (let i = 0; i < vertices.length; i++) {
      const prevVertex = vertices[i - 1 >= 0 ? i - 1 : vertices.length - 1]
      const vertex = vertices[i]
      const nextVertex = vertices[(i + 1) % vertices.length]
      const currentRadius = radius[i < radius.length ? i : radius.length - 1]

      if (currentRadius === 0) {
        newVertices.push(vertex)
        continue
      }

      const prevNormal = Vector.normalise({
        x: vertex.y - prevVertex.y,
        y: prevVertex.x - vertex.x,
      })
      const nextNormal = Vector.normalise({
        x: nextVertex.y - vertex.y,
        y: vertex.x - nextVertex.x,
      })

      const diagonalRadius = Math.sqrt(2 * Math.pow(currentRadius, 2))
      const radiusVector = Vector.mult(Common.clone(prevNormal), currentRadius)
      const midNormal = Vector.normalise(
        Vector.mult(Vector.add(prevNormal, nextNormal), 0.5)
      )
      const scaledVertex = Vector.sub(
        vertex,
        Vector.mult(midNormal, diagonalRadius)
      )

      let precision = quality
      if (quality === -1) {
        // automatically decide precision
        precision = Math.pow(currentRadius, 0.32) * 1.75
      }
      precision = Common.clamp(precision, qualityMin, qualityMax)

      // use an even value for precision, more likely to reduce axes by using symmetry
      if (precision % 2 === 1) {
        precision += 1
      }

      const alpha = Math.acos(Vector.dot(prevNormal, nextNormal))
      const theta = alpha / precision

      for (let j = 0; j < precision; j++) {
        newVertices.push({
          ...vertex,
          ...Vector.add(Vector.rotate(radiusVector, theta * j), scaledVertex),
        })
      }
    }

    return newVertices
  }

  /**
   * Sorts the input vertices into clockwise order in place.
   * @method clockwiseSort
   * @param vertices
   * @return vertices
   */
  public static clockwiseSort(vertices: IVertices): IVertices {
    const centre = Vertices.mean(vertices)

    vertices.sort(function (vertexA, vertexB) {
      return Vector.angle(centre, vertexA) - Vector.angle(centre, vertexB)
    })

    return vertices
  }

  /**
   * Returns true if the vertices form a convex shape (vertices must be in clockwise order).
   * @method isConvex
   * @param vertices
   * @return `true` if the `vertices` are convex, `false` if not (or `null` if not computable).
   */
  public static isConvex(vertices: IVertices): boolean | null {
    // http://paulbourke.net/geometry/polygonmesh/
    // Copyright (c) Paul Bourke (use permitted)
    let flag = 0

    if (vertices.length < 3) {
      return null
    }

    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length
      const k = (i + 2) % vertices.length
      let z = (vertices[j].x - vertices[i].x) * (vertices[k].y - vertices[j].y)
      z -= (vertices[j].y - vertices[i].y) * (vertices[k].x - vertices[j].x)

      if (z < 0) {
        flag |= 1
      } else if (z > 0) {
        flag |= 2
      }

      if (flag === 3) {
        return false
      }
    }

    if (flag !== 0) {
      return true
    } else {
      return null
    }
  }

  /**
   * Returns the convex hull of the input vertices as a new array of points.
   * @method hull
   * @param vertices
   * @return vertices
   */
  public static hull(vertices: IVertices): IVertices {
    // http://geomalgorithms.com/a10-_hull-1.html
    const upper: IVertices = []
    const lower: IVertices = []

    // sort vertices on x-axis (y-axis for ties)
    vertices = vertices.slice(0)
    vertices.sort((vertexA, vertexB) => {
      const dx = vertexA.x - vertexB.x
      return dx !== 0 ? dx : vertexA.y - vertexB.y
    })

    // build lower hull
    for (const vertex of vertices) {
      while (
        lower.length >= 2 &&
        Vector.cross3(
          lower[lower.length - 2],
          lower[lower.length - 1],
          vertex
        ) <= 0
      ) {
        lower.pop()
      }

      lower.push(vertex)
    }

    // build upper hull
    for (const vertex of vertices) {
      while (
        upper.length >= 2 &&
        Vector.cross3(
          upper[upper.length - 2],
          upper[upper.length - 1],
          vertex
        ) <= 0
      ) {
        upper.pop()
      }

      upper.push(vertex)
    }

    // concatenation of the lower and upper hulls gives the convex hull
    // omit last points because they are repeated at the beginning of the other list
    upper.pop()
    lower.pop()

    return upper.concat(lower)
  }
}
