import React from 'react';
import { useGame } from '../../context/GameContext';
import { BoardCell } from '../BoardCell';
import { Star, Trophy, Eye } from 'lucide-react';
import { Button } from '../Button';

export function SpectatorScreen() {
  const { gameState, resetGame } = useGame();

  const getPlayersOnCell = (cellId: number) =>
    gameState.players.filter(p => p.position === cellId);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Banner de espectador */}
        <div className="mb-4 flex items-center justify-center gap-2 bg-white/10 rounded-2xl p-3 text-white text-sm">
          <Eye className="w-5 h-5 animate-pulse text-yellow-300" />
          <span>Modo espectador — Sesión <span className="font-mono font-bold text-yellow-300">{gameState.sessionCode}</span></span>
          <Button variant="secondary" size="sm" onClick={resetGame} className="ml-4">
            Salir
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-6">
              <div className="mb-6 text-center">
                <h2 className="text-2xl md:text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 font-bold">
                  El Tablero Gigante de la Inclusión
                </h2>
                {currentPlayer && (
                  <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-3 max-w-md mx-auto">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ backgroundColor: currentPlayer.color }}
                    >
                      {currentPlayer.avatar}
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Turno de:</p>
                      <p className="text-gray-800 font-semibold">{currentPlayer.name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {gameState.board.map(cell => (
                  <BoardCell
                    key={cell.id}
                    cell={cell}
                    players={getPlayersOnCell(cell.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="mb-4 text-center text-gray-800 flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Jugadores
              </h3>
              <div className="space-y-3">
                {gameState.players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`rounded-2xl p-4 transition-all ${
                      index === gameState.currentPlayerIndex
                        ? 'ring-4 ring-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 scale-105'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 border-white shadow-md"
                        style={{ backgroundColor: player.color }}
                      >
                        {player.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 truncate font-medium">{player.name}</p>
                        <p className="text-xs text-gray-500">Casilla {player.position}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(player.position / 30) * 100}%`,
                          backgroundColor: player.color,
                        }}
                      />
                    </div>
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: player.stars }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
