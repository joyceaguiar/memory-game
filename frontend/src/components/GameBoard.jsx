import confetti from 'canvas-confetti';
import './GameBoard.css';
import { useState, useEffect } from 'react';
import Ranking from './Ranking';

const BASE_URL = "http://localhost:3001";


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
    const [atualizarRanking, setAtualizarRanking] = useState(false);
    const [mostrarTudo, setMostrarTudo] = useState(false);


    const iniciarJogo = (nivel) => {
        setNivelSelecionado(nivel);
        reiniciarJogo(nivel);
    };


    const reiniciarJogo = (nivel = nivelSelecionado) => {

        let emojis = [];

        if (nivel === "Fácil") {
            emojis = ['🐶', '🍕', '🌈', '🎧', '🌟', '🏆'];
            setTempoRestante(90);
        } else if (nivel === "Intermediário") {
            emojis = ['🐶', '🍕', '🌈', '🎧', '🚀', '💎', '🐱', '🌟', '🏆', '💻'];
            setTempoRestante(60);
        } else if (nivel === "Difícil") {
            emojis = ['🐶', '🍕', '🌈', '🎧', '🚀', '💎', '🐱', '🌟', '⚡', '🍩', '🧃', '🎲', '🏆', '💻', '💅'];
            setTempoRestante(50);
        }

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
        setMostrarTudo(true);
        setTimeout(() => {
            setMostrarTudo(false);
        }, 2000); // 2 segundos


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
            setTempoRestante(
                nivelSelecionado === "Fácil" ? 60 :
                    nivelSelecionado === "Intermediário" ? 50 :
                        45
            );

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
                    const novosAcertos = [...matched, cards[firstIndex].emoji];
                    setMatched(novosAcertos);

                    if (novosAcertos.length === cards.length / 2) {
                        setVitoria(true);

                        setTimeout(() => {
                            const nome = prompt("Digite seu nome para o ranking:");
                            if (nome) {
                                confetti({
                                    particleCount: 150,
                                    spread: 90,
                                    origin: { y: 0.6 }
                                });

                                fetch(`${BASE_URL}/rankings`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        nome,
                                        nivel: nivelSelecionado,
                                        tentativas
                                    })
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        console.log("✅ Enviado com sucesso:", data);
                                        setAtualizarRanking(prev => !prev);
                                    })
                                    .catch(erro => console.error("Erro ao enviar:", erro));
                            }
                        }, 300);
                    }


                    return novosAcertos;
                });
            }

            setTimeout(() => {
                setSelected([]);
            }, 1000);
        }
    };

    const voltarParaMenu = () => {
        setMostrarTudo(false);
        setNivelSelecionado(null);
        setCards([]);
        setSelected([]);
        setMatched([]);
        setVitoria(false);
        setTentativas(0);
        setTempoRestante(null);
        setTimerAtivo(false);
        setDerrota(false);
    };


    // interface
    return (
        <div className="container">
            {!nivelSelecionado ? (
                <div className="tela-inicial">
                    <h1 className="titulo">🎮 Escolha o Nível</h1>
                    <div className="botoes-nivel">
                        <button onClick={() => iniciarJogo("Fácil")}>Fácil</button>
                        <button onClick={() => iniciarJogo("Intermediário")}>Intermediário</button>
                        <button onClick={() => iniciarJogo("Difícil")}>Difícil</button>
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="titulo">🧠 Jogo da Memória 🧠</h1>
                    {vitoria && (
                        <div className="mensagem-vitoria">
                            ✨ Parabéns! Você ganhou! ✨
                        </div>
                    )}
                    {tempoRestante !== null && !vitoria && !derrota && (
                        <div className="barra-tempo">
                            <p>⏳ Tempo restante: {tempoRestante}s</p>
                            <div
                                className="progresso"
                                style={{
                                    width: `${(tempoRestante / (
                                        nivelSelecionado === "Fácil" ? 60 :
                                            nivelSelecionado === "Intermediário" ? 50 :
                                                45
                                    )) * 100}%`
                                }}

                            >
                                <span className="tempo-texto">{tempoRestante}</span>
                            </div>
                        </div>
                    )}

                    {derrota && (
                        <div className="mensagem-derrota">
                            😢 Que pena! Você perdeu!
                        </div>
                    )}
                    <button onClick={() => iniciarJogo(nivelSelecionado)}> Reiniciar </button>
                    <button onClick={voltarParaMenu}> Voltar ao Menu</button>


                    <div className={`board board-${nivelSelecionado?.toLowerCase()}`}>

                        {cards.map((card, index) => {
                            const isFlipped = mostrarTudo || selected.includes(index) || matched.includes(card.emoji);
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

                    <Ranking atualizarRanking={atualizarRanking} />

                </>
            )}
        </div>


    );
}


export default GameBoard;