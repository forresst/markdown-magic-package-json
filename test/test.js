import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import test from 'ava';
import markdownMagic from 'markdown-magic';
import ParseMarkdownMetadata from 'parse-markdown-metadata';
import {findPathPkg, getJsonPkg, getDeepAccessProp} from '..';

const outputDir = path.join(__dirname, 'fixtures', 'output');
const originalDir = path.join(__dirname, 'fixtures', 'original');
const expectedDir = path.join(__dirname, 'fixtures', 'expected');

// Macro test file (see macro with AVA)
const macroFile = (t, fileName, errorMsg) => {
	// Init config markdown-magic
	const config = {
		// Change output path of new content to outputDir: \test\fixtures\output\
		outputDir,
		// Custom commands to transform block contents: PKGJSON call ../index.js
		transforms: {
			PKGJSON: require('..')
		}
	};

	// Call mardown-magic with :
	// - original file path: path.join(originalDir, fileName)
	// - configuration markdown-magic: config
	// - callback to run after markdown updates: (err, data) => { ... }
	markdownMagic(path.join(originalDir, fileName), config, (err, data) => {
		// An error occurred while calling markdown-magic
		if (err) {
			t.fail(err);
		}
		// Comparison between the output file and the expected file
		try {
			// Reading the expected file
			const expectedSource = fs.readFileSync(path.join(expectedDir, fileName), 'utf8');
			// Parse the expected file (ParseMarkdownMetadata remove metadata in expectedMd.content)
			const expectedMd = new ParseMarkdownMetadata(expectedSource);
			// Parse the output file (ParseMarkdownMetadata remove metadata in outputMd.content)
			const outputMd = new ParseMarkdownMetadata(data[0].outputContent);
			// Comparison between the output file and the expected file
			t.is(outputMd.content, expectedMd.content, errorMsg);
		} catch (err) {
			// The expected file doesn't exist
			if (err.code === 'ENOENT') {
				t.fail(`File ${fileName} not found in ${expectedDir}!`);
			// Others errors
			} else {
				t.fail(err);
			}
		}
	});
};
// Title for macro testFile (see title for macro with AVA)
macroFile.title = (providedTitle, fileName) => `Test file ${fileName}: ${providedTitle}`;

// Removing output test files before all tests
test.before.cb('Cleanup', t => {
	rimraf(outputDir, err => {
		if (err) {
			t.fail(err);
		}
		t.end();
	});
});

// Removing output test files after all tests
test.after.cb('Cleanup', t => {
	rimraf(outputDir, err => {
		if (err) {
			t.fail(err);
		}
		t.end();
	});
});

test('findPathPkg without given path', t => {
	const pathExpected = path.join(process.cwd(), 'package.json');
	const pathPkg = findPathPkg();
	t.is(pathPkg, pathExpected, 'The path default should be process.cwd(): ' + process.cwd());
});

test('getJsonPkg without given path', t => {
	const json = getJsonPkg();
	const jsonExpected = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
	t.deepEqual(json, jsonExpected, 'The JSON package object should be the package.json root');
});

test('findPathPkg with given path (path with package.json file)', t => {
	const pathExpected = path.join(__dirname, 'fixtures', 'package.json');
	const pathPkg = findPathPkg(path.join(__dirname, 'fixtures'));
	t.is(pathPkg, pathExpected, 'The path default should be: ' + path.join(__dirname, 'fixtures'));
});

test('getJsonPkg with given path (path with package.json file)', t => {
	const pathPkgFixtures = path.join(__dirname, 'fixtures', 'package.json');
	const json = getJsonPkg(pathPkgFixtures);
	const jsonExpected = JSON.parse(fs.readFileSync(pathPkgFixtures), 'utf8');
	t.deepEqual(json, jsonExpected, 'The JSON package object should be the package.json fixtures (' + pathPkgFixtures + ')');
});

test('findPathPkg with wrong ancestor path', t => {
	const pathExpected = undefined;
	const pathPkg = findPathPkg('../wrong');
	t.is(pathPkg, pathExpected, 'The path default should be `undefined`');
});

test('getJsonPkg without undefined path', t => {
	const pathUndefined = undefined;
	const json = getJsonPkg(pathUndefined);
	const jsonExpected = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
	t.deepEqual(json, jsonExpected, 'The JSON package object should be the package.json root');
});

test('findPathPkg with wrong child path (path without package.json file)', t => {
	const pathExpected = path.join(process.cwd(), 'package.json');
	const pathPkg = findPathPkg(path.join(__dirname, 'wrong'));
	t.is(pathPkg, pathExpected, 'The path default should be package.json in ancestor dir: ' + process.cwd());
});

test('getJsonPkg with wrong child path (path without package.json file)', t => {
	const json = getJsonPkg(path.join(__dirname, 'wrong'));
	const jsonExpected = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
	t.deepEqual(json, jsonExpected, 'The JSON package object should be the package.json root');
});

test('getDeepAccessProp with known property (name)', t => {
	const json = getJsonPkg();
	const value = getDeepAccessProp(json, 'name');
	t.is(value, 'markdown-magic-package-json', 'The property value of `name` should be: markdown-magic-package-json');
});

test('getDeepAccessProp with unknown property', t => {
	const json = getJsonPkg();
	const value = getDeepAccessProp(json, 'foo');
	t.is(value, undefined, 'The value of unknown property should be: undefined');
});

test('getDeepAccessProp with deep property (repository.type)', t => {
	const json = getJsonPkg();
	const value = getDeepAccessProp(json, 'repository.type');
	t.is(value, 'git', 'The value of `repository.type` should be: git');
});

test('getDeepAccessProp with very deep property (obj.foo.bar)', t => {
	const json = getJsonPkg(path.join(__dirname, 'fixtures', 'package.json'));
	const value = getDeepAccessProp(json, 'obj.foo.bar');
	t.is(value, 'foobar', 'The value of `obj.foo.bar` should be: foobar');
});

test('getDeepAccessProp with property (obj) that is a object', t => {
	const json = getJsonPkg(path.join(__dirname, 'fixtures', 'package.json'));
	const value = getDeepAccessProp(json, 'obj');
	const valueExpected = {foo: {bar: 'foobar'}};
	t.deepEqual(value, valueExpected, 'The value of `obj` should be: {foo: {bar: \'foobar\'}}');
});

test('getDeepAccessProp with property (arr) that is a array', t => {
	const json = getJsonPkg(path.join(__dirname, 'fixtures', 'package.json'));
	const value = getDeepAccessProp(json, 'arr');
	const valueExpected = ['foo', 'bar'];
	t.deepEqual(value, valueExpected, 'The value of `arr` should be: [\'foo\', \'bar\']');
});

// Check basic case pass
test('If basic case pass', t => {
	const markdownPath = path.join(originalDir, 'basic.md');
	const config = {
		outputDir,
		transforms: {
			PKGJSON: require('..')
		}
	};
	markdownMagic(markdownPath, config);
	t.pass();
});

// Tests if all the files in the `original` directory after using magic-markdown
// match those in the `expected` directory
// (by comparing the files in `output` with those of `expected`)
fs.readdirSync(originalDir).forEach(file => {
	let source;
	try {
		source = fs.readFileSync(path.join(originalDir, file)).toString();
	} catch (err) {
		throw err;
	}
	const md = new ParseMarkdownMetadata(source);
	const title = (md.props.title) ? md.props.title : '';
	const errMsg = (md.props.error) ? md.props.error : '';
	test(title, macroFile, file, errMsg);
});
