import confetti from 'canvas-confetti';
import './GameBoard.css';
import { useState, useEffect } from 'react';
import Ranking from './Ranking';


function GameBoard() {
    const [nivelSelecionado, setNivelSelecionado] = useState(null);
    const [cards, setCards] = useState([]);
    const [selected, setSelected] = useState([]);
    const [matched, setMatched] = useState([]);
    const [vitoria, setVitoria] = useState(false);
    const [tentativas, setTentativas] = useState(0);
    const nivel = "Intermediário";
    const [tempoRestante, setTempoRestante] = useState(null);
    const [timerAtivo, setTimerAtivo] = useState(false);
    const [derrota, setDerrota] = useState(false);

    const reiniciarJogo = () => {
        const emojis = ['🐶', '🍕', '🌈', '🎧', '🚀', '💎', '🐱', '🌟', '⚡', '🍩', '🧃', '🎲'];
        const duplicated = [...emojis, ...emojis]; // dobra tudo p virar pares
        const shuffled = duplicated
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji
            }));

        setCards(shuffled);
        setSelected([]);
        setMatched([]);
        setVitoria(false);
        setTentativas(0);
        setTempoRestante(null);
        setTimerAtivo(false);
        setDerrota(false);

    };

    // usa essa função assim que o componente carrega
    useEffect(() => {
        reiniciarJogo();
    }, []);

    useEffect(() => {
        if (!timerAtivo || tempoRestante === null) return;

        if (tempoRestante === 0) {
            if (!vitoria) {
                setDerrota(true);
            }
            setTimerAtivo(false);
            return;
        }

        const intervalo = setInterval(() => {
            setTempoRestante(prev => prev - 1);
        }, 1000);

        return () => clearInterval(intervalo);
    }, [timerAtivo, tempoRestante]);

    // lógica de clique
    const handleClick = (index) => {
        if (vitoria) return;

        if (!timerAtivo) {
            setTimerAtivo(true);
            setTempoRestante(90); // ou 30, 90, etc.
        }

        if (selected.length === 2 || selected.includes(index)) return;

        if (derrota) return;

        const newSelected = [...selected, index];
        setSelected(newSelected);

        if (newSelected.length === 2) {
            setTentativas(prev => prev + 1);

            const [firstIndex, secondIndex] = newSelected;

            if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
                setMatched((prev) => {
                    const novosAcertos = [...prev, cards[firstIndex].emoji];

                    if (novosAcertos.length === cards.length / 2) {
                        setVitoria(true);

                        const nome = prompt("Digite seu nome para o ranking:");
                        confetti({
                            particleCount: 150,
                            spread: 90,
                            origin: { y: 0.6 }
                        });

                        fetch("http://localhost:3001/rankings", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                nome,
                                nivel,
                                tentativas
                            })
                        })
                            .then(res => res.json())
                            .then(data => console.log("✅ Enviado com sucesso:", data))
                            .catch(erro => console.error("Erro ao enviar:", erro));
                    }

                    return novosAcertos;
                });
            }

            setTimeout(() => {
                setSelected([]);
            }, 1000);
        }
    };

    // interface
    return (
        <div className="container">
            <h1 className="titulo">🧠 Jogo da Memória 🧠</h1>
            {vitoria && (
                <div className="mensagem-vitoria">
                    ✨ Parabéns! Você completou o jogo! ✨
                </div>
            )}
            {tempoRestante !== null && !vitoria && !derrota && (
                <div className="barra-tempo">
                    <p>⏳ Tempo restante: {tempoRestante}s</p>
                    <div
                        className="progresso"
                        style={{ width: `${(tempoRestante / 120) * 100}%` }}
                    >
                        <span className="tempo-texto">{tempoRestante}</span>
                    </div>
                </div>
            )}

            {derrota && (
                <div className="mensagem-derrota">
                    😢 Tempo esgotado! Você perdeu!
                </div>
            )}
            <button onClick={reiniciarJogo}>🔄 Reiniciar Jogo</button>
            <div className="board">
                {cards.map((card, index) => {
                    const isFlipped = selected.includes(index) || matched.includes(card.emoji);
                    return (
                        <div
                            key={card.id}
                            className="card"
                            onClick={() => handleClick(index)}
                        >
                            <div className={`inner ${isFlipped ? 'flipped' : ''}`}>
                                <div className="front">{card.emoji}</div>
                                <div className="back">❓</div>
                            </div>


                        </div>

                    );
                })}
            </div>

            <Ranking />
        </div>
    );
}


export default GameBoard;