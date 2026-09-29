import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useGame } from '../../context/GameContext';
import { Board } from '../Board';
import { Button } from '../Button';
import { Star, Trophy, Eye, Maximize, Minimize, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D'];

/** Vista para proyectar en clase: tablero grande, pregunta en curso y QR para unirse. */
export function SpectatorScreen() {
  const { gameState, resetGame } = useGame();
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  const code = gameState.sessionCode ?? '';
  const joinUrl = `${window.location.origin}${window.location.pathname}?sala=${code}`;
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const question = gameState.currentQuestion;
  const revealed = gameState.questionAnswer ?? null;
  const inLobby = gameState.sessionStatus === 'lobby';
  const winner = gameState.sessionStatus === 'finished' ? gameState.winner : null;
  const ranking = [...gameState.players].sort((a, b) => b.position - a.position);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-4 md:p-6 text-slate-800">
      <div className="max-w-[1600px] mx-auto">

        {/* Barra superior */}
        <header className="mb-4 flex flex-wrap items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 text-white">
          <Eye className="w-5 h-5 text-yellow-300" aria-hidden="true" />
          <h1 className="font-bold text-lg md:text-xl">El Tablero Gigante de la Inclusión</h1>
          <span className="text-sm text-white/70">
            Sala <span className="font-mono font-bold text-yellow-300 text-lg tracking-widest">{code}</span>
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3 py-2 text-sm font-semibold"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</span>
            </button>
            <Button variant="secondary" size="sm" onClick={resetGame}>Salir</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Zona principal */}
          <main className="xl:col-span-3">
            <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8">
              {winner ? (
                <div className="text-center py-12">
                  <div className="text-7xl mb-4" aria-hidden="true">🏆</div>
                  <p className="text-slate-500 text-xl mb-2">¡Tenemos ganador!</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="w-20 h-20 rounded-full flex items-center justify-center text-5xl" style={{ backgroundColor: winner.color }}>
                      {winner.avatar}
                    </span>
                    <span className="text-5xl font-extrabold text-indigo-700">{winner.name}</span>
                  </div>
                </div>
              ) : question ? (
                <section aria-live="polite">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                      <Lightbulb className="w-7 h-7" />
                    </span>
                    <p className="text-lg text-slate-500">
                      Pregunta para <span className="font-bold text-slate-800">{currentPlayer?.avatar} {currentPlayer?.name}</span>
                    </p>
                  </div>
                  <p className="text-2xl md:text-4xl font-bold leading-snug mb-8">{question.question}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {question.options.map((opt, i) => {
                      const correct = revealed !== null && i === question.correctAnswer;
                      const wrong = revealed === i && i !== question.correctAnswer;
                      const dim = revealed !== null && !correct && !wrong;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-4 rounded-2xl border-2 p-4 md:p-5 text-lg md:text-2xl transition-opacity
                            ${correct ? 'bg-emerald-50 border-emerald-500' : wrong ? 'bg-rose-50 border-rose-500' : 'bg-slate-50 border-slate-200'}
                            ${dim ? 'opacity-40' : ''}`}
                        >
                          <span className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold flex-shrink-0
                            ${correct ? 'bg-emerald-500 text-white' : wrong ? 'bg-rose-500 text-white' : 'bg-white border border-slate-300 text-slate-600'}`}>
                            {LETTERS[i]}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {correct && <CheckCircle className="w-8 h-8 text-emerald-600" aria-label="Correcta" />}
                          {wrong && <XCircle className="w-8 h-8 text-rose-600" aria-label="Elegida, incorrecta" />}
                        </div>
                      );
                    })}
                  </div>
                  {revealed !== null ? (
                    <p className="mt-8 rounded-2xl bg-amber-50 border-2 border-amber-300 p-5 text-xl md:text-2xl text-amber-900">
                      💡 {question.explanation}
                    </p>
                  ) : (
                    <p className="mt-8 text-center text-slate-400 text-lg">¿Cuál crees que es la respuesta? Coméntalo con tu grupo…</p>
                  )}
                </section>
              ) : (
                <>
                  {inLobby ? (
                    <p className="text-center text-xl text-slate-500 mb-6">Esperando a que el anfitrión inicie la partida…</p>
                  ) : currentPlayer && (
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <span className="w-14 h-14 rounded-full flex items-center justify-center text-3xl ring-4 ring-indigo-300" style={{ backgroundColor: currentPlayer.color }}>
                        {currentPlayer.avatar}
                      </span>
                      <p className="text-2xl md:text-3xl">
                        Turno de <span className="font-extrabold text-indigo-700">{currentPlayer.name}</span>
                        {gameState.diceValue != null && <span className="ml-3 text-slate-500">🎲 {gameState.diceValue}</span>}
                      </p>
                    </div>
                  )}
                  <Board board={gameState.board} players={gameState.players} currentPlayerIndex={gameState.currentPlayerIndex} />
                </>
              )}
            </div>
          </main>

          {/* Lateral: unirse + clasificación */}
          <aside className="space-y-6">
            {inLobby && (
              <div className="bg-white rounded-3xl shadow-2xl p-6 text-center">
                <p className="font-bold text-lg mb-3">Únete con tu móvil</p>
                <div className="inline-block bg-white p-3 rounded-2xl border-2 border-slate-100">
                  <QRCodeSVG value={joinUrl} size={180} aria-label={`Código QR para unirse a la sala ${code}`} />
                </div>
                <p className="mt-3 text-sm text-slate-500">o escribe el código</p>
                <p className="font-mono font-extrabold text-4xl tracking-[0.2em] text-indigo-700">{code}</p>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h2 className="mb-4 text-center font-bold text-lg flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" /> Clasificación
              </h2>
              <ol className="space-y-3">
                {ranking.map((player, rank) => {
                  const isTurn = player.id === currentPlayer?.id && !inLobby;
                  return (
                    <li key={player.id} className={`rounded-2xl p-3 ${isTurn ? 'ring-4 ring-indigo-400 bg-indigo-50' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-6 text-center font-bold text-slate-400">{rank + 1}</span>
                        <span className="w-11 h-11 rounded-full flex items-center justify-center text-2xl border-2 border-white shadow" style={{ backgroundColor: player.color }}>
                          {player.avatar}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{player.name}</p>
                          <p className="text-xs text-slate-500">Casilla {player.position}</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${(player.position / 30) * 100}%`, backgroundColor: player.color }} />
                      </div>
                      {player.stars > 0 && (
                        <div className="flex gap-1 mt-2">
                          {Array.from({ length: player.stars }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
