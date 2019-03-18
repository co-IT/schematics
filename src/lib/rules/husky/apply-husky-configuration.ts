import { Rule, Tree } from '@angular-devkit/schematics';
import { createHuskyRc } from './create-husky-rc';
import { updateHuskyRc } from './update-husky-rc';

export function applyHuskyConfiguration(newHook: [string, string]): Rule {
  return (tree: Tree) =>
    !tree.exists('.huskyrc')
      ? createHuskyRc()
      : updateHuskyRc(tree.read('.huskyrc')!, newHook);
}
