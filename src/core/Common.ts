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
 * contains utility functions that are common to all modules.
 */
export class Common {
  protected static _baseDelta = 1000 / 60
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

  public static nextId() {
    return this._nextId++
  }

  public static random(min: number = 1, max: number = 1) {
    return min + this._seededRandom() * (max - min)
  }

  protected static _seededRandom() {
    // https://en.wikipedia.org/wiki/Linear_congruential_generator
    this._seed = (this._seed * 9301 + 49297) % 233280
    return this._seed / 233280
  }

  public static colorToNumber(colorString: `#${string}`) {
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
  public static clamp(value: number, min: number, max: number) {
    if (value < min) {
      return min
    }
    if (value > max) {
      return max
    }
    return value
  }

  /**
   * Randomly chooses a value from a list with equal probability.
   * The function uses a seeded random generator.
   * @param choices
   * @return A random choice object from the array
   */
  public static choose<T>(choices: T[]) {
    return choices[Math.floor(Common.random() * choices.length)]
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
  ) {
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
  ) {
    const parts = path.split('.').slice(begin, end)
    this.get(obj, path, 0, -1)[parts[parts.length - 1] as keyof T] = val
    return val
  }

  /**
   * Shows a `console.log` message only if the current `Common.logLevel` allows it.
   * The message will be prefixed with 'matter-ts' to make it easily identifiable.
   * @param params The objects to log.
   */
  public static log(...params: string[]) {
    if (
      this.logLevel === LogLevel.Debug ||
      this.logLevel === LogLevel.Info ||
      this.logLevel === LogLevel.Warn
    ) {
      console.log.apply(console, ['matter-ts:'].concat(params))
    }
  }

  /**
   * Shows a `console.info` message only if the current `Common.logLevel` allows it.
   * The message will be prefixed with 'matter-ts' to make it easily identifiable.
   * @param params The objects to log.
   */
  public static info(...params: string[]) {
    if (this.logLevel === LogLevel.Debug || this.logLevel === LogLevel.Info) {
      console.info.apply(console, ['matter-ts:'].concat(params))
    }
  }

  /**
   * Shows a `console.warn` message only if the current `Common.logLevel` allows it.
   * The message will be prefixed with 'matter-js' to make it easily identifiable.
   * @param params The objects to log.
   */
  public static warn(...params: string[]) {
    if (
      this.logLevel === LogLevel.Debug ||
      this.logLevel === LogLevel.Info ||
      this.logLevel === LogLevel.Warn
    ) {
      console.warn.apply(console, ['matter-ts:'].concat(params))
    }
  }

  /**
   * Uses `Common.warn` to log the given message one time only.
   * @param params The objects to log.
   */
  public static warnOnce(...params: string[]) {
    const message = params.join(' ')
    if (!this._warnedOnce[message]) {
      this.warn(message)
      this._warnedOnce[message] = true
    }
  }

  /**
   * Takes a directed graph and returns the partially ordered set of vertices in topological order.
   * Circular dependencies are allowed.
   * @param graph
   * @return Partially ordered set of vertices in topological order.
   */
  public static topologicalSort<T extends Record<any, any[]>>(graph: T) {
    // https://github.com/mgechev/javascript-algorithms
    // Copyright (c) Minko Gechev (MIT license)
    // Modifications: tidy formatting and naming
    const result: (keyof T)[] = []
    const visited = {} as Record<keyof T, boolean>
    const temp = {} as Record<keyof T, boolean>

    for (const node in graph) {
      if (!visited[node] && !temp[node]) {
        this._topologicalSort(node, visited, temp, graph, result)
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
  ) {
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
    return this.set(
      base,
      path,
      this.chain(
        func,
        this.get(base, path) as unknown as Function
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
  ) {
    return this.set(
      base,
      path,
      this.chain(
        this.get(base, path) as unknown as Function,
        func
      ) as T[keyof T]
    )
  }

  /**
   * Provide the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module to enable
   * concave vertex decomposition support when using `Bodies.fromVertices` e.g. `Common.setDecomp(require('poly-decomp'))`.
   * @param decomp The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module.
   */
  public static setDecomp(decomp: any) {
    this._decomp = decomp
  }

  /**
   * Returns the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module provided through `Common.setDecomp`,
   * otherwise returns the global `decomp` if set.
   * @return The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module if provided.
   */
  public static getDecomp() {
    // get user provided decomp if set
    let decomp = this._decomp

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
