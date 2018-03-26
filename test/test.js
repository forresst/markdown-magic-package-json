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
	// Init config markdown-magic
	const config = {
		// Change output path of new content to outputDir: \test\fixtures\output\
		outputDir,
		// Custom commands to transform block contents: PKGJSON call ../index.js
		transforms: {
			PKGJSON: require('../index')
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
