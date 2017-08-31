import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import test from 'ava';
import markdownMagic from 'markdown-magic';

const outputDir = path.join(__dirname, 'fixtures', 'output');

const testCase = (testTxt, fileName, testMsg) => {
	test(testTxt, t => {
		const config = {
			outputDir,
			transforms: {
				PKGJSON: require('../index')
			}
		};

		markdownMagic(path.join(__dirname, 'fixtures', 'original', fileName), config, (err, data) => {
			if (err) {
				console.log(err);
			}
			const expectedContent = fs.readFileSync(path.join(__dirname, 'fixtures', 'expected', fileName), 'utf8');
			t.is(data[0].outputContent, expectedContent, testMsg);
		});
	});
};

test.before.cb('Cleanup', t => {
	// Removing output test files
	rimraf(outputDir, err => {
		if (err) {
			console.log(err);
		}
		t.end();
	});
});

test.after.cb('Cleanup', t => {
	// Removing output test files
	rimraf(outputDir, err => {
		if (err) {
			console.log(err);
		}
		t.end();
	});
});

test('If basic case pass', t => {
	const markdownPath = path.join(__dirname, 'fixtures', 'original', 'basic.md');
	const config = {
		outputDir,
		transforms: {
			PKGJSON: require('../index')
		}
	};
	markdownMagic(markdownPath, config);
	t.pass();
});

testCase('With option prop=name', 'basic.md', 'bad name');

testCase('Without option', 'without-option.md', 'name should be unknown');

testCase('With prop unknown', 'unknown-prop.md', 'name should be unknown');

testCase('With prop unknown and unknownTxt=TODO', 'unknown-text.md', 'the return should be unknownTxt option');

testCase('With only unknownTxt=TODO', 'unknown-text-only.md', 'the return should be unknownTxt option');

testCase('With deep property', 'deep-property.md', 'name should be this fixture package.json');

testCase('With before option', 'before.md', 'name should be preceded by before option');

testCase('With after option', 'after.md', 'name should be followed by after option');

testCase('With option prop=name&pkg=./test/fixtures', 'path-package-json.md', 'name should be this fixture package.json');

testCase('With option prop=name&pkg=./test', 'unknown-path-package-json.md', 'name should be undefined');

testCase('With option prop=name&pkg=./test', 'go-to-package-json.md', 'name should be this root package.json');

testCase('With news lines', 'news-lines.md', 'new lines should be displayed');
