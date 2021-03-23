import {Compiler} from 'webpack';

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
export interface EntryWrapperPluginOptions {
	/**
	 * Path to the template file.
	 */
	template: string | ((compiler: Compiler) => string);

	/**
	 * Patterns to filter entry files applying the loader.
	 */
	test?: string | RegExp | Array<string | RegExp>;
}

/**
 * Entry wrapper plugin.
 */
export class EntryWrapperPlugin {
	constructor(options: EntryWrapperPluginOptions);

	/**
	 * Apply the plugin
	 */
	apply(compiler: Compiler): void;
}

/**
 * Entry wrapper context.
 */
export interface EntryWrapperContext {
	/**
	 * The compiler target.
	 */
	target: string;

	/**
	 * The compiler name.
	 */
	name: string;
}

/**
 * Entry wrapper.
 * @param input original entry
 * @param context entry context
 */
export type EntryWrapper<T = any, V = any> = (input: T, context: EntryWrapperContext) => V;
