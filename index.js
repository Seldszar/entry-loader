const loaderUtils = require('loader-utils');
const path = require('path');
const querystring = require('querystring');
const validateOptions = require('schema-utils');

const loaderSchema = {
	additionalProperties: false,
	type: 'object',
	properties: {
		data: {
			type: 'object'
		},
		template: {
			type: 'string'
		}
	},
	required: [
		'template'
	]
};

function loader() {
	const options = loaderUtils.getOptions(this);

	validateOptions(loaderSchema, options, {
		baseDataPath: 'options',
		name: 'Entry Loader'
	});

	const templatePath = path.resolve(this.rootContext, options.template);
	const templateContext = {
		target: this.target,
		data: options.data
	};

	return `
		import template from ${JSON.stringify(templatePath)};
		import entry from ${JSON.stringify(this.resourcePath)};

		export default template(entry, ${JSON.stringify(templateContext)});
	`;
}

function format(entry, context) {
	return `@seldszar/yael?${querystring.stringify(context)}!${entry}`;
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
		data: {
			oneOf: [
				{
					type: 'object'
				},
				{
					instanceof: 'Function'
				}
			]
		},
		template: {
			type: 'string'
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

class EntryPlugin {
	constructor(options) {
		validateOptions(pluginSchema, options, {
			baseDataPath: 'options',
			name: 'Entry Plugin'
		});

		this.options = options;
	}

	apply({options}) {
		const {entry} = options;

		options.entry =
			typeof entry === 'function' ?
				async () => this.updateEntry(await entry()) :
				this.updateEntry(entry);
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

	updateEntry(entry) {
		if (typeof entry === 'string' && this.testEntry(entry)) {
			let {data, template} = this.options;

			if (typeof data === 'function') {
				data = data(entry);
			}

			return format(entry, {data, template});
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

module.exports = loader;
module.exports.format = format;
module.exports.EntryPlugin = EntryPlugin;
