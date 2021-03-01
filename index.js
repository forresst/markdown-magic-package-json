'use strict';

const fs = require('fs');
const path = require('path');
const findup = require('findup');

/**
 * Return the package.json's path or undefined if not found
 *
 * Note: The search is always done in the ancestors of the file tree
 *
 * @param {string} [dir=process.cwd()] Path where the file search starts
 * @returns {string} Package.json's path or undefined if not found
 */
const findPathPkg = (dir = process.cwd()) => {
	try {
		return path.join(findup.sync(path.resolve(process.cwd(), dir), 'package.json'), 'package.json');
	} catch {
		return undefined;
	}
};

/**
 * Return the JSON content of package.json or empty JSON if not found the file package.json
 *
 * @param {string} [pathSearchStart] Path where the file search starts
 * @returns {Object} JSON content of package.json
 */
const getJsonPkg = pathSearchStart => {
	const pkgPath = findPathPkg(pathSearchStart);

	let contentJson = {};
	if (pkgPath) {
		contentJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
	}

	return contentJson;
};

/**
 * Return the property value from object via a string key
 *
 * For example:
 *
 * const obj = {
 * 	"a": "Value a",
 *  "child": {
 * 		"b": "Value b"
 * 	}
 * }
 *
 * getDeepAccessProp(obj, 'child.b'); // -> 'Value b'
 *
 * @param {Object} obj A object
 * @param {string} key A key
 * @returns {Object} The property value of key in obj
 */
const getDeepAccessProp = (object, key) => {
	// eslint-disable-next-line unicorn/no-array-reduce
	return key.split('.').reduce((nestedObject, key) => {
		if (nestedObject && key in nestedObject) {
			return nestedObject[key];
		}

		return undefined;
	}, object);
};

/**
 * Plugin markdown-magic-package-json
 *
 * @param {string} content Content before transformation
 * @param {Object} options Options passed to the transform
 * @param {string} [options.template] String with placeholders like Template literals. For example, if we want to retrieve the `name` property in the package.json, we can write this: `${name}`
 * @param {string} [options.unknownTxt] String to add if the property is unknown
 * @param {string} [options.pkg] `package.json` path. If the path is incorrect, the plugin find `package.json` in ancestor's dir
 * @param {Object} config markdown-magic configuration object
 * @returns {string} Content modified
 */
module.exports = (content, options, config) => {
	if (!options) {
		options = {};
	}

	let updatedContent = 'undefined';

	if (options.unknownTxt) {
		updatedContent = options.unknownTxt;
	}

	if (options.template) {
		updatedContent = options.template;
	}

	let result;
	const reg = /(?:\${(\w+(?:\.\w+)?)})/gi;
	const jsonPkg = getJsonPkg(options.pkg, config);
	while ((result = reg.exec(options.template)) !== null) {
		const placeholder = result[0];
		const match = result[1];
		updatedContent = options.unknownTxt && getDeepAccessProp(jsonPkg, match) === undefined ? updatedContent.replace(placeholder, options.unknownTxt) : updatedContent.replace(placeholder, getDeepAccessProp(jsonPkg, match));
	}

	return updatedContent
		.replace(/\\n/g, '\n')
		.replace(/\\t/g, '\t')
		.replace(/\\r/g, '\r')
		.replace(/\\b/g, '\b')
		.replace(/\\f/g, '\f');
};

module.exports.findPathPkg = findPathPkg;
module.exports.getJsonPkg = getJsonPkg;
module.exports.getDeepAccessProp = getDeepAccessProp;
