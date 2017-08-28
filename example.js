'use strict';

const path = require('path');
const markdownMagic = require('markdown-magic');

const config = {
	transforms: {
		PKGJSON: require('./index.js')
	}
};

const markdownPath = path.join(__dirname, 'README.md');
markdownMagic(markdownPath, config);
