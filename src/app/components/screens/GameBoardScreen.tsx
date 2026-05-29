import React from 'react';
import { useGame } from '../../context/GameContext';
import { BoardCell } from '../BoardCell';
import { Dice } from '../Dice';
import { Star, Trophy, Share2, Eye } from 'lucide-react';

export function GameBoardScreen() {
  const { gameState, myPlayerId, rollDice } = useGame();
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = myPlayerId === currentPlayer?.id;
  const busy = gameState.isRollingDice || gameState.isMoving;

  const getPlayersOnCell = (cellId: number) =>
    gameState.players.filter(p => p.position === cellId);

  const copyCode = () => {
    if (gameState.sessionCode) navigator.clipboard.writeText(gameState.sessionCode).catch(() => {});
  };

  const canRoll = isMyTurn && !busy && gameState.diceValue === null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Tablero */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-6">

              {/* Encabezado */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl md:text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 font-bold">
                  El Tablero Gigante de la Inclusión
                </h2>

                {/* Código de sesión (pequeño) */}
                {gameState.sessionCode && (
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1.5 text-sm text-slate-600">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sala:</span>
                      <span className="font-mono font-bold text-indigo-600 tracking-widest">
                        {gameState.sessionCode}
                      </span>
                      <button onClick={copyCode} title="Copiar" className="text-slate-400 hover:text-indigo-600">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Banner de turno */}
                <div className={`
                  flex items-center justify-center gap-3 rounded-2xl p-3 max-w-md mx-auto transition-all
                  ${isMyTurn
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 ring-2 ring-green-400'
                    : 'bg-gradient-to-r from-yellow-100 to-orange-100'
                  }
                `}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: currentPlayer?.color }}
                  >
                    {currentPlayer?.avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Turno de:</p>
                    <p className="text-gray-800 font-bold">{currentPlayer?.name}</p>
                  </div>
                  {isMyTurn && (
                    <span className="ml-auto text-xs font-bold text-green-700 bg-green-200 px-3 py-1 rounded-full animate-pulse">
                      ¡TÚ!
                    </span>
                  )}
                  {busy && (
                    <span className="ml-auto text-xs text-orange-600 font-medium animate-pulse">
                      Moviendo...
                    </span>
                  )}
                </div>
              </div>

              {/* Tablero */}
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 mb-6">
                {gameState.board.map(cell => (
                  <BoardCell
                    key={cell.id}
                    cell={cell}
                    players={getPlayersOnCell(cell.id)}
                  />
                ))}
              </div>

              {/* Dado y controles */}
              <div className="flex flex-col items-center gap-4">
                <Dice
                  value={gameState.diceValue}
                  isRolling={gameState.isRollingDice}
                  onRoll={rollDice}
                  disabled={!canRoll}
                />

                {/* Mensaje cuando no es mi turno */}
                {!isMyTurn && !busy && (
                  <div className="bg-slate-100 rounded-2xl px-6 py-3 text-center">
                    <p className="text-slate-600 text-sm">
                      Esperando que <span className="font-bold text-indigo-600">{currentPlayer?.name}</span> lance el dado...
                    </p>
                  </div>
                )}

                {/* Mensaje de movimiento automático */}
                {isMyTurn && gameState.diceValue !== null && !busy && (
                  <div className="bg-green-50 rounded-2xl px-6 py-3 text-center animate-pulse">
                    <p className="text-green-700 text-sm font-medium">
                      ⏳ Pasando el turno automáticamente...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar jugadores */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="mb-4 text-center text-gray-800 font-bold flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Jugadores
              </h3>

              <div className="space-y-3">
                {gameState.players.map((player, index) => {
                  const isActive = index === gameState.currentPlayerIndex;
                  const isMe = player.id === myPlayerId;
                  return (
                    <div
                      key={player.id}
                      className={`
                        rounded-2xl p-3 transition-all
                        ${isActive
                          ? 'ring-4 ring-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 scale-105'
                          : 'bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-md flex-shrink-0"
                          style={{ backgroundColor: player.color }}
                        >
                          {player.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-800 font-semibold truncate">
                            {player.name}
                            {isMe && <span className="text-indigo-400 ml-1">(tú)</span>}
                          </p>
                          <p className="text-xs text-gray-500">Casilla {player.position}</p>
                          {player.skipNextTurn && (
                            <p className="text-xs text-orange-500 font-semibold">⏳ Pierde turno</p>
                          )}
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-700"
                          style={{
                            width: `${(player.position / 30) * 100}%`,
                            backgroundColor: player.color,
                          }}
                        />
                      </div>

                      <div className="flex gap-1 mt-1.5">
                        {Array.from({ length: player.stars }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Leyenda */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2 text-center font-semibold">Casillas:</p>
                <div className="space-y-1.5 text-xs">
                  {[
                    { color: 'text-blue-600', symbol: '❓', label: 'Pregunta' },
                    { color: 'text-emerald-600', symbol: '⬆️', label: 'Acción positiva' },
                    { color: 'text-red-600', symbol: '🚧', label: 'Barrera (−2)' },
                    { color: 'text-amber-600', symbol: '⭐', label: 'Premio' },
                    { color: 'text-slate-600', symbol: '⏳', label: 'Pierde turno' },
                  ].map(({ symbol, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="text-sm">{symbol}</span>
                      <span className="text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
