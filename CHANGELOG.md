<a name="1.1.0"></a>
# [1.1.0](https://github.com/forresst/markdown-magic-package-json/compare/1.0.2...1.1.0) (2018-03-26)


### Features

* **template:** add option `template` ([57743b0](https://github.com/forresst/markdown-magic-package-json/commit/57743b0))


### Chore

* Change package.json for commitlint ([2ea44e2](https://github.com/forresst/markdown-magic-package-json/commit/2ea44e2))
* Change validate-commit-msg by commitlint ([6033e9f](https://github.com/forresst/markdown-magic-package-json/commit/6033e9f))

### Test

* Add comments to test coveralls ([41a5734](https://github.com/forresst/markdown-magic-package-json/commit/41a5734))
* Add Node.js 9 in CI ([cf108bb](https://github.com/forresst/markdown-magic-package-json/commit/cf108bb))
* Comments should not begin with a lowercase character ([525ae14](https://github.com/forresst/markdown-magic-package-json/commit/525ae14))
* Add tests with markdown-magic 0.1.21 ([e533165](https://github.com/forresst/markdown-magic-package-json/commit/e533165))
* Bump dev dependencies ([3bc60cc](https://github.com/forresst/markdown-magic-package-json/commit/3bc60cc))
* Improve tests with readdirSync ([9cb5aa5](https://github.com/forresst/markdown-magic-package-json/commit/9cb5aa5))

### BREAKING CHANGES

* **template:** The following options has been deprecated in favor of `template`. **They will be removed from version 2.0.0 and later**. See the [guide](docs/guide-switch-to-template-option.md) to use `template` instead :
   * **prop** - any property in package.json (like `name`, `version`, `scripts.test`, ...)
   * **before** (empty by default) - string to add **before** prop
   * **after** (empty by default) - string to add **after** prop



<a name="1.0.2"></a>
## [1.0.2](https://github.com/forresst/markdown-magic-package-json/compare/1.0.1...1.0.2) (2018-02-15)


### chore

* Bump dev dependencies ([e228e68](https://github.com/forresst/markdown-magic-package-json/commit/e228e68))

### docs

* Fix property name ([6bc3517](https://github.com/forresst/markdown-magic-package-json/commit/6bc3517))
* Update URL to XO ([1af4c62](https://github.com/forresst/markdown-magic-package-json/commit/1af4c62))

### refactor

* improve the code and add docs into the code ([0c94ffb](https://github.com/forresst/markdown-magic-package-json/commit/0c94ffb))

### test

* Improve metadata titles and messages only in the original files ([6d5af41](https://github.com/forresst/markdown-magic-package-json/commit/6d5af41))
* Improve tests with macro ava ([6db7522](https://github.com/forresst/markdown-magic-package-json/commit/6db7522))
* Improve tests with titles and messages in the test files ([9f659b3](https://github.com/forresst/markdown-magic-package-json/commit/9f659b3))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/forresst/markdown-magic-package-json/compare/1.0.0...1.0.1) (2017-09-02)

### Docs

* Improve readme



<a name="1.0.0"></a>
# [1.0.0](https://github.com/forresst/markdown-magic-package-json/compare/0.1.0...1.0.0) (2017-09-01)


### Features

* **findup:** Using findup to slim the plugin ([23ab0d0](https://github.com/forresst/markdown-magic-package-json/commit/23ab0d0))

  The weight decreases from 202.9K (gzipped: 61.4K) to 23.4K (gzipped: 7.6K)


### BREAKING CHANGES

* **findup:** The new library `findup` change the behaviour to search `package.json`:
The search for the file `package.json`, even in the case of an unknown path, will always be done in the ancestor directory



<a name="0.1.0"></a>
# 0.1.0 (2017-08-29)

First version


