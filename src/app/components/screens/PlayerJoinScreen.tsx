import React, { useState } from 'react';
import { Button } from '../Button';
import { useGame } from '../../context/GameContext';
import { avatars, playerColors } from '../../data/avatars';
import { ArrowLeft, Plus, LogIn, Loader2 } from 'lucide-react';

export function PlayerJoinScreen() {
  const { pendingAction, pendingJoinCode, createRoom, joinRoom, setScreen } = useGame();

  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0].emoji);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isCreating = pendingAction === 'create';

  const handleConfirm = async () => {
    if (!name.trim()) { setError('Escribe tu nombre'); return; }
    setError('');
    setLoading(true);

    if (isCreating) {
      await createRoom(name.trim(), selectedAvatar);
    } else {
      const result = await joinRoom(name.trim(), selectedAvatar);
      if (!result.ok) {
        setError(result.reason ?? 'No se pudo unir');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-10">

          {/* Cabecera */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              {isCreating ? '¡Crea tu personaje!' : '¡Únete a la partida!'}
            </h1>
            {!isCreating && pendingJoinCode && (
              <p className="text-gray-600">
                Código de sala:{' '}
                <span className="font-mono font-bold text-indigo-600 text-xl tracking-widest">
                  {pendingJoinCode}
                </span>
              </p>
            )}
          </div>

          {/* Elige avatar */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-3 text-center">Elige tu avatar:</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 justify-items-center">
              {avatars.map(av => (
                <button
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.emoji)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all shadow-md
                    ${selectedAvatar === av.emoji
                      ? 'ring-4 ring-purple-500 scale-110 shadow-xl'
                      : 'hover:scale-105'
                    }`}
                  style={{ backgroundColor: av.color + '40' }}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-2 text-center">Tu nombre:</p>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleConfirm()}
              placeholder="Escribe tu nombre aquí"
              maxLength={20}
              className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-center text-lg"
              autoFocus
            />
            {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
          </div>

          {/* Vista previa */}
          {name && (
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl px-6 py-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: playerColors[0] }}
                >
                  {selectedAvatar}
                </div>
                <span className="text-gray-800 font-semibold">{name}</span>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button
              onClick={() => setScreen('home')}
              variant="secondary"
              size="md"
              disabled={loading}
            >
              <ArrowLeft className="inline w-5 h-5 mr-1" />
              Volver
            </Button>

            <Button
              onClick={handleConfirm}
              variant="primary"
              size="lg"
              disabled={!name.trim() || loading}
              className="sm:px-10"
            >
              {loading ? (
                <Loader2 className="inline w-5 h-5 mr-2 animate-spin" />
              ) : isCreating ? (
                <Plus className="inline w-5 h-5 mr-2" />
              ) : (
                <LogIn className="inline w-5 h-5 mr-2" />
              )}
              {loading
                ? isCreating ? 'Creando sala...' : 'Uniéndome...'
                : isCreating ? 'Crear sala' : 'Unirme'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
