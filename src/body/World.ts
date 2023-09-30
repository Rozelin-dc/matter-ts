import Composite from './Composite'

/**
 * This module has now been replaced by `Matter.Composite`.
 *
 * All usage should be migrated to the equivalent functions found on `Matter.Composite`.
 * For example `World.add(world, body)` now becomes `Composite.add(world, body)`.
 *
 * The property `world.gravity` has been moved to `engine.gravity`.
 *
 * For back-compatibility purposes this module will remain as a direct alias to `Matter.Composite` in the short term during migration.
 * Eventually this alias module will be marked as deprecated and then later removed in a future release.
 */
export default class World {
  /**
   * See above, aliases for back compatibility only
   */
  public static create = Composite.create
  public static add = Composite.add
  public static remove = Composite.remove
  public static clear = Composite.clear
  public static addComposite = Composite.addComposite
  public static addBody = Composite.addBody
  public static addConstraint = Composite.addConstraint
}
