import React from 'react';
import { useGame } from '../../context/GameContext';
import { Button } from '../Button';
import { Play, Copy, Check, Users, Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export function LobbyScreen() {
  const { gameState, myPlayerId, startGame, resetGame } = useGame();
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);

  const isHost = myPlayerId === gameState.hostPlayerId;
  const code = gameState.sessionCode ?? '------';
  const canStart = gameState.players.length >= 2;

  const copyCode = async () => {
    await navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = async () => {
    setStarting(true);
    await startGame();
    setStarting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-10 text-center">

          {/* Título estilo Kahoot */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Código de sala
            </p>
            {/* PIN grande y llamativo */}
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl px-8 py-5 shadow-xl mb-4">
              <span className="text-5xl md:text-7xl font-black font-mono tracking-[0.2em] text-white select-all">
                {code}
              </span>
              <button
                onClick={copyCode}
                className="text-white/70 hover:text-white transition-colors ml-2"
                title="Copiar código"
              >
                {copied
                  ? <Check className="w-8 h-8 text-green-300" />
                  : <Copy className="w-8 h-8" />}
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              Comparte este código para que tus amigos se unan desde sus dispositivos
            </p>
          </div>

          {/* Lista de jugadores */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-800">
                Jugadores ({gameState.players.length}/6)
              </h3>
            </div>

            {gameState.players.length === 0 ? (
              <div className="text-gray-400 italic py-8">
                Esperando jugadores...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gameState.players.map((player, index) => {
                  const isMe = player.id === myPlayerId;
                  const isPlayerHost = player.id === gameState.hostPlayerId;
                  return (
                    <div
                      key={player.id}
                      className={`
                        rounded-2xl p-4 flex flex-col items-center gap-2 transition-all
                        ${isMe
                          ? 'ring-4 ring-indigo-400 bg-indigo-50 scale-105'
                          : 'bg-gray-50'
                        }
                      `}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white"
                        style={{ backgroundColor: player.color }}
                      >
                        {player.avatar}
                      </div>
                      <p className="text-sm font-semibold text-gray-800 truncate w-full text-center">
                        {player.name}
                        {isMe && <span className="text-indigo-500"> (tú)</span>}
                      </p>
                      {isPlayerHost && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                          👑 Anfitrión
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Espacios libres */}
                {Array.from({ length: Math.max(0, 6 - gameState.players.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="rounded-2xl p-4 flex flex-col items-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 opacity-50"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400">
                      +
                    </div>
                    <p className="text-xs text-gray-400">Esperando...</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Indicador de espera en tiempo real */}
          <div className="flex items-center justify-center gap-2 mb-6 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Actualizando en tiempo real</span>
          </div>

          {/* Botones */}
          {isHost ? (
            <div className="space-y-3">
              <Button
                onClick={handleStart}
                variant="primary"
                size="lg"
                disabled={!canStart || starting}
                className="w-full text-lg py-5"
              >
                {starting
                  ? <Loader2 className="inline w-6 h-6 mr-2 animate-spin" />
                  : <Play className="inline w-6 h-6 mr-2" />}
                {starting ? 'Iniciando...' : '¡Iniciar partida!'}
              </Button>
              {!canStart && (
                <p className="text-sm text-gray-500">
                  Necesitas al menos 2 jugadores para comenzar
                </p>
              )}
              <Button onClick={resetGame} variant="secondary" size="md">
                <ArrowLeft className="inline w-4 h-4 mr-1" />
                Cancelar sala
              </Button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-3 text-indigo-700">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-lg font-medium">
                  Esperando que el anfitrión inicie la partida...
                </p>
              </div>
              <Button onClick={resetGame} variant="secondary" size="sm" className="mt-4">
                <ArrowLeft className="inline w-4 h-4 mr-1" />
                Salir
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
