import {
  chain,
  noop,
  Rule,
  SchematicContext,
  Tree
} from '@angular-devkit/schematics';
import { installDependencies, PackageJson } from '../lib';
import { PrettierSchematicOptions } from './models';
import { applyHuskyConfiguration } from './rules/husky';
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
    applyHuskyConfiguration(),
    warnAgainstCompetingConfiguration({
      packageJsonKey: 'husky',
      files: ['.huskyrc.json', '.huskyrc.js']
    })
  ]);
}

export interface CompetingConfigurationOptions {
  packageJsonKey: string;
  files: string[];
}

export function warnAgainstCompetingConfiguration(
  config: CompetingConfigurationOptions
) {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = new PackageJson(tree.read('package.json'));
    [
      ...config.files,
      packageJson.hasProperty(config.packageJsonKey) ? 'package.json' : null
    ]
      .map(file =>
        file && tree.exists(file)
          ? `Found competing ${config.packageJsonKey} configuration in ${file}.`
          : null
      )
      .filter((candidate): candidate is string => !!candidate)
      .forEach(detectedConfiguration =>
        context.logger.warn(detectedConfiguration)
      );
  };
}
