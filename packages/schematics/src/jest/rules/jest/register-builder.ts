import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { AngularJson } from '../../../lib';
import { JestConfigOptions } from '../../models/jest-config-options';

export function registerBuilder(
  config: JestConfigOptions
): (tree: Tree) => Tree {
  return (tree: Tree) => {
    const ngConfig = new AngularJson(tree.read('angular.json'));
    ngConfig.setJestConfigFor(config.app || ngConfig.defaultProject);
    tree.overwrite('angular.json', ngConfig.stringify());
    return tree;
  };
}
