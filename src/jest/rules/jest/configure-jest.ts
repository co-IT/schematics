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

const possibleKarmaConfigs = ['src/karma.conf.js'];

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
        devDependencies: ['jest', 'jest-preset-angular', '@types/jest']
      }),
      removeDependencies({
        devDependencies: [
          'karma',
          'karma-chrome-launcher',
          'karma-coverage-istanbul-reporter',
          'karma-jasmine',
          'karma-jasmine-html-reporter'
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
