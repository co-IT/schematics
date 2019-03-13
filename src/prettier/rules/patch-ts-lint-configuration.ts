import { Rule, Tree } from '@angular-devkit/schematics';
export function patchTsLintConfiguration(): Rule {
  return (tree: Tree) => {
    const tslintFile = tree.read('tslint.json');
    if (!tslintFile) {
      return;
    }
    const tslintJson = JSON.parse(tslintFile!.toString('utf-8'));
    if (Array.isArray(tslintJson.extends)) {
      tslintJson.extends.push('tslint-config-prettier');
    } else {
      tslintJson.extends = [tslintJson.extends, 'tslint-config-prettier'];
    }
    tree.overwrite('tslint.json', JSON.stringify(tslintJson, null, 2));
  };
}
