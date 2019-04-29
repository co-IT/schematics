import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { AngularJson } from '../../../lib';

export function registerBuilder(): (tree: Tree) => Tree {
  return (tree: Tree) => {
    const ngConfig = new AngularJson(tree.read('angular.json'));
    const appName = ngConfig.defaultProject;
    ngConfig.setJestConfigFor(appName);
    tree.overwrite('angular.json', ngConfig.stringify());
    return tree;
  };
}
