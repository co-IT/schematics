import {
  IntegrationTestBed,
  initializeIntegrationTestBed
} from './integration-test-bed';

import { linkSchematics, matchLines } from './utils';

describe('Jest', () => {
  let testBed: IntegrationTestBed;

  beforeAll(async done => {
    testBed = await initializeIntegrationTestBed();

    console.log(`Creating Angular test project in ${testBed.folder}`);

    await testBed.execute(
      'mkdir global_node_modules; yarn --cwd global_node_modules add @angular/cli'
    );

    const result = await testBed.run(
      './global_node_modules/node_modules/.bin/ng new integration-test --directory . --defaults'
    );

    console.log(result.stdout);
    if (result.code !== 0) {
      done.fail('Could not create Angular project');
    }

    await testBed.execute(
      'rm -rf global_node_modules; git commit -a --amend --no-edit'
    );

    console.log('Finished creating Angular test project.');

    done();
  });

  beforeEach(async done => {
    console.log('Cleaning git repository.');

    await testBed.execute('git checkout -- .; git clean -fd');

    const statusResult = await testBed.run('git status --porcelain');
    expect(statusResult.stdout).toBeFalsy();

    await linkSchematics(testBed);

    done();
  });

  describe('When "ng generate @co-it/schematics:jest --hook=true" is run', () => {
    it('should update files', async () => {
      const result = await testBed.run(
        'ng generate @co-it/schematics:jest --hook=true'
      );

      expect(result.stdout).toMatch(
        matchLines(
          'DELETE src/karma.conf.js',
          'DELETE src/test.ts',
          'CREATE src/jest.config.js',
          'CREATE .huskyrc',
          'UPDATE package.json',
          'UPDATE src/tsconfig.spec.json',
          '> husky@.* install',
          'added .* packages'
        )
      );
    });
    it('should run jest tests for default app', async () => {
      await testBed.execute('ng generate @co-it/schematics:jest --hook=true');

      const result = await testBed.run('yarn test');

      // Jest uses stderr, see issue https://github.com/facebook/jest/issues/5064
      expect(result.stderr).toMatch(
        matchLines(
          'PASS src/app/app.component.spec.ts',
          'AppComponent',
          ' should create the app',
          " should have as title 'integration-test'",
          ' should render title in a h1 tag',
          'Test Suites: 1 passed, 1 total',
          'Tests:       3 passed, 3 total',
          'Snapshots:   0 total',
          'Time: .*',
          'Ran all test suites.'
        )
      );
    });
  });

  describe('When "ng generate @co-it/schematics:jest --hook=false --app=second-app" is run', () => {
    it('should update files', async () => {
      await testBed.execute('ng generate app second-app');
      await linkSchematics(testBed);

      const result = await testBed.run(
        'ng generate @co-it/schematics:jest --hook=false --app=second-app'
      );

      expect(result.stdout).toMatch(
        matchLines(
          'DELETE projects/second-app/karma.conf.js',
          'DELETE projects/second-app/src/test.ts',
          'CREATE projects/second-app/jest.config.js',
          'UPDATE package.json',
          'UPDATE angular.json',
          'UPDATE projects/second-app/tsconfig.spec.json'
        )
      );
    });

    it('should run jest tests', async () => {
      await testBed.execute('ng generate app second-app');
      await linkSchematics(testBed);
      await testBed.execute(
        'ng generate @co-it/schematics:jest --hook=false --app=second-app'
      );

      const result = await testBed.run('yarn test --project=second-app');

      // Jest uses stderr, see issue https://github.com/facebook/jest/issues/5064
      expect(result.stderr).toMatch(
        matchLines(
          'PASS projects/second-app/src/app/app.component.spec.ts',
          'AppComponent',
          ' should create the app',
          " should have as title 'second-app'",
          ' should render title in a h1 tag',
          'Test Suites: 1 passed, 1 total',
          'Tests:       3 passed, 3 total',
          'Snapshots:   0 total',
          'Time: .*',
          'Ran all test suites.'
        )
      );
    });
  });
});
