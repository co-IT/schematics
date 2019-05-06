import {
  IntegrationTestBed,
  initializeIntegrationTestBed
} from './integration-test-bed';

import { linkSchematics, matchLines } from './utils';

describe('Prettier', () => {
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