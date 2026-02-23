import { Parser } from 'json2csv';

export function toCSV(data: Record<string, unknown>[], fields?: string[]): string {
  const opts = fields ? { fields } : {};
  const parser = new Parser(opts);
  return parser.parse(data);
}
