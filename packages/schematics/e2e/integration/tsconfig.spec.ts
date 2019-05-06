import {
  IntegrationTestBed,
  initializeIntegrationTestBed
} from '../integration-test-bed';

import { linkSchematics, matchLines } from '../utils';

describe('TsConfig', () => {
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

  describe('When "ng generate @co-it/schematics:tsconfig --defaults" is run', () => {
    it('should update tsconfig.json', async () => {
      const result = await testBed.run(
        'ng generate @co-it/schematics:tsconfig --defaults'
      );

      expect(result.stdout).toMatch(matchLines('UPDATE tsconfig.json'));
    });
  });
});
