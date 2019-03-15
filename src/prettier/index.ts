import {
  apply,
  chain,
  mergeWith,
  noop,
  Rule,
  Tree,
  url
} from '@angular-devkit/schematics';
import { installDependencies } from '../lib';
import { PrettierSchematicOptions } from './models';
import {
  configurePrettier,
  registerPrettier,
  warnAgainstCompetingPrettierConfiguration
} from './rules/prettier';
import { patchTsLintConfiguration } from './rules/tslint';

export default function(parameters: PrettierSchematicOptions): Rule {
  return chain([
    configurePrettier(),
    warnAgainstCompetingPrettierConfiguration(),
    registerPrettier(),
    patchTsLintConfiguration(),
    parameters.hook ? configureHusky() : noop()
  ]);
}

export function configureHusky(): Rule {
  return chain([
    installDependencies({
      devDependencies: ['husky', 'pretty-quick', 'lint-staged']
    }),
    setupConfigurationFiles()
  ]);
}

export function setupConfigurationFiles(): Rule {
  return (tree: Tree) =>
    tree.exists('.huskyrc.json')
      ? updateHuskyRc(tree.read('.huskyrc.json')!)
      : createHuskyRc();
}

export function createHuskyRc(): Rule {
  return mergeWith(apply(url('./templates/hook'), []));
}

export function updateHuskyRc(origin: Buffer): Rule {
  return (tree: Tree) => {
    const originHuskyRc = JSON.parse(origin.toString('utf-8'));
    const updatedHuskyRc = {
      ...originHuskyRc,
      hooks: {
        ...originHuskyRc.hooks,
        'pre-commit': 'pretty-quick --staged && lint-staged'
      }
    };

    tree.overwrite('.huskyrc.json', JSON.stringify(updatedHuskyRc, null, 2));
  };
}
