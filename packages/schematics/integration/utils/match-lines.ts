export function matchLines(...lines: string[]): RegExp {
  return new RegExp(lines.map(line => `${line}.*`).join(''), 'gs');
}
