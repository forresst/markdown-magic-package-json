<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=name&before=# ) -->
# markdown-magic-package-json
<!-- AUTO-GENERATED-CONTENT:END -->

> Add the `package.json` properties to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [Install](#install)
- [Adding the plugin](#adding-the-plugin)
- [Options](#options)
- [Usage in markdown](#usage-in-markdown)
  * [Basic](#basic)
  * [With most options](#with-most-options)
  * [Unknown property](#unknown-property)
  * [Deep property](#deep-property)
  * [With news lines and tabulations](#with-news-lines-and-tabulations)
- [License](#license)
<!-- AUTO-GENERATED-CONTENT:END -->

## Install

```console
npm i markdown-magic markdown-magic-package-json --save-dev
```

## Adding the plugin

See this example for usage.

```js
'use strict';

const path = require('path');
const markdownMagic = require('markdown-magic');

const config = {
	transforms: {
		PKGJSON: require('markdown-magic-package-json')
	}
};

const markdownPath = path.join(__dirname, 'README.md');
markdownMagic(markdownPath, config);
```

## Options

* **prop** - any property in package.json (like `name`, `version`, `scripts.test`, ...)
* **before** (empty by default) - string to add **before** prop
* **after** (empty by default) - string to add **after** prop
* **pkg** (closest `package.json` by default) - `package.json` path. If the path is incorrect, the plugin take closest `package.json`
* **UnknownTxt** (undefined by default) - string to add if the `prop` is unknown

## Usage in markdown

### Basic

Here is a first example to display the `name` property inside `package.json`:

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=name) -->
markdown-magic-package-json
<!-- AUTO-GENERATED-CONTENT:END -->
```

### With most options

Here is an example with most options:

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=name&before=### &after= is very useful !&pkg=tests) -->
### markdown-magic-package-json is very useful !
<!-- AUTO-GENERATED-CONTENT:END -->
```

### Unknown property

In this example, the property does not exist in `package.json`:

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=foo) -->
undefined
<!-- AUTO-GENERATED-CONTENT:END -->
```

Please note in this case the value unknown is replaced by `undefined`. You can change `undefined` by a value of your choice using the option `unknownTxt` as below:

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=foo&unknownTxt=##TODO##) -->
##TODO##
<!-- AUTO-GENERATED-CONTENT:END -->
```

### Deep property

To retrieve a deep property (for example `repository.git`):

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=repository.type) -->
git
<!-- AUTO-GENERATED-CONTENT:END -->
```

### With news lines and tabulations

To the layout, use characters for new line (`/n`) or tabulation (`\t`):

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=name&before=# Hello World\n\nThe package: &after=\n\n\tIt is useful!\n\nVery useful!!!cd ) -->
# Hello World

The package: markdown-magic-package-json

	It is useful!

Very useful!!!cd 
<!-- AUTO-GENERATED-CONTENT:END -->
```

## License

MIT © [forresst](https://github.com/forresst)
