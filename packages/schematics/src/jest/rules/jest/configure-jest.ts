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

const possibleKarmaConfigs = ['src/karma.conf.js', 'src/test.ts'];

/**
 * TODO: Workaround
 * ----------------
 * The operator `forEach` should not be needed to overwrite a file.
 * There is a bug in the devkit: https://github.com/angular/angular-cli/issues/11337
 * The MergeStrategy.Overwrite takes no effect.
 *
 * Once the issue is resolved `forEach` should be removed.
 */
export function configureJest(): Rule {
  return (tree: Tree) =>
    chain([
      installDependencies({
        devDependencies: [
          { name: 'jest', version: '^24.5.0' },
          { name: 'jest-preset-angular', version: '^7.0.1' },
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
        possibleKarmaConfigs.forEach(path =>
          tree.exists(path) ? tree.delete(path) : ''
        );
        return tree;
      }),
      mergeWith(
        apply(url('./templates'), [
          forEach(template => {
            tree.exists(template.path)
              ? tree.overwrite(template.path, template.content)
              : tree.create(template.path, template.content);
            return null;
          })
        ]),
        MergeStrategy.Overwrite
      )
    ]);
}
