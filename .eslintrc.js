module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: 'airbnb-base',
	overrides: [{
		env: {
			node: true,
		},
		files: [
			'.eslintrc.{js,cjs}',
		],
		parserOptions: {
			sourceType: 'script',
		},
	},
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		//   "indent": ["error", { "allowIndentationTabs": true }],
		// "allowIndentationTabs": true,
		// 'no-tabs': 0,
		indent: ['error', 'tab'],
		'no-tabs': ['error', { allowIndentationTabs: true }],
		'no-multi-spaces': 'error',
		'object-curly-newline': 'off',
		'no-trailing-spaces': 'error',
		'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
		'no-duplicate-imports': ['error', { includeExports: true }],
		'eol-last': ['error', 'never'],
	},
};