'use strict';

const path = require('path');
const readPkgUp = require('read-pkg-up');

function deepAccess(obj, key) {
	return key.split('.').reduce((nestedObject, key) => {
		if (nestedObject && key in nestedObject) {
			return nestedObject[key];
		}
		return undefined;
	}, obj);
}

module.exports = function (content, options, config) {
	if (!options) {
		options = {};
	}

	const optReadPkg = {
		cwd: ''
	};
	if (options.pkg) {
		optReadPkg.cwd = path.resolve(path.dirname(config.originalPath), options.pkg);
	}

	if (!options.before) {
		options.before = '';
	}

	if (!options.after) {
		options.after = '';
	}

	let prop;
	if (options.prop) {
		const result = readPkgUp.sync(optReadPkg);
		prop = deepAccess(result.pkg, options.prop);
	}

	if (prop === undefined && options.unknownTxt) {
		prop = options.unknownTxt;
	}

	const updatedContent = `${options.before}${prop}${options.after}`;
	return updatedContent
	.replace(/\\n/g, '\n')
	.replace(/\\t/g, '\t')
	.replace(/\\r/g, '\r')
	.replace(/\\b/g, '\b')
	.replace(/\\f/g, '\f');
};
