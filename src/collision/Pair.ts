import { IBody } from '../body/Body'
import { ICollision } from './Collision'
import Contact, { IContact } from './Contact'

export interface IPair {
  id: string
  bodyA: IBody
  bodyB: IBody
  collision: ICollision
  contacts: IContact[]
  activeContacts: IContact[]
  separation: number
  isActive: boolean
  confirmedActive: boolean
  isSensor: boolean
  timeCreated: number
  timeUpdated: number
  inverseMass: number
  friction: number
  frictionStatic: number
  restitution: number
  slop: number
}

/**
 * The `Matter.Pair` module contains methods for creating and manipulating collision pairs.
 */
export default class Pair {
  /**
   * Creates a pair.
   * @method create
   * @param collision
   * @param timestamp
   * @return A new pair
   */
  public static create(collision: ICollision, timestamp: number): IPair {
    const bodyA = collision.bodyA
    const bodyB = collision.bodyB

    const pair: IPair = {
      id: Pair.id(bodyA, bodyB),
      bodyA: bodyA,
      bodyB: bodyB,
      collision: collision,
      contacts: [],
      activeContacts: [],
      separation: 0,
      isActive: true,
      confirmedActive: true,
      isSensor: bodyA.isSensor || bodyB.isSensor,
      timeCreated: timestamp,
      timeUpdated: timestamp,
      inverseMass: 0,
      friction: 0,
      frictionStatic: 0,
      restitution: 0,
      slop: 0,
    }

    Pair.update(pair, collision, timestamp)

    return pair
  }

  /**
   * Updates a pair given a collision.
   * @method update
   * @param pair
   * @param collision
   * @param timestamp
   */
  public static update(
    pair: IPair,
    collision: ICollision,
    timestamp: number
  ): void {
    const contacts = pair.contacts
    const supports = collision.supports
    const activeContacts = pair.activeContacts
    const parentA = collision.parentA
    const parentB = collision.parentB
    const parentAVerticesLength = parentA.vertices.length

    pair.isActive = true
    pair.timeUpdated = timestamp
    pair.collision = collision
    pair.separation = collision.depth
    pair.inverseMass = parentA.inverseMass + parentB.inverseMass
    pair.friction =
      parentA.friction < parentB.friction ? parentA.friction : parentB.friction
    pair.frictionStatic =
      parentA.frictionStatic > parentB.frictionStatic
        ? parentA.frictionStatic
        : parentB.frictionStatic
    pair.restitution =
      parentA.restitution > parentB.restitution
        ? parentA.restitution
        : parentB.restitution
    pair.slop = parentA.slop > parentB.slop ? parentA.slop : parentB.slop

    collision.pair = pair
    activeContacts.length = 0

    for (const support of supports) {
      const contactId =
        support.body === parentA
          ? support.index
          : parentAVerticesLength + support.index
      const contact = contacts[contactId]

      if (contact) {
        activeContacts.push(contact)
      } else {
        activeContacts.push((contacts[contactId] = Contact.create(support)))
      }
    }
  }

  /**
   * Set a pair as active or inactive.
   * @method setActive
   * @param pair
   * @param isActive
   * @param timestamp
   */
  public static setActive(
    pair: IPair,
    isActive: boolean,
    timestamp: number
  ): void {
    if (isActive) {
      pair.isActive = true
      pair.timeUpdated = timestamp
    } else {
      pair.isActive = false
      pair.activeContacts.length = 0
    }
  }

  /**
   * Get the id for the given pair.
   * @method id
   * @param bodyA
   * @param bodyB
   * @return Unique pairId
   */
  public static id(bodyA: IBody, bodyB: IBody): string {
    if (bodyA.id < bodyB.id) {
      return 'A' + bodyA.id + 'B' + bodyB.id
    } else {
      return 'A' + bodyB.id + 'B' + bodyA.id
    }
  }
}
