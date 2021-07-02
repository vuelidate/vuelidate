# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.25](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.24...@vuelidate/docs@2.0.0-alpha.25) (2021-07-02)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.24](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.23...@vuelidate/docs@2.0.0-alpha.24) (2021-07-01)


### Features

* **core:** add external validations support via $externalResults ([#837](https://github.com/vuelidate/vuelidate/issues/837)), closes [#824](https://github.com/vuelidate/vuelidate/issues/824) ([b259587](https://github.com/vuelidate/vuelidate/commit/b25958725ea310018d571fdd718847db98277684))
* **validators:** add a new forEach helper, and @vuelidate/components package ([#880](https://github.com/vuelidate/vuelidate/issues/880)) ([102c6cd](https://github.com/vuelidate/vuelidate/commit/102c6cde3deb5ead7da157d00ac7a964ae596a96))





# [2.0.0-alpha.23](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.22...@vuelidate/docs@2.0.0-alpha.23) (2021-06-07)


### Bug Fixes

* **validators:** async handling of `and`, `or`. Change `requiredIf` and `requiredUnless` to sync only  ([#864](https://github.com/vuelidate/vuelidate/issues/864)) ([6e7eedb](https://github.com/vuelidate/vuelidate/commit/6e7eedbcbec968d74050f98c325ef589bdeb7a37))


### BREAKING CHANGES

* **validators:** 1. Async validators passed to `and` and `or` must be wrapped in `withAsync`.
2. `requiredIf` and `requiredUnless` no longer work with functions, returning a Promise.





# [2.0.0-alpha.22](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.21...@vuelidate/docs@2.0.0-alpha.22) (2021-06-04)


### Features

* enable algolia search ([d0b99de](https://github.com/vuelidate/vuelidate/commit/d0b99dec172d8f096a8d39a96a4a1d0bc0a9b9da))





# [2.0.0-alpha.21](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.20...@vuelidate/docs@2.0.0-alpha.21) (2021-05-23)


### Code Refactoring

* **core:** revert back to assuming sync validators via computed and using withAsync for async validators ([#860](https://github.com/vuelidate/vuelidate/issues/860)) ([d45ea36](https://github.com/vuelidate/vuelidate/commit/d45ea3636c3fb5fc4c3133ce1717fd66c89ca121))


### BREAKING CHANGES

* **core:** Async validators must be wrapped in `withAsync`





# [2.0.0-alpha.20](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.19...@vuelidate/docs@2.0.0-alpha.20) (2021-05-18)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.19](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.18...@vuelidate/docs@2.0.0-alpha.19) (2021-04-18)


### Features

* **core:** adds an $uid property to the $errors objects, fix [#843](https://github.com/vuelidate/vuelidate/issues/843)  ([#844](https://github.com/vuelidate/vuelidate/issues/844)) ([cb3ca06](https://github.com/vuelidate/vuelidate/commit/cb3ca063afd7bd57389f3e6ab9255b2c75641eb0))





# [2.0.0-alpha.18](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.17...@vuelidate/docs@2.0.0-alpha.18) (2021-04-07)


### Bug Fixes

* **validators:** allow not, and, or to accept async validators ([#823](https://github.com/vuelidate/vuelidate/issues/823)) ([d7ae436](https://github.com/vuelidate/vuelidate/commit/d7ae4368c608bf9b431b0435fdf12f9ac5997798))





# [2.0.0-alpha.17](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.16...@vuelidate/docs@2.0.0-alpha.17) (2021-02-20)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.16](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.15...@vuelidate/docs@2.0.0-alpha.16) (2021-02-20)


### Code Refactoring

* rename $invalid response property to $valid ([#808](https://github.com/vuelidate/vuelidate/issues/808)) ([9f5d3e0](https://github.com/vuelidate/vuelidate/commit/9f5d3e09a20487340bc46fde2c3500b3db210686))


### BREAKING CHANGES

* It used to be $invalid, but that did not make any sense, as the return value was identical to boolean validators.





# [2.0.0-alpha.15](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.14...@vuelidate/docs@2.0.0-alpha.15) (2021-02-18)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.14](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.13...@vuelidate/docs@2.0.0-alpha.14) (2021-02-17)


### Code Refactoring

* **core:** change all validators to be async, removes withAsync helper ([#795](https://github.com/vuelidate/vuelidate/issues/795)) ([3a76cd6](https://github.com/vuelidate/vuelidate/commit/3a76cd6f3da68d45e674f867506969b77428b2b8))


### Features

* **core:** Support returning none boolean data from validators. ([#739](https://github.com/vuelidate/vuelidate/issues/739)) ([caf0eb8](https://github.com/vuelidate/vuelidate/commit/caf0eb8b68247efef2e3bf86173a043eeda23570))


### BREAKING CHANGES

* **core:** Unit tests will require users to always use `nextTick` between changes.





# [2.0.0-alpha.13](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.12...@vuelidate/docs@2.0.0-alpha.13) (2021-02-12)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.12](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.11...@vuelidate/docs@2.0.0-alpha.12) (2021-02-10)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.11](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.10...@vuelidate/docs@2.0.0-alpha.11) (2021-02-07)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.10](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.9...@vuelidate/docs@2.0.0-alpha.10) (2021-02-04)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.9](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.8...@vuelidate/docs@2.0.0-alpha.9) (2021-02-04)


### Features

* add global configs, remove mixin, add silentErrors, lazy mode  ([#790](https://github.com/vuelidate/vuelidate/issues/790)) ([22cd7c5](https://github.com/vuelidate/vuelidate/commit/22cd7c5ae5a0c5c2e4a021dc082509b3be3f5141)), closes [#670](https://github.com/vuelidate/vuelidate/issues/670)
* allow scoping of component validations, fixes: [#719](https://github.com/vuelidate/vuelidate/issues/719) ([#791](https://github.com/vuelidate/vuelidate/issues/791)) ([d7a8797](https://github.com/vuelidate/vuelidate/commit/d7a87976f3a1a27914c406462e09df69ccb653c8))


### BREAKING CHANGES

* Validations are no longer lazy by default, you need to specify `$lazy: true` to each, or at the top using the globalConfig.





# [2.0.0-alpha.8](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.7...@vuelidate/docs@2.0.0-alpha.8) (2020-11-19)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.7](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.6...@vuelidate/docs@2.0.0-alpha.7) (2020-11-02)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.6](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.5...@vuelidate/docs@2.0.0-alpha.6) (2020-10-24)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.5](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.4...@vuelidate/docs@2.0.0-alpha.5) (2020-10-23)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.4](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.3...@vuelidate/docs@2.0.0-alpha.4) (2020-09-24)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.3](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.2...@vuelidate/docs@2.0.0-alpha.3) (2020-09-15)


### Features

* add error message display and form submission ([b4655a2](https://github.com/vuelidate/vuelidate/commit/b4655a2ce9f71841bd212be6ff97a94047bc09cd))
* add more docs pages ([d6eaac1](https://github.com/vuelidate/vuelidate/commit/d6eaac1d27687369a4c6bc81ca52d8e57699efb8))
* improve the guide page ([f662965](https://github.com/vuelidate/vuelidate/commit/f662965699d213a8bb318a6864388b513324e085))
* rewrite home page ([f26280d](https://github.com/vuelidate/vuelidate/commit/f26280dc9b6759df251dc3d477c74a22c0316049))





# [2.0.0-alpha.2](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.1...@vuelidate/docs@2.0.0-alpha.2) (2020-09-13)

**Note:** Version bump only for package @vuelidate/docs





# [2.0.0-alpha.1](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.0...@vuelidate/docs@2.0.0-alpha.1) (2020-08-08)


### Features

* **core:** 🚀 Add context-aware validation support ([771828e](https://github.com/vuelidate/vuelidate/commit/771828e43654e453f5ca8d4719ca5466b5d363f8))
* **docs:** add AsComposition component to docs ([43ec225](https://github.com/vuelidate/vuelidate/commit/43ec225817cac7d37cc4475e627e4048bdcc3f93))
* **docs:** add test examples do docs ([5a08ad0](https://github.com/vuelidate/vuelidate/commit/5a08ad0cfe8bc0cb52c5c9d8b962ebde7bee80f1))
* Add $touch and $reset to root. ([#626](https://github.com/vuelidate/vuelidate/issues/626)) ([a80c164](https://github.com/vuelidate/vuelidate/commit/a80c164db882a860fc3e1c30c14d083f83c2c2a9))





# [2.0.0-alpha.1](https://github.com/vuelidate/vuelidate/compare/@vuelidate/docs@2.0.0-alpha.0...@vuelidate/docs@2.0.0-alpha.1) (2020-08-08)


### Features

* **core:** 🚀 Add context-aware validation support ([771828e](https://github.com/vuelidate/vuelidate/commit/771828e43654e453f5ca8d4719ca5466b5d363f8))
* **docs:** add AsComposition component to docs ([43ec225](https://github.com/vuelidate/vuelidate/commit/43ec225817cac7d37cc4475e627e4048bdcc3f93))
* **docs:** add test examples do docs ([5a08ad0](https://github.com/vuelidate/vuelidate/commit/5a08ad0cfe8bc0cb52c5c9d8b962ebde7bee80f1))
* Add $touch and $reset to root. ([#626](https://github.com/vuelidate/vuelidate/issues/626)) ([a80c164](https://github.com/vuelidate/vuelidate/commit/a80c164db882a860fc3e1c30c14d083f83c2c2a9))
