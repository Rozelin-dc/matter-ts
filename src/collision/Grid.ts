import { IBody } from '../body/Body'
import Common, { DeepPartial } from '../core/Common'
import Pair from './Pair'

export interface IGrid {
  buckets: Record<string, IBody[]>
  pairs: Record<string, BodyPair>
  pairsList: any[]

  /**
   * The width of a single grid bucket.
   * @default 48
   */
  bucketWidth: number

  /**
   * The height of a single grid bucket.
   * @default 48
   */
  bucketHeight: number
}

type BodyPair = [IBody, IBody, number]

export interface IRegion {
  id: string
  startCol: number
  endCol: number
  startRow: number
  endRow: number
}

/**
 * This module has now been replaced by `Matter.Detector`.
 *
 * All usage should be migrated to `Matter.Detector` or another alternative.
 * For back-compatibility purposes this module will remain for a short term and then later removed in a future release.
 *
 * The `Matter.Grid` module contains methods for creating and manipulating collision broadphase grid structures.
 *
 * @deprecated
 */
export default class Grid {
  /**
   * Creates a new grid.
   * @deprecated replaced by Matter.Detector
   * @method create
   * @param options
   * @return A new grid
   */
  public static create(options: DeepPartial<IGrid> = {}): IGrid {
    const defaults: IGrid = {
      buckets: {},
      pairs: {},
      pairsList: [],
      bucketWidth: 48,
      bucketHeight: 48,
    }

    return Common.extend(defaults, options)
  }

  /**
   * Updates the grid.
   * @deprecated replaced by Matter.Detector
   * @method update
   * @param grid
   * @param bodies
   * @param engine
   * @param forceUpdate
   */
  public static update(
    grid: IGrid,
    bodies: IBody[],
    engine: any,
    forceUpdate: boolean
  ): void {
    let gridChanged = false

    const world = engine.world
    const buckets = grid.buckets

    for (const body of bodies) {
      if (body.isSleeping && !forceUpdate) {
        continue
      }

      // temporary back compatibility bounds check
      if (
        world.bounds &&
        (body.bounds.max.x < world.bounds.min.x ||
          body.bounds.min.x > world.bounds.max.x ||
          body.bounds.max.y < world.bounds.min.y ||
          body.bounds.min.y > world.bounds.max.y)
      ) {
        continue
      }

      const newRegion = Grid._getRegion(grid, body)

      // if the body has changed grid region
      if (!body.region || newRegion.id !== body.region.id || forceUpdate) {
        if (!body.region || forceUpdate) {
          body.region = newRegion
        }

        const union = Grid._regionUnion(newRegion, body.region)

        // update grid buckets affected by region change
        // iterate over the union of both regions
        for (let col = union.startCol; col <= union.endCol; col++) {
          for (let row = union.startRow; row <= union.endRow; row++) {
            const bucketId = Grid._getBucketId(col, row)
            let bucket = buckets[bucketId]

            const isInsideNewRegion =
              col >= newRegion.startCol &&
              col <= newRegion.endCol &&
              row >= newRegion.startRow &&
              row <= newRegion.endRow
            const isInsideOldRegion =
              col >= body.region.startCol &&
              col <= body.region.endCol &&
              row >= body.region.startRow &&
              row <= body.region.endRow

            // remove from old region buckets
            if (!isInsideNewRegion && isInsideOldRegion) {
              if (isInsideOldRegion) {
                if (bucket) {
                  Grid._bucketRemoveBody(grid, bucket, body)
                }
              }
            }

            // add to new region buckets
            if (
              body.region === newRegion ||
              (isInsideNewRegion && !isInsideOldRegion) ||
              forceUpdate
            ) {
              if (!bucket) {
                bucket = Grid._createBucket(buckets, bucketId)
              }
              Grid._bucketAddBody(grid, bucket, body)
            }
          }
        }

        // set the new region
        body.region = newRegion

        // flag changes so we can update pairs
        gridChanged = true
      }
    }

    // update pairs list only if pairs changed (i.e. a body changed region)
    if (gridChanged) {
      grid.pairsList = Grid._createActivePairsList(grid)
    }
  }

  /**
   * Clears the grid.
   * @deprecated replaced by Matter.Detector
   * @method clear
   * @param grid
   */
  public static clear(grid: IGrid): void {
    grid.buckets = {}
    grid.pairs = {}
    grid.pairsList = []
  }

  /**
   * Finds the union of two regions.
   * @method _regionUnion
   * @deprecated replaced by Matter.Detector
   * @param regionA
   * @param regionB
   * @return region
   */
  protected static _regionUnion(regionA: IRegion, regionB: IRegion): IRegion {
    const startCol = Math.min(regionA.startCol, regionB.startCol)
    const endCol = Math.max(regionA.endCol, regionB.endCol)
    const startRow = Math.min(regionA.startRow, regionB.startRow)
    const endRow = Math.max(regionA.endRow, regionB.endRow)

    return Grid._createRegion(startCol, endCol, startRow, endRow)
  }

