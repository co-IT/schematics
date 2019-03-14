import { Rule, Tree } from '@angular-devkit/schematics';
import { PackageJson } from '../../../lib';

export function registerPrettier(): Rule {
  return (tree: Tree) => {
    const packageJson = new PackageJson(tree.read('package.json'));
    packageJson.setScript(
      'format',
      'prettier --write "**/*.{js,json,css,scss,md,ts,html}"'
    );
    tree.overwrite('package.json', packageJson.stringify());
  };
}
