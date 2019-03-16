import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { PackageJson } from '..';
import { CompetingConfigurationOptions } from './competing-configuration-options';

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
