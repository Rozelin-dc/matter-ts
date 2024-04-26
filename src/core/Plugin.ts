import Common from './Common'

export interface IPlugin {
  name: string
  version: string
  for: string
  uses: string[]
  install: Function
  _warned?: boolean
}

export interface ParsedVersion {
  isRange: boolean
  version: string
  range: string
  operator: string
  major: number
  minor: number
  patch: number
  parts: number[]
  prerelease: string
  number: number
}

type Dependency =
  | { name: string; range: string }
  | { name: string; version: string }
  | string

/**
 * contains functions for registering and installing plugins on modules.
 */
export default class Plugin {
  protected static _registry: Record<string, IPlugin> = {}

  /**
   * Registers a plugin object so it can be resolved later by name.
   * @param plugin The plugin to register.
   * @return The plugin.
   */
  public static register<T>(plugin: T): T {
    if (!Plugin.isPlugin(plugin)) {
      Common.warn(
        'Plugin.register:',
        JSON.stringify(plugin),
        'does not implement all required fields.'
      )
      return plugin
    }

    if (plugin.name in Plugin._registry) {
      const registered = Plugin._registry[plugin.name]
      const pluginVersion = Plugin.versionParse(plugin.version).number
      const registeredVersion = Plugin.versionParse(registered.version).number

      if (pluginVersion > registeredVersion) {
        Common.warn(
          'Plugin.register:',
          Plugin.toString(registered),
          'was upgraded to',
          Plugin.toString(plugin)
        )
        Plugin._registry[plugin.name] = plugin
      } else if (pluginVersion < registeredVersion) {
        Common.warn(
          'Plugin.register:',
          Plugin.toString(registered),
          'can not be downgraded to',
          Plugin.toString(plugin)
        )
      } else if (plugin !== registered) {
        Common.warn(
          'Plugin.register:',
          Plugin.toString(plugin),
          'is already registered to different plugin object'
        )
      }
    } else {
      Plugin._registry[plugin.name] = plugin
    }

    return plugin
  }

  /**
   * Resolves a dependency to a plugin object from the registry if it exists.
   * The `dependency` may contain a version, but only the name matters when resolving.
   * @param dependency The dependency.
   * @return The plugin if resolved, otherwise `undefined`.
   */
  public static resolve(dependency: string): IPlugin {
    return Plugin._registry[Plugin.dependencyParse(dependency).name]
  }

  /**
   * Returns a pretty printed plugin name and version.
   * @param plugin The plugin.
   * @return Pretty printed plugin name and version.
   */
  public static toString(plugin: IPlugin | string): string {
    return typeof plugin === 'string'
      ? plugin
      : (plugin.name || 'anonymous') + '@' + plugin.version
  }

  /**
   * Returns `true` if the object meets the minimum standard to be considered a plugin.
   * This means it must define the following properties:
   * - `name`
   * - `version`
   * - `install`
   * @param obj The obj to test.
   * @return `true` if the object can be considered a plugin otherwise `false`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isPlugin(obj: any): obj is IPlugin {
    return obj && 'name' in obj && 'version' in obj && 'install' in obj
  }

  /**
   * Returns `true` if a plugin with the given `name` been installed on `module`.
   * @param m The module.
   * @param name The plugin name.
   * @return `true` if a plugin with the given `name` been installed on `module`, otherwise `false`.
   */
  public static isUsed<T extends { used: string[] }>(
    m: T,
    name: string
  ): boolean {
    return m.used.indexOf(name) > -1
  }

  /**
   * Returns `true` if `plugin.for` is applicable to `module` by comparing against `module.name` and `module.version`.
   * If `plugin.for` is not specified then it is assumed to be applicable.
   * The value of `plugin.for` is a string of the format `'module-name'` or `'module-name@version'`.
   * @param plugin The plugin.
   * @param m The module.
   * @return `true` if `plugin.for` is applicable to `module`, otherwise `false`.
   */
  public static isFor(
    plugin: IPlugin,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    m: { name?: string | undefined; [_: string]: any }
  ): boolean {
    const parsed = Plugin.dependencyParse(plugin.for)
    return (
      !plugin.for ||
      (m.name === parsed.name &&
        Plugin.versionSatisfies(m.version, parsed.range))
    )
  }