  /**
   * Gets the region a given body falls in for a given grid.
   * @method _getRegion
   * @deprecated replaced by Matter.Detector
   * @param grid
   * @param body
   * @return region
   */
  protected static _getRegion(grid: IGrid, body: IBody): IRegion {
    const bounds = body.bounds
    const startCol = Math.floor(bounds.min.x / grid.bucketWidth)
    const endCol = Math.floor(bounds.max.x / grid.bucketWidth)
    const startRow = Math.floor(bounds.min.y / grid.bucketHeight)
    const endRow = Math.floor(bounds.max.y / grid.bucketHeight)

    return Grid._createRegion(startCol, endCol, startRow, endRow)
  }

  /**
   * Creates a region.
   * @method _createRegion
   * @deprecated replaced by Matter.Detector
   * @param startCol
   * @param endCol
   * @param startRow
   * @param endRow
   * @return region
   */
  protected static _createRegion(
    startCol: number,
    endCol: number,
    startRow: number,
    endRow: number
  ): IRegion {
    return {
      id: startCol + ',' + endCol + ',' + startRow + ',' + endRow,
      startCol: startCol,
      endCol: endCol,
      startRow: startRow,
      endRow: endRow,
    }
  }

  /**
   * Gets the bucket id at the given position.
   * @method _getBucketId
   * @deprecated replaced by Matter.Detector
   * @param column
   * @param row
   * @return bucket id
   */
  protected static _getBucketId(column: number, row: number): string {
    return 'C' + column + 'R' + row
  }

  /**
   * Creates a bucket.
   * @method _createBucket
   * @deprecated replaced by Matter.Detector
   * @param buckets
   * @param bucketId
   * @return bucket
   */
  protected static _createBucket(
    buckets: Record<string, IBody[]>,
    bucketId: string
  ): IBody[] {
    const bucket = (buckets[bucketId] = [])
    return bucket
  }

  /**
   * Adds a body to a bucket.
   * @method _bucketAddBody
   * @deprecated replaced by Matter.Detector
   * @param grid
   * @param bucket
   * @param body
   */
  protected static _bucketAddBody(
    grid: IGrid,
    bucket: IBody[],
    body: IBody
  ): void {
    const gridPairs = grid.pairs

    // add new pairs
    for (const bodyB of bucket) {
      if (body.id === bodyB.id || (body.isStatic && bodyB.isStatic)) {
        continue
      }

      // keep track of the number of buckets the pair exists in
      // important for Grid.update to work
      const id = Pair.id(body, bodyB)
      const pair = gridPairs[id]

      if (pair) {
        pair[2] += 1
      } else {
        gridPairs[id] = [body, bodyB, 1]
      }
    }

    // add to bodies (after pairs, otherwise pairs with self)
    bucket.push(body)
  }

  /**
   * Removes a body from a bucket.
   * @method _bucketRemoveBody
   * @deprecated replaced by Matter.Detector
   * @param grid
   * @param bucket
   * @param body
   */
  protected static _bucketRemoveBody(
    grid: IGrid,
    bucket: IBody[],
    body: IBody
  ): void {
    // remove from bucket
    bucket.splice(bucket.indexOf(body), 1)

    // update pair counts
    for (let i = 0; i < bucket.length; i++) {
      // keep track of the number of buckets the pair exists in
      // important for _createActivePairsList to work
      const pair = grid.pairs[Pair.id(body, bucket[i])]
      if (pair) {
        pair[2] -= 1
      }
    }
  }

  /**
   * Generates a list of the active pairs in the grid.
   * @method _createActivePairsList
   * @deprecated replaced by Matter.Detector
   * @param grid
   * @return pairs
   */
  protected static _createActivePairsList(grid: IGrid): BodyPair[] {
    const gridPairs = grid.pairs
    const pairKeys = Object.keys(gridPairs)
    const pairKeysLength = pairKeys.length
    const pairs: BodyPair[] = []

    // iterate over grid.pairs
    for (let k = 0; k < pairKeysLength; k++) {
      const pair = gridPairs[pairKeys[k]]

      // if pair exists in at least one bucket
      // it is a pair that needs further collision testing so push it
      if (pair[2] > 0) {
        pairs.push(pair)
      } else {
        delete gridPairs[pairKeys[k]]
      }
    }

    return pairs
  }
}

;(() => {
  Common.deprecated(
    Grid as Object as Record<string, Function>,
    'update',
    'Grid.update ➤ replaced by Matter.Detector'
  )
  Common.deprecated(
    Grid as Object as Record<string, Function>,
    'clear',
    'Grid.clear ➤ replaced by Matter.Detector'
  )
})()
