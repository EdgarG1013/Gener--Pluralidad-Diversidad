import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Button } from '../Button';
import { CheckCircle, XCircle, Lightbulb, Eye } from 'lucide-react';

export function QuestionScreen() {
  const { gameState, myPlayerId, answerQuestion } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const question = gameState.currentQuestion;
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = myPlayerId === currentPlayer?.id;

  if (!question || answered) return null;

  const handleSelectAnswer = (index: number) => {
    if (!isMyTurn || showResult) return;
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !isMyTurn) return;
    const isCorrect = selectedAnswer === question.correctAnswer;
    setShowResult(true);

    setTimeout(() => {
      setAnswered(true);
      answerQuestion(isCorrect);
    }, 3000);
  };

  const isCorrect = selectedAnswer !== null && selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">

          {/* Cabecera */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
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

            {/* Indicador para espectadores / no-activos */}
            {!isMyTurn && (
              <div className="mt-3 flex items-center justify-center gap-2 bg-slate-100 rounded-xl px-4 py-2 w-fit mx-auto">
                <Eye className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Estás observando esta ronda</span>
              </div>
            )}
          </div>

          {/* Pregunta */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
            <p className="text-lg md:text-xl text-gray-800 text-center font-medium">
              {question.question}
            </p>
          </div>

          {/* Opciones */}
          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.correctAnswer;
              const showCorrect = showResult && isCorrectAnswer;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult || !isMyTurn}
                  className={`
                    w-full p-5 rounded-2xl text-left transition-all duration-200
                    ${!showResult && !isSelected && isMyTurn ? 'bg-gray-100 hover:bg-gray-200 cursor-pointer' : ''}
                    ${!showResult && !isMyTurn ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}
                    ${!showResult && isSelected ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white scale-[1.02] shadow-lg' : ''}
                    ${showCorrect ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white scale-[1.02] shadow-lg' : ''}
                    ${showWrong ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white' : ''}
                    ${showResult && !isSelected && !isCorrectAnswer ? 'bg-gray-100 opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg">{option}</span>
                    {showCorrect && <CheckCircle className="w-6 h-6 flex-shrink-0 ml-2" />}
                    {showWrong && <XCircle className="w-6 h-6 flex-shrink-0 ml-2" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Resultado */}
          {showResult && (
            <div
              className={`rounded-2xl p-6 mb-6 text-center ${
                isCorrect
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400'
                  : 'bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-400'
              }`}
            >
              {isCorrect ? (
                <>
                  <div className="text-5xl mb-3">🎉</div>
                  <p className="text-xl text-green-800 font-bold mb-2">¡Excelente!</p>
                  <p className="text-green-700">{question.explanation}</p>
                  <p className="text-green-600 mt-2 font-semibold">Avanzas espacios extra</p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-3">💭</div>
                  <p className="text-xl text-orange-800 font-bold mb-2">¡Sigue aprendiendo!</p>
                  <p className="text-orange-700">{question.explanation}</p>
                  <p className="text-orange-600 mt-2 font-semibold">Retrocedes un poco, ¡pero aprendiste algo nuevo!</p>
                </>
              )}
              <p className="text-gray-400 text-sm mt-4 animate-pulse">Volviendo al tablero...</p>
            </div>
          )}

          {/* Botón confirmar (solo jugador activo) */}
          {!showResult && isMyTurn && (
            <div className="text-center">
              <Button
                onClick={handleConfirmAnswer}
                disabled={selectedAnswer === null}
                variant="primary"
                size="lg"
              >
                Confirmar respuesta
              </Button>
            </div>
          )}

          {/* Mensaje para no-activos */}
          {!showResult && !isMyTurn && (
            <div className="text-center text-gray-500 text-sm italic">
              Solo <span className="font-semibold">{currentPlayer?.name}</span> puede responder esta pregunta
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
