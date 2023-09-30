import { IVertex } from '../geometry/Vertices'

export interface IContact {
  vertex: IVertex
  normalImpulse: number
  tangentImpulse: number
}

/**
 * The `Matter.Contact` module contains methods for creating and manipulating collision contacts.
 */
export default class Contact {
  /**
   * Creates a new contact.
   * @method create
   * @param {vertex} vertex
   * @return {contact} A new contact
   */
  public static create(vertex: IVertex): IContact {
    return {
      vertex: vertex,
      normalImpulse: 0,
      tangentImpulse: 0,
    }
  }
}
