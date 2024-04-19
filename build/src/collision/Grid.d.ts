import { IBody } from '../body/Body';
import { DeepPartial } from '../core/Common';
import { IEngine } from '../core/Engine';
export interface IGrid {
    buckets: Record<string, IBody[]>;
    pairs: Record<string, BodyPair>;
    pairsList: BodyPair[];
    /**
     * The width of a single grid bucket.
     * @default 48
     */
    bucketWidth: number;
    /**
     * The height of a single grid bucket.
     * @default 48
     */
    bucketHeight: number;
}
type BodyPair = [IBody, IBody, number];
export interface IRegion {
    id: string;
    startCol: number;
    endCol: number;
    startRow: number;
    endRow: number;
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
    static create(options?: DeepPartial<IGrid>): IGrid;
    /**
     * Updates the grid.
     * @deprecated replaced by Matter.Detector
     * @method update
     * @param grid
     * @param bodies
     * @param engine
     * @param forceUpdate
     */
    static update(grid: IGrid, bodies: IBody[], engine: IEngine, forceUpdate: boolean): void;
    /**
     * Clears the grid.
     * @deprecated replaced by Matter.Detector
     * @method clear
     * @param grid
     */
    static clear(grid: IGrid): void;
    /**
     * Finds the union of two regions.
     * @method _regionUnion
     * @deprecated replaced by Matter.Detector
     * @param regionA
     * @param regionB
     * @return region
     */
    protected static _regionUnion(regionA: IRegion, regionB: IRegion): IRegion;
    /**
     * Gets the region a given body falls in for a given grid.
     * @method _getRegion
     * @deprecated replaced by Matter.Detector
     * @param grid
     * @param body
     * @return region
     */
    protected static _getRegion(grid: IGrid, body: IBody): IRegion;
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
    protected static _createRegion(startCol: number, endCol: number, startRow: number, endRow: number): IRegion;
    /**
     * Gets the bucket id at the given position.
     * @method _getBucketId
     * @deprecated replaced by Matter.Detector
     * @param column
     * @param row
     * @return bucket id
     */
    protected static _getBucketId(column: number, row: number): string;
    /**
     * Creates a bucket.
     * @method _createBucket
     * @deprecated replaced by Matter.Detector
     * @param buckets
     * @param bucketId
     * @return bucket
     */
    protected static _createBucket(buckets: Record<string, IBody[]>, bucketId: string): IBody[];
    /**
     * Adds a body to a bucket.
     * @method _bucketAddBody
     * @deprecated replaced by Matter.Detector
     * @param grid
     * @param bucket
     * @param body
     */
    protected static _bucketAddBody(grid: IGrid, bucket: IBody[], body: IBody): void;
    /**
     * Removes a body from a bucket.
     * @method _bucketRemoveBody
     * @deprecated replaced by Matter.Detector
     * @param grid
     * @param bucket
     * @param body
     */
    protected static _bucketRemoveBody(grid: IGrid, bucket: IBody[], body: IBody): void;
    /**
     * Generates a list of the active pairs in the grid.
     * @method _createActivePairsList
     * @deprecated replaced by Matter.Detector
     * @param grid
     * @return pairs
     */
    protected static _createActivePairsList(grid: IGrid): BodyPair[];
}
export {};
