import { useState, useEffect } from 'react';

function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/rankings")
      .then(res => res.json())
      .then(data => {
        // Ordena pelo menor número de tentativas
        const ordenado = data.sort((a, b) => a.tentativas - b.tentativas);
        setRanking(ordenado);
      })
      .catch(err => console.error("Erro ao carregar ranking:", err));
  }, []);

  return (
    <div className="ranking-container">
      <h2>🏆 Ranking das Jogadoras</h2>
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
              <td>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ranking;