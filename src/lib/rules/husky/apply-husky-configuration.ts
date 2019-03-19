import { Rule, Tree } from '@angular-devkit/schematics';
import { createHuskyRc } from './create-husky-rc';
import { updateHuskyRc } from './update-husky-rc';

/**
 * Create or update husky configuration with the new hook.
 * Uses the template in ./templates/hook.
 *
 * **Note**: newHook is currently needed to be provided for updating existing
 * huskyrc files due to a bug in MergeStrategy.Overwrite.
 * See https://github.com/angular/angular-cli/issues/11337 for details.
 *
 * @param newHook key value pair representing the hook to add
 */
export function applyHuskyConfiguration(newHook: [string, string]): Rule {
  return (tree: Tree) =>
    !tree.exists('.huskyrc')
      ? createHuskyRc()
      : updateHuskyRc(tree.read('.huskyrc')!, newHook);
}
