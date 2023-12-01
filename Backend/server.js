const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const csvHandler = require('./csvHandler');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/dados', async (req, res) => {
    try {
        const dados = await csvHandler.lerDadosCSV();
        res.json(dados);
    } catch (e) {
        res.status(500).send('Erro ao ler o arquivo CSV');
    }
});

app.post('/atualizar', express.json(), async (req, res) => {
    const aulaAtualizada = req.body;
    // Encontrar a aula correspondente e atualizar os dados
    let dados = await lerDadosCSV();
    let aulaIndex = dados.findIndex(aula => aula['Nome da Aula'] === aulaAtualizada['Nome da Aula']);
    
    if (aulaIndex !== -1) {
        dados[aulaIndex] = aulaAtualizada;
        // Escrever os dados atualizados de volta para o CSV
        await escreverDadosCSV(dados);
        res.status(200).send('Aula atualizada com sucesso');
    } else {
        res.status(404).send('Aula não encontrada');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
