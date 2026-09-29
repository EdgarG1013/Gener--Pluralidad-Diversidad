import React from 'react';
import { Pause } from 'lucide-react';
import { useGame } from '../context/GameContext';

export function PauseOverlay() {
  const { gameState, isHost } = useGame();
  const inGame = ['game-board', 'question', 'spectator'].includes(gameState.screen);
  if (!gameState.paused || !inGame) return null;

  return (
    <div className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4" role="alertdialog" aria-label="Partida en pausa">
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Pause className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Partida en pausa</h2>
        <p className="text-slate-500">
          {isHost ? 'Reanuda desde el panel docente cuando estén listos.' : 'El docente reanudará el juego en un momento.'}
        </p>
      </div>
    </div>
  );
}
