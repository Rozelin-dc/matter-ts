import { IBody } from '../body/Body'
import { IAxes } from '../geometry/Axes'
import { IVector } from '../geometry/Vector'
import Vertices, { IVertex } from '../geometry/Vertices'
import Pair, { IPair } from './Pair'
import { IPairs } from './Pairs'

export interface ICollision {
  pair: IPair | null
  collided: boolean
  body?: IBody
  bodyA: IBody
  bodyB: IBody
  parentA: IBody
  parentB: IBody
  depth: number
  normal: IVector
  tangent: IVector
  penetration: IVector
  supports: IVertex[]
}

interface IOverlap {
  overlap: number
  axis: IVector | null
}

/**
 * The `Matter.Collision` module contains methods for detecting collisions between a given pair of bodies.
 *
 * For efficient detection between a list of bodies, see `Matter.Detector` and `Matter.Query`.
 *
 * See `Matter.Engine` for collision events.
 */
export default class Collision {
  protected static _supports: IVertex[] = []

  protected static _overlapAB: IOverlap = {
    overlap: 0,
    axis: null,
  }

  protected static _overlapBA: IOverlap = {
    overlap: 0,
    axis: null,
  }

  /**
   * Creates a new collision record.
   * @method create
   * @param bodyA The first body part represented by the collision record
   * @param bodyB The second body part represented by the collision record
   * @return A new collision record
   */
  public static create(bodyA: IBody, bodyB: IBody): ICollision {
    return {
      pair: null,
      collided: false,
      bodyA: bodyA,
      bodyB: bodyB,
      parentA: bodyA.parent,
      parentB: bodyB.parent,
      depth: 0,
      normal: { x: 0, y: 0 },
      tangent: { x: 0, y: 0 },
      penetration: { x: 0, y: 0 },
      supports: [],
    }
  }

  /**
   * Detect collision between two bodies.
   * @method collides
   * @param bodyA
   * @param bodyB
   * @param pairs Optionally reuse collision records from existing pairs.
   * @return A collision record if detected, otherwise null
   */
  public static collides(
    bodyA: IBody,
    bodyB: IBody,
    pairs?: IPairs | null
  ): ICollision | null {
    Collision._overlapAxes(
      Collision._overlapAB,
      bodyA.vertices,
      bodyB.vertices,
      bodyA.axes
    )

    if (Collision._overlapAB.overlap <= 0) {
      return null
    }

    Collision._overlapAxes(
      Collision._overlapBA,
      bodyB.vertices,
      bodyA.vertices,
      bodyB.axes
    )

    if (Collision._overlapBA.overlap <= 0) {
      return null
    }

    // reuse collision records for gc efficiency
    const pair = pairs && pairs.table[Pair.id(bodyA, bodyB)]
    let collision: ICollision
    if (!pair) {
      collision = Collision.create(bodyA, bodyB)
      collision.collided = true
      collision.bodyA = bodyA.id < bodyB.id ? bodyA : bodyB
      collision.bodyB = bodyA.id < bodyB.id ? bodyB : bodyA
      collision.parentA = collision.bodyA.parent
      collision.parentB = collision.bodyB.parent
    } else {
      collision = pair.collision
    }

    bodyA = collision.bodyA
    bodyB = collision.bodyB

    let minOverlap: IOverlap

    if (Collision._overlapAB.overlap < Collision._overlapBA.overlap) {
      minOverlap = Collision._overlapAB
    } else {
      minOverlap = Collision._overlapBA
    }

    const normal = collision.normal
    const supports = collision.supports
    const minAxis = minOverlap.axis
    const minAxisX = minAxis?.x ?? NaN
    const minAxisY = minAxis?.y ?? NaN

    // ensure normal is facing away from bodyA
    if (
      minAxisX * (bodyB.position.x - bodyA.position.x) +
        minAxisY * (bodyB.position.y - bodyA.position.y) <
      0
    ) {
      normal.x = minAxisX
      normal.y = minAxisY
    } else {
      normal.x = -minAxisX
      normal.y = -minAxisY
    }

    collision.tangent.x = -normal.y
    collision.tangent.y = normal.x

    collision.depth = minOverlap.overlap

    collision.penetration.x = normal.x * collision.depth
    collision.penetration.y = normal.y * collision.depth

    // find support points, there is always either exactly one or two
    const supportsB = Collision._findSupports(bodyA, bodyB, normal, 1)
    let supportCount = 0

    // find the supports from bodyB that are inside bodyA
    if (Vertices.contains(bodyA.vertices, supportsB[0])) {
      supports[supportCount++] = supportsB[0]
    }

    if (Vertices.contains(bodyA.vertices, supportsB[1])) {
      supports[supportCount++] = supportsB[1]
    }

    // find the supports from bodyA that are inside bodyB
    if (supportCount < 2) {
      const supportsA = Collision._findSupports(bodyB, bodyA, normal, -1)

      if (Vertices.contains(bodyB.vertices, supportsA[0])) {
        supports[supportCount++] = supportsA[0]
      }

      if (supportCount < 2 && Vertices.contains(bodyB.vertices, supportsA[1])) {
        supports[supportCount++] = supportsA[1]
      }
    }

    // account for the edge case of overlapping but no vertex containment
    if (supportCount === 0) {
      supports[supportCount++] = supportsB[0]
    }

    // update supports array size
    supports.length = supportCount

    return collision
  }

