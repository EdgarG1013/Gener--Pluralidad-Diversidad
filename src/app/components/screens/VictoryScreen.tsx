import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Button } from '../Button';
import { Trophy, Star, Home, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export function VictoryScreen() {
  const { gameState, resetGame, setScreen } = useGame();
  const winner = gameState.winner;

  useEffect(() => {
    // Launch confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF6B9D', '#4ECDC4', '#FFE66D', '#A8DADC', '#F4A261', '#95E1D3']
      });

      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF6B9D', '#4ECDC4', '#FFE66D', '#A8DADC', '#F4A261', '#95E1D3']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!winner) return null;

  // Sort players by position for podium
  const sortedPlayers = [...gameState.players].sort((a, b) => b.position - a.position);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-300 rounded-full -translate-x-20 -translate-y-20 opacity-30 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-300 rounded-full translate-x-24 translate-y-24 opacity-30 animate-pulse" />

          {/* Content */}
          <div className="relative z-10">
            {/* Trophy animation */}
            <div className="mb-6 animate-bounce">
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl mb-4 bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
              ¡Tenemos un ganador!
            </h1>

            {/* Winner card */}
            <div className="max-w-md mx-auto mb-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-8 shadow-xl border-4 border-yellow-400">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-6xl mx-auto mb-4 shadow-2xl border-4 border-white"
                style={{ backgroundColor: winner.color }}
              >
                {winner.avatar}
              </div>
              <h2 className="text-3xl text-gray-800 mb-2">{winner.name}</h2>
              <div className="flex justify-center gap-2 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-lg text-gray-700">¡Promovió la inclusión y llegó a la meta!</p>
            </div>

            {/* Podium */}
            <div className="mb-8">
              <h3 className="text-2xl text-gray-800 mb-6">Clasificación final</h3>
              <div className="flex justify-center items-end gap-4 max-w-2xl mx-auto">
                {sortedPlayers.slice(0, 3).map((player, index) => {
                  const heights = ['h-32', 'h-40', 'h-28'];
                  const positions = ['2°', '1°', '3°'];
                  const colors = ['from-gray-300 to-gray-400', 'from-yellow-300 to-yellow-500', 'from-orange-300 to-orange-400'];
                  const displayOrder = [1, 0, 2]; // Show 2nd, 1st, 3rd

                  const actualIndex = displayOrder.indexOf(index);
                  if (actualIndex === -1) return null;

                  const displayPlayer = sortedPlayers[actualIndex];

                  return (
                    <div
                      key={displayPlayer.id}
                      className={`flex-1 max-w-[150px] ${heights[index]} bg-gradient-to-t ${colors[index]} rounded-t-2xl flex flex-col items-center justify-start p-4 shadow-lg`}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 shadow-lg border-2 border-white"
                        style={{ backgroundColor: displayPlayer.color }}
                      >
                        {displayPlayer.avatar}
                      </div>
                      <p className="text-xs text-gray-800 truncate w-full text-center mb-1">
                        {displayPlayer.name}
                      </p>
                      <p className="text-2xl">{positions[index]}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Educational message */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl p-6 mb-8 max-w-2xl mx-auto">
              <p className="text-xl text-gray-800 mb-2">
                💖 La inclusión nos hace más fuertes
              </p>
              <p className="text-gray-700">
                Juntos hemos aprendido sobre respeto, diversidad e igualdad.
                ¡Sigamos construyendo un mundo más inclusivo!
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  resetGame();
                }}
                variant="primary"
                size="lg"
              >
                <RotateCcw className="inline w-6 h-6 mr-2" />
                Jugar de nuevo
              </Button>

              <Button
                onClick={() => {
                  resetGame();
                  setScreen('home');
                }}
                variant="secondary"
                size="lg"
              >
                <Home className="inline w-6 h-6 mr-2" />
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
