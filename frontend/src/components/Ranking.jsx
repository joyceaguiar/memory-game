import { useState, useEffect } from 'react';
import './Ranking.css';

const BASE_URL = "http://localhost:3001";

function Ranking({ atualizar = false }) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/rankings`)
      .then(res => res.json())
      .then(data => {
        const ordenado = [...data].sort((a, b) => a.tempo - b.tempo);
        setRanking(ordenado.slice(0, 10)); // Top 10
      })
      .catch(err => console.error("Erro ao carregar ranking:", err));
  }, [atualizar]);

  return (
    <div className="ranking-container">
      <h2>🏆 Ranking dos Jogadores</h2>
      <p className="ranking-subtitulo">Veja os melhores tempos registrados até agora!</p>
      <div className="tabela-scroll">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Nível</th>
              <th>Tempo (s)</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item, index) => (
              <tr key={index}>
                <td>{item.nome}</td>
                <td>{item.nivel}</td>
                <td>{item.tempo}</td>
                <td>{item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Ranking;
