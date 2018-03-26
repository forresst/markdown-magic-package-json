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
 * @returns {string} package.json's path or undefined if not found
 */
const findPathPkg = (dir = process.cwd()) => {
	try {
		return path.join(findup.sync(path.resolve(process.cwd(), dir), 'package.json'), 'package.json');
	} catch (err) {
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
 * Return the property from object via a string key
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
 * @param {Object} obj
 * @param {string} key
 * @returns {Object} property
 */
const getDeepAccessProp = (obj, key) => {
	return key.split('.').reduce((nestedObject, key) => {
		if (nestedObject && key in nestedObject) {
			return nestedObject[key];
		}
		return undefined;
	}, obj);
};

/**
 * Plugin markdown-magic-package-json
 *
 * @param {string} content content before transformation
 * @param {Object} options options passed to the transform
 * @param {string} [options.template] string with placeholders like Template literals. For example, if we want to retrieve the `name` property in the package.json, we can write this: `${name}`
 * @param {string} [options.unknownTxt] string to add if the property is unknown
 * @param {string} [options.pkg] `package.json` path. If the path is incorrect, the plugin find `package.json` in ancestor's dir
 * @param {string} [options.prop] DEPRECATED any property in package.json (like `name`, `version`, `scripts.test`, ...)
 * @param {string} [options.before] DEPRECATED string to add before the property
 * @param {string} [options.after] DEPRECATED string to add after the property
 * @param {Object} [config] markdown-magic configuration object
 * @returns {string} content modified
 */
module.exports = (content, options, config) => {
	if (!options) {
		options = {};
	}

	const jsonPkg = getJsonPkg(options.pkg, config);
	let updatedContent;
	if (options.template) {
		const reg = new RegExp('(?:\\$\\{(\\w+(?:\\.\\w+)?)\\})', 'gi');
		updatedContent = options.template;
		let result;
		while ((result = reg.exec(options.template)) !== null) {
			const placeholder = result[0];
			const match = result[1];
			if (options.unknownTxt && getDeepAccessProp(jsonPkg, match) === undefined) {
				updatedContent = updatedContent.replace(placeholder, options.unknownTxt);
			} else {
				updatedContent = updatedContent.replace(placeholder, getDeepAccessProp(jsonPkg, match));
			}
		}
	} else {
		let warningMsg = false;
		if (options.before) {
			warningMsg = true;
		} else {
			options.before = '';
		}

		if (options.after) {
			warningMsg = true;
		} else {
			options.after = '';
		}

		let prop;
		if (options.prop) {
			prop = getDeepAccessProp(jsonPkg, options.prop);
			warningMsg = true;
		}

		if (prop === undefined && options.unknownTxt) {
			prop = options.unknownTxt;
		}

		if (warningMsg) {
			console.warn('markdown-magic-package-json: `prop`, `before` and `after` options has been deprecated in favor of `template`');
		}
		updatedContent = `${options.before}${prop}${options.after}`;
	}

	return updatedContent
		.replace(/\\n/g, '\n')
		.replace(/\\t/g, '\t')
		.replace(/\\r/g, '\r')
		.replace(/\\b/g, '\b')
		.replace(/\\f/g, '\f');
};
