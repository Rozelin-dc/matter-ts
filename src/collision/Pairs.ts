import Common, { DeepPartial } from '../core/Common'
import { ICollision } from './Collision'
import Pair, { IPair } from './Pair'

export interface IPairs {
  table: Record<string, IPair>
  list: IPair[]
  collisionStart: IPair[]
  collisionActive: IPair[]
  collisionEnd: IPair[]
}

/**
 * The `Matter.Pairs` module contains methods for creating and manipulating collision pair sets.
 */
export default class Pairs {
  /**
   * Creates a new pairs structure.
   * @method create
   * @param options
   * @return A new pairs structure
   */
  public static create(options?: DeepPartial<IPairs>): IPairs {
    const defaults: IPairs = {
      table: {},
      list: [],
      collisionStart: [],
      collisionActive: [],
      collisionEnd: [],
    }
    return Common.extend(defaults, options)
  }

  /**
   * Updates pairs given a list of collisions.
   * @method update
   * @param pairs
   * @param collisions
   * @param timestamp
   */
  public static update(
    pairs: IPairs,
    collisions: ICollision[],
    timestamp: number
  ): void {
    const pairsList = pairs.list
    let pairsListLength = pairsList.length
    const pairsTable = pairs.table
    const collisionsLength = collisions.length
    const collisionStart = pairs.collisionStart
    const collisionEnd = pairs.collisionEnd
    const collisionActive = pairs.collisionActive

    // clear collision state arrays, but maintain old reference
    collisionStart.length = 0
    collisionEnd.length = 0
    collisionActive.length = 0

    for (let i = 0; i < pairsListLength; i++) {
      pairsList[i].confirmedActive = false
    }

    for (const collision of collisions) {
      let pair = collision.pair
      if (pair) {
        // pair already exists (but may or may not be active)
        if (pair.isActive) {
          // pair exists and is active
          collisionActive.push(pair)
        } else {
          // pair exists but was inactive, so a collision has just started again
          collisionStart.push(pair)
        }

        // update the pair
        Pair.update(pair, collision, timestamp)
        pair.confirmedActive = true
      } else {
        // pair did not exist, create a new pair
        pair = Pair.create(collision, timestamp)
        pairsTable[pair.id] = pair

        // push the new pair
        collisionStart.push(pair)
        pairsList.push(pair)
      }
    }

    // find pairs that are no longer active
    const removePairIndex: number[] = []
    pairsListLength = pairsList.length

    for (let i = 0; i < pairsListLength; i++) {
      const pair = pairsList[i]
      if (!pair.confirmedActive) {
        Pair.setActive(pair, false, timestamp)
        collisionEnd.push(pair)

        if (
          !pair.collision.bodyA.isSleeping &&
          !pair.collision.bodyB.isSleeping
        ) {
          removePairIndex.push(i)
        }
      }
    }

    // remove inactive pairs
    for (let i = 0; i < removePairIndex.length; i++) {
      const pairIndex = removePairIndex[i] - i
      const pair = pairsList[pairIndex]
      pairsList.splice(pairIndex, 1)
      delete pairsTable[pair.id]
    }
  }

  /**
   * Clears the given pairs structure.
   * @method clear
   * @param pairs
   * @return pairs
   */
  public static clear(pairs: IPairs): IPairs {
    pairs.table = {}
    pairs.list.length = 0
    pairs.collisionStart.length = 0
    pairs.collisionActive.length = 0
    pairs.collisionEnd.length = 0
    return pairs
  }
}
