[![Build Status][1]][2] [![npm-version][3]][4]

[1]: https://travis-ci.org/co-IT/schematics.svg?branch=master
[2]: https://travis-ci.org/co-IT/schematics
[3]: https://badge.fury.io/js/%40co-it%2Fschematics.svg
[4]: https://www.npmjs.com/package/@co-it/schematics

## @co-it/schematics

This collection of commands allow you to quickly enhance the quality of your
Angular project.
You can activate automatic code formatting instrumenting [prettier],
lint commit messages using [commitlint] and prevent runtime errors in advance
leveraging [TypeScript]'s compiler options.

Furthermore, you can set up [jest] & [cypress]. Now, these tools are installed
and configured automatically for you.

### Installation & Usage

To install `@co-it/schematics` globally, run the following command:

```shell
npm install --global @co-it/schematics
```

Then you can execute a schematic in your Angular project by running the following command in your project's root folder:

<pre>ng generate @co-it/schematics:<i>name</i> [<i>options</i>]</pre>

You can find all available values for _name_ in the following overview.

### Overview

| Command                             | Description                                                                  |                                         |
| ----------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| `ng g @co-it/schematics:commitlint` | Set up [commitlint] and optionally<br>configure a commit hook using [husky]. | [details](#️-co-itschematicscommitlint) |
| `ng g @co-it/schematics:cypress`    | Set up cypress using [@nrwl/builders].                                       | [details](#️-co-itschematicscypress)    |
| `ng g @co-it/schematics:jest`       | Set up [jest] and optionally configure<br>a pre-push hook using [husky].     | [details](#️-co-itschematicsjest)       |
| `ng g @co-it/schematics:prettier`   | Set up [prettier] and optionally configure<br>a commit hook using [husky].   | [details](#️-co-itschematicsprettier)   |
| `ng g @co-it/schematics:tsconfig`   | Activate Typescript's strict compiler options.                               | [details](#️-co-itschematicstsconfig)   |

[commitlint]: https://github.com/conventional-changelog/commitlint
[cypress]: https://www.cypress.io/
[husky]: https://github.com/typicode/husky
[jest]: https://jestjs.io/
[prettier]: https://prettier.io/
[typescript]: https://www.typescriptlang.org/
[@nrwl/builders]: https://www.npmjs.com/package/@nrwl/builders

### Details

#### ➡️ @co-it/schematics:commitlint

Set up [commitlint] and configure a commit hook using [husky].

##### Parameters

None.

##### Resulting changes in workspace

- Installs npm packages `@commitlint/cli`, `@commitlint/config-conventional` and `husky` as dev dependencies
- Creates commitlint configuration in `commitlint.config.js`
- Configures husky commit-msg hook in `.huskyrc`

#### ➡️ @co-it/schematics:cypress

Set up cypress using [@nrwl/builders].

##### Parameters

| Name        | Description                                                    | Default                                    |
| ----------- | -------------------------------------------------------------- | ------------------------------------------ |
| `app`       | Name of the application under test as defined in angular.json. | Default project according to angular.json. |
| `overwrite` | Overwrite existing e2e folder?                                 | false                                      |

##### Example scenarios

- Replace existing Protractor e2e tests for default project:
  `ng g @co-it/schematics:cypress --overwrite=true --no-interactive`
- Replace existing Protractor e2e tests for project `my-app`:
  `ng g @co-it/schematics:cypress --app=my-app --overwrite=true --no-interactive`

##### Resulting changes in workspace

- Installs npm packages `cypress` and `@nrwl/builders` as dev dependencies
- Creates e2e app named "_appname_-e2e"
  - Deletes existing content if `--overwrite` is set to true
  - Creates cypress configuration and example test
- Adds npm scripts:
  - `"cy:open": "cypress open"`
  - `"cy:run": "cypress run"`
- Configures the e2e project in angular.json using [@nrwl/builders]

##### Cypress usage

After running this schematic, you can use `ng e2e` to run cypress tests.

Run cypress in watch mode:

```shell
ng e2e --watch
```

Run cypress in headless mode (e.g. on a CI server):

```shell
ng e2e --headless
```

See [the Nrwl documentation](https://github.com/nrwl/nx/blob/master/docs/api-builders/cypress.md) for details about all available options.

#### ➡️ @co-it/schematics:jest

Set up [jest] and optionally configure a pre-push hook using [husky].

##### Parameters

| Name   | Description                                   | Default |
| ------ | --------------------------------------------- | ------- |
| `hook` | Enable push hook to run all test before push. | true    |

##### Example scenarios

- Replace existing Karma/Jasmine configuration for default project by Jest and install pre-push hook: `ng g @co-it/schematics:jest --no-interactive`

##### Resulting changes in workspace

- Installs npm packages `jest`, `jest-preset-angular`, `@types/jest` and `husky` as dev dependencies
- Replaces existing karma configuration with jest configuration
- Configures husky pre-push hook in `.huskyrc`
- adds jest types to ts.config.spec.json
- Adds npm scripts:
  - `"test": "jest"`
  - `"test:watch": "jest --watch"`

#### ➡️ @co-it/schematics:prettier

Set up [prettier] and optionally configure a commit hook using [husky].

##### Parameters

| Name   | Description                                                                    | Default |
| ------ | ------------------------------------------------------------------------------ | ------- |
| `hook` | Enable commit hook formatting & linting staged files with prettier and tslint. | true    |

##### Example scenarios

- Install Prettier with pre-commit hook:
  `ng g @co-it/schematics:prettier --no-interactive`

##### Resulting changes in workspace

- Installs npm packages `prettier`, `tslint-config-prettier`, `pretty-quick`, `lint-staged` and `husky` as dev dependencies
- Configures prettier in `.prettierrc`
- Configures lint-staged in `.lintstagedrc`
- Updates tslint.json to be compatible with prettier configuration
- Configures husky pre-commit hook in `.huskyrc`
- Adds npm scripts:
  - `"format": "prettier --write \"**/*.{js,json,css,scss,md,ts,html}\""`

#### ➡️ @co-it/schematics:tsconfig

Activate Typescript's strict compiler options.

##### Parameters

| Name                 | Description                     | Default |
| -------------------- | ------------------------------- | ------- |
| `strict`             | Enable typescript's strict mode | true    |
| `noUnusedParameters` | Detect unused parameters        | true    |
| `noUnusedLocals`     | Detect unused locals            | true    |
| `noImplicitAny`      | Detect usage of implicit any    | true    |

##### Example scenarios

- Enable all strict compiler options: `ng g @co-it/schematics:tsconfig --no-interactive`

##### Resulting changes in workspace

- Configures the `compilerOptions` parameters in `tsconfig.json`.

---

**@co-it/schematics** is internally used and maintained by [co-IT.eu GmbH](https://co-IT.eu).

<img align="right" alt="Orange co-IT.eu GmbH Logo" src="https://github.com/co-IT/schematics/blob/master/assets/co-it.logo.png?raw=true">
