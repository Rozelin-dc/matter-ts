import Composite from './Composite';
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
    static create: typeof Composite.create;
    static add: typeof Composite.add;
    static remove: typeof Composite.remove;
    static clear: typeof Composite.clear;
    static addComposite: typeof Composite.addComposite;
    static addBody: typeof Composite.addBody;
    static addConstraint: typeof Composite.addConstraint;
}
