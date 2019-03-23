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

    describe('getApp()', () => {
      it('should throw exception if app does not exist', () => {
        expect(() => angularJson.getApp('not-existing')).toThrowError(
          'No entry found for application "not-existing"'
        );
      });
      it('should return app config', () => {
        expect(angularJson.getApp('app1-e2e')).toEqual({
          root: '',
          projectType: 'application',
          architect: { e2e: {} }
        });
      });
    });

    describe('setApp', () => {
      it.each(['app1-e2e', 'new-app'])(
        'should set app "%s"',
        (appName: string) => {
          angularJson.setApp(appName, {
            root: 'test',
            projectType: 'application',
            architect: { x: 'y' }
          });
          const angularJsonAfter = JSON.parse(angularJson.stringify());
          expect(angularJsonAfter.projects[appName]).toEqual({
            root: 'test',
            projectType: 'application',
            architect: { x: 'y' }
          });
        }
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
