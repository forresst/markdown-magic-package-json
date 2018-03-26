# Guide to switch to `template` option

Since version 1.1.0, `prop`, `before` and `after` options has been deprecated in favor of `template`. This small guide provides you with examples to use the new `template` option instead of the deprecated options.

>**NOTE**: `prop`, `before` and `after` options will be removed from version 2.0.0 and later.

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [Basic Usage](#basic-usage)
- [With most options](#with-most-options)
- [Unknown property](#unknown-property)
- [Deep property](#deep-property)
- [With news lines and tabulations](#with-news-lines-and-tabulations)
<!-- AUTO-GENERATED-CONTENT:END -->

## Basic Usage

Here is a first example to display the `name` property inside `package.json`:

_Before:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=name) -->
markdown-magic-package-json
<!-- AUTO-GENERATED-CONTENT:END -->
```

_After:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:template=${name}) -->
markdown-magic-package-json
<!-- AUTO-GENERATED-CONTENT:END -->
```

## With most options

Here is an example with most options:

_Before:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=name&before=### &after= is very useful !&pkg=tests) -->
### markdown-magic-package-json is very useful !
<!-- AUTO-GENERATED-CONTENT:END -->
```

_After:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:template=### ${name} is very useful !&pkg=tests) -->
### markdown-magic-package-json is very useful !
<!-- AUTO-GENERATED-CONTENT:END -->
```

## Unknown property

In this example, the property does not exist in `package.json`:

_Before:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=foo) -->
undefined
<!-- AUTO-GENERATED-CONTENT:END -->
```

_After:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:template=${foo}) -->
undefined
<!-- AUTO-GENERATED-CONTENT:END -->
```

Please note in this case the value unknown is replaced by `undefined`. You can change `undefined` by a value of your choice using the option `unknownTxt` as below:


_Before:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=foo&unknownTxt=##TODO##) -->
##TODO##
<!-- AUTO-GENERATED-CONTENT:END -->
```

_After:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:template=${foo}&unknownTxt=##TODO##) -->
##TODO##
<!-- AUTO-GENERATED-CONTENT:END -->
```

## Deep property

To retrieve a deep property (for example `repository.type`):

_Before:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=repository.type) -->
git
<!-- AUTO-GENERATED-CONTENT:END -->
```

_After:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:template=${repository.type}) -->
git
<!-- AUTO-GENERATED-CONTENT:END -->
```

## With news lines and tabulations

To the layout, use characters for new line (`\n`) or tabulation (`\t`):

_Before:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:prop=name&before=# Hello World\n\nThe package: &after=\n\n\tIt is useful!\n\nVery useful!!!) -->
# Hello World

The package: markdown-magic-package-json

	It is useful!

Very useful!!!
<!-- AUTO-GENERATED-CONTENT:END -->
```

_After:_

```markdown
<!-- AUTO-GENERATED-CONTENT:START (PKGJSON:template=# Hello World\n\nThe package: ${name}\n\n\tIt is useful!\n\nVery useful!!!) -->
# Hello World

The package: markdown-magic-package-json

	It is useful!

Very useful!!!
<!-- AUTO-GENERATED-CONTENT:END -->
```
