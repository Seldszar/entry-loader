const test = require('ava');
const path = require('path');

const yael = require('..');

const {compile} = require('./helpers/compiler');

test('compiles the wrapped entry', async t => {
	const stats = await compile({
		entry: yael.wrapEntry('./fixtures/basic/main.js', {
			template: path.join(__dirname, './fixtures/basic/template.js')
		})
	});

	t.snapshot(stats.compilation.assets['main.js'].source());
});
