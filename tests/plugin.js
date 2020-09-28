const test = require('ava');
const path = require('path');

const {EntryPlugin} = require('..');
const {compile} = require('./helpers/compiler');

test('compiles the wrapped entry', async t => {
	const stats = await compile({
		entry: './fixtures/basic/main.js',
		plugins: [
			new EntryPlugin({
				template: path.join(__dirname, './fixtures/basic/template.js')
			})
		]
	});

	t.snapshot(stats.compilation.assets['main.js'].source());
});
