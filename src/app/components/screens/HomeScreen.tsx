import React, { useState } from 'react';
import { Button } from '../Button';
import { useGame } from '../../context/GameContext';
import { Sparkles, Users, Heart, Star, Eye, LogIn } from 'lucide-react';

export function HomeScreen() {
  const { setScreen, initCreate, initJoin, joinSession } = useGame();
  const [joinCode, setJoinCode] = useState('');
  const [spectatorCode, setSpectatorCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [spectatorError, setSpectatorError] = useState('');
  const [loadingSpectator, setLoadingSpectator] = useState(false);

  const handleJoinAsPlayer = () => {
    if (!joinCode.trim()) return;
    setJoinError('');
    initJoin(joinCode.trim());
  };

  const handleJoinAsSpectator = async () => {
    if (!spectatorCode.trim()) return;
    setLoadingSpectator(true);
    setSpectatorError('');
    const ok = await joinSession(spectatorCode.trim());
    if (!ok) setSpectatorError('Código no encontrado');
    setLoadingSpectator(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorativos */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full -translate-x-16 -translate-y-16 opacity-50" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-300 rounded-full translate-x-20 translate-y-20 opacity-50" />
          <div className="absolute top-1/4 right-10 w-20 h-20 bg-pink-300 rounded-full opacity-40" />

          <div className="relative z-10">
            {/* Título */}
            <div className="mb-8">
              <div className="flex justify-center gap-3 mb-4">
                <Sparkles className="w-10 h-10 text-yellow-500 animate-pulse" />
                <Star className="w-10 h-10 text-purple-500 animate-bounce" />
                <Heart className="w-10 h-10 text-pink-500 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-6xl mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
                El Tablero Gigante
              </h1>
              <h2 className="text-3xl md:text-5xl bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent font-bold">
                de la Inclusión
              </h2>
            </div>

            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              ¡Aprende sobre respeto, diversidad e inclusión mientras te diviertes! 🎲✨
            </p>

            {/* Emojis */}
            <div className="flex justify-center gap-4 mb-10 text-5xl">
              {['👧🏽', '👦🏾', '👧🏻', '🦽', '👦🏿'].map((e, i) => (
                <span
                  key={i}
                  className="animate-bounce"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {e}
                </span>
              ))}
            </div>

            {/* ── CREAR SALA ────────────────────────────────── */}
            <div className="mb-6">
              <Button
                onClick={initCreate}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto min-w-[260px] text-lg"
              >
                <Users className="inline w-6 h-6 mr-2" />
                Crear sala
              </Button>
              <p className="text-sm text-gray-500 mt-2">Genera un código y compártelo con tus amigos</p>
            </div>

            {/* ── UNIRSE A SALA ────────────────────────────── */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-5 py-3 border-2 border-transparent focus-within:border-indigo-400 transition-colors">
                  <LogIn className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Código de sala"
                    value={joinCode}
                    onChange={e => { setJoinCode(e.target.value.toUpperCase()); setJoinError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleJoinAsPlayer()}
                    maxLength={8}
                    className="bg-transparent outline-none text-base font-mono font-bold tracking-widest text-indigo-700 w-36 placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal"
                  />
                </div>
                <Button
                  onClick={handleJoinAsPlayer}
                  variant="secondary"
                  size="lg"
                  disabled={!joinCode.trim()}
                >
                  Unirme a sala
                </Button>
              </div>
              {joinError && <p className="text-sm text-red-500 mt-2">{joinError}</p>}
            </div>

            <hr className="border-gray-200 mb-6" />

            {/* ── VER EN VIVO (espectador) ─────────────────── */}
{/*             <div className="mb-8">
              <p className="text-sm text-gray-500 mb-2">¿Solo quieres ver? Únete como espectador:</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-2 border border-slate-200">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Código de sala"
                    value={spectatorCode}
                    onChange={e => { setSpectatorCode(e.target.value.toUpperCase()); setSpectatorError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleJoinAsSpectator()}
                    maxLength={8}
                    className="bg-transparent outline-none text-sm font-mono font-bold tracking-widest text-slate-600 w-32 placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal"
                  />
                </div>
                <Button
                  onClick={handleJoinAsSpectator}
                  variant="secondary"
                  size="lg"
                  disabled={loadingSpectator || !spectatorCode.trim()}
                >
                  {loadingSpectator ? 'Conectando...' : 'Ver en vivo'}
                </Button>
              </div>
              {spectatorError && <p className="text-sm text-red-500 mt-2">{spectatorError}</p>}
            </div> */}

            <Button
              onClick={() => setScreen('how-to-play')}
              variant="secondary"
              size="lg"
            >
              <Sparkles className="inline w-5 h-5 mr-2" />
              Cómo jugar
            </Button>

            {/* Info */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-3xl mb-2">🎯</div>
                <p className="text-gray-700">2–6 jugadores</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4">
                <div className="text-3xl mb-2">📚</div>
                <p className="text-gray-700">Preguntas educativas</p>
              </div>
              <div className="bg-pink-50 rounded-2xl p-4">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-gray-700">Multijugador en tiempo real</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
