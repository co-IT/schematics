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
            'UPDATE package.json.*',
            '> husky@.* install',
            'added .* packages.*'
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
            'UPDATE e2e/tsconfig.e2e.json .*',
            '> cypress.* postinstall .*',
            'added .* packages .*'
          )
        );
      });

      it('should setup e2e runner for cypress', async () => {
        await testBed.execute(
          'ng generate @co-it/schematics:cypress --overwrite=true --no-interactive'
        );

        const result = await testBed.run('ng e2e --headless');

        expect(result.stdout).toMatch(
          matchLines('✔ examples/app.spec.js', 'All specs passed!')
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
            'UPDATE projects/second-app-e2e/tsconfig.e2e.json .*',
            '> cypress@.* postinstall .*',
            'added .* packages .*'
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

  describe('@co-it/schematics:jest', () => {});

  describe('@co-it/schematics:prettier', () => {});

  describe('@co-it/schematics:tsconfig', () => {});
});

function matchLines(...lines: string[]): RegExp {
  return new RegExp(lines.map(line => `${line}.*`).join(''), 'gs');
}
