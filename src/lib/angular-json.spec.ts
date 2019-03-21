import { SchematicsException } from '@angular-devkit/schematics';
import { AngularJson } from './angular-json';
import { AngularJsonSchema } from './angular-json-schema';

describe('AngularJson', () => {
  describe('When angular.json has no content', () => {
    it('should raise an error', () => {
      expect(() => new AngularJson(null)).toThrow(
        new SchematicsException('Sorry, angular.json file could not be found.')
      );
    });
  });

  describe('When angular.json contains multiple apps and libs', () => {
    let angularJson: AngularJson;

    beforeEach(() => {
      angularJson = new AngularJson(
        toBuffer({
          projects: {
            app1: {
              root: '',
              projectType: 'application',
              architect: {}
            },
            'app1-e2e': {
              root: '',
              projectType: 'application',
              architect: { e2e: {} }
            },
            app2: { root: '', projectType: 'application', architect: {} },
            'app2-e2e': {
              root: '',
              projectType: 'application',
              architect: { e2e: {} }
            },
            lib: { root: '', projectType: 'library', architect: {} }
          },
          defaultProject: 'app1'
        } as AngularJsonSchema)
      );
    });

    describe('hasApp()', () => {
      it('should return true if found', () => {
        expect(angularJson.hasApp('app1')).toBe(true);
      });

      it('should return false if no project with name exists', () => {
        expect(angularJson.hasApp('app3')).toBe(false);
      });

      it('should return false if project with name is a library', () => {
        expect(angularJson.hasApp('lib')).toBe(false);
      });
    });
  });

  describe('setCypressConfigFor()', () => {
    it('should throw exception if given project not found', () => {
      const angularJson = new AngularJson(
        toBuffer({
          projects: {}
        })
      );
      expect(() => angularJson.setCypressConfigFor('not-there')).toThrowError(
        'Project "not-there" does not exist.'
      );
    });

    it('should throw exception if given project is not an e2e project', () => {
      const angularJson = new AngularJson(
        toBuffer({
          projects: {
            app1: {
              root: '',
              projectType: 'application',
              architect: {}
            }
          }
        })
      );
      expect(() => angularJson.setCypressConfigFor('app1')).toThrowError(
        'Did not find an e2e configuration in "app1".'
      );
    });

    it('should create options if there are none', () => {
      const angularJson = new AngularJson(
        toBuffer({
          projects: {
            app1: {
              root: '',
              projectType: 'application',
              architect: { e2e: {} }
            }
          }
        })
      );
      angularJson.setCypressConfigFor('app1');
      const angularJsonAfter = JSON.parse(angularJson.stringify());

      expect(
        angularJsonAfter.projects.app1.architect.e2e.options
      ).toBeDefined();
    });

    it('should configure builder and options', () => {
      const angularJson = new AngularJson(
        toBuffer({
          projects: {
            'app1-e2e': {
              root: 'path/',
              projectType: 'application',
              architect: {
                e2e: {
                  options: {
                    protractorConfig: 'protractorConfig',
                    devServerTarget: 'devServerTarget'
                  }
                }
              }
            }
          }
        })
      );
      angularJson.setCypressConfigFor('app1-e2e');
      const angularJsonAfter = JSON.parse(angularJson.stringify());

      expect(angularJsonAfter).toEqual({
        projects: {
          'app1-e2e': {
            root: 'path/',
            projectType: 'application',
            architect: {
              e2e: {
                builder: '@nrwl/builders:cypress',
                options: {
                  cypressConfig: 'path/cypress.json',
                  tsConfig: 'path/tsconfig.e2e.json',
                  devServerTarget: 'devServerTarget'
                }
              }
            }
          }
        }
      });
    });
  });
});

function toBuffer(value: object): Buffer {
  return Buffer.from(JSON.stringify(value));
}
