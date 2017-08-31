'use strict';

const fs = require('fs');
const path = require('path');
const findup = require('findup');

const findPkg = dir => {
	try {
		return path.join(findup.sync(dir, 'package.json'), 'package.json');
	} catch (err) {
		return undefined;
	}
};

const getPackage = options => {
	let pkgPath;
	if (options.pkg) {
		pkgPath = findPkg(path.resolve(process.cwd(), options.pkg));
	} else {
		pkgPath = findPkg(process.cwd());
	}

	let contentJson = {};
	if (pkgPath) {
		contentJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
	}
	return contentJson;
};

const deepAccess = (obj, key) => {
	return key.split('.').reduce((nestedObject, key) => {
		if (nestedObject && key in nestedObject) {
			return nestedObject[key];
		}
		return undefined;
	}, obj);
};

module.exports = (content, options, config) => {
	if (!options) {
		options = {};
	}

	if (!options.before) {
		options.before = '';
	}

	if (!options.after) {
		options.after = '';
	}

	let prop;
	if (options.prop) {
		const result = getPackage(options, config);
		prop = deepAccess(result, options.prop);
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
