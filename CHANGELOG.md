# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.1-alpha.8](https://github.com/co-it/schematics/compare/v1.0.1-alpha.7...v1.0.1-alpha.8) (2019-04-01)


### Bug Fixes

* accept *schema.json files | closes [#27](https://github.com/co-it/schematics/issues/27) ([094b3c6](https://github.com/co-it/schematics/commit/094b3c6))





## [1.0.1-alpha.7](https://github.com/co-IT/schematics/compare/v1.0.1-alpha.6...v1.0.1-alpha.7) (2019-04-01)


### Bug Fixes

* **cypress:** generate an example test that does not fail ([781f4db](https://github.com/co-IT/schematics/commit/781f4db))
* **jest:** fix testing if pre-push hook is configured ([1fcbe84](https://github.com/co-IT/schematics/commit/1fcbe84))
* **schema:** allow Angular CLI 7.2.x to discover jest & commitlint schematic ([73dddad](https://github.com/co-IT/schematics/commit/73dddad))


### Features

* **jest:** add possibility to configure husky for pre-push hook ([81b964c](https://github.com/co-IT/schematics/commit/81b964c))
* **jest:** add template for husky hook ([d93658a](https://github.com/co-IT/schematics/commit/d93658a))





## [1.0.1-alpha.6](https://github.com/co-IT/schematics/compare/v1.0.1-alpha.5...v1.0.1-alpha.6) (2019-03-27)


### Bug Fixes

* **cypress:** use correct extends option in tsconfig ([6d24da3](https://github.com/co-IT/schematics/commit/6d24da3))
* **cypress:** use correct wording in project prompt ([ea92eae](https://github.com/co-IT/schematics/commit/ea92eae))


### Features

* **cypress:** add cy:open npm script ([ba3703e](https://github.com/co-IT/schematics/commit/ba3703e))
* **cypress:** add cy:run npm script ([e7d4b67](https://github.com/co-IT/schematics/commit/e7d4b67))
* **cypress:** add initial configuration and some first error handling for parameters ([ad1ee0f](https://github.com/co-IT/schematics/commit/ad1ee0f))
* **cypress:** configure angular.json project entry ([7f0e67e](https://github.com/co-IT/schematics/commit/7f0e67e))
* **cypress:** generate new e2e app if overwrite parameter is false ([93578a6](https://github.com/co-IT/schematics/commit/93578a6))
* **cypress:** install packages ([fec8fb4](https://github.com/co-IT/schematics/commit/fec8fb4))
* **cypress:** let user overwrite e2e project folder path ([635bec7](https://github.com/co-IT/schematics/commit/635bec7))
* **cypress:** remove prompt for folder parameter ([5073fe1](https://github.com/co-IT/schematics/commit/5073fe1))
* **cypress:** replace old e2e files with cypress files ([7d31d17](https://github.com/co-IT/schematics/commit/7d31d17))
* **cypress:** reword prompts ([b40fe50](https://github.com/co-IT/schematics/commit/b40fe50))
* **cypress:** specify version for installed packages ([78e3d69](https://github.com/co-IT/schematics/commit/78e3d69))





## [1.0.1-alpha.5](https://github.com/co-IT/schematics/compare/v1.0.1-alpha.4...v1.0.1-alpha.5) (2019-03-21)

**Note:** Version bump only for package schematics





## [1.0.1-alpha.4](https://github.com/co-IT/schematics/compare/v1.0.1-alpha.3...v1.0.1-alpha.4) (2019-03-21)

**Note:** Version bump only for package schematics





## [1.0.1-alpha.3](https://github.com/co-IT/schematics/compare/v1.0.1-alpha.2...v1.0.1-alpha.3) (2019-03-21)


### Bug Fixes

* refine license expression ([d1486a0](https://github.com/co-IT/schematics/commit/d1486a0))





## [1.0.1-alpha.2](https://github.com/co-IT/schematics/compare/v1.0.1-alpha.1...v1.0.1-alpha.2) (2019-03-21)


### Bug Fixes

* **schematics:** add missing repository url ([3f16b8c](https://github.com/co-IT/schematics/commit/3f16b8c))





## [1.0.1-alpha.1](https://github.com/co-IT/schematics/compare/v1.0.1-alpha.0...v1.0.1-alpha.1) (2019-03-21)

**Note:** Version bump only for package schematics





## 1.0.1-alpha.0 (2019-03-21)


### Bug Fixes

* get tsc build to run ([8e9285d](https://github.com/co-IT/schematics/commit/8e9285d))
* **build:** copy dot-files to dist/ ([51f1b27](https://github.com/co-IT/schematics/commit/51f1b27))
* **jest:** exclude template files from build ([8e3f862](https://github.com/co-IT/schematics/commit/8e3f862))
* **package.json:** preserve order of entries in package.json ([7fc468d](https://github.com/co-IT/schematics/commit/7fc468d))
* **prettier:** correct format command ([cba806c](https://github.com/co-IT/schematics/commit/cba806c))
* **prettier:** fix test for registering start script ([ff54def](https://github.com/co-IT/schematics/commit/ff54def))
* **prettier:** overwrite existing .prettierrc ([9910d76](https://github.com/co-IT/schematics/commit/9910d76))
* **tsconfig:** correct name of tsconfig file ([15835df](https://github.com/co-IT/schematics/commit/15835df))
* don't ignore files in template folders ([f7b4843](https://github.com/co-IT/schematics/commit/f7b4843))
* raise error if package.json is empty ([e74682d](https://github.com/co-IT/schematics/commit/e74682d))


### Features

* **jest:** add jest types to dependencies ([1d09716](https://github.com/co-IT/schematics/commit/1d09716))
* **jest:** add templates for configuration files ([2900bda](https://github.com/co-IT/schematics/commit/2900bda))
* **jest:** configure typescript compiler for jest ([0932bc7](https://github.com/co-IT/schematics/commit/0932bc7))
* **jest:** fix test for adding watch script ([1384075](https://github.com/co-IT/schematics/commit/1384075))
* **jest:** install jest and dependencies ([385b3e3](https://github.com/co-IT/schematics/commit/385b3e3))
* **jest:** register jest in package.json scripts ([566c4c3](https://github.com/co-IT/schematics/commit/566c4c3))
* **jest:** remove karma configuration ([432c61e](https://github.com/co-IT/schematics/commit/432c61e))
* **jest:** remove schematic schema ([dc7e19a](https://github.com/co-IT/schematics/commit/dc7e19a))
* **jest:** remove unnessesary merge strategie ([1779ca5](https://github.com/co-IT/schematics/commit/1779ca5))
* **jest:** removes test.ts from root ([2921637](https://github.com/co-IT/schematics/commit/2921637))
* **jest:** reorder scripts for package.json ([dfa50b8](https://github.com/co-IT/schematics/commit/dfa50b8))
* **prettier:** add format script to package.json ([9f50e8a](https://github.com/co-IT/schematics/commit/9f50e8a))
* **prettier:** adds generation of .prettierrc configuration file ([7c27fcf](https://github.com/co-IT/schematics/commit/7c27fcf))
* **prettier:** configure schematic ([1f6d29d](https://github.com/co-IT/schematics/commit/1f6d29d))
* **prettier:** install husky if wanted ([8038ff7](https://github.com/co-IT/schematics/commit/8038ff7))
* **prettier:** install pretty-quick & lint-staged next to husky ([fdee3b9](https://github.com/co-IT/schematics/commit/fdee3b9))
* **prettier:** merge existing .huskyrc.json with prettier hook ([26d64b0](https://github.com/co-IT/schematics/commit/26d64b0))
* **prettier:** provide .huskyrc.json ([731354e](https://github.com/co-IT/schematics/commit/731354e))
* **prettier:** setup .lintstagedrc ([cfbfedb](https://github.com/co-IT/schematics/commit/cfbfedb))
* **prettier:** use .huskyrc instead of .huskyrc.json ([de490c5](https://github.com/co-IT/schematics/commit/de490c5))
* **prettier/husky:** warn if competing configuration is found ([57bc7e6](https://github.com/co-IT/schematics/commit/57bc7e6))
* **rules:** allow to specify version for a npm package ([69c4197](https://github.com/co-IT/schematics/commit/69c4197))
* **tsconfig:** introduce schematic configuring tsconfig.json ([89b5455](https://github.com/co-IT/schematics/commit/89b5455))
