import {
  apply,
  chain,
  mergeWith,
  Rule,
  Tree,
  url
} from '@angular-devkit/schematics';
import { installDependencies, PackageJson } from '../lib';

export default function(): Rule {
  return chain([
    installDependencies({
      devDependencies: ['prettier', 'tslint-config-prettier']
    }),
    registerPrettier(),
    patchTsLintConfiguration()
  ]);
}

function registerPrettier(): Rule {
  return (tree: Tree) => {
    const packageJson = new PackageJson(tree.read('package.json'));

    packageJson.setScript(
      'format',
      'prettier --write "**/*.{js,json,css,scss,md,ts,html}"'
    );

    tree.overwrite('package.json', packageJson.stringify());

    return mergeWith(apply(url('./templates'), []));
  };
}

function patchTsLintConfiguration(): Rule {
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
