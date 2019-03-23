import {
  chain,
  Rule,
  SchematicContext,
  Tree
} from '@angular-devkit/schematics';
import { installDependencies } from '../lib';
import { AngularJson } from '../lib/angular-json';
import { CypressSchematicOptions } from './model';
import { configureAngularJson } from './rules/configure-angular-json';
import { verifyOptions } from './rules/verify-options';
import { writeCypressFiles } from './rules/write-cypress-files';

export default function cypress(options: CypressSchematicOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const angularJson = readAngularJson(tree);
    const patchedOptions = {
      ...options,
      app: options.app || angularJson.defaultProject
    };

    return chain([
      verifyOptions(patchedOptions, angularJson),
      installDependencies({
        devDependencies: [
          { name: 'cypress', version: '^3.2.0' },
          { name: '@nrwl/builders', version: '^7.7.2' }
        ]
      }),
      configureAngularJson(patchedOptions, angularJson),
      writeCypressFiles(patchedOptions, angularJson)
    ]);
  };
}

function readAngularJson(tree: Tree): AngularJson {
  const angularJsonBuffer = tree.read('angular.json')!;
  const angularJson = new AngularJson(angularJsonBuffer);
  return angularJson;
}
