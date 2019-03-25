import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { readParameterDefaults } from '../../test';
import * as cypressSchema from '../cypress.schema.json';
import { CypressSchematicOptions } from '../model';
import { configureAngularJson } from './configure-angular-json';
import { writeCypressFiles } from './write-cypress-files';

const defaultParameters = readParameterDefaults<CypressSchematicOptions>(
  cypressSchema
);

describe('writeCypressFiles', () => {
  let tree: UnitTestTree;

  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty());
  });

  describe('When user wants to overwrite project files in /e2e folder', () => {
    const parameters = {
      ...defaultParameters,
      app: 'my-app',
      overwrite: true
    };

    beforeEach(() => {
      tree.create('e2e/.keep', '');
      tree.create(
        'angular.json',
        JSON.stringify({
          projects: {
            'my-app': {
              projectType: 'application',
              architect: {}
            },
            'my-app-e2e': {
              root: 'e2e/',
              projectType: 'application',
              prefix: '',
              architect: {}
            }
          }
        })
      );
    });

    it('should delete old content from root path', () => {
      tree.create('e2e/old-file', 'content');
      tree.create('e2e/old-folder/old-file', 'content');

      writeCypressFiles(parameters)(tree, null!);

      expect(tree.files.filter(f => f.includes('old-file'))).toEqual([]);
    });
  });
});
