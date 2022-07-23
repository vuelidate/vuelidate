# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.30](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.29...@vuelidate/validators@2.0.0-alpha.30) (2022-06-24)


### Bug Fixes

* **types:** add Ref type to parameters in validators, fixes [#1054](https://github.com/vuelidate/vuelidate/issues/1054) ([0962038](https://github.com/vuelidate/vuelidate/commit/0962038fcbc7ef0c38e9282a6b48a65313906c40))





# [2.0.0-alpha.29](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.28...@vuelidate/validators@2.0.0-alpha.29) (2022-05-01)


### Bug Fixes

* **types:** add MessageProps $params types to attributes ([#1033](https://github.com/vuelidate/vuelidate/issues/1033)) ([8502d1a](https://github.com/vuelidate/vuelidate/commit/8502d1af2fdbc41404aa11b11e0ff1c556882e01))
* **types:** minLength param type ([0d10b26](https://github.com/vuelidate/vuelidate/commit/0d10b2610cc2698e806f8fea38a0932ae5822de2))
* **validators:** improves the minLength and maxValue validator messages, closes [#1040](https://github.com/vuelidate/vuelidate/issues/1040) ([4c8c218](https://github.com/vuelidate/vuelidate/commit/4c8c218d6ee9952451fd5f070e25e9227658952b))





# [2.0.0-alpha.28](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.27...@vuelidate/validators@2.0.0-alpha.28) (2022-03-26)


### Bug Fixes

* add iife exports to all packages, closes [#1001](https://github.com/vuelidate/vuelidate/issues/1001) ([#1020](https://github.com/vuelidate/vuelidate/issues/1020)) ([2d1a203](https://github.com/vuelidate/vuelidate/commit/2d1a2034cddc0c473b7bfa1e44ac5601ee2dbce3))





# [2.0.0-alpha.27](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.26...@vuelidate/validators@2.0.0-alpha.27) (2022-03-13)


### Bug Fixes

* requiredIf and requiredUnless pre-trim value before validation to match required ([#997](https://github.com/vuelidate/vuelidate/issues/997)) ([72bad52](https://github.com/vuelidate/vuelidate/commit/72bad5275520a3e7545ccbcfc24c2a007e0f677d))


### Features

* **core:** add array of 'regex', closes [#400](https://github.com/vuelidate/vuelidate/issues/400) ([#1003](https://github.com/vuelidate/vuelidate/issues/1003)) ([62ba19d](https://github.com/vuelidate/vuelidate/commit/62ba19d0c988abd54cef5880cbb22a8e8f9122de))





# [2.0.0-alpha.26](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.25...@vuelidate/validators@2.0.0-alpha.26) (2021-12-28)


### Bug Fixes

* **types:** createI18nMessage (fix [#972](https://github.com/vuelidate/vuelidate/issues/972)) ([#981](https://github.com/vuelidate/vuelidate/issues/981)) ([2d55072](https://github.com/vuelidate/vuelidate/commit/2d55072d35715c013eb065a1e3cbe2755d421e82))





# [2.0.0-alpha.25](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.24...@vuelidate/validators@2.0.0-alpha.25) (2021-11-01)


### Bug Fixes

* update vue-demi and composition-api to latest versions, closes [#963](https://github.com/vuelidate/vuelidate/issues/963) ([#967](https://github.com/vuelidate/vuelidate/issues/967)) ([cb12037](https://github.com/vuelidate/vuelidate/commit/cb12037ef8b45ff53988b777c731aeb67ba59905))





# [2.0.0-alpha.24](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.23...@vuelidate/validators@2.0.0-alpha.24) (2021-10-20)


### Bug Fixes

* **validators:** add $invalid and $error to forEach ([#955](https://github.com/vuelidate/vuelidate/issues/955)) ([7ca6e3a](https://github.com/vuelidate/vuelidate/commit/7ca6e3a99083404676b6f280dac6ecabdc8ebb81))





# [2.0.0-alpha.23](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.22...@vuelidate/validators@2.0.0-alpha.23) (2021-10-06)


### Bug Fixes

* **types:** `ValidatorFn`, relax types, closes [#903](https://github.com/vuelidate/vuelidate/issues/903) ([#941](https://github.com/vuelidate/vuelidate/issues/941)) ([a81a4d8](https://github.com/vuelidate/vuelidate/commit/a81a4d889d81b20382ad89b8d5d5004315840788))
* **types:** fix minLength param name ([#946](https://github.com/vuelidate/vuelidate/issues/946)) ([2652418](https://github.com/vuelidate/vuelidate/commit/26524181c80bf7b540fc72a52852d8af09129e99))


### Features

* **validators:** provide colletion item to forEach helper ([#944](https://github.com/vuelidate/vuelidate/issues/944)) ([9661d4d](https://github.com/vuelidate/vuelidate/commit/9661d4d594eea636f44c8be2bcf20b1452dd3593))





# [2.0.0-alpha.22](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.21...@vuelidate/validators@2.0.0-alpha.22) (2021-09-17)


### Bug Fixes

* **validators:** prevent forEach helper from throwing, when a state property has no validator ([#932](https://github.com/vuelidate/vuelidate/issues/932)), closes [#931](https://github.com/vuelidate/vuelidate/issues/931) ([2cd1fbb](https://github.com/vuelidate/vuelidate/commit/2cd1fbbfb8ee981886a4a540e4ddd13593ec2d05))
* **validators:** update the url validator, to reduce potential ReDos attacks ([#933](https://github.com/vuelidate/vuelidate/issues/933)) ([1f0ca31](https://github.com/vuelidate/vuelidate/commit/1f0ca31c30e5032f00dbd14c4791b5ee7928f71d))





# [2.0.0-alpha.21](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.20...@vuelidate/validators@2.0.0-alpha.21) (2021-08-14)

**Note:** Version bump only for package @vuelidate/validators





# [2.0.0-alpha.20](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.19...@vuelidate/validators@2.0.0-alpha.20) (2021-08-08)

**Note:** Version bump only for package @vuelidate/validators





# [2.0.0-alpha.19](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.18...@vuelidate/validators@2.0.0-alpha.19) (2021-07-28)


### Bug Fixes

* email validation with uppercase domain ([#888](https://github.com/vuelidate/vuelidate/issues/888)) ([d028e16](https://github.com/vuelidate/vuelidate/commit/d028e164e0781ed2e716dbac77228a1443222366))


### Features

* **validators:** add i18n message helper ([#894](https://github.com/vuelidate/vuelidate/issues/894)) ([d5f6d32](https://github.com/vuelidate/vuelidate/commit/d5f6d322a50dfcf218e98a21c12e962e3f25b202))





# [2.0.0-alpha.18](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.17...@vuelidate/validators@2.0.0-alpha.18) (2021-07-01)


### Features

* **validators:** add a new forEach helper, and @vuelidate/components package ([#880](https://github.com/vuelidate/vuelidate/issues/880)) ([102c6cd](https://github.com/vuelidate/vuelidate/commit/102c6cde3deb5ead7da157d00ac7a964ae596a96))





# [2.0.0-alpha.17](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.16...@vuelidate/validators@2.0.0-alpha.17) (2021-06-07)


### Bug Fixes

* **validators:** async handling of `and`, `or`. Change `requiredIf` and `requiredUnless` to sync only  ([#864](https://github.com/vuelidate/vuelidate/issues/864)) ([6e7eedb](https://github.com/vuelidate/vuelidate/commit/6e7eedbcbec968d74050f98c325ef589bdeb7a37))


### BREAKING CHANGES

* **validators:** 1. Async validators passed to `and` and `or` must be wrapped in `withAsync`.
2. `requiredIf` and `requiredUnless` no longer work with functions, returning a Promise.





# [2.0.0-alpha.16](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.15...@vuelidate/validators@2.0.0-alpha.16) (2021-06-04)

**Note:** Version bump only for package @vuelidate/validators





# [2.0.0-alpha.15](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.14...@vuelidate/validators@2.0.0-alpha.15) (2021-05-23)


### Code Refactoring

* **core:** revert back to assuming sync validators via computed and using withAsync for async validators ([#860](https://github.com/vuelidate/vuelidate/issues/860)) ([d45ea36](https://github.com/vuelidate/vuelidate/commit/d45ea3636c3fb5fc4c3133ce1717fd66c89ca121))


### BREAKING CHANGES

* **core:** Async validators must be wrapped in `withAsync`





# [2.0.0-alpha.14](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.13...@vuelidate/validators@2.0.0-alpha.14) (2021-05-18)


### Bug Fixes

* **validators:** properly pass the this context to validators ([#845](https://github.com/vuelidate/vuelidate/issues/845)) ([93f57a6](https://github.com/vuelidate/vuelidate/commit/93f57a6f7eabe1cf25b3d587c9286cfa215bac9b))





# [2.0.0-alpha.13](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.12...@vuelidate/validators@2.0.0-alpha.13) (2021-04-07)


### Bug Fixes

* **validators:** allow not, and, or to accept async validators ([#823](https://github.com/vuelidate/vuelidate/issues/823)) ([d7ae436](https://github.com/vuelidate/vuelidate/commit/d7ae4368c608bf9b431b0435fdf12f9ac5997798))
* replace $invalid with $valid for validator response ([#822](https://github.com/vuelidate/vuelidate/issues/822)) ([d7c6c00](https://github.com/vuelidate/vuelidate/commit/d7c6c003cf891c53cb3908ad5dc04a447e8c879e))





# [2.0.0-alpha.12](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.11...@vuelidate/validators@2.0.0-alpha.12) (2021-02-20)

**Note:** Version bump only for package @vuelidate/validators





# [2.0.0-alpha.11](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.10...@vuelidate/validators@2.0.0-alpha.11) (2021-02-18)


### Bug Fixes

* **validators:** pass value to function in requiredIf and requiredUnless ([a311d22](https://github.com/vuelidate/vuelidate/commit/a311d22bf631105390a1c482eefdc12355f3b57f)), closes [#806](https://github.com/vuelidate/vuelidate/issues/806)





# [2.0.0-alpha.10](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.9...@vuelidate/validators@2.0.0-alpha.10) (2021-02-17)


### Code Refactoring

* **core:** change all validators to be async, removes withAsync helper ([#795](https://github.com/vuelidate/vuelidate/issues/795)) ([3a76cd6](https://github.com/vuelidate/vuelidate/commit/3a76cd6f3da68d45e674f867506969b77428b2b8))


### Features

* **core:** Support returning none boolean data from validators. ([#739](https://github.com/vuelidate/vuelidate/issues/739)) ([caf0eb8](https://github.com/vuelidate/vuelidate/commit/caf0eb8b68247efef2e3bf86173a043eeda23570))


### BREAKING CHANGES

* **core:** Unit tests will require users to always use `nextTick` between changes.





# [2.0.0-alpha.9](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.8...@vuelidate/validators@2.0.0-alpha.9) (2021-02-12)


### Bug Fixes

* **validators:** add the helpers to the types ([dd1105d](https://github.com/vuelidate/vuelidate/commit/dd1105deaf0b7d7d4212ee0d4318747342d4080a))





# [2.0.0-alpha.8](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.7...@vuelidate/validators@2.0.0-alpha.8) (2021-02-07)

**Note:** Version bump only for package @vuelidate/validators





# [2.0.0-alpha.7](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.6...@vuelidate/validators@2.0.0-alpha.7) (2021-02-04)


### Bug Fixes

* **types:** declare second sameAs validator parameter as optional ([#773](https://github.com/vuelidate/vuelidate/issues/773)) ([#776](https://github.com/vuelidate/vuelidate/issues/776)) ([9ed9365](https://github.com/vuelidate/vuelidate/commit/9ed9365fb264a0e0f5024fba43e2dedf15e981d2))





# [2.0.0-alpha.6](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.5...@vuelidate/validators@2.0.0-alpha.6) (2021-02-04)


### Bug Fixes

* improve the validator message consistency ([#779](https://github.com/vuelidate/vuelidate/issues/779)) ([9d47c3c](https://github.com/vuelidate/vuelidate/commit/9d47c3c1507952a519d007b3dfdffb9c080a6640))
* remove side effects from withMessage helper ([#763](https://github.com/vuelidate/vuelidate/issues/763)) ([e77a610](https://github.com/vuelidate/vuelidate/commit/e77a61039afcac3dcce66d84d4229ead5b050a58))





# [2.0.0-alpha.5](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.4...@vuelidate/validators@2.0.0-alpha.5) (2020-11-02)

**Note:** Version bump only for package @vuelidate/validators





# [2.0.0-alpha.4](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.3...@vuelidate/validators@2.0.0-alpha.4) (2020-10-24)

**Note:** Version bump only for package @vuelidate/validators





# [2.0.0-alpha.3](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.2...@vuelidate/validators@2.0.0-alpha.3) (2020-10-23)


### Bug Fixes

* **validators:** fix `not`,`or`, `and` validators ([#724](https://github.com/vuelidate/vuelidate/issues/724)) ([995c6f9](https://github.com/vuelidate/vuelidate/commit/995c6f909e43e4e03622d96986123498e6fa6378))
* **validators:** Unify minLength validator format ([#726](https://github.com/vuelidate/vuelidate/issues/726)) ([e5d755a](https://github.com/vuelidate/vuelidate/commit/e5d755a429ee9bbb20c24d893e98fa7a082aaf0a))
* **validators:** update "numeric" validator ([#711](https://github.com/vuelidate/vuelidate/issues/711)) ([a80b157](https://github.com/vuelidate/vuelidate/commit/a80b1574f3e456970b92da61efe0e1e4a7a1e101))
* **validators:** update email regex validator ([#718](https://github.com/vuelidate/vuelidate/issues/718)) ([d68a480](https://github.com/vuelidate/vuelidate/commit/d68a48062c2cf21512d8c7e72ceb843a083ac4c5))


### Features

* typings ([#722](https://github.com/vuelidate/vuelidate/issues/722)) ([b99b8ab](https://github.com/vuelidate/vuelidate/commit/b99b8ab14fe6fdd81c3796594053147feb647961))





# [2.0.0-alpha.2](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.1...@vuelidate/validators@2.0.0-alpha.2) (2020-09-13)


### Features

* **compat:** use vue-demi in validators package ([baf8816](https://github.com/vuelidate/vuelidate/commit/baf881617ae2579a5b17f42963987f11e180c482))





# [2.0.0-alpha.1](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@2.0.0-alpha.0...@vuelidate/validators@2.0.0-alpha.1) (2020-08-08)


### Bug Fixes

* **validators:** add unwrap calls to the core helpers like "req", "len", "regex", along with some validators ([b6ec948](https://github.com/vuelidate/vuelidate/commit/b6ec948e629e169f78d2679cb50162aeb3631f2d))


### Features

* **validators:** add promise as property resolver ([aab11d1](https://github.com/vuelidate/vuelidate/commit/aab11d16a804550f7c3bc3acebd2af0f850486ca))
* **validators:** expose an isTruthy helper ([dc2235e](https://github.com/vuelidate/vuelidate/commit/dc2235e612e8663b56488eb79eeb7fe99c72b6bc))
* add $dirty cache WIP ([5725a38](https://github.com/vuelidate/vuelidate/commit/5725a38da12848fc699c719dafa06706107f0374))
* add validate function and other improvements ([#663](https://github.com/vuelidate/vuelidate/issues/663)) ([0d1ca73](https://github.com/vuelidate/vuelidate/commit/0d1ca73ca5f7574e15256cf8bfa94ea6170dc2dc))





# [1.0.0-alpha.2](https://github.com/vuelidate/vuelidate/compare/@vuelidate/validators@1.0.0-alpha.1...@vuelidate/validators@1.0.0-alpha.2) (2019-11-05)

**Note:** Version bump only for package @vuelidate/validators





# 1.0.0-alpha.1 (2019-11-04)


### Features

* **validators:** improve utils organisation ([4d710df](https://github.com/vuelidate/vuelidate/commit/4d710dfa1aeaab955dc81fa57e754c0932991121))
* **validators:** Update validators to v 1.x. ([2e5b8c9](https://github.com/vuelidate/vuelidate/commit/2e5b8c9e777c94ab40d7762f6ddc6a82e6e02651))
* add jest as a global and package level test runner ([eb4c875](https://github.com/vuelidate/vuelidate/commit/eb4c875a442d626fec1b68d03e043c4ec94cfea9))
* move validator tests ([658a615](https://github.com/vuelidate/vuelidate/commit/658a6152f958cf6fc9c1028457682622d367e006))
* Rewrite Vuelidate with Vue 3.0 new reactivity API ([0794780](https://github.com/vuelidate/vuelidate/commit/0794780c5937cdc11ab8aa5447c85fa0a77d0932))





# 1.0.0-alpha.1 (2019-11-04)


### Features

* **validators:** improve utils organisation ([4d710df](https://github.com/vuelidate/vuelidate/commit/4d710dfa1aeaab955dc81fa57e754c0932991121))
* **validators:** Update validators to v 1.x. ([2e5b8c9](https://github.com/vuelidate/vuelidate/commit/2e5b8c9e777c94ab40d7762f6ddc6a82e6e02651))
* add jest as a global and package level test runner ([eb4c875](https://github.com/vuelidate/vuelidate/commit/eb4c875a442d626fec1b68d03e043c4ec94cfea9))
* move validator tests ([658a615](https://github.com/vuelidate/vuelidate/commit/658a6152f958cf6fc9c1028457682622d367e006))
* Rewrite Vuelidate with Vue 3.0 new reactivity API ([0794780](https://github.com/vuelidate/vuelidate/commit/0794780c5937cdc11ab8aa5447c85fa0a77d0932))
