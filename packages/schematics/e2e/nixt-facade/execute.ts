const nixt = require('nixt');

/**
 * Execute the given commands using nixt#exec.
 * @param commands Shell commands to run. Can be separated by &&, || or ;
 * @param folder Working directory to execute the commands in. Default: .
 */
export function execute(command: string, folder = '.'): Promise<void> {
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
