const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const fs = require('fs');
const RANKINGS_FILE ='rankings.json';

app.get('/rankings', (req, res) => {
    const data = fs.readFileSync(RANKINGS_FILE);
    const rankings = JSON.parse(data);
    res.json(rankings);
});