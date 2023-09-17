import { Common } from '../core/Common'
import { Vector } from './Vector'

/**
 * contains methods for creating and manipulating sets of vertices.
 * A set of vertices is an array of `Matter.Vector` with additional indexing properties inserted by `Vertices.create`.
 * A `Matter.Body` maintains a set of vertices to represent the shape of the object (its convex hull).
 *
 * See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
 */
export class Vertices {
  public vertices: {
    vector: Vector
    index: number
    body: any
    isInternal: boolean
  }[] = []

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
   */
  constructor(path: string, body: any)
  constructor(points: Vector[], body: any)
  constructor(p: Vector[] | string, body: any) {
    let points: Vector[] = []
    if (typeof p === 'string') {
      const pathPattern = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/gi
      p.replace(pathPattern, (match, x, y) => {
        points.push(new Vector(parseFloat(x), parseFloat(y)))
        return match
      })
    } else {
      points = p
    }

    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const vertex = {
        vector: point,
        index: i,
        body: body,
        isInternal: false,
      }

      this.vertices.push(vertex)
    }
  }

  /**
   * Returns the centre (centroid) of the set of vertices.
   * @return The centre point
   */
  public centre() {
    const area = this.area(true)
    const sum: Vector[] = []

    for (let i = 0; i < this.vertices.length; i++) {
      const j = (i + 1) % this.vertices.length
      const cross = Vector.cross(
        this.vertices[i].vector,
        this.vertices[j].vector
      )
      const temp = Vector.add(
        this.vertices[i].vector,
        this.vertices[j].vector
      ).mult(cross)
      sum.push(temp)
    }

    return Vector.add(...sum).div(6 * area)
  }

  /**
   * Returns the average (mean) of the set of vertices.
   * @return The average point
   */
  public mean() {
    const sum = Vector.add(...this.vertices.map((v) => v.vector))
    return sum.div(this.vertices.length)
  }

  /**
   * Returns the area of the set of vertices.
   * @method area
   * @param {vertices} vertices
   * @param {bool} signed
   * @return {number} The area
   */
  public area(signed: boolean) {
    let area = 0
    let j = this.vertices.length - 1

    for (var i = 0; i < this.vertices.length; i++) {
      area +=
        (this.vertices[j].vector.x - this.vertices[i].vector.x) *
        (this.vertices[j].vector.y + this.vertices[i].vector.y)
      j = i
    }

    if (signed) {
      return area / 2
    }
    return Math.abs(area) / 2
  }

  /**
   * Returns the moment of inertia (second moment of area) of the set of vertices given the total mass.
   * @param mass
   * @return The polygon's moment of inertia
   */
  public inertia(mass: number) {
    let numerator = 0
    let denominator = 0

    // find the polygon's moment of inertia, using second moment of area
    // from equations at http://www.physicsforums.com/showthread.php?t=25293
    for (let i = 0; i < this.vertices.length; i++) {
      const j = (i + 1) % this.vertices.length
      const cross = Math.abs(
        Vector.cross(this.vertices[j].vector, this.vertices[i].vector)
      )
      numerator +=
        cross *
        (Vector.dot(this.vertices[j].vector, this.vertices[j].vector) +
          Vector.dot(this.vertices[j].vector, this.vertices[i].vector) +
          Vector.dot(this.vertices[i].vector, this.vertices[i].vector))
      denominator += cross
    }

    return (mass / 6) * (numerator / denominator)
  }

  /**
   * Translates the set of vertices in-place.
   * @param vector
   * @param scalar
   */
  public translate(vector: Vector, scalar = 1) {
    const translateX = vector.x * scalar
    const translateY = vector.y * scalar

    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].vector.x += translateX
      this.vertices[i].vector.y += translateY
    }
  }

  /**
   * Rotates the set of vertices in-place.
   * @param angle
   * @param point
   */
  public rotate(angle: number, point: Vector) {
    if (angle === 0) return

    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const pointX = point.x
    const pointY = point.y

    for (let i = 0; i < this.vertices.length; i++) {
      const vertex = this.vertices[i].vector
      const dx = vertex.x - pointX
      const dy = vertex.y - pointY
      this.vertices[i].vector.x = pointX + (dx * cos - dy * sin)
      this.vertices[i].vector.y = pointY + (dx * sin + dy * cos)
    }
  }

  /**
   * Returns `true` if the `point` is inside the set of `vertices`.
   * @param {vector} point
   * @return {boolean} True if the vertices contains point, otherwise false
   */
  public contains(point: Vector) {
    const pointX = point.x
    const pointY = point.y
    let vertex = this.vertices[this.vertices.length - 1].vector

    for (const v of this.vertices) {
      if (
        (pointX - vertex.x) * (v.vector.y - vertex.y) +
          (pointY - vertex.y) * (vertex.x - v.vector.x) >
        0
      ) {
        return false
      }

      vertex = v.vector
    }

    return true
  }

  /**
   * Scales the vertices from a point (default is centre) in-place.
   * @method scale
   * @param {vertices} vertices
   * @param {number} scaleX
   * @param {number} scaleY
   * @param {vector} point
   */
  public scale(scaleX: number, scaleY: number, point?: Vector) {
    if (scaleX === 1 && scaleY === 1) {
      return
    }

    if (!point) {
      point = this.centre()
    }

    for (let i = 0; i < this.vertices.length; i++) {
      const delta = Vector.sub(this.vertices[i].vector, point)
      this.vertices[i].vector.x = point.x + delta.x * scaleX
      this.vertices[i].vector.y = point.y + delta.y * scaleY
    }
  }

  /**
   * Chamfers a set of vertices by giving them rounded corners, returns a new set of vertices.
   * The radius parameter is a single number or an array to specify the radius for each vertex.
   * @param radius
   * @param quality
   * @param qualityMin
   * @param qualityMax
   * @return A new Vertices
   */
  public chamfer(
    radius: number[] | number,
    quality: number = -1,
    qualityMin: number = 2,
    qualityMax: number = 14
  ) {
    if (typeof radius === 'number') {
      radius = [radius]
    } else {
      radius = radius || [8]
    }

    const newVerticesVectors: Vector[] = []

    for (let i = 0; i < this.vertices.length; i++) {
      const prevVertex =
        this.vertices[i - 1 >= 0 ? i - 1 : this.vertices.length - 1].vector
      const vertex = this.vertices[i].vector
      const nextVertex = this.vertices[(i + 1) % this.vertices.length].vector
      const currentRadius = radius[i < radius.length ? i : radius.length - 1]

      if (currentRadius === 0) {
        newVerticesVectors.push(vertex)
        continue
      }

      const prevNormal = new Vector(
        vertex.y - prevVertex.y,
        prevVertex.x - vertex.x
      ).normalize()
      const nextNormal = new Vector(
        nextVertex.y - vertex.y,
        vertex.x - nextVertex.x
      ).normalize()

      const diagonalRadius = Math.sqrt(2 * Math.pow(currentRadius, 2))
      const radiusVector = prevNormal.mult(currentRadius)
      const midNormal = Vector.add(prevNormal, nextNormal).mult(0.5).normalize()
      const scaledVertex = Vector.sub(vertex, midNormal.mult(diagonalRadius))

      let precision = quality
      if (quality === -1) {
        // automatically decide precision
        precision = Math.pow(currentRadius, 0.32) * 1.75
      }
      precision = Common.clamp(precision, qualityMin, qualityMax)

      // use an even value for precision, more likely to reduce axes by using symmetry
      if (precision % 2 === 1) precision += 1

      const alpha = Math.acos(Vector.dot(prevNormal, nextNormal))
      const theta = alpha / precision

      for (let j = 0; j < precision; j++) {
        newVerticesVectors.push(
          Vector.add(radiusVector.rotate(theta * j), scaledVertex)
        )
      }
    }

    return new Vertices(newVerticesVectors, this.vertices[0].body)
  }

  /**
   * Sorts the input vertices into clockwise order in place.
   */
  public clockwiseSort() {
    const centre = this.mean()
    this.vertices.sort(function (vertexA, vertexB) {
      return (
        Vector.angle(centre, vertexA.vector) -
        Vector.angle(centre, vertexB.vector)
      )
    })
  }

  /**
   * Returns true if the vertices form a convex shape (vertices must be in clockwise order).
   * @return `true` if the `vertices` are convex, `false` if not (or `null` if not computable).
   */
  public isConvex() {
    // http://paulbourke.net/geometry/polygonmesh/
    // Copyright (c) Paul Bourke (use permitted)
    let flag = 0

    if (this.vertices.length < 3) return null

    for (let i = 0; i < this.vertices.length; i++) {
      const j = (i + 1) % this.vertices.length
      const k = (i + 2) % this.vertices.length
      let z =
        (this.vertices[j].vector.x - this.vertices[i].vector.x) *
        (this.vertices[k].vector.y - this.vertices[j].vector.y)
      z -=
        (this.vertices[j].vector.y - this.vertices[i].vector.y) *
        (this.vertices[k].vector.x - this.vertices[j].vector.x)

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
   * @return vertices
   */
  public hull() {
    // http://geomalgorithms.com/a10-_hull-1.html
    const upper: Vertices['vertices'] = []
    const lower: Vertices['vertices'] = []

    // sort vertices on x-axis (y-axis for ties)
    this.vertices = this.vertices.slice(0)
    this.vertices.sort(function (vertexA, vertexB) {
      const dx = vertexA.vector.x - vertexB.vector.x
      return dx !== 0 ? dx : vertexA.vector.y - vertexB.vector.y
    })

    // build lower hull
    for (const vertex of this.vertices) {
      while (
        lower.length >= 2 &&
        Vector.cross3(
          lower[lower.length - 2].vector,
          lower[lower.length - 1].vector,
          vertex.vector
        ) <= 0
      ) {
        lower.pop()
      }
      lower.push(vertex)
    }

    // build upper hull
    for (let i = this.vertices.length - 1; i >= 0; i -= 1) {
      const vertex = this.vertices[i]
      while (
        upper.length >= 2 &&
        Vector.cross3(
          upper[upper.length - 2].vector,
          upper[upper.length - 1].vector,
          vertex.vector
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

    const v = upper.concat(lower)
    const newVertices = new Vertices([], this.vertices[0].body)
    newVertices.vertices = v

    return newVertices
  }
}
