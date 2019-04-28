import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

const nixt = require('nixt');

const minute = 60000;
jest.setTimeout(5 * minute);

interface RunResult {
  readonly code?: number;
  readonly cmd?: string;
  readonly err?: number;
  readonly stdout?: string;
  readonly stderr?: string;
}

function run(command: string, folder = '.'): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    console.log(`Running command ${command} in folder ${folder}`);

    let runResult: RunResult = {};
    function expectationHook(result: any) {
      runResult = result;
      if (result.stderr) {
        console.warn(result.stderr);
      }
    }
    function done() {
      resolve(runResult);
    }

    try {
      nixt()
        .cwd(folder)
        .expect(expectationHook)
        .run(command, done);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

function execute(command: string, folder = '.'): Promise<void> {
  console.log(`Executing command ${command} in folder ${folder}`);

  return new Promise((resolve, reject) => {
    try {
      nixt()
        .cwd(folder)
        .exec(command)
        .run('', resolve);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

async function linkSchematics(folder: string) {
  const linkResult = await run('yarn link @co-it/schematics', folder);
  console.log(linkResult.stdout);
  expect(linkResult.stdout).toContain(
    'Using linked package for "@co-it/schematics"'
  );
}

describe('@co-it/schematics integration tests', () => {
  let folder: string;

  beforeAll(async done => {
    folder = fs.mkdtempSync(
      path.join(os.tmpdir(), 'schematics-integration-test-workspace-')
    );

    console.log(`Creating Angular test project in ${folder}`);

    await execute(`cd dist; yarn unlink; yarn link;`);

    const result = await run(
      'npx ng new integration-test --directory . --defaults',
      folder
    );

    console.log(result.stdout);
    if (result.code !== 0) {
      done.fail('Could not create Angular project');
    }

    console.log('Finished creating Angular test project.');

    done();
  });

  beforeEach(async done => {
    console.log('Cleaning git repository.');

    await execute('git checkout -- .; git clean -fd', folder);

    const statusResult = await run('git status', folder);
    expect(statusResult.stdout).toContain(
      'nothing to commit, working tree clean'
    );

    await linkSchematics(folder);

    done();
  });

  describe('@co-it/schematics:commitlint', () => {
    describe('When "ng g @co-it/schematics:commitlint" is run', () => {
      it('should update files', async () => {
        const result = await run(
          'ng generate @co-it/schematics:commitlint',
          folder
        );

        expect(result.stdout).toMatch(
          matchLines(
            'CREATE commitlint.config.js.*',
            'CREATE .huskyrc.*',
            'UPDATE package.json.*',
            'husky > setting up git hooks.*',
            'husky > done.*',
            'added .* packages.*'
          )
        );
      });
    });
  });

  describe('@co-it/schematics:cypress', () => {
    describe('When "ng generate @co-it/schematics:cypress --overwrite=true" is run', () => {
      it('should update files', async () => {
        const result = await run(
          'ng generate @co-it/schematics:cypress --overwrite=true --no-interactive',
          folder
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
        await execute(
          'ng generate @co-it/schematics:cypress --overwrite=true --no-interactive',
          folder
        );

        const result = await run('ng e2e --headless', folder);

        expect(result.stdout).toMatch(
          matchLines('✔ examples/app.spec.js', 'All specs passed!')
        );
      });
    });

    describe('When "ng generate @co-it/schematics:cypress --app=second-app --overwrite=true" is run', () => {
      it('should update files', async () => {
        await execute('ng generate app second-app', folder);
        await linkSchematics(folder);

        const result = await run(
          'ng generate @co-it/schematics:cypress --app=second-app --overwrite=true --no-interactive',
          folder
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
        await execute('ng generate app second-app', folder);
        await linkSchematics(folder);
        await execute(
          'ng generate @co-it/schematics:cypress --app=second-app --overwrite=true --no-interactive',
          folder
        );

        const result = await run('ng e2e second-app-e2e --headless', folder);

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
