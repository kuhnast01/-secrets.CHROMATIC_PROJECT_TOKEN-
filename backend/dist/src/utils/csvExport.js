import { Parser } from 'json2csv';
export function toCSV(data, fields) {
    const opts = fields ? { fields } : {};
    const parser = new Parser(opts);
    return parser.parse(data);
}
