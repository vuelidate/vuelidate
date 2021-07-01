# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0](https://github.com/vuelidate/vuelidate/compare/test-project@0.5.0...test-project@0.6.0) (2021-07-01)


### Features

* **validators:** add a new forEach helper, and @vuelidate/components package ([#880](https://github.com/vuelidate/vuelidate/issues/880)) ([102c6cd](https://github.com/vuelidate/vuelidate/commit/102c6cde3deb5ead7da157d00ac7a964ae596a96))





# [0.5.0](https://github.com/vuelidate/vuelidate/compare/test-project@0.4.0...test-project@0.5.0) (2021-05-23)


### Code Refactoring

* **core:** revert back to assuming sync validators via computed and using withAsync for async validators ([#860](https://github.com/vuelidate/vuelidate/issues/860)) ([d45ea36](https://github.com/vuelidate/vuelidate/commit/d45ea3636c3fb5fc4c3133ce1717fd66c89ca121))


### BREAKING CHANGES

* **core:** Async validators must be wrapped in `withAsync`





# [0.4.0](https://github.com/vuelidate/vuelidate/compare/test-project@0.3.0...test-project@0.4.0) (2021-02-17)


### Code Refactoring

* **core:** change all validators to be async, removes withAsync helper ([#795](https://github.com/vuelidate/vuelidate/issues/795)) ([3a76cd6](https://github.com/vuelidate/vuelidate/commit/3a76cd6f3da68d45e674f867506969b77428b2b8))


### BREAKING CHANGES

* **core:** Unit tests will require users to always use `nextTick` between changes.





# [0.3.0](https://github.com/vuelidate/vuelidate/compare/test-project@0.2.4...test-project@0.3.0) (2021-02-04)


### Features

* add global configs, remove mixin, add silentErrors, lazy mode  ([#790](https://github.com/vuelidate/vuelidate/issues/790)) ([22cd7c5](https://github.com/vuelidate/vuelidate/commit/22cd7c5ae5a0c5c2e4a021dc082509b3be3f5141)), closes [#670](https://github.com/vuelidate/vuelidate/issues/670)


### BREAKING CHANGES

* Validations are no longer lazy by default, you need to specify `$lazy: true` to each, or at the top using the globalConfig.





## [0.2.4](https://github.com/vuelidate/vuelidate/compare/test-project@0.2.3...test-project@0.2.4) (2020-11-19)

**Note:** Version bump only for package test-project





## [0.2.3](https://github.com/vuelidate/vuelidate/compare/test-project@0.2.2...test-project@0.2.3) (2020-10-23)

**Note:** Version bump only for package test-project





## [0.2.2](https://github.com/vuelidate/vuelidate/compare/test-project@0.2.1...test-project@0.2.2) (2020-09-24)

**Note:** Version bump only for package test-project





## [0.2.1](https://github.com/vuelidate/vuelidate/compare/test-project@0.2.0...test-project@0.2.1) (2020-09-13)

**Note:** Version bump only for package test-project





# 0.2.0 (2020-08-08)


### Bug Fixes

* **core:** move validations into $v computed for correct this ([55017c5](https://github.com/vuelidate/vuelidate/commit/55017c5bd3810a8bb9b9b3dec8242e97d3c9c185))
* **core:** use cached setValidations state ([99d4728](https://github.com/vuelidate/vuelidate/commit/99d47289245b643d58f41e464902935b9af7f365))


### Features

* **core:** add mixin support for old options API ([682bf74](https://github.com/vuelidate/vuelidate/commit/682bf748b684d4a1ee008affed350179ded4eb6a))
* **test-project:** add a test project in Vue 3 ([0f2db5e](https://github.com/vuelidate/vuelidate/commit/0f2db5e63feab16c16d8edee3f3690e0a900ab4f))
* **test-project:** add test components ([29214ca](https://github.com/vuelidate/vuelidate/commit/29214ca038b37be8a405566bc7b5137c6c337ec9))
* add $dirty cache WIP ([5725a38](https://github.com/vuelidate/vuelidate/commit/5725a38da12848fc699c719dafa06706107f0374))
* add validate function and other improvements ([#663](https://github.com/vuelidate/vuelidate/issues/663)) ([0d1ca73](https://github.com/vuelidate/vuelidate/commit/0d1ca73ca5f7574e15256cf8bfa94ea6170dc2dc))
* add vue-router ([#668](https://github.com/vuelidate/vuelidate/issues/668)) ([20eea8b](https://github.com/vuelidate/vuelidate/commit/20eea8bda9fafce4ee9c8935648c3d5dcaa78097))
* replace vue-cli with vite ([#664](https://github.com/vuelidate/vuelidate/issues/664)) ([c155404](https://github.com/vuelidate/vuelidate/commit/c155404769fc78ceca5a2b766d0abf2071bff987))





# 0.2.0 (2020-08-08)


### Bug Fixes

* **core:** move validations into $v computed for correct this ([55017c5](https://github.com/vuelidate/vuelidate/commit/55017c5bd3810a8bb9b9b3dec8242e97d3c9c185))
* **core:** use cached setValidations state ([99d4728](https://github.com/vuelidate/vuelidate/commit/99d47289245b643d58f41e464902935b9af7f365))


### Features

* **core:** add mixin support for old options API ([682bf74](https://github.com/vuelidate/vuelidate/commit/682bf748b684d4a1ee008affed350179ded4eb6a))
* **test-project:** add a test project in Vue 3 ([0f2db5e](https://github.com/vuelidate/vuelidate/commit/0f2db5e63feab16c16d8edee3f3690e0a900ab4f))
* **test-project:** add test components ([29214ca](https://github.com/vuelidate/vuelidate/commit/29214ca038b37be8a405566bc7b5137c6c337ec9))
* add $dirty cache WIP ([5725a38](https://github.com/vuelidate/vuelidate/commit/5725a38da12848fc699c719dafa06706107f0374))
* add validate function and other improvements ([#663](https://github.com/vuelidate/vuelidate/issues/663)) ([0d1ca73](https://github.com/vuelidate/vuelidate/commit/0d1ca73ca5f7574e15256cf8bfa94ea6170dc2dc))
* add vue-router ([#668](https://github.com/vuelidate/vuelidate/issues/668)) ([20eea8b](https://github.com/vuelidate/vuelidate/commit/20eea8bda9fafce4ee9c8935648c3d5dcaa78097))
* replace vue-cli with vite ([#664](https://github.com/vuelidate/vuelidate/issues/664)) ([c155404](https://github.com/vuelidate/vuelidate/commit/c155404769fc78ceca5a2b766d0abf2071bff987))
