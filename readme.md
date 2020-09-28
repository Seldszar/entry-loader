# @seldszar/yael

> Yet another entry loader for Webpack

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Author](#author)
- [License](#license)

# Install

```bash
$ npm install @seldszar/yael
```

# Usage

Register the plugin in you Webpack configuration and set the `template` to the entry template file:

```javascript
const { EntryPlugin } = require('@seldszar/yael');

module.exports = {
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new EntryPlugin({
			test: /\.vue$/,
			template: './entry-template.js'
		})
	]
};
```

In the `entry-template.js` file, export a function taking the original entry & the context as arguments:

```javascript
import { createApp } from 'vue';

export default (App, { target }) => {
	const app = createApp(App, {
		message: 'Hello World'
	});

	if (target === 'web') {
		app.mount('#app');
	}

	return app;
};
```

## API

See the [declaration file](./index.d.ts).

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
