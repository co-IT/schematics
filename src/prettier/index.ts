import {
  apply,
  chain,
  mergeWith,
  Rule,
  Tree,
  url
} from '@angular-devkit/schematics';
import { installDependencies, PackageJson } from '../lib';
import { patchTsLintConfiguration } from './rules';

export default function(): Rule {
  return chain([
    installDependencies({
      devDependencies: ['prettier', 'tslint-config-prettier']
    }),
    configurePrettier(),
    registerPrettier(),
    patchTsLintConfiguration()
  ]);
}

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

export function configurePrettier(): Rule {
  return mergeWith(apply(url('./templates'), []));
}
