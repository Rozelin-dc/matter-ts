export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

interface IWindow extends Window {
  decomp: any
}
declare const window: IWindow

interface IGlobal extends NodeJS.Global {
  decomp: any
}
declare const global: IGlobal

enum LogLevel {
  None,
  Debug,
  Info,
  Warn,
  Error,
}

/**
 * The `Matter.Common` module contains utility functions that are common to all modules.
 */
export default class Common {
  public static _baseDelta = 1000 / 60
  protected static _nextId = 0
  protected static _seed = 0
  protected static _nowStartTime = +new Date()
  protected static _warnedOnce: Record<string, boolean> = {}
  protected static _decomp = null

  /**
   * The console logging level to use, where each level includes all levels above and excludes the levels below.
   * The default level is 'debug' which shows all console messages.
   */
  public static logLevel: LogLevel = LogLevel.Debug

  public static nextId(): number {
    return Common._nextId++
  }

  /**
   * Returns the current timestamp since the time origin (e.g. from page load).
   * The result is in milliseconds and will use high-resolution timing if available.
   * @method now
   * @return the current timestamp in milliseconds
   */
  public static now(): number {
    if (typeof window !== 'undefined' && window.performance) {
      if (window.performance.now) {
        return window.performance.now()
      }
    }

    if (Date.now) {
      return Date.now()
    }

    const date = new Date()
    return +date - Common._nowStartTime
  }

  public static random(min: number = 1, max: number = 1): number {
    return min + Common._seededRandom() * (max - min)
  }

  protected static _seededRandom(): number {
    // https://en.wikipedia.org/wiki/Linear_congruential_generator
    Common._seed = (Common._seed * 9301 + 49297) % 233280
    return Common._seed / 233280
  }

  public static colorToNumber(colorString: `${'#' | ''}${string}`): number {
    let code = colorString.replace('#', '')

    if (code.length == 3) {
      code =
        code.charAt(0) +
        code.charAt(0) +
        code.charAt(1) +
        code.charAt(1) +
        code.charAt(2) +
        code.charAt(2)
    }

    return parseInt(code, 16)
  }

  /**
   * Returns the given value clamped between a minimum and maximum value.
   * @param value
   * @param min
   * @param max
   * @return The value clamped between min and max inclusive
   */
  public static clamp(value: number, min: number, max: number): number {
    if (value < min) {
      return min
    }
    if (value > max) {
      return max
    }
    return value
  }

  /**
   * Returns the sign of the given value.
   * @method sign
   * @param value
   * @return -1 if negative, +1 if 0 or positive
   */
  public static sign(value: number): 1 | -1 {
    return value < 0 ? -1 : 1
  }

