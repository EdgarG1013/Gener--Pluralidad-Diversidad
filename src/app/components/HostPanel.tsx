import React, { useEffect, useState } from 'react';
import { GraduationCap, Pause, Play, SkipForward, UserMinus, X, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';

/** Panel flotante del docente (anfitrión): pausar, saltar turno y retirar jugadores. */
export function HostPanel() {
  const { gameState, isHost, myPlayerId, togglePause, skipTurn, kickPlayer } = useGame();
  const [open, setOpen] = useState(false);
  const [confirmKick, setConfirmKick] = useState<string | null>(null);

  useEffect(() => { if (!open) setConfirmKick(null); }, [open]);

  const inGame = gameState.screen === 'game-board' || gameState.screen === 'question';
  if (!isHost || !inGame || gameState.sessionStatus !== 'playing') return null;

  const busy = gameState.isRollingDice || gameState.isMoving;
  const current = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {open && (
        <div
          id="host-panel"
          className="w-72 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" /> Panel docente
            </h3>
            <button onClick={() => setOpen(false)} aria-label="Cerrar panel" className="text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={togglePause}
              disabled={busy}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold py-2.5 hover:bg-indigo-700 disabled:opacity-50"
            >
              {gameState.paused ? <><Play className="w-4 h-4" /> Reanudar</> : <><Pause className="w-4 h-4" /> Pausar</>}
            </button>
            <button
              onClick={skipTurn}
              disabled={busy}
              title={current ? `Pasar el turno de ${current.name}` : undefined}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold py-2.5 hover:bg-slate-200 disabled:opacity-50"
            >
              <SkipForward className="w-4 h-4" /> Saltar turno
            </button>
          </div>

          <p className="text-xs font-semibold text-slate-500 mb-2">Jugadores</p>
          <ul className="space-y-1.5 max-h-60 overflow-y-auto">
            {gameState.players.map(p => {
              const isMe = p.id === myPlayerId;
              const confirming = confirmKick === p.id;
              return (
                <li key={p.id} className="flex items-center gap-2 rounded-xl bg-slate-50 px-2 py-1.5">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: p.color }}>
                    {p.avatar}
                  </span>
                  <span className="flex-1 min-w-0 text-sm text-slate-700 truncate">
                    {p.name}{isMe && <span className="text-indigo-400"> (tú)</span>}
                  </span>
                  {!isMe && (confirming ? (
                    <span className="flex gap-1">
                      <button
                        onClick={() => { kickPlayer(p.id); setConfirmKick(null); }}
                        disabled={busy}
                        aria-label={`Confirmar retirar a ${p.name}`}
                        className="rounded-lg bg-rose-600 text-white p-1.5 hover:bg-rose-700 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setConfirmKick(null)} aria-label="Cancelar" className="rounded-lg bg-slate-200 text-slate-600 p-1.5">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmKick(p.id)}
                      aria-label={`Retirar a ${p.name}`}
                      title="Retirar de la partida"
                      className="rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  ))}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="host-panel"
        className="flex items-center gap-2 rounded-full bg-indigo-600 text-white font-semibold px-4 py-3 shadow-xl hover:bg-indigo-700"
      >
        <GraduationCap className="w-5 h-5" />
        <span className="hidden sm:inline">Panel docente</span>
        {gameState.paused && <span className="w-2 h-2 rounded-full bg-amber-300" aria-label="En pausa" />}
      </button>
    </div>
  );
}
