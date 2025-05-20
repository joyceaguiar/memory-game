const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const RANKINGS_PATH = './rankings.json';

app.post('/rankings', (req, res) => {
  const novoRanking = {
    ...req.body,
    data: new Date().toISOString() // adiciona a data automaticamente
  };

  // Lê o arquivo atual
  fs.readFile(RANKINGS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao ler ranking' });

    let rankings = [];
    try {
      rankings = JSON.parse(data).rankings || [];
    } catch (e) {
      return res.status(500).json({ erro: 'JSON inválido' });
    }

    // Adiciona o novo ranking
    rankings.push(novoRanking);

    // Salva novamente o arquivo
    fs.writeFile(RANKINGS_PATH, JSON.stringify({ rankings }, null, 2), (err) => {
      if (err) return res.status(500).json({ erro: 'Erro ao salvar ranking' });

      res.status(201).json({ mensagem: 'Ranking salvo com sucesso' });
    });
  });
});

app.get('/rankings', (req, res) => {
  fs.readFile(RANKINGS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao ler ranking' });

    try {
      const rankings = JSON.parse(data).rankings || [];
      res.json(rankings);
    } catch (e) {
      res.status(500).json({ erro: 'JSON inválido' });
    }
  });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor acessível na rede local via http://192.168.1.8:${PORT}`);
});
