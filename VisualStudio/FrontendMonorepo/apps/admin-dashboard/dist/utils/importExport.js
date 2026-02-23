"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToCSV = exportToCSV;
exports.importFromCSV = importFromCSV;
// importExport.ts - Data import/export utilities (scaffold)
function exportToCSV(data, filename) {
    const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
function importFromCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;
            const [header, ...rows] = text.split('\n');
            const keys = header.split(',');
            const data = rows.map(row => {
                const values = row.split(',');
                return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
            });
            resolve(data);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}
