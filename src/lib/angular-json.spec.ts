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
              sourceRoot: '',
              projectType: 'application',
              architect: {}
            },
            'app1-e2e': {
              sourceRoot: '',
              projectType: 'application',
              architect: { e2e: {} }
            },
            app2: { sourceRoot: '', projectType: 'application', architect: {} },
            'app2-e2e': {
              sourceRoot: '',
              projectType: 'application',
              architect: { e2e: {} }
            },
            lib: { sourceRoot: '', projectType: 'library', architect: {} }
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
});

function toBuffer(value: object): Buffer {
  return Buffer.from(JSON.stringify(value));
}
