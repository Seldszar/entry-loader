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

Let's consider the following project structure using Vue.js:

```
src/
├── template.js
└── app.vue
```

Register the plugin in your Webpack configuration and set the `template` path:

```javascript
const { EntryPlugin } = require('@seldszar/yael');
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
		new VueLoaderPlugin(),
		new EntryPlugin({
			template: './src/template.js'
		})
	]
};
```

In `src/template.js`, export a function taking the original entry & the context as arguments:

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

Webpack will generate a `dist/main.js` file, exporting `app` and mounting it because the current target is `web` by default.

## API

See the [declaration file](./index.d.ts).

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
