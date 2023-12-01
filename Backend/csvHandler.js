const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');

const csvFilePath = 'TabelaFDZ.csv';

async function lerDadosCSV() {
    return new Promise((resolve, reject) => {
        let resultados = [];
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (data) => resultados.push(data))
          .on('end', () => {
            resolve(resultados);
          });
    });
}

async function escreverDadosCSV(dados) {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(dados);

    return new Promise((resolve, reject) => {
        fs.writeFile(csvFilePath, csv, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    lerDadosCSV,
    escreverDadosCSV
};
