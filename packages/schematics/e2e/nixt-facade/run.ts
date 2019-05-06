import { RunResult } from './run-result';

const nixt = require('nixt');

/**
 * Run the given single command using nixt#run.
 * The result can be used for Jest expectations.
 * @param command Single shell command to run.
 * @param folder Working directory to run the command in. Default: .
 */
export function run(command: string, folder = '.'): Promise<RunResult> {
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