  /**
   * Find the overlap between two sets of vertices.
   * @method _overlapAxes
   * @param result
   * @param verticesA
   * @param verticesB
   * @param axes
   */
  protected static _overlapAxes(
    result: IOverlap,
    verticesA: IVertex[],
    verticesB: IVertex[],
    axes: IAxes
  ): void {
    const verticesALength = verticesA.length
    const verticesBLength = verticesB.length
    const verticesAX = verticesA[0].x
    const verticesAY = verticesA[0].y
    const verticesBX = verticesB[0].x
    const verticesBY = verticesB[0].y
    const axesLength = axes.length
    let overlapMin = Number.MAX_VALUE
    let overlapAxisNumber = 0

    for (let i = 0; i < axesLength; i++) {
      const axis = axes[i]
      const axisX = axis.x
      const axisY = axis.y
      let minA = verticesAX * axisX + verticesAY * axisY
      let minB = verticesBX * axisX + verticesBY * axisY
      let maxA = minA
      let maxB = minB

      for (let j = 1; j < verticesALength; j += 1) {
        const dot = verticesA[j].x * axisX + verticesA[j].y * axisY

        if (dot > maxA) {
          maxA = dot
        } else if (dot < minA) {
          minA = dot
        }
      }

      for (let j = 1; j < verticesBLength; j += 1) {
        const dot = verticesB[j].x * axisX + verticesB[j].y * axisY

        if (dot > maxB) {
          maxB = dot
        } else if (dot < minB) {
          minB = dot
        }
      }

      const overlapAB = maxA - minB
      const overlapBA = maxB - minA
      const overlap = overlapAB < overlapBA ? overlapAB : overlapBA

      if (overlap < overlapMin) {
        overlapMin = overlap
        overlapAxisNumber = i

        if (overlap <= 0) {
          // can not be intersecting
          break
        }
      }
    }

    result.axis = axes[overlapAxisNumber]
    result.overlap = overlapMin
  }

  /**
   * Projects vertices on an axis and returns an interval.
   * @method _projectToAxis
   * @param projection
   * @param vertices
   * @param axis
   */
  protected static _projectToAxis(
    projection: { min: number; max: number },
    vertices: IVertex[],
    axis: IVector
  ): void {
    let min = vertices[0].x * axis.x + vertices[0].y * axis.y
    let max = min

    for (let i = 1; i < vertices.length; i += 1) {
      const dot = vertices[i].x * axis.x + vertices[i].y * axis.y

      if (dot > max) {
        max = dot
      } else if (dot < min) {
        min = dot
      }
    }

    projection.min = min
    projection.max = max
  }

  /**
   * Finds supporting vertices given two bodies along a given direction using hill-climbing.
   * @method _findSupports
   * @param bodyA
   * @param bodyB
   * @param normal
   * @param direction
   */
  protected static _findSupports(
    bodyA: IBody,
    bodyB: IBody,
    normal: IVector,
    direction: number
  ): IVertex[] {
    const vertices = bodyB.vertices
    const verticesLength = vertices.length
    const bodyAPositionX = bodyA.position.x
    const bodyAPositionY = bodyA.position.y
    const normalX = normal.x * direction
    const normalY = normal.y * direction
    let nearestDistance = Number.MAX_VALUE

    let vertexA = vertices[0]
    let vertexB: IVertex

    // find deepest vertex relative to the axis
    for (let j = 0; j < verticesLength; j += 1) {
      vertexB = vertices[j]
      const distance =
        normalX * (bodyAPositionX - vertexB.x) +
        normalY * (bodyAPositionY - vertexB.y)

      // convex hill-climbing
      if (distance < nearestDistance) {
        nearestDistance = distance
        vertexA = vertexB
      }
    }

    // measure next vertex
    const vertexC = vertices[(verticesLength + vertexA.index - 1) % verticesLength]
    nearestDistance =
      normalX * (bodyAPositionX - vertexC.x) +
      normalY * (bodyAPositionY - vertexC.y)

    // compare with previous vertex
    vertexB = vertices[(vertexA.index + 1) % verticesLength]
    if (
      normalX * (bodyAPositionX - vertexB.x) +
        normalY * (bodyAPositionY - vertexB.y) <
      nearestDistance
    ) {
      Collision._supports[0] = vertexA
      Collision._supports[1] = vertexB

      return Collision._supports
    }

    Collision._supports[0] = vertexA
    Collision._supports[1] = vertexC

    return Collision._supports
  }
}