  /**
   * Installs the plugins by calling `plugin.install` on each plugin specified in `plugins` if passed, otherwise `module.uses`.
   * For installing plugins on `Matter` see the convenience function `Matter.use`.
   * Plugins may be specified either by their name or a reference to the plugin object.
   * Plugins themselves may specify further dependencies, but each plugin is installed only once.
   * Order is important, a topological sort is performed to find the best resulting order of installation.
   * This sorting attempts to satisfy every dependency's requested ordering, but may not be exact in all cases.
   * This function logs the resulting status of each dependency in the console, along with any warnings.
   * - A green tick ✅ indicates a dependency was resolved and installed.
   * - An orange diamond 🔶 indicates a dependency was resolved but a warning was thrown for it or one if its dependencies.
   * - A red cross ❌ indicates a dependency could not be resolved.
   * Avoid calling this function multiple times on the same module unless you intend to manually control installation order.
   * @param m The module install plugins on.
   * @param [plugins=module.uses] {} The plugins to install on module (optional, defaults to `module.uses`).
   */
  public static use<T extends IPlugin | string>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    m: { uses?: T[]; [_: string]: any },
    plugins: T[]
  ): void {
    m.uses = (m.uses || []).concat(plugins || [])

    if (m.uses.length === 0) {
      Common.warn(
        'Plugin.use:',
        JSON.stringify(m),
        'does not specify any dependencies to install.'
      )
      return
    }

    const dependencies = Plugin.dependencies(m as Dependency)
    const sortedDependencies = Common.topologicalSort(dependencies).map(
      (d) => `${d}`
    )
    const status = []

    for (const d of sortedDependencies) {
      if (d === m.name) {
        continue
      }

      const plugin = Plugin.resolve(d)

      if (!plugin) {
        status.push('❌ ' + d)
        continue
      }

      if ('used' in m && Plugin.isUsed(m as { used: string[] }, plugin.name)) {
        continue
      }

      if (!Plugin.isFor(plugin, m)) {
        Common.warn(
          'Plugin.use:',
          Plugin.toString(plugin),
          'is for',
          plugin.for,
          'but installed on',
          JSON.stringify(m) + '.'
        )
        plugin._warned = true
      }

      if (plugin.install) {
        plugin.install(m)
      } else {
        Common.warn(
          'Plugin.use:',
          Plugin.toString(plugin),
          'does not specify an install function.'
        )
        plugin._warned = true
      }

      if (plugin._warned) {
        status.push('🔶 ' + Plugin.toString(plugin))
        delete plugin._warned
      } else {
        status.push('✅ ' + Plugin.toString(plugin))
      }

      m.used.push(plugin.name)
    }

    if (status.length > 0) {
      Common.info(status.join('  '))
    }
  }

  /**
   * Recursively finds all of a module's dependencies and returns a flat dependency graph.
   * @param m The module.
   * @return A dependency graph.
   */
  public static dependencies(
    m: Dependency,
    tracked?: { [_: string]: string[] }
  ): { [_: string]: string[] } {
    const parsedBase = Plugin.dependencyParse(m)
    const name = parsedBase.name

    tracked = tracked || {}

    if (name in tracked) {
      return tracked
    }

    const plugin = typeof m === 'string' ? Plugin.resolve(m) : (m as IPlugin)

    tracked[name] = (plugin.uses || []).map((dependency) => {
      if (Plugin.isPlugin(dependency)) {
        Plugin.register(dependency)
      }

      const parsed = Plugin.dependencyParse(dependency)
      const resolved = Plugin.resolve(dependency)

      if (
        resolved &&
        !Plugin.versionSatisfies(resolved.version, parsed.range)
      ) {
        Common.warn(
          'Plugin.dependencies:',
          Plugin.toString(resolved),
          'does not satisfy',
          JSON.stringify(parsed),
          'used by',
          JSON.stringify(parsedBase) + '.'
        )

        resolved._warned = true
        plugin._warned = true
      } else if (!resolved) {
        Common.warn(
          'Plugin.dependencies:',
          Plugin.toString(dependency),
          'used by',
          JSON.stringify(parsedBase),
          'could not be resolved.'
        )

        plugin._warned = true
      }

      return parsed.name
    })

    for (const t of tracked[name]) {
      Plugin.dependencies(t, tracked)
    }

    return tracked
  }

  /**
   * Parses a dependency string into its components.
   * The `dependency` is a string of the format `'module-name'` or `'module-name@version'`.
   * See documentation for `Plugin.versionParse` for a description of the format.
   * This function can also handle dependencies that are already resolved (e.g. a module object).
   * @param dependency The dependency of the format `'module-name'` or `'module-name@version'`.
   * @return The dependency parsed into its components.
   */
  public static dependencyParse(dependency: Dependency): {
    name: string
    range: string
  } {
    if (typeof dependency === 'string') {
      const pattern = /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/

      if (!pattern.test(dependency)) {
        Common.warn(
          'Plugin.dependencyParse:',
          dependency,
          'is not a valid dependency string.'
        )
      }

      return {
        name: dependency.split('@')[0],
        range: dependency.split('@')[1] || '*',
      }
    }

    let range = ''
    if ('range' in dependency) {
      range = dependency.range
    } else if ('version' in dependency) {
      range = dependency.version
    }

    return {
      name: dependency.name,
      range,
    }
  }

  /**
   * Parses a version string into its components.
   * Versions are strictly of the format `x.y.z` (as in [semver](http://semver.org/)).
   * Versions may optionally have a prerelease tag in the format `x.y.z-alpha`.
   * Ranges are a strict subset of [npm ranges](https://docs.npmjs.com/misc/semver#advanced-range-syntax).
   * Only the following range types are supported:
   * - Tilde ranges e.g. `~1.2.3`
   * - Caret ranges e.g. `^1.2.3`
   * - Greater than ranges e.g. `>1.2.3`
   * - Greater than or equal ranges e.g. `>=1.2.3`
   * - Exact version e.g. `1.2.3`
   * - Any version `*`
   * @param range The version string.
   * @return The version range parsed into its components.
   */
  public static versionParse(range: string): ParsedVersion {
    const pattern =
      /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/

    if (!pattern.test(range)) {
      Common.warn(
        'Plugin.versionParse:',
        range,
        'is not a valid version or range.'
      )
    }

    const parts = pattern.exec(range)
    if (!parts) {
      return {
        isRange: false,
        version: '0',
        range: range,
        operator: '',
        major: 0,
        minor: 0,
        patch: 0,
        parts: [0, 0, 0],
        prerelease: '',
        number: 0 * 1e8 + 0 * 1e4 + 0,
      }
    }

    const major = Number(parts[4])
    const minor = Number(parts[5])
    const patch = Number(parts[6])

    return {
      isRange: Boolean(parts[1] || parts[2]),
      version: parts[3],
      range: range,
      operator: parts[1] || parts[2] || '',
      major: major,
      minor: minor,
      patch: patch,
      parts: [major, minor, patch],
      prerelease: parts[7],
      number: major * 1e8 + minor * 1e4 + patch,
    }
  }

  /**
   * Returns `true` if `version` satisfies the given `range`.
   * See documentation for `Plugin.versionParse` for a description of the format.
   * If a version or range is not specified, then any version (`*`) is assumed to satisfy.
   * @param version The version string.
   * @param range The range string.
   * @return `true` if `version` satisfies `range`, otherwise `false`.
   */
  public static versionSatisfies(version: string, range: string): boolean {
    range = range || '*'

    const r = Plugin.versionParse(range)
    const v = Plugin.versionParse(version)

    if (r.isRange) {
      if (r.operator === '*' || version === '*') {
        return true
      }

      if (r.operator === '>') {
        return v.number > r.number
      }

      if (r.operator === '>=') {
        return v.number >= r.number
      }

      if (r.operator === '~') {
        return v.major === r.major && v.minor === r.minor && v.patch >= r.patch
      }

      if (r.operator === '^') {
        if (r.major > 0) {
          return v.major === r.major && v.number >= r.number
        }

        if (r.minor > 0) {
          return v.minor === r.minor && v.patch >= r.patch
        }

        return v.patch === r.patch
      }
    }

    return version === range || version === '*'
  }
}
