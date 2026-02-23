"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCSV = toCSV;
const json2csv_1 = require("json2csv");
function toCSV(data, fields) {
    const opts = fields ? { fields } : {};
    const parser = new json2csv_1.Parser(opts);
    return parser.parse(data);
}
