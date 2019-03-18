import { Rule, Tree } from '@angular-devkit/schematics';
export function updateHuskyRc(origin: Buffer): Rule {
  return (tree: Tree) => {
    const originHuskyRc = JSON.parse(origin.toString('utf-8'));
    const updatedHuskyRc = {
      ...originHuskyRc,
      hooks: {
        ...originHuskyRc.hooks,
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
      }
    };
    tree.overwrite('.huskyrc', JSON.stringify(updatedHuskyRc, null, 2));
  };
}
