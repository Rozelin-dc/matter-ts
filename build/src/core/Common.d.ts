export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
export type ObjectLike<T = any> = Record<string | number, T>;
type Decomp = any;
declare enum LogLevel {
    None = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4
}
/**
 * The `Matter.Common` module contains utility functions that are common to all modules.
 */
export default class Common {
    static _baseDelta: number;
    protected static _nextId: number;
    protected static _seed: number;
    protected static _nowStartTime: number;
    protected static _warnedOnce: Record<string, boolean>;
    protected static _decomp: null;
    /**
     * The console logging level to use, where each level includes all levels above and excludes the levels below.
     * The default level is 'debug' which shows all console messages.
     */
    static logLevel: LogLevel;
    static nextId(): number;
    /**
     * Returns the current timestamp since the time origin (e.g. from page load).
     * The result is in milliseconds and will use high-resolution timing if available.
     * @method now
     * @return the current timestamp in milliseconds
     */
    static now(): number;
    static random(min?: number, max?: number): number;
    protected static _seededRandom(): number;
    static colorToNumber(colorString: `${'#' | ''}${string}`): number;
    /**
     * Returns the given value clamped between a minimum and maximum value.
     * @param value
     * @param min
     * @param max
     * @return The value clamped between min and max inclusive
     */
    static clamp(value: number, min: number, max: number): number;
    /**
     * Returns the sign of the given value.
     * @method sign
     * @param value
     * @return -1 if negative, +1 if 0 or positive
     */
    static sign(value: number): 1 | -1;
    /**
     * Shuffles the given array in-place.
     * The function uses a seeded random generator.
     * @param array
     * @return array shuffled randomly
     */
    static shuffle<T>(array: T[]): T[];
    /**
     * Randomly chooses a value from a list with equal probability.
     * The function uses a seeded random generator.
     * @param choices
     * @return A random choice object from the array
     */
    static choose<T>(choices: T[]): T;
    /**
     * Returns true if the object is an array.
     * @method isArray
     * @param obj
     * @return True if the object is an array, otherwise false
     */
    static isArray(obj: unknown): obj is any[];
    /**
     * Returns true if the object is an Object.
     * @method isObject
     * @param value
     * @return True if the object is an Object, otherwise false
     */
    static isObject(value: unknown): value is ObjectLike;
    /**
     * Returns true if the object is a HTMLElement, otherwise false.
     * @method isElement
     * @param obj
     * @return True if the object is a HTMLElement, otherwise false
     */
    static isElement(obj: any): obj is HTMLElement;
    /**
     * Returns the list of keys for the given object.
     * @method keys
     * @param obj
     * @return keys
     */
    static keys(obj: Record<string, unknown>): string[];
    /**
     * Returns the list of values for the given object.
     * @method values
     * @param obj
     * @return Array of the objects property values
     */
    static values<T>(obj: ObjectLike<T>): T[];
    /**
     * Gets a value from `base` relative to the `path` string.
     * @param obj The base object
     * @param path The path relative to `base`, e.g. 'Foo.Bar.baz'
     * @param begin Path slice begin
     * @param end Path slice end
     * @return The object at the given path
     */
    static get<T extends Record<string, any>>(obj: T, path: string, begin?: number, end?: number): T;
    /**
     * Sets a value on `base` relative to the given `path` string.
     * @param obj The base object
     * @param path The path relative to `base`, e.g. 'Foo.Bar.baz'
     * @param val The value to set
     * @param begin Path slice begin
     * @param end Path slice end
     * @return Pass through `val` for chaining
     */
    static set<T extends Record<string, any>>(obj: T, path: string, val: T[keyof T], begin?: number, end?: number): T[keyof T];
    /**
     * Extends the object in the first argument using the object in the second argument.
     * @param obj
     * @param deep
     * @return obj extended
     */
    static extend<T extends ObjectLike, E extends ObjectLike>(obj: T, deep?: boolean | E, ...params: E[]): T & E;
    static extend<T extends ObjectLike>(obj: DeepPartial<T>, deep?: boolean | T, ...params: T[]): T;
    static extend<T extends ObjectLike>(obj: T, deep?: boolean | DeepPartial<T>, ...params: DeepPartial<T>[]): T;
    /**
     * Creates a new clone of the object, if deep is true references will also be cloned.
     * @param obj
     * @param deep
     * @return obj cloned
     */
    static clone<T extends ObjectLike>(obj: T, deep?: boolean): T;
    /**
     * Shows a `console.log` message only if the current `Common.logLevel` allows it.
     * The message will be prefixed with 'matter-ts' to make it easily identifiable.
     * @param params The objects to log.
     */
    static log(...params: string[]): void;
    /**
     * Shows a deprecated console warning when the function on the given object is called.
     * The target function will be replaced with a new function that first shows the warning
     * and then calls the original function.
     * @param obj The object or module
     * @param name The property name of the function on obj
     * @param warning The one-time message to show if the function is called
     */
    static deprecated<T extends ObjectLike<Function>>(obj: T, prop: keyof T, warning: string): void;
    /**
     * Shows a `console.info` message only if the current `Common.logLevel` allows it.
     * The message will be prefixed with 'matter-ts' to make it easily identifiable.
     * @param params The objects to log.
     */
    static info(...params: string[]): void;
    /**
     * Shows a `console.warn` message only if the current `Common.logLevel` allows it.
     * The message will be prefixed with 'matter-js' to make it easily identifiable.
     * @param params The objects to log.
     */
    static warn(...params: string[]): void;
    /**
     * Uses `Common.warn` to log the given message one time only.
     * @param params The objects to log.
     */
    static warnOnce(...params: string[]): void;
    /**
     * Takes a directed graph and returns the partially ordered set of vertices in topological order.
     * Circular dependencies are allowed.
     * @param graph
     * @return Partially ordered set of vertices in topological order.
     */
    static topologicalSort<T extends ObjectLike<any[]>>(graph: T): (keyof T)[];
    protected static _topologicalSort<T extends ObjectLike<any[]>>(node: keyof T, visited: Record<keyof T, boolean>, temp: Record<keyof T, boolean>, graph: T, result: (keyof T)[]): void;
    /**
     * Takes _n_ functions as arguments and returns a new function that calls them in order.
     * The arguments applied when calling the new function will also be applied to every function passed.
     * The value of `this` refers to the last value returned in the chain that was not `undefined`.
     * Therefore if a passed function does not return a value, the previously returned value is maintained.
     * After all passed functions have been called the new function returns the last returned value (if any).
     * If any of the passed functions are a chain, then the chain will be flattened.
     * @param params The functions to chain.
     * @return A new function that calls the passed functions in order.
     */
    static chain(...params: Function[]): Function;
    /**
     * Chains a function to excute before the original function on the given `path` relative to `base`.
     * See also docs for `Common.chain`.
     * @param base The base object
     * @param path The path relative to `base`
     * @param func The function to chain before the original
     * @return The chained function that replaced the original
     */
    static chainPathBefore<T extends Record<string, any>>(base: T, path: string, func: Function): Function;
    /**
     * Chains a function to excute after the original function on the given `path` relative to `base`.
     * See also docs for `Common.chain`.
     * @param base The base object
     * @param path The path relative to `base`
     * @param func The function to chain after the original
     * @return The chained function that replaced the original
     */
    static chainPathAfter<T extends Record<string, any>>(base: T, path: string, func: Function): T[keyof T];
    /**
     * Provide the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module to enable
     * concave vertex decomposition support when using `Bodies.fromVertices` e.g. `Common.setDecomp(require('poly-decomp'))`.
     * @param decomp The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module.
     */
    static setDecomp(decomp: Decomp): void;
    /**
     * Returns the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module provided through `Common.setDecomp`,
     * otherwise returns the global `decomp` if set.
     * @return The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module if provided.
     */
    static getDecomp(): Decomp;
}
export {};
