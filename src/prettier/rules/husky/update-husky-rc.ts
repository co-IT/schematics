import { Rule, Tree } from '@angular-devkit/schematics';
export function updateHuskyRc(origin: Buffer): Rule {
  return (tree: Tree) => {
    const originHuskyRc = JSON.parse(origin.toString('utf-8'));
    const updatedHuskyRc = {
      ...originHuskyRc,
      hooks: {
        ...originHuskyRc.hooks,
        'pre-commit': 'pretty-quick --staged && lint-staged'
      }
    };
    tree.overwrite('.huskyrc.json', JSON.stringify(updatedHuskyRc, null, 2));
  };
}
