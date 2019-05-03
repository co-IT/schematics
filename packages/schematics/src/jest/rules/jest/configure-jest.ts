import {
  apply,
  chain,
  forEach,
  MergeStrategy,
  mergeWith,
  Rule,
  Tree,
  url
} from '@angular-devkit/schematics';
import { installDependencies, removeDependencies } from '../../../lib';
import { JestConfigOptions } from '../../models/jest-config-options';
import { readAngularJson } from '../../../cypress/rules/utils';

const possibleDeprecatedConfigs = [
  'src/karma.conf.js',
  'karma.conf.js',
  'src/test.ts',
  'src/test-config.helper.ts'
];

/**
 * TODO: Workaround
 * ----------------
 * The operator `forEach` should not be needed to overwrite a file.
 * There is a bug in the devkit: https://github.com/angular/angular-cli/issues/11337
 * The MergeStrategy.Overwrite takes no effect.
 *
 * Once the issue is resolved `forEach` should be removed.
 */
export function configureJest(config: JestConfigOptions): Rule {
  return (tree: Tree) => {
    const ngConfig = readAngularJson(tree);
    const root =
      config && config.app ? `${ngConfig.getRootPathFor(config.app)}/` : '';
    return chain([
      installDependencies({
        devDependencies: [
          { name: 'jest', version: '^24.5.0' },
          { name: '@angular-builders/jest', version: '^7.4.1' },
          { name: '@types/jest', version: '^24.0.11' }
        ]
      }),
      removeDependencies({
        devDependencies: [
          { name: 'karma' },
          { name: 'karma-chrome-launcher' },
          { name: 'karma-coverage-istanbul-reporter' },
          { name: 'karma-jasmine' },
          { name: 'karma-jasmine-html-reporter' }
        ]
      }),
      mergeWith(() => {
        possibleDeprecatedConfigs.forEach(path =>
          tree.exists(`${root}${path}`) ? tree.delete(`${root}${path}`) : ''
        );
        return tree;
      }),
      mergeWith(
        apply(url(`./templates/jest`), [
          forEach(template => {
            const templatePath = config.app
              ? `${template.path}`
              : `src/${template.path}`;
            tree.exists(`${root}${templatePath}`)
              ? tree.overwrite(`${root}${templatePath}`, template.content)
              : tree.create(`${root}${templatePath}`, template.content);
            return null;
          })
        ]),
        MergeStrategy.Overwrite
      )
    ]);
  };
}
