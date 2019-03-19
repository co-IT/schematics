import {
  apply,
  chain,
  forEach,
  MergeStrategy,
  mergeWith,
  Rule,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { installDependencies } from '../../../lib';

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
        devDependencies: ['jest', 'jest-preset-angular'],
      }),
      mergeWith(
        apply(url('./templates'), [
          forEach(template => {
            tree.exists(template.path)
              ? tree.overwrite(template.path, template.content)
              : tree.create(template.path, template.content);
            return null;
          }),
        ]),
        MergeStrategy.Overwrite
      ),
    ]);
}
