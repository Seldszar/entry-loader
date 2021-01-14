# @seldszar/yael

> Yet another entry wrapper for Webpack

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

Let's consider the following project structure using Vue.js:

```
src/
├── entry-template.js
└── app.vue
```

Here's the `webpack.config.js` configuration:

```javascript
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
	entry: './src/app.vue',
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
};
```

In `src/entry-template.js`, export a function taking the original entry & the context as arguments:

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

## Using the wrapper

If you prefer a more granular approach, you can manually apply with `wrapEntry`:

```javascript
const { wrapEntry } = require('@seldszar/yael');

module.exports = {
	entry: wrapEntry('./src/app.vue', {
		template: './src/entry-template.js'
	}),
	// ...
};
```

## Using the plugin

Register the plugin in your Webpack configuration and set the `template` path:

```javascript
const { EntryWrapperPlugin } = require('@seldszar/yael');

module.exports = {
	// ...
	plugins: [
		// ...
		new EntryWrapperPlugin({
			template: './src/entry-template.js'
		})
	]
};
```

## API

See the [declaration file](./index.d.ts).

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
