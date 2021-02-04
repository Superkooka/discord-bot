module.exports = {
	'env': {
		'node': true,
		'es6': true
	},
	'extends': 'standard',
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parser': "babel-eslint",
	'parserOptions': {
		'ecmaVersion': 2018
	},
	"plugins": [
		"babel"
	],
	'rules': {
		// allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'semi': ['error', 'always'],
		"comma-dangle": ["error", {
			"arrays": "always-multiline",
			"objects": "always-multiline",
			"imports": "ignore",
			"exports": "ignore",
			"functions": "ignore"
		}],
		'key-spacing': 'off',
		'space-before-function-paren': 'off',
		'spaced-comment': 'off'
	}
};
