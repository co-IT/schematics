import { Rule, Tree } from '@angular-devkit/schematics';
import { createHuskyRc } from './create-husky-rc';
import { updateHuskyRc } from './update-husky-rc';

export function applyHuskyConfiguration(): Rule {
  return (tree: Tree) =>
    !tree.exists('.huskyrc.json')
      ? createHuskyRc()
      : updateHuskyRc(tree.read('.huskyrc.json')!);
}
