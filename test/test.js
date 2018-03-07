import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import test from 'ava';
import markdownMagic from 'markdown-magic';
import ParseMarkdownMetadata from 'parse-markdown-metadata';

const outputDir = path.join(__dirname, 'fixtures', 'output');
const originalDir = path.join(__dirname, 'fixtures', 'original');
const expectedDir = path.join(__dirname, 'fixtures', 'expected');

// Macro test file (see macro with AVA)
const macroFile = (t, fileName, errorMsg) => {
	// init config markdown-magic
	const config = {
		outputDir,
		transforms: {
			PKGJSON: require('../index')
		}
	};

	markdownMagic(path.join(originalDir, fileName), config, (err, data) => {
		if (err) {
			t.fail(err);
		}
		try {
			const expectedSource = fs.readFileSync(path.join(expectedDir, fileName), 'utf8');
			const expectedMd = new ParseMarkdownMetadata(expectedSource);
			const outputMd = new ParseMarkdownMetadata(data[0].outputContent);
			t.is(outputMd.content, expectedMd.content, errorMsg);
		} catch (err) {
			if (err.code === 'ENOENT') {
				t.fail(`File ${fileName} not found in ${expectedDir}!`);
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

// Check basic case pass
test('If basic case pass', t => {
	const markdownPath = path.join(originalDir, 'basic.md');
	const config = {
		outputDir,
		transforms: {
			PKGJSON: require('../index')
		}
	};
	markdownMagic(markdownPath, config);
	t.pass();
});

/*
* Tests if all the files in the `original` directory after using magic-markdown
* match those in the `expected` directory
* (by comparing the files in `output` with those of `expected`)
*/
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
