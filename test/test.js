import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import test from 'ava';
import markdownMagic from 'markdown-magic';

const outputDir = path.join(__dirname, 'fixtures', 'output');
const originalDir = path.join(__dirname, 'fixtures', 'original');
const expectedDir = path.join(__dirname, 'fixtures', 'expected');

// Macro testFile (see macro with AVA)
const testFile = (t, fileName, testMsg) => {
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
			const expectedContent = fs.readFileSync(path.join(expectedDir, fileName), 'utf8');
			t.is(data[0].outputContent, expectedContent, testMsg);
		} catch (err) {
			if (err.code === 'ENOENT') {
				t.fail(`File ${fileName} not found in ${expectedDir}!`);
			} else {
				throw err;
			}
		}
	});
};
// Title for macro testFile (see title for macro with AVA)
testFile.title = (providedTitle, fileName) => `Test file ${fileName}: ${providedTitle}`;

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
fs.readdir(originalDir, (err, files) => {
	if (err) {
		console.log(err);
	}
	files.forEach(file => {
		test(testFile, file);
	});
});
