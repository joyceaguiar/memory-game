import confetti from 'canvas-confetti';
import './GameBoard.css';
import { useState, useEffect } from 'react';

function GameBoard() {
    const [cards, setCards] = useState([]);
    const [selected, setSelected] = useState([]);
    const [matched, setMatched] = useState([]);
    const [vitoria, setVitoria] = useState(false);

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
    };

    // usa essa função assim que o componente carrega
    useEffect(() => {
        reiniciarJogo();
    }, []);

    // lógica de clique
    const handleClick = (index) => {
        if (selected.length === 2 || selected.includes(index)) return;

        const newSelected = [...selected, index];
        setSelected(newSelected);

        if (newSelected.length === 2) {
            const [firstIndex, secondIndex] = newSelected;

            if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
                setMatched((prev) => {
                    const novosAcertos = [...prev, cards[firstIndex].emoji];

                    if (novosAcertos.length === cards.length / 2) {
                        setVitoria(true);
                        confetti({
                          particleCount: 150,
                          spread: 90,
                          origin: { y: 0.6 }
                        });
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
        </div>
    );
}


export default GameBoard;