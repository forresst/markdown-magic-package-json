'use strict';

const path = require('path');
const markdownMagic = require('markdown-magic');

const config = {
	transforms: {
		PKGJSON: require('./index.js')
	}
};

markdownMagic(path.join(__dirname, 'README.md'), config);
markdownMagic(path.join(__dirname, 'docs', 'guide-switch-to-template-option.md'), config);
