const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

const RANKINGS_FILE = 'rankings.json';

app.get('/rankings', (req, res) => {
    const data = fs.readFileSync(RANKINGS_FILE);
    const rankings = JSON.parse(data);
    res.json(rankings);
});


app.post('/rankings', (req, res) => {
    const { nome, nivel, tentativas } = req.body;

    const novoRegistro = {
        nome,
        nivel,
        tentativas,
        data: new Date().toISOString()
    };

    const data = fs.readFileSync(RANKINGS_FILE);
    const rankings = JSON.parse(data);

    rankings.push(novoRegistro);

    fs.writeFileSync(RANKINGS_FILE, JSON.stringify(rankings, null, 2));
    res.status(201).json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`✨ Servidor rodando em http://localhost:${PORT}`);
});