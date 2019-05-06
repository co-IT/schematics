import {
  IntegrationTestBed,
  initializeIntegrationTestBed
} from './integration-test-bed';

async function linkSchematics(testBed: IntegrationTestBed) {
  const linkResult = await testBed.run('yarn link @co-it/schematics');
  console.log(linkResult.stdout);
  expect(linkResult.stdout).toContain(
    'Using linked package for "@co-it/schematics"'
  );
}

describe('@co-it/schematics integration tests', () => {
  let testBed: IntegrationTestBed;

  beforeAll(async done => {
    testBed = await initializeIntegrationTestBed();

    console.log(`Creating Angular test project in ${testBed.folder}`);

    await testBed.execute(
      'mkdir global_node_modules; yarn --cwd global_node_modules add @angular/cli'
    );

    await testBed.execute(
      './global_node_modules/node_modules/.bin/ng config -g cli.packageManager yarn'
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

  describe('@co-it/schematics:commitlint', () => {
    describe('When "ng g @co-it/schematics:commitlint" is run', () => {
      it('should update files', async () => {
        const result = await testBed.run(
          'ng generate @co-it/schematics:commitlint'
        );

        expect(result.stdout).toMatch(
          matchLines(
            'CREATE commitlint.config.js.*',
            'CREATE .huskyrc.*',
            'UPDATE package.json.*'
          )
        );
      });
    });
  });

  describe('@co-it/schematics:cypress', () => {
    describe('When "ng generate @co-it/schematics:cypress --overwrite=true" is run', () => {
      it('should update files', async () => {
        const result = await testBed.run(
          'ng generate @co-it/schematics:cypress --overwrite=true --no-interactive'
        );

        expect(result.stdout).toMatch(
          matchLines(
            'DELETE e2e/protractor.conf.js',
            'DELETE e2e/src/app.e2e-spec.ts',
            'DELETE e2e/src/app.po.ts',
            'CREATE e2e/cypress.json .*',
            'CREATE e2e/tsconfig.json .*',
            'CREATE e2e/src/fixtures/example.json .*',
            'CREATE e2e/src/integration/examples/app.spec.ts .*',
            'CREATE e2e/src/plugins/index.ts .*',
            'CREATE e2e/src/support/commands.ts .*',
            'CREATE e2e/src/support/index.ts .*',
            'UPDATE package.json .*',
            'UPDATE angular.json .*',
            'UPDATE e2e/tsconfig.e2e.json .*'
          )
        );
      });

      it('should setup e2e runner for cypress', async () => {
        await testBed.execute(
          'ng generate @co-it/schematics:cypress --overwrite=true --no-interactive'
        );

        const result = await testBed.run('ng e2e --headless');

        expect(result.stdout).toMatch(
          matchLines('examples/app.spec.js', 'All specs passed!')
        );
      });
    });

    describe('When "ng generate @co-it/schematics:cypress --app=second-app --overwrite=true" is run', () => {
      it('should update files', async () => {
        await testBed.execute('ng generate app second-app');
        await linkSchematics(testBed);

        const result = await testBed.run(
          'ng generate @co-it/schematics:cypress --app=second-app --overwrite=true --no-interactive'
        );

        expect(result.stdout).toMatch(
          matchLines(
            'DELETE projects/second-app-e2e/protractor.conf.js',
            'DELETE projects/second-app-e2e/src/app.e2e-spec.ts',
            'DELETE projects/second-app-e2e/src/app.po.ts',
            'CREATE projects/second-app-e2e/cypress.json .*',
            'CREATE projects/second-app-e2e/tsconfig.json .*',
            'CREATE projects/second-app-e2e/src/fixtures/example.json .*',
            'CREATE projects/second-app-e2e/src/integration/examples/app.spec.ts .*',
            'CREATE projects/second-app-e2e/src/plugins/index.ts .*',
            'CREATE projects/second-app-e2e/src/support/commands.ts .*',
            'CREATE projects/second-app-e2e/src/support/index.ts .*',
            'UPDATE package.json .*',
            'UPDATE angular.json .*',
            'UPDATE projects/second-app-e2e/tsconfig.e2e.json .*'
          )
        );
      });

      it('should setup e2e runner for cypress', async () => {
        await testBed.execute('ng generate app second-app');
        await linkSchematics(testBed);
        await testBed.execute(
          'ng generate @co-it/schematics:cypress --app=second-app --overwrite=true --no-interactive'
        );

        const result = await testBed.run('ng e2e second-app-e2e --headless');

        expect(result.stdout).toMatch(
          matchLines('examples/app.spec.js', 'All specs passed!')
        );
      });
    });
  });

  describe('@co-it/schematics:jest', () => {
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
            'UPDATE src/tsconfig.spec.json'
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

  describe('@co-it/schematics:prettier', () => {
    describe('When "ng generate @co-it/schematics:prettier --hook=true" is run', () => {
      it('should update files', async () => {
        const result = await testBed.run(
          'ng generate @co-it/schematics:prettier --hook=true'
        );

        expect(result.stdout).toMatch(
          matchLines(
            'CREATE .prettierrc',
            'CREATE .huskyrc',
            'CREATE .lintstagedrc',
            'UPDATE package.json',
            'UPDATE tslint.json'
          )
        );
      });

      it('should add working format script', async () => {
        await testBed.execute(
          'ng generate @co-it/schematics:prettier --hook=true'
        );

        const result = await testBed.run('yarn format');

        expect(result.stdout).toMatch(
          matchLines(
            'prettier --write "\\*\\*\\/\\*\\.\\{js,json,css,scss,md,ts,html\\}"'
          )
        );
      });
    });
  });

  describe('@co-it/schematics:tsconfig', () => {
    describe('When "ng generate @co-it/schematics:tsconfig --defaults" is run', () => {
      it('should update tsconfig.json', async () => {
        const result = await testBed.run(
          'ng generate @co-it/schematics:tsconfig --defaults'
        );

        expect(result.stdout).toMatch(matchLines('UPDATE tsconfig.json'));
      });
    });
  });
});

function matchLines(...lines: string[]): RegExp {
  return new RegExp(lines.map(line => `${line}.*`).join(''), 'gs');
}
