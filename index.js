const loaderUtils = require('loader-utils');
const path = require('path');
const querystring = require('querystring');
const schemaUtils = require('schema-utils');

const loaderSchema = {
	additionalProperties: false,
	type: 'object',
	properties: {
		template: {
			type: 'string'
		},
		name: {
			type: 'string'
		}
	},
	required: [
		'template'
	]
};

function loader() {
	const options = loaderUtils.getOptions(this);

	schemaUtils.validate(loaderSchema, options, {
		baseDataPath: 'options',
		name: 'Entry Wrapper Loader'
	});

	const templatePath = path.resolve(this.rootContext, options.template);
	const templateContext = {
		target: this.target,
		name: this.name
	};

	return `
		import template from ${JSON.stringify(templatePath)};
		import entry from ${JSON.stringify(this.resourcePath)};

		export default template(entry, ${JSON.stringify(templateContext)});
	`;
}

function wrapEntry(entry, options) {
	return `${__filename}?${querystring.stringify(options)}!${entry}`;
}

const pluginSchema = {
	definitions: {
		Rule: {
			anyOf: [
				{
					instanceof: 'RegExp',
					tsType: 'RegExp'
				},
				{
					type: 'string',
					minLength: 1
				}
			]
		}
	},
	additionalProperties: false,
	type: 'object',
	properties: {
		template: {
			oneOf: [
				{
					instanceof: 'Function',
					tsType: 'Function'
				},
				{
					type: 'string'
				}
			]
		},
		test: {
			oneOf: [
				{
					type: 'array',
					items: {
						oneOf: [
							{
								$ref: '#/definitions/Rule'
							}
						]
					}
				},
				{
					$ref: '#/definitions/Rule'
				}
			]
		}
	},
	required: [
		'template'
	]
};

class EntryWrapperPlugin {
	constructor(options) {
		schemaUtils.validate(pluginSchema, options, {
			baseDataPath: 'options',
			name: 'Entry Wrapper Plugin'
		});

		this.options = options;
	}

	apply(compiler) {
		const {
			options: {entry}
		} = compiler;

		compiler.options.entry =
			typeof entry === 'function' ?
				async () => this.updateEntry(compiler, await entry()) :
				this.updateEntry(compiler, entry);
	}

	testEntry(entry) {
		if (typeof this.options.test === 'undefined') {
			return true;
		}

		const testPattern = pattern =>
			pattern instanceof RegExp ? pattern.test(entry) : entry.includes(pattern);

		return Array.isArray(this.options.test) ?
			this.options.test.some(pattern => testPattern(pattern)) :
			testPattern(this.options.test);
	}

	updateEntry(compiler, entry) {
		if (typeof entry === 'string' && this.testEntry(entry)) {
			let {template} = this.options;

			if (typeof template === 'function') {
				template = template(compiler);
			}

			return wrapEntry(entry, {template});
		}

		if (Array.isArray(entry)) {
			for (let index = 0; index < entry.length; index++) {
				entry[index] = this.updateEntry(entry[index]);
			}
		} else if (typeof entry === 'object') {
			for (const key in entry) {
				if (Object.prototype.hasOwnProperty.call(entry, key)) {
					entry[key] = this.updateEntry(entry[key]);
				}
			}
		}

		return entry;
	}
}

loader.wrapEntry = wrapEntry;
loader.EntryWrapperPlugin = EntryWrapperPlugin;

module.exports = loader;
