import * as nixtFacade from '../nixt-facade';
import { IntegrationTestBed } from './integration-test-bed';
import { createTempFolder } from './create-temp-folder';

class IntegrationTestBedImpl {
  constructor(public readonly folder: string) {}

  run(command: string): Promise<nixtFacade.RunResult> {
    return nixtFacade.run(command, this.folder);
  }

  execute(command: string): Promise<void> {
    return nixtFacade.execute(command, this.folder);
  }
}

/**
 * Initializes the IntegrationTestBed:
 * - sets Jest timeout to 5 minutes
 * - creates the test folder to run integration tests in
 * - links the dist folder via yarn
 */
export async function initializeIntegrationTestBed(): Promise<
  IntegrationTestBed
> {
  const minute = 60000;
  jest.setTimeout(5 * minute);

  const folder = await createTempFolder(
    'schematics-integration-test-workspace-'
  );

  await nixtFacade.execute('cd dist; yarn unlink; yarn link;');

  return new IntegrationTestBedImpl(folder);
}
