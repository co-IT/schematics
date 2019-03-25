import {
  chain,
  Rule,
  SchematicContext,
  Tree
} from '@angular-devkit/schematics';
import { installDependencies } from '../lib';
import { CypressSchematicOptions } from './model';
import { configureAngularJson } from './rules/configure-angular-json';
import { verifyOptions } from './rules/verify-options';
import { writeCypressFiles } from './rules/write-cypress-files';

export default function cypress(options: CypressSchematicOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const verifiedOptions = verifyOptions(options, tree);

    return chain([
      installDependencies({
        devDependencies: [
          { name: 'cypress', version: '^3.2.0' },
          { name: '@nrwl/builders', version: '^7.7.2' }
        ]
      }),
      configureAngularJson(verifiedOptions),
      writeCypressFiles(verifiedOptions)
    ]);
  };
}
