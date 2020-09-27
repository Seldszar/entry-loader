/**
 * Entry loader options.
 */
export interface EntryLoaderOptions {
	/**
	 * Path to the template file.
	 */
	template: string;

	/**
	 * Additional data transmitted to the template.
	 */
	data?: Record<string, any> | ((entry: string) => Record<string, any>);
}

/**
 * Format an entry using the template entry loader.
 * @param entry path to the entry file
 * @param options entry loader options
 */
export function format(entry: string, options: EntryLoaderOptions): string;

/**
 * Entry plugin options.
 */
export interface EntryPluginOptions extends EntryLoaderOptions {
	/**
	 * Patterns to filter entry files applying the loader.
	 */
	test?: string | RegExp | Array<string | RegExp>;
}

/**
 * Entry plugin.
 */
export type EntryPlugin = {
	new (options: EntryPluginOptions);
};

/**
 * Entry context.
 */
export interface EntryContext {
	/**
	 * The Webpack target.
	 */
	target: string;

	/**
	 * Additional data transmitted by the loader.
	 */
	data?: Record<string, any>;
}

/**
 * Entry handler.
 * @param entry path to the entry file
 * @param context entry context
 */
export type EntryHandler<T = any, V = any> = (entry: T, context: EntryContext) => V;
