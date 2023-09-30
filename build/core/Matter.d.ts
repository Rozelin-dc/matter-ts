import { IPlugin } from './Plugin';
/**
 * includes a function for installing plugins on top of the library.
 */
export default class Matter {
    /**
     * The library name.
     */
    static readonly libraryName = "matter-ts";
    /**
     * The library version.
     */
    static readonly version: any;
    /**
     * A list of plugin dependencies to be installed. These are normally set and installed through `Matter.use`.
     * Alternatively you may set `Matter.uses` manually and install them by calling `Plugin.use(Matter)`.
     */
    protected static uses: string[];
    /**
     * The plugins that have been installed through `Matter.Plugin.install`. Read only.
     */
    protected static readonly used: string[];
    /**
     * Installs the given plugins on the `Matter` namespace.
     * This is a short-hand for `Plugin.use`, see it for more information.
     * Call this function once at the start of your code, with all of the plugins you wish to install as arguments.
     * Avoid calling this function multiple times unless you intend to manually control installation order.
     * @param params The plugin(s) to install on `base` (multi-argument).
     */
    static use(...params: (IPlugin | string)[]): void;
    /**
     * Chains a function to excute before the original function on the given `path` relative to `Matter`.
     * See also docs for `Common.chain`.
     * @param path The path relative to `Matter`
     * @param func The function to chain before the original
     * @return The chained function that replaced the original
     */
    static before(path: string, func: Function): Function;
    /**
     * Chains a function to excute after the original function on the given `path` relative to `Matter`.
     * See also docs for `Common.chain`.
     * @param path The path relative to `Matter`
     * @param func The function to chain after the original
     * @return The chained function that replaced the original
     */
    static after(path: string, func: Function): Function;
}
