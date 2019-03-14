import {
  chain,
  Rule,
  SchematicContext,
  Tree
} from '@angular-devkit/schematics';
import { installDependencies, PackageJson } from '../lib';
import { configurePrettier, registerPrettier } from './rules/prettier';
import { patchTsLintConfiguration } from './rules/tslint';

export default function(): Rule {
  return chain([
    installDependencies({
      devDependencies: ['prettier', 'tslint-config-prettier']
    }),
    configurePrettier(),
    discoverConflictingPrettierConfigurations(),
    registerPrettier(),
    patchTsLintConfiguration()
  ]);
}

export function discoverConflictingPrettierConfigurations() {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = new PackageJson(tree.read('package.json'));
    if (packageJson.hasProperty('prettier')) {
      console.log('a[sodka[pdjapdja[spjd[apkjd[p');

      context.logger.warn('Found prettier configuration in package.json');
    }
  };
}
