/**
 * Entry wrapper options.
 */
export interface EntryWrapperOptions {
	/**
	 * Path to the template file.
	 */
	template: string;
}

/**
 * Wraps an entry to use the loader.
 * @param entry path to the entry file
 * @param options entry wrapper options
 */
export function wrapEntry(entry: string, options: EntryWrapperOptions): string;

/**
 * Entry wrapper plugin options.
 */
export interface EntryWrapperPluginOptions extends EntryWrapperOptions {
	/**
	 * Patterns to filter entry files applying the loader.
	 */
	test?: string | RegExp | Array<string | RegExp>;
}

/**
 * Entry wrapper plugin.
 */
export type EntryWrapperPlugin = {
	new (options: EntryWrapperPluginOptions);
};

/**
 * Entry wrapper context.
 */
export interface EntryWrapperContext {
	/**
	 * The Webpack target.
	 */
	target: string;
}

/**
 * Entry wrapper.
 * @param input original entry
 * @param context entry context
 */
export type EntryWrapper<T = any, V = any> = (input: T, context: EntryWrapperContext) => V;
