import { JestConfigOptions } from 'src/jest/models/jest-config-options';
import { chain, Rule } from '@angular-devkit/schematics';

import { applyHuskyConfiguration } from '../../../lib/rules/husky';
import {
  installDependencies,
  warnAgainstCompetingConfiguration
} from '../../../lib';

export function configureHusky(): Rule {
  return chain([
    installDependencies({
      devDependencies: [{ name: 'husky', version: '^1.3.1' }]
    }),
    applyHuskyConfiguration(['pre-push', 'ng test']),
    warnAgainstCompetingConfiguration({
      packageJsonKey: 'husky',
      files: ['.huskyrc.json', '.huskyrc.js']
    })
  ]);
}
