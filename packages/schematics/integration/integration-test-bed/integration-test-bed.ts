import { RunResult } from '../nixt-facade';

export interface IntegrationTestBed {
  /**
   * The directory used for integration tests.
   */
  readonly folder: string;

  /**
   * Run the given single command in the integration test folder.
   * The result can be used for Jest expectations.
   * @param command Single shell command to run.
   */
  run(command: string): Promise<RunResult>;

  /**
   * Run the given commands in the integration test folder.
   * @param commands Shell commands to run. Can be separated by &&, || or ;
   */
  execute(commands: string): Promise<void>;
}
