import { IntegrationTestBed } from '../integration-test-bed';
export async function linkSchematics(testBed: IntegrationTestBed) {
  const linkResult = await testBed.run('yarn link @co-it/schematics');
  console.log(linkResult.stdout);
  expect(linkResult.stdout).toContain(
    'Using linked package for "@co-it/schematics"'
  );
}
