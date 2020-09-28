const memfs = require('memfs');
const path = require('path');
const webpack = require('webpack');

exports.compile = options => {
	const compiler = webpack({
		context: path.resolve(__dirname, '..'),
		...options
	});

	compiler.outputFileSystem = memfs.createFsFromVolume(new memfs.Volume());
	compiler.outputFileSystem.join = path.join.bind(path);

	return new Promise((resolve, reject) => {
		compiler.run((error, stats) => {
			if (error) {
				return reject(error);
			}

			if (stats.hasErrors()) {
				return reject(new Error(stats.toJson().errors));
			}

			resolve(stats);
		});
	});
};
