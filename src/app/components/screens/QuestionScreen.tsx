import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Button } from '../Button';
import { CheckCircle, XCircle, Lightbulb, Eye } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D'];

export function QuestionScreen() {
  const { gameState, myPlayerId, revealAnswer, answerQuestion } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [continuing, setContinuing] = useState(false);

  const question = gameState.currentQuestion;
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = myPlayerId === currentPlayer?.id;
  const revealed = gameState.questionAnswer ?? null;
  const showResult = revealed !== null;
  const chosen = showResult ? revealed : selectedAnswer;
  const isCorrect = showResult && question !== null && revealed === question.correctAnswer;
  const effect = gameState.questionEffect ?? 0;

  // Reiniciar selección local al cambiar de pregunta
  useEffect(() => {
    setSelectedAnswer(null);
    setContinuing(false);
  }, [question?.id]);

  // Atajos de teclado: 1-4 / A-D para elegir, Enter para confirmar o continuar
  useEffect(() => {
    if (!isMyTurn || !question) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLButtonElement && e.key === 'Enter') return;
      const k = e.key.toUpperCase();
      const idx = /^[1-4]$/.test(k) ? Number(k) - 1 : LETTERS.indexOf(k);
      if (!showResult && idx >= 0 && idx < question.options.length) {
        setSelectedAnswer(idx);
      } else if (e.key === 'Enter') {
        if (!showResult && selectedAnswer !== null) revealAnswer(selectedAnswer);
        else if (showResult && !continuing) { setContinuing(true); answerQuestion(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMyTurn, question, showResult, selectedAnswer, continuing, revealAnswer, answerQuestion]);

  if (!question) return null;

  const handleConfirm = () => {
    if (selectedAnswer === null || !isMyTurn) return;
    revealAnswer(selectedAnswer);
  };

  const handleContinue = () => {
    if (continuing) return;
    setContinuing(true);
    answerQuestion();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">

          {/* Cabecera */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 motion-safe:animate-pulse">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl text-gray-800 mb-1 font-bold">¡Momento de aprender!</h2>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: currentPlayer?.color }}
              >
                {currentPlayer?.avatar}
              </div>
              <span>
                Turno de <span className="font-semibold text-gray-700">{currentPlayer?.name}</span>
              </span>
            </div>

            {!isMyTurn && (
              <div className="mt-3 flex items-center justify-center gap-2 bg-slate-100 rounded-xl px-4 py-2 w-fit mx-auto">
                <Eye className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Estás observando esta ronda: ¡piensa tu respuesta!</span>
              </div>
            )}
          </div>

          {/* Pregunta */}
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-6 mb-8">
            <p className="text-lg md:text-xl text-gray-800 text-center font-medium" id="question-text">
              {question.question}
            </p>
          </div>

          {/* Opciones */}
          <div className="space-y-3 mb-8" role="radiogroup" aria-labelledby="question-text">
            {question.options.map((option, index) => {
              const isSelected = chosen === index;
              const isCorrectAnswer = index === question.correctAnswer;
              const showCorrect = showResult && isCorrectAnswer;
              const showWrong = showResult && isSelected && !isCorrectAnswer;

              let cls = 'bg-gray-50 border-gray-200';
              if (!showResult && isSelected) cls = 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-300';
              else if (!showResult && isMyTurn) cls += ' hover:bg-gray-100 hover:border-gray-300 cursor-pointer';
              else if (!showResult) cls += ' cursor-default';
              if (showCorrect) cls = 'bg-emerald-50 border-emerald-500';
              if (showWrong) cls = 'bg-rose-50 border-rose-500';
              if (showResult && !isSelected && !isCorrectAnswer) cls = 'bg-gray-50 border-gray-200 opacity-50';

              const letterCls = showCorrect
                ? 'bg-emerald-500 text-white'
                : showWrong
                ? 'bg-rose-500 text-white'
                : isSelected
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-600 border border-gray-300';

              return (
                <button
                  key={index}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => isMyTurn && !showResult && setSelectedAnswer(index)}
                  disabled={showResult || !isMyTurn}
                  className={`w-full p-4 rounded-2xl text-left border-2 transition-colors duration-150 flex items-center gap-4 ${cls}`}
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${letterCls}`}>
                    {LETTERS[index]}
                  </span>
                  <span className="text-base md:text-lg text-gray-800 flex-1">{option}</span>
                  {showCorrect && <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" aria-label="Respuesta correcta" />}
                  {showWrong && <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" aria-label="Respuesta elegida, incorrecta" />}
                </button>
              );
            })}
          </div>

          {/* Resultado (visible para todos) */}
          {showResult && (
            <div
              role="status"
              className={`rounded-2xl p-6 mb-6 text-center border-2 ${
                isCorrect ? 'bg-emerald-50 border-emerald-400' : 'bg-amber-50 border-amber-400'
              }`}
            >
              <div className="text-5xl mb-3" aria-hidden="true">{isCorrect ? '🎉' : '💭'}</div>
              <p className={`text-xl font-bold mb-2 ${isCorrect ? 'text-emerald-800' : 'text-amber-800'}`}>
                {isCorrect ? '¡Excelente!' : '¡Sigue aprendiendo!'}
              </p>
              <p className={isCorrect ? 'text-emerald-700' : 'text-amber-800'}>{question.explanation}</p>
              <p className={`mt-3 font-semibold ${isCorrect ? 'text-emerald-600' : 'text-amber-700'}`}>
                {currentPlayer?.name} {effect >= 0 ? 'avanza' : 'retrocede'} {Math.abs(effect)}{' '}
                {Math.abs(effect) === 1 ? 'casilla' : 'casillas'}
              </p>
            </div>
          )}

          {/* Acciones */}
          {isMyTurn && !showResult && (
            <div className="text-center">
              <Button onClick={handleConfirm} disabled={selectedAnswer === null} variant="primary" size="lg">
                Confirmar respuesta
              </Button>
              <p className="text-xs text-gray-400 mt-3">Atajo: teclas 1–4 o A–D y Enter</p>
            </div>
          )}
          {isMyTurn && showResult && (
            <div className="text-center">
              <Button onClick={handleContinue} disabled={continuing} variant="primary" size="lg">
                Continuar
              </Button>
            </div>
          )}
          {!isMyTurn && (
            <p className="text-center text-gray-500 text-sm italic">
              {showResult
                ? <>Esperando a que <span className="font-semibold">{currentPlayer?.name}</span> continúe…</>
                : <>Solo <span className="font-semibold">{currentPlayer?.name}</span> puede responder esta pregunta</>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
