import { Rule, Tree } from '@angular-devkit/schematics';

/**
 * Add a husky hook to an existing .huskyrc file.
 * @param origin source of existing .huskyrc file
 * @param newHook key value pair representing the hook to add
 */
export function updateHuskyRc(origin: Buffer, newHook: [string, string]): Rule {
  return (tree: Tree) => {
    const originHuskyRc = JSON.parse(origin.toString('utf-8'));
    const updatedHuskyRc = {
      ...originHuskyRc,
      hooks: {
        ...originHuskyRc.hooks,
        [newHook[0]]: newHook[1]
      }
    };
    tree.overwrite('.huskyrc', JSON.stringify(updatedHuskyRc, null, 2));
  };
}
