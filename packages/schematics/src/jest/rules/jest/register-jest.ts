import { PackageJson } from '../../../lib';
import { Rule, Tree } from '@angular-devkit/schematics';

export function registerJest(): Rule {
  return (tree: Tree) => {
    const packageJson = new PackageJson(tree.read('package.json'));
    packageJson.setScript('test', 'ng test');
    packageJson.setScript('test:watch', 'ng test --watch');
    tree.overwrite('package.json', packageJson.stringify());
  };
}
