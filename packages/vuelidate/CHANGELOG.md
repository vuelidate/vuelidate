# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.41](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.40...@vuelidate/core@2.0.0-alpha.41) (2022-05-01)


### Bug Fixes

* support optionMergeStrategies, closes [#789](https://github.com/vuelidate/vuelidate/issues/789) ([#1049](https://github.com/vuelidate/vuelidate/issues/1049)) ([dc307c9](https://github.com/vuelidate/vuelidate/commit/dc307c9b63975175219a3f8f5079f72d360efe4d))





# [2.0.0-alpha.40](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.39...@vuelidate/core@2.0.0-alpha.40) (2022-03-30)


### Bug Fixes

* **core:** correct type definition of ValidationArgs ([#1026](https://github.com/vuelidate/vuelidate/issues/1026)) ([e7622d8](https://github.com/vuelidate/vuelidate/commit/e7622d8ac2af318a5a4920c2060871e265d8ec14))





# [2.0.0-alpha.39](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.38...@vuelidate/core@2.0.0-alpha.39) (2022-03-28)


### Bug Fixes

* **types:** build issue with typescript undefined error ([#1024](https://github.com/vuelidate/vuelidate/issues/1024)) ([2c1f83e](https://github.com/vuelidate/vuelidate/commit/2c1f83e96d072c8a4223a98f8ce93db31d392ec2))





# [2.0.0-alpha.38](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.37...@vuelidate/core@2.0.0-alpha.38) (2022-03-27)


### Bug Fixes

* **core:** make sure $validate, triggers newly added children ([#1023](https://github.com/vuelidate/vuelidate/issues/1023)) ([800d240](https://github.com/vuelidate/vuelidate/commit/800d240194dff94bcc486f0d992b1548dec61575))





# [2.0.0-alpha.37](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.36...@vuelidate/core@2.0.0-alpha.37) (2022-03-27)


### Bug Fixes

* **core:** fix typo in symbol description ([#1004](https://github.com/vuelidate/vuelidate/issues/1004)) ([a2de77f](https://github.com/vuelidate/vuelidate/commit/a2de77fa5a2d6a90183af9ac57b2d032b0721a53))
* **types:** export BaseValidation for typing props ([#994](https://github.com/vuelidate/vuelidate/issues/994)) ([d61410f](https://github.com/vuelidate/vuelidate/commit/d61410ff90fad4347f128fd56844e1b9af66074c))
* **types:** make the validation arguments optional. it's not always needed to validate everything ([#1022](https://github.com/vuelidate/vuelidate/issues/1022)) ([073f3d8](https://github.com/vuelidate/vuelidate/commit/073f3d822f50bd4d62a86d15c4b42f992dee6dbb))





# [2.0.0-alpha.36](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.35...@vuelidate/core@2.0.0-alpha.36) (2022-03-26)


### Bug Fixes

* add iife exports to all packages, closes [#1001](https://github.com/vuelidate/vuelidate/issues/1001) ([#1020](https://github.com/vuelidate/vuelidate/issues/1020)) ([2d1a203](https://github.com/vuelidate/vuelidate/commit/2d1a2034cddc0c473b7bfa1e44ac5601ee2dbce3))





# [2.0.0-alpha.35](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.34...@vuelidate/core@2.0.0-alpha.35) (2022-03-13)


### Bug Fixes

* **types:** useVuelidate return value ([#1010](https://github.com/vuelidate/vuelidate/issues/1010)) ([89a7fae](https://github.com/vuelidate/vuelidate/commit/89a7faee0940ba339385ddd0c01da97ae704f940))





# [2.0.0-alpha.34](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.33...@vuelidate/core@2.0.0-alpha.34) (2022-01-16)


### Bug Fixes

* UseVuelidate return type ([#990](https://github.com/vuelidate/vuelidate/issues/990)) ([9c9de3d](https://github.com/vuelidate/vuelidate/commit/9c9de3dbf69b897ddd404c1db681d2169710c820)), closes [/github.com/vuelidate/vuelidate/issues/925#issuecomment-1008406811](https://github.com//github.com/vuelidate/vuelidate/issues/925/issues/issuecomment-1008406811)





# [2.0.0-alpha.33](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.32...@vuelidate/core@2.0.0-alpha.33) (2021-12-28)


### Bug Fixes

* add missing $path property type ([#986](https://github.com/vuelidate/vuelidate/issues/986)) ([dc56201](https://github.com/vuelidate/vuelidate/commit/dc56201700d1904ae97c08e8fe87551e71bec596))


### Features

* allow passing external vue instance, closes [#815](https://github.com/vuelidate/vuelidate/issues/815) ([#987](https://github.com/vuelidate/vuelidate/issues/987)) ([fdf5138](https://github.com/vuelidate/vuelidate/commit/fdf51386103b0dbfff9732b35b4535030e77b67a)), closes [#982](https://github.com/vuelidate/vuelidate/issues/982)





# [2.0.0-alpha.32](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.31...@vuelidate/core@2.0.0-alpha.32) (2021-11-01)


### Bug Fixes

* **core:** allow providing child results into multiple Vuelidate instances ([#961](https://github.com/vuelidate/vuelidate/issues/961)) ([8e173a6](https://github.com/vuelidate/vuelidate/commit/8e173a69e5cb5c0043ea8b9a92a74dd2d983c04b))


### Features

* **core:** pass parent object state to validator second parameter ([#818](https://github.com/vuelidate/vuelidate/issues/818)) ([d1ecb20](https://github.com/vuelidate/vuelidate/commit/d1ecb20915fbc46b20c0a12f82a804f396014ada))


### BREAKING CHANGES

* **core:** Second parameter in validators changed from `vm` to `parent object` of the current property.





# [2.0.0-alpha.31](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.30...@vuelidate/core@2.0.0-alpha.31) (2021-11-01)


### Bug Fixes

* update vue-demi and composition-api to latest versions, closes [#963](https://github.com/vuelidate/vuelidate/issues/963) ([#967](https://github.com/vuelidate/vuelidate/issues/967)) ([cb12037](https://github.com/vuelidate/vuelidate/commit/cb12037ef8b45ff53988b777c731aeb67ba59905))





# [2.0.0-alpha.30](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.29...@vuelidate/core@2.0.0-alpha.30) (2021-10-22)


### Bug Fixes

* **types:** make `$rewardEarly` optional in types. closes [#958](https://github.com/vuelidate/vuelidate/issues/958) ([61006de](https://github.com/vuelidate/vuelidate/commit/61006de5c047e62a883e41521c30736e342af3b9))





# [2.0.0-alpha.29](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.28...@vuelidate/core@2.0.0-alpha.29) (2021-10-20)


### Features

* **core:** add reward early mode, closes  [#897](https://github.com/vuelidate/vuelidate/issues/897) ([#951](https://github.com/vuelidate/vuelidate/issues/951)) ([62ee67d](https://github.com/vuelidate/vuelidate/commit/62ee67db241a8a98dea77511599a8fd661f7116a))





# [2.0.0-alpha.28](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.27...@vuelidate/core@2.0.0-alpha.28) (2021-10-15)


### Bug Fixes

* **types:** revert the Vue type on ValidatorFn, closes [#949](https://github.com/vuelidate/vuelidate/issues/949) ([44ea35c](https://github.com/vuelidate/vuelidate/commit/44ea35c98e5bec45787c6bc850fc06d7124962b5))





# [2.0.0-alpha.27](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.26...@vuelidate/core@2.0.0-alpha.27) (2021-10-06)


### Bug Fixes

* **types:** `ValidatorFn`, relax types, closes [#903](https://github.com/vuelidate/vuelidate/issues/903) ([#941](https://github.com/vuelidate/vuelidate/issues/941)) ([a81a4d8](https://github.com/vuelidate/vuelidate/commit/a81a4d889d81b20382ad89b8d5d5004315840788))





# [2.0.0-alpha.26](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.25...@vuelidate/core@2.0.0-alpha.26) (2021-09-17)

**Note:** Version bump only for package @vuelidate/core





# [2.0.0-alpha.25](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.24...@vuelidate/core@2.0.0-alpha.25) (2021-09-02)


### Features

* **core:** add the $validate method to every validation leaf ([#926](https://github.com/vuelidate/vuelidate/issues/926)) ([0738621](https://github.com/vuelidate/vuelidate/commit/07386213e7389ea755c3d3b8395f925e432d10c6))
* **core:** allow passing configs in OptionsApi directly to `useVuelidate`, closes [#922](https://github.com/vuelidate/vuelidate/issues/922) ([#927](https://github.com/vuelidate/vuelidate/issues/927)) ([e14fba9](https://github.com/vuelidate/vuelidate/commit/e14fba946fde7afd82fb97fe328f16e7073a44cc))





# [2.0.0-alpha.24](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.23...@vuelidate/core@2.0.0-alpha.24) (2021-08-14)


### Bug Fixes

* **core:** reset the $externalResults key for a changed property, closes [#891](https://github.com/vuelidate/vuelidate/issues/891) ([#916](https://github.com/vuelidate/vuelidate/issues/916)) ([67d56d7](https://github.com/vuelidate/vuelidate/commit/67d56d78e0c792c0e0e0e6e8a8249a1f924f7096))





# [2.0.0-alpha.23](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.22...@vuelidate/core@2.0.0-alpha.23) (2021-08-08)


### Bug Fixes

* **core:** change async validators to return `invalid: true`, only after they resolve ([#914](https://github.com/vuelidate/vuelidate/issues/914)) ([64892a5](https://github.com/vuelidate/vuelidate/commit/64892a5ebcdee1ad8c728766d9e693f605e36477))





# [2.0.0-alpha.22](https://github.com/vuelidate/vuelidate/compare/@vuelidate/core@2.0.0-alpha.21...@vuelidate/core@2.0.0-alpha.22) (2021-07-28)


### Bug Fixes

* **types:** allow reactive ServerErrors in GlobalConfig ([#901](https://github.com/vuelidate/vuelidate/issues/901)) ([2515777](https://github.com/vuelidate/vuelidate/commit/25157771d38806826a81b8bdf5c162a6c9952077))
* **types:** writable $model, closes vuelidate[#892](https://github.com/vuelidate/vuelidate/issues/892) ([#893](https://github.com/vuelidate/vuelidate/issues/893)) ([bb545d8](https://github.com/vuelidate/vuelidate/commit/bb545d8d9db9c270324a91e353fbdecf24a9dc13))





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
