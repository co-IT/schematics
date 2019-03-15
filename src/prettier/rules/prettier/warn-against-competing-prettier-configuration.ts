import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { PackageJson } from '../../../lib';

export function warnAgainstCompetingPrettierConfiguration() {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = new PackageJson(tree.read('package.json'));
    [
      '.prettierrc.yaml',
      '.prettierrc.yml',
      '.prettierrc.toml',
      '.prettierrc.json',
      '.prettierrc.js',
      '.prettier.config.js',
      packageJson.hasProperty('prettier') ? 'package.json' : null
    ]
      .map(file =>
        file && tree.exists(file)
          ? `Found competing prettier configuration in ${file}.`
          : null
      )
      .filter((candidate): candidate is string => !!candidate)
      .forEach(detectedConfiguration =>
        context.logger.warn(detectedConfiguration)
      );
  };
}
