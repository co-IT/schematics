/**
 * Result of nixt#run.
 */
export interface RunResult {
  readonly code?: number;
  readonly cmd?: string;
  readonly err?: number;
  readonly stdout?: string;
  readonly stderr?: string;
}
