[![Build Status](https://travis-ci.org/co-IT/schematics.svg?branch=master)](https://travis-ci.org/co-IT/schematics)

## @co-it/schematics

This collection of commands allow you to quickly enhance the quality of your
Angular project.
You can activate automatic code formatting instrumenting [prettier],
lint commit messages using [commitlint] and prevent runtime errors in advance
leveraging [TypeScript]'s compiler options.

Furthermore, you can set up [jest] & [cypress]. Now, these tools are installed
and configured automatically for you.

### Overview

| Command                             | Description                                                               |
| ----------------------------------- | ------------------------------------------------------------------------- |
| `ng g @co-it/schematics:commitlint` | Set up [commitlint] and optionally configure a commit hook using [husky]. |
| `ng g @co-it/schematics:cypress`    | Set up cypress using [@nrwl/builders]                                     |
| `ng g @co-it/schematics:jest`       | Set up [jest] and optionally configure a pre-push hook using [husky].     |
| `ng g @co-it/schematics:prettier`   | Set up [prettier] and optionally configure a commit hook using [husky].   |
| `ng g @co-it/schematics:tsconfig`   | Activate Typescript's strict compiler options.                            |

**@co-it/schematics** is internally used and maintained by [co-IT.eu GmbH](https://co-IT.eu).

<img align="right" alt="Orange co-IT.eu GmbH Logo" src="./assets/co-it.logo.png">

[commitlint]: https://github.com/conventional-changelog/commitlint
[cypress]: https://www.cypress.io/
[husky]: https://github.com/typicode/husky
[jest]: https://jestjs.io/
[prettier]: https://prettier.io/
[typescript]: https://www.typescriptlang.org/
