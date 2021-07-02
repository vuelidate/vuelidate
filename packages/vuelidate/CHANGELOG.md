# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.21](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.20...@vuelidate/core@2.0.0-alpha.21) (2021-07-02)


### Bug Fixes

* **core:** fixed type issues regarding ([#886](https://github.com/vuelidate/vuelidate/issues/886)) ([a292833](https://github.com/vuelidate/vuelidate/commit/a29283359f8119eb6fd6649274c0d7322cc81865))





# [2.0.0-alpha.20](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.19...@vuelidate/core@2.0.0-alpha.20) (2021-07-01)


### Features

* **core:** add external validations support via $externalResults ([#837](https://github.com/vuelidate/vuelidate/issues/837)), closes [#824](https://github.com/vuelidate/vuelidate/issues/824) ([b259587](https://github.com/vuelidate/vuelidate/commit/b25958725ea310018d571fdd718847db98277684))





# [2.0.0-alpha.19](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.18...@vuelidate/core@2.0.0-alpha.19) (2021-06-04)


### Bug Fixes

* **types:** export ValidationArgs, closes [#869](https://github.com/vuelidate/vuelidate/issues/869) ([8e89256](https://github.com/vuelidate/vuelidate/commit/8e89256f464228aecd3b5aa3a9c2115ed2a37345))





# [2.0.0-alpha.18](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.17...@vuelidate/core@2.0.0-alpha.18) (2021-05-23)


### Code Refactoring

* **core:** revert back to assuming sync validators via computed and using withAsync for async validators ([#860](https://github.com/vuelidate/vuelidate/issues/860)) ([d45ea36](https://github.com/vuelidate/vuelidate/commit/d45ea3636c3fb5fc4c3133ce1717fd66c89ca121))


### BREAKING CHANGES

* **core:** Async validators must be wrapped in `withAsync`





# [2.0.0-alpha.17](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.16...@vuelidate/core@2.0.0-alpha.17) (2021-05-18)


### Bug Fixes

* **types:**  add async custom validator response type ([#855](https://github.com/vuelidate/vuelidate/issues/855)), closes [#854](https://github.com/vuelidate/vuelidate/issues/854) ([0b2c4b7](https://github.com/vuelidate/vuelidate/commit/0b2c4b7cc97c22698f706ebbdab6a8e05118e295))





# [2.0.0-alpha.16](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.15...@vuelidate/core@2.0.0-alpha.16) (2021-04-18)


### Features

* **core:** adds an $uid property to the $errors objects, fix [#843](https://github.com/vuelidate/vuelidate/issues/843)  ([#844](https://github.com/vuelidate/vuelidate/issues/844)) ([cb3ca06](https://github.com/vuelidate/vuelidate/commit/cb3ca063afd7bd57389f3e6ab9255b2c75641eb0))





# [2.0.0-alpha.15](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.14...@vuelidate/core@2.0.0-alpha.15) (2021-04-07)


### Bug Fixes

* replace $invalid with $valid for validator response ([#822](https://github.com/vuelidate/vuelidate/issues/822)) ([d7c6c00](https://github.com/vuelidate/vuelidate/commit/d7c6c003cf891c53cb3908ad5dc04a447e8c879e))
* watch changes to arrays and objects deeply, closes [#832](https://github.com/vuelidate/vuelidate/issues/832) ([#833](https://github.com/vuelidate/vuelidate/issues/833)) ([f33ffbc](https://github.com/vuelidate/vuelidate/commit/f33ffbc979ac0ff4f278fdc8035944cac3a494d8))
* **types:** add boolean to the $scope config ([8486deb](https://github.com/vuelidate/vuelidate/commit/8486deb353c793ac04a4b97352f364154858b63e))


### Features

* allow usage of Vuelidate outside Vue components ([#828](https://github.com/vuelidate/vuelidate/issues/828)) ([4816b7d](https://github.com/vuelidate/vuelidate/commit/4816b7d11800edd2d342b539215c57ac54994ce2))





# [2.0.0-alpha.14](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.13...@vuelidate/core@2.0.0-alpha.14) (2021-02-20)


### Bug Fixes

* **types:** make $validate and $getResultsForChild none optional ([7d3fcf4](https://github.com/vuelidate/vuelidate/commit/7d3fcf4573981c234e010533a85224c26f2309fb))





# [2.0.0-alpha.13](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.12...@vuelidate/core@2.0.0-alpha.13) (2021-02-20)


### Code Refactoring

* rename $invalid response property to $valid ([#808](https://github.com/vuelidate/vuelidate/issues/808)) ([9f5d3e0](https://github.com/vuelidate/vuelidate/commit/9f5d3e09a20487340bc46fde2c3500b3db210686))


### BREAKING CHANGES

* It used to be $invalid, but that did not make any sense, as the return value was identical to boolean validators.





# [2.0.0-alpha.12](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.11...@vuelidate/core@2.0.0-alpha.12) (2021-02-17)


### Bug Fixes

* **core:** add fixes for Vue 2 ([e4ce82d](https://github.com/vuelidate/vuelidate/commit/e4ce82d8428df24c6251cfcfa818e5fccd1e7783))
* **types:** Updated useVuelidate global config types ([#804](https://github.com/vuelidate/vuelidate/issues/804)) ([4ef983b](https://github.com/vuelidate/vuelidate/commit/4ef983be4912a0dad6309ffd8ba21d48d4b70cba))


### Code Refactoring

* **core:** change all validators to be async, removes withAsync helper ([#795](https://github.com/vuelidate/vuelidate/issues/795)) ([3a76cd6](https://github.com/vuelidate/vuelidate/commit/3a76cd6f3da68d45e674f867506969b77428b2b8))


### Features

* **core:** Support returning none boolean data from validators. ([#739](https://github.com/vuelidate/vuelidate/issues/739)) ([caf0eb8](https://github.com/vuelidate/vuelidate/commit/caf0eb8b68247efef2e3bf86173a043eeda23570))


### BREAKING CHANGES

* **core:** Unit tests will require users to always use `nextTick` between changes.





# [2.0.0-alpha.11](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.10...@vuelidate/core@2.0.0-alpha.11) (2021-02-10)


### Bug Fixes

* **core:** remove isProxy and implement own ([95706a3](https://github.com/vuelidate/vuelidate/commit/95706a3ee667ae8d01b37172868360277da86c7f))
* **core:** remove isProxy and implement own in index.js ([376c054](https://github.com/vuelidate/vuelidate/commit/376c054844fcde8529e572a9bd1690a38621f5f7))





# [2.0.0-alpha.10](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.9...@vuelidate/core@2.0.0-alpha.10) (2021-02-07)


### Bug Fixes

* **core:** allow $autoDirty on the root, when passed a plain object as state ([#796](https://github.com/vuelidate/vuelidate/issues/796)) ([4d49bb2](https://github.com/vuelidate/vuelidate/commit/4d49bb2060bfa07f8e190489e89cb5240b37311d))





# [2.0.0-alpha.9](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.8...@vuelidate/core@2.0.0-alpha.9) (2021-02-04)


### Features

* add global configs, remove mixin, add silentErrors, lazy mode  ([#790](https://github.com/vuelidate/vuelidate/issues/790)) ([22cd7c5](https://github.com/vuelidate/vuelidate/commit/22cd7c5ae5a0c5c2e4a021dc082509b3be3f5141)), closes [#670](https://github.com/vuelidate/vuelidate/issues/670)
* allow scoping of component validations, fixes: [#719](https://github.com/vuelidate/vuelidate/issues/719) ([#791](https://github.com/vuelidate/vuelidate/issues/791)) ([d7a8797](https://github.com/vuelidate/vuelidate/commit/d7a87976f3a1a27914c406462e09df69ccb653c8))


### BREAKING CHANGES

* Validations are no longer lazy by default, you need to specify `$lazy: true` to each, or at the top using the globalConfig.





# [2.0.0-alpha.8](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.7...@vuelidate/core@2.0.0-alpha.8) (2020-11-19)


### Bug Fixes

* changed type for VuelidatePlugin to Plugin from vue ([#752](https://github.com/vuelidate/vuelidate/issues/752)) ([7daaf4c](https://github.com/vuelidate/vuelidate/commit/7daaf4c646c66123cc27d6ad883750f308c2c243))





# [2.0.0-alpha.7](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.6...@vuelidate/core@2.0.0-alpha.7) (2020-11-02)


### Bug Fixes

* **core:** fix VuelidatePlugin type to accept App argument ([#745](https://github.com/vuelidate/vuelidate/issues/745)) ([0fc3e74](https://github.com/vuelidate/vuelidate/commit/0fc3e744e23d4a4e2735f523328e9fb7d42ac164))
* **core:** pass path as parentKey to nested setValidations ([#746](https://github.com/vuelidate/vuelidate/issues/746)) ([3d42c60](https://github.com/vuelidate/vuelidate/commit/3d42c60fbc3c1a65ee1e06f49bff7379f43cffb5))





# [2.0.0-alpha.6](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.5...@vuelidate/core@2.0.0-alpha.6) (2020-10-24)

**Note:** Version bump only for package @vuelidate/core





# [2.0.0-alpha.5](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.4...@vuelidate/core@2.0.0-alpha.5) (2020-10-23)


### Bug Fixes

* chain of state refs ([#674](https://github.com/vuelidate/vuelidate/issues/674)) ([c0ae553](https://github.com/vuelidate/vuelidate/commit/c0ae5538272296b81c8b892a783b59a287843a88))
* **validators:** fix `not`,`or`, `and` validators ([#724](https://github.com/vuelidate/vuelidate/issues/724)) ([995c6f9](https://github.com/vuelidate/vuelidate/commit/995c6f909e43e4e03622d96986123498e6fa6378))


### Features

* typings ([#722](https://github.com/vuelidate/vuelidate/issues/722)) ([b99b8ab](https://github.com/vuelidate/vuelidate/commit/b99b8ab14fe6fdd81c3796594053147feb647961))





# [2.0.0-alpha.4](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.3...@vuelidate/core@2.0.0-alpha.4) (2020-09-24)

**Note:** Version bump only for package @vuelidate/core





# [2.0.0-alpha.3](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.2...@vuelidate/core@2.0.0-alpha.3) (2020-09-15)


### Bug Fixes

* **core:** handle mismatch in Vue 3.0 and composition-api plugin ([bc19566](https://github.com/vuelidate/vuelidate/commit/bc195663f8319b387a1964cf1b9abb0b4ffcc878))





# [2.0.0-alpha.2](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.1...@vuelidate/core@2.0.0-alpha.2) (2020-09-13)


### Bug Fixes

* **compat:** fix mixin; fix plugin object ([06d5e49](https://github.com/vuelidate/vuelidate/commit/06d5e49154897bce109d576dd70739b659d2d9dc))


### Features

* **compat:** use vue-demi for compat and apply vue 2.x fixes ([1ff120b](https://github.com/vuelidate/vuelidate/commit/1ff120b75c49025cfd01aac47d178cb73c6134a5))





# [2.0.0-alpha.1](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.0...@vuelidate/core@2.0.0-alpha.1) (2020-08-08)


### Bug Fixes

* **core:** allow for no validation rules when using useVuelidate ([5119f05](https://github.com/vuelidate/vuelidate/commit/5119f0580ddceccbfcdda272b1bcd9d381891794))
* **core:** ensure registerAs is always valid ([b01de4b](https://github.com/vuelidate/vuelidate/commit/b01de4b24d39017dff5e2d0adc1973199686f28f))
* **core:** fallback $params to empty object. Properly propagate $pending up to the root ([0b0d0d3](https://github.com/vuelidate/vuelidate/commit/0b0d0d329d0e74ecd18feadfedf73fc9f3e37a3f))
* **core:** fix $model on state ([37b65d4](https://github.com/vuelidate/vuelidate/commit/37b65d4659de74f85c3fbc2f14c4a00adf66762e))
* **core:** make $errors a reactive object ([3848e7b](https://github.com/vuelidate/vuelidate/commit/3848e7b7778571b400be74a668e5123814753ff9))
* **core:** move validations into $v computed for correct this ([55017c5](https://github.com/vuelidate/vuelidate/commit/55017c5bd3810a8bb9b9b3dec8242e97d3c9c185))
* remove unnecessary watch options ([b8c5181](https://github.com/vuelidate/vuelidate/commit/b8c5181c7a98e2be918935c1a15a494f49daf6e3))
* **core:** normalize validator output ([af116cc](https://github.com/vuelidate/vuelidate/commit/af116ccac66a36c608b0115d3ad1380deaddffda))
* **core:** unwrap $params in $message function ([e8e9074](https://github.com/vuelidate/vuelidate/commit/e8e90749f666b2765e1316cd884ed70a15cd7540))
* **core:** unwrap child results ([fe2c6f4](https://github.com/vuelidate/vuelidate/commit/fe2c6f46a2df2d3a4841a996d11d47f1a4bd6146))
* **core:** unwrap state when creating validation results ([99f9029](https://github.com/vuelidate/vuelidate/commit/99f90293e2c363ff2fa100e6398169d1aa20b49d))
* **core:** use cached setValidations state ([99d4728](https://github.com/vuelidate/vuelidate/commit/99d47289245b643d58f41e464902935b9af7f365))
* **vuelidate:** remove double nested result injection ([33aff45](https://github.com/vuelidate/vuelidate/commit/33aff45f2c1ac46c68f947e67db30be872c185e7))


### Features

* **core:** 🚀 Add context-aware validation support ([771828e](https://github.com/vuelidate/vuelidate/commit/771828e43654e453f5ca8d4719ca5466b5d363f8))
* **core:** $anyDirty should fallback on $dirty ([6b10bb4](https://github.com/vuelidate/vuelidate/commit/6b10bb4260f22040a24ee56e6ef728522ebe9796))
* **core:** add mixin support for old options API ([682bf74](https://github.com/vuelidate/vuelidate/commit/682bf748b684d4a1ee008affed350179ded4eb6a))
* replace vue-cli with vite ([#664](https://github.com/vuelidate/vuelidate/issues/664)) ([c155404](https://github.com/vuelidate/vuelidate/commit/c155404769fc78ceca5a2b766d0abf2071bff987))
* **core:** improve docs and add $propertyPath property to validators ([9ec284c](https://github.com/vuelidate/vuelidate/commit/9ec284cc08312fc87261c0f896cbb62542652aca))
* **core:** lazy validations ([8b95a0b](https://github.com/vuelidate/vuelidate/commit/8b95a0b2e279771634824bc8d90eb661ebedca07))
* **core:** make message an empty string by default ([cb7dc1d](https://github.com/vuelidate/vuelidate/commit/cb7dc1d38f09f31f573ff8cc24a53ec9c76c275b))
* **core:** make RegisterAs optional; use comp name & uid as key ([2fa7976](https://github.com/vuelidate/vuelidate/commit/2fa79760606ba5c7c591f115849b2b344486feb7))
* **core:** rename variables after review ([3bb7341](https://github.com/vuelidate/vuelidate/commit/3bb7341f7f43fff233ebcd1c121cf12427406c1a))
* **core:** update to Vue 3 ([35a49c3](https://github.com/vuelidate/vuelidate/commit/35a49c3aad7a7d14840e24b5d47f5929c87cbbf5))
* add $dirty cache WIP ([5725a38](https://github.com/vuelidate/vuelidate/commit/5725a38da12848fc699c719dafa06706107f0374))
* Add $touch and $reset to root. ([#626](https://github.com/vuelidate/vuelidate/issues/626)) ([a80c164](https://github.com/vuelidate/vuelidate/commit/a80c164db882a860fc3e1c30c14d083f83c2c2a9))
* add support for $model with reactive ([75c821d](https://github.com/vuelidate/vuelidate/commit/75c821db3eb71183c8be73c7f842efdf712fc07b))
* add validate function and other improvements ([#663](https://github.com/vuelidate/vuelidate/issues/663)) ([0d1ca73](https://github.com/vuelidate/vuelidate/commit/0d1ca73ca5f7574e15256cf8bfa94ea6170dc2dc))





# [1.0.0-alpha.2](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@1.0.0-alpha.1...@vuelidate/core@1.0.0-alpha.2) (2019-11-05)

**Note:** Version bump only for package @vuelidate/core





# 1.0.0-alpha.1 (2019-11-04)


### Features

* **validators:** Update validators to v 1.x. ([2e5b8c9](https://github.com/vuelidate/vuelidate/commit/2e5b8c9e777c94ab40d7762f6ddc6a82e6e02651))
* add jest as a global and package level test runner ([eb4c875](https://github.com/vuelidate/vuelidate/commit/eb4c875a442d626fec1b68d03e043c4ec94cfea9))
* move validator tests ([658a615](https://github.com/vuelidate/vuelidate/commit/658a6152f958cf6fc9c1028457682622d367e006))
* Rewrite Vuelidate with Vue 3.0 new reactivity API ([0794780](https://github.com/vuelidate/vuelidate/commit/0794780c5937cdc11ab8aa5447c85fa0a77d0932))





# 1.0.0-alpha.1 (2019-11-04)


### Features

* **validators:** Update validators to v 1.x. ([2e5b8c9](https://github.com/vuelidate/vuelidate/commit/2e5b8c9e777c94ab40d7762f6ddc6a82e6e02651))
* add jest as a global and package level test runner ([eb4c875](https://github.com/vuelidate/vuelidate/commit/eb4c875a442d626fec1b68d03e043c4ec94cfea9))
* move validator tests ([658a615](https://github.com/vuelidate/vuelidate/commit/658a6152f958cf6fc9c1028457682622d367e006))
* Rewrite Vuelidate with Vue 3.0 new reactivity API ([0794780](https://github.com/vuelidate/vuelidate/commit/0794780c5937cdc11ab8aa5447c85fa0a77d0932))
