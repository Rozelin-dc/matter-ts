export interface IPlugin {
    name: string;
    version: string;
    for: string;
    uses: string[];
    install: Function;
    _warned?: boolean;
}
export interface ParsedVersion {
    isRange: boolean;
    version: string;
    range: string;
    operator: string;
    major: number;
    minor: number;
    patch: number;
    parts: number[];
    prerelease: string;
    number: number;
}
type Dependency = {
    name: string;
    range: string;
} | {
    name: string;
    version: string;
} | string;
/**
 * contains functions for registering and installing plugins on modules.
 */
export default class Plugin {
    protected static _registry: Record<string, IPlugin>;
    /**
     * Registers a plugin object so it can be resolved later by name.
     * @param plugin The plugin to register.
     * @return The plugin.
     */
    static register<T>(plugin: T): T;
    /**
     * Resolves a dependency to a plugin object from the registry if it exists.
     * The `dependency` may contain a version, but only the name matters when resolving.
     * @param dependency The dependency.
     * @return The plugin if resolved, otherwise `undefined`.
     */
    static resolve(dependency: string): IPlugin;
    /**
     * Returns a pretty printed plugin name and version.
     * @param plugin The plugin.
     * @return Pretty printed plugin name and version.
     */
    static toString(plugin: IPlugin | string): string;
    /**
     * Returns `true` if the object meets the minimum standard to be considered a plugin.
     * This means it must define the following properties:
     * - `name`
     * - `version`
     * - `install`
     * @param obj The obj to test.
     * @return `true` if the object can be considered a plugin otherwise `false`.
     */
    static isPlugin(obj: any): obj is IPlugin;
    /**
     * Returns `true` if a plugin with the given `name` been installed on `module`.
     * @param m The module.
     * @param name The plugin name.
     * @return `true` if a plugin with the given `name` been installed on `module`, otherwise `false`.
     */
    static isUsed<T extends {
        used: string[];
    }>(m: T, name: string): boolean;
    /**
     * Returns `true` if `plugin.for` is applicable to `module` by comparing against `module.name` and `module.version`.
     * If `plugin.for` is not specified then it is assumed to be applicable.
     * The value of `plugin.for` is a string of the format `'module-name'` or `'module-name@version'`.
     * @param plugin The plugin.
     * @param m The module.
     * @return `true` if `plugin.for` is applicable to `module`, otherwise `false`.
     */
    static isFor(plugin: IPlugin, m: {
        name?: string | undefined;
        [_: string]: any;
    }): boolean;
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
    static use<T extends IPlugin | string>(m: {
        uses?: T[];
        [_: string]: any;
    }, plugins: T[]): void;
    /**
     * Recursively finds all of a module's dependencies and returns a flat dependency graph.
     * @param m The module.
     * @return A dependency graph.
     */
    static dependencies(m: Dependency, tracked?: {
        [_: string]: string[];
    }): {
        [_: string]: string[];
    };
    /**
     * Parses a dependency string into its components.
     * The `dependency` is a string of the format `'module-name'` or `'module-name@version'`.
     * See documentation for `Plugin.versionParse` for a description of the format.
     * This function can also handle dependencies that are already resolved (e.g. a module object).
     * @param dependency The dependency of the format `'module-name'` or `'module-name@version'`.
     * @return The dependency parsed into its components.
     */
    static dependencyParse(dependency: Dependency): {
        name: string;
        range: string;
    };
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
    static versionParse(range: string): ParsedVersion;
    /**
     * Returns `true` if `version` satisfies the given `range`.
     * See documentation for `Plugin.versionParse` for a description of the format.
     * If a version or range is not specified, then any version (`*`) is assumed to satisfy.
     * @param version The version string.
     * @param range The range string.
     * @return `true` if `version` satisfies `range`, otherwise `false`.
     */
    static versionSatisfies(version: string, range: string): boolean;
}
export {};
