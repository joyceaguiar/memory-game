import { useState, useEffect } from 'react';
import './Ranking.css';

const BASE_URL = "http://localhost:3001";

function Ranking({ atualizar = false }) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/rankings`)
      .then(res => res.json())
      .then(data => {
        const ordenado = [...data].sort((a, b) => a.tentativas - b.tentativas);
        setRanking(ordenado.slice(0, 10)); // Top 10
      })
      .catch(err => console.error("Erro ao carregar ranking:", err));
  }, [atualizar]);

  return (
    <div className="ranking-container">
      <h2>🏆 Ranking dos Jogadores</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nível</th>
            <th>Tentativas</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((item, index) => (
            <tr key={index}>
              <td>{item.nome}</td>
              <td>{item.nivel}</td>
              <td>{item.tentativas}</td>
              <td>{item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ranking;