  /**
   * Shuffles the given array in-place.
   * The function uses a seeded random generator.
   * @param array
   * @return array shuffled randomly
   */
  public static shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Common.random() * (i + 1))
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }

  /**
   * Randomly chooses a value from a list with equal probability.
   * The function uses a seeded random generator.
   * @param choices
   * @return A random choice object from the array
   */
  public static choose<T>(choices: T[]): T {
    return choices[Math.floor(Common.random() * choices.length)]
  }

  /**
   * Returns true if the object is an array.
   * @method isArray
   * @param obj
   * @return True if the object is an array, otherwise false
   */
  public static isArray<T>(obj: T | T[]): obj is T[] {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  /**
   * Returns true if the object is a HTMLElement, otherwise false.
   * @method isElement
   * @param obj
   * @return True if the object is a HTMLElement, otherwise false
   */
  public static isElement(obj: any): obj is HTMLElement {
    if (typeof HTMLElement !== 'undefined') {
      return obj instanceof HTMLElement
    }

    return !!(obj && obj.nodeType && obj.nodeName)
  }

  /**
   * Gets a value from `base` relative to the `path` string.
   * @param obj The base object
   * @param path The path relative to `base`, e.g. 'Foo.Bar.baz'
   * @param begin Path slice begin
   * @param end Path slice end
   * @return The object at the given path
   */
  public static get<T extends Record<string, any>>(
    obj: T,
    path: string,
    begin?: number,
    end?: number
  ): T {
    const pathArray = path.split('.').slice(begin, end)
    for (const part of pathArray) {
      obj = obj[part]
    }
    return obj
  }

  /**
   * Sets a value on `base` relative to the given `path` string.
   * @param obj The base object
   * @param path The path relative to `base`, e.g. 'Foo.Bar.baz'
   * @param val The value to set
   * @param begin Path slice begin
   * @param end Path slice end
   * @return Pass through `val` for chaining
   */
  public static set<T extends Record<string, any>>(
    obj: T,
    path: string,
    val: T[keyof T],
    begin?: number,
    end?: number
  ): T[keyof T] {
    const parts = path.split('.').slice(begin, end)
    Common.get(obj, path, 0, -1)[parts[parts.length - 1] as keyof T] = val
    return val
  }

  /**
   * Extends the object in the first argument using the object in the second argument.
   * @param obj
   * @param deep
   * @return obj extended
   */
  public static extend<T extends Object, E extends Object = T>(
    obj: T & Partial<E>,
    deep?: boolean | E,
    ..._params: E[]
  ): T & E {
    let argsStart: number
    let deepClone: boolean

    if (typeof deep === 'boolean') {
      argsStart = 2
      deepClone = deep
    } else {
      argsStart = 1
      deepClone = true
    }

    for (let i = argsStart; i < arguments.length; i++) {
      const source: E = arguments[i]
      if (source) {
        for (const prop in source) {
          const value = source[prop]
          if (deepClone && value && typeof value === 'object') {
            if (!obj[prop] || typeof obj[prop] === 'object') {
              obj[prop] = (obj[prop] || {}) as (T & Partial<E>)[Extract<
                keyof E,
                string
              >]
              Common.extend(obj[prop] as any, deepClone, value)
            } else {
              obj[prop] = value as unknown as (T & Partial<E>)[Extract<
                keyof E,
                string
              >]
            }
          } else {
            obj[prop] = value as unknown as (T & Partial<E>)[Extract<
              keyof E,
              string
            >]
          }
        }
      }
    }

    return obj as T & E
  }

  /**
   * Creates a new clone of the object, if deep is true references will also be cloned.
   * @param obj
   * @param deep
   * @return obj cloned
   */
  public static clone<T extends Object>(obj: T, deep?: boolean): T {
    return Common.extend<{}, T>({}, deep, obj)
  }

  /**
   * Shows a `console.log` message only if the current `Common.logLevel` allows it.
   * The message will be prefixed with 'matter-ts' to make it easily identifiable.
   * @param params The objects to log.
   */
  public static log(...params: string[]): void {
    if (
      Common.logLevel === LogLevel.Debug ||
      Common.logLevel === LogLevel.Info ||
      Common.logLevel === LogLevel.Warn
    ) {
      console.log.apply(console, ['matter-ts:'].concat(params))
    }
  }

  /**
   * Shows a deprecated console warning when the function on the given object is called.
   * The target function will be replaced with a new function that first shows the warning
   * and then calls the original function.
   * @param obj The object or module
   * @param name The property name of the function on obj
   * @param warning The one-time message to show if the function is called
   */
  public static deprecated<T extends Record<string, Function>>(
    obj: T,
    prop: keyof T,
    warning: string
  ): void {
    obj[prop] = Common.chain(() => {
      Common.warnOnce('🔅 deprecated 🔅', warning)
    }, obj[prop]) as T[keyof T]
  }

  /**
   * Shows a `console.info` message only if the current `Common.logLevel` allows it.
   * The message will be prefixed with 'matter-ts' to make it easily identifiable.
   * @param params The objects to log.
   */
  public static info(...params: string[]): void {
    if (
      Common.logLevel === LogLevel.Debug ||
      Common.logLevel === LogLevel.Info
    ) {
      console.info.apply(console, ['matter-ts:'].concat(params))
    }
  }

  /**
   * Shows a `console.warn` message only if the current `Common.logLevel` allows it.
   * The message will be prefixed with 'matter-js' to make it easily identifiable.
   * @param params The objects to log.
   */
  public static warn(...params: string[]): void {
    if (
      Common.logLevel === LogLevel.Debug ||
      Common.logLevel === LogLevel.Info ||
      Common.logLevel === LogLevel.Warn
    ) {
      console.warn.apply(console, ['matter-ts:'].concat(params))
    }
  }

  /**
   * Uses `Common.warn` to log the given message one time only.
   * @param params The objects to log.
   */
  public static warnOnce(...params: string[]): void {
    const message = params.join(' ')
    if (!Common._warnedOnce[message]) {
      Common.warn(message)
      Common._warnedOnce[message] = true
    }
  }

  /**
   * Takes a directed graph and returns the partially ordered set of vertices in topological order.
   * Circular dependencies are allowed.
   * @param graph
   * @return Partially ordered set of vertices in topological order.
   */
  public static topologicalSort<T extends Record<any, any[]>>(
    graph: T
  ): (keyof T)[] {
    // https://github.com/mgechev/javascript-algorithms
    // Copyright (c) Minko Gechev (MIT license)
    // Modifications: tidy formatting and naming
    const result: (keyof T)[] = []
    const visited = {} as Record<keyof T, boolean>
    const temp = {} as Record<keyof T, boolean>

    for (const node in graph) {
      if (!visited[node] && !temp[node]) {
        Common._topologicalSort(node, visited, temp, graph, result)
      }
    }

    return result
  }

  protected static _topologicalSort<T extends Record<any, any[]>>(
    node: keyof T,
    visited: Record<keyof T, boolean>,
    temp: Record<keyof T, boolean>,
    graph: T,
    result: (keyof T)[]
  ): void {
    const neighbors = graph[node] || []
    temp[node] = true

    for (const neighbor of neighbors) {
      if (temp[neighbor]) {
        // skip circular dependencies
        continue
      }

      if (!visited[neighbor]) {
        Common._topologicalSort(neighbor, visited, temp, graph, result)
      }
    }

    temp[node] = false
    visited[node] = true

    result.push(node)
  }

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
  public static chain(...params: Function[]): Function {
    const funcs: any[] = []

    for (const func of params) {
      if ('_chained' in func) {
        // flatten already chained functions
        funcs.push.apply(funcs, func._chained as any[])
      } else {
        funcs.push(func)
      }
    }

    const chain = function () {
      // https://github.com/GoogleChrome/devtools-docs/issues/53#issuecomment-51941358
      let lastResult: any
      const args = new Array(arguments.length)

      for (var i = 0, l = arguments.length; i < l; i++) {
        args[i] = arguments[i]
      }

      for (i = 0; i < funcs.length; i += 1) {
        const result: any = funcs[i].apply(lastResult, args)

        if (typeof result !== 'undefined') {
          lastResult = result
        }
      }

      return lastResult
    }

    chain._chained = funcs

    return chain
  }

  /**
   * Chains a function to excute before the original function on the given `path` relative to `base`.
   * See also docs for `Common.chain`.
   * @param base The base object
   * @param path The path relative to `base`
   * @param func The function to chain before the original
   * @return The chained function that replaced the original
   */
  public static chainPathBefore<T extends Record<string, any>>(
    base: T,
    path: string,
    func: Function
  ): Function {
    return Common.set(
      base,
      path,
      Common.chain(
        func,
        Common.get(base, path) as unknown as Function
      ) as T[keyof T]
    )
  }

  /**
   * Chains a function to excute after the original function on the given `path` relative to `base`.
   * See also docs for `Common.chain`.
   * @param base The base object
   * @param path The path relative to `base`
   * @param func The function to chain after the original
   * @return The chained function that replaced the original
   */
  public static chainPathAfter<T extends Record<string, any>>(
    base: T,
    path: string,
    func: Function
  ): T[keyof T] {
    return Common.set(
      base,
      path,
      Common.chain(
        Common.get(base, path) as unknown as Function,
        func
      ) as T[keyof T]
    )
  }

  /**
   * Provide the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module to enable
   * concave vertex decomposition support when using `Bodies.fromVertices` e.g. `Common.setDecomp(require('poly-decomp'))`.
   * @param decomp The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module.
   */
  public static setDecomp(decomp: any): void {
    Common._decomp = decomp
  }

  /**
   * Returns the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module provided through `Common.setDecomp`,
   * otherwise returns the global `decomp` if set.
   * @return The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module if provided.
   */
  public static getDecomp(): any {
    // get user provided decomp if set
    let decomp = Common._decomp

    try {
      // otherwise from window global
      if (!decomp && typeof window !== 'undefined') {
        decomp = window.decomp
      }

      // otherwise from node global
      if (!decomp && typeof global !== 'undefined') {
        decomp = global.decomp
      }
    } catch (e) {
      // decomp not available
      decomp = null
    }

    return decomp
  }
}
