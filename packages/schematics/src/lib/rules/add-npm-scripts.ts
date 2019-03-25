import { Rule, Tree } from '@angular-devkit/schematics';
import { PackageJson } from '../package-json';

export function addNpmScripts(
  ...scripts: { name: string; command: string }[]
): Rule {
  return (tree: Tree) => {
    const packageJson = new PackageJson(tree.read('package.json'));
    scripts.forEach(script => {
      packageJson.setScript(script.name, script.command);
      tree.overwrite('package.json', packageJson.stringify());
    });
    return tree;
  };
}
