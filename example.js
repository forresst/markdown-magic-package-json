'use strict';

const path = require('path');
const markdownMagic = require('markdown-magic');

const config = {
	transforms: {
		PKGJSON: require('.')
	}
};

markdownMagic(path.join(__dirname, 'README.md'), config);
