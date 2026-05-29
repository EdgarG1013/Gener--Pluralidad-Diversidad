import React, { useState } from 'react';
import { Button } from '../Button';
import { useGame } from '../../context/GameContext';
import { Player } from '../../types';
import { avatars, playerColors } from '../../data/avatars';
import { ArrowLeft, Play, Trash2, UserPlus } from 'lucide-react';

export function PlayerSetupScreen() {
  const { gameState, setScreen, addPlayer, removePlayer, startGame } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    if (gameState.players.length >= 6) return;

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: newPlayerName.trim(),
      avatar: selectedAvatar.emoji,
      position: 1,
      stars: 0,
      color: playerColors[gameState.players.length % playerColors.length]
    };

    addPlayer(newPlayer);
    setNewPlayerName('');
    setSelectedAvatar(avatars[(gameState.players.length + 1) % avatars.length]);
  };

  const handleStartGame = () => {
    if (gameState.players.length >= 2) {
      startGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl mb-3 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              ¡Crea tu equipo!
            </h1>
            <p className="text-lg text-gray-600">Agrega de 2 a 6 jugadores</p>
          </div>

          {/* Current players */}
          {gameState.players.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-gray-700">Jugadores ({gameState.players.length}/6)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameState.players.map((player) => (
                  <div
                    key={player.id}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-lg border-2 border-gray-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                        style={{ backgroundColor: player.color + '30' }}
                      >
                        {player.avatar}
                      </div>
                      <div>
                        <p className="text-gray-800">{player.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new player */}
          {gameState.players.length < 6 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 md:p-8 mb-8">
              <h3 className="mb-4 text-gray-700 text-center">
                {gameState.players.length === 0 ? 'Agrega el primer jugador' : 'Agrega otro jugador'}
              </h3>

              {/* Avatar selection */}
              <div className="mb-6">
                <label className="block mb-3 text-gray-700 text-center">Elige tu avatar:</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                        selectedAvatar.id === avatar.id
                          ? 'ring-4 ring-purple-500 scale-110 shadow-lg'
                          : 'hover:scale-105 shadow-md'
                      }`}
                      style={{ backgroundColor: avatar.color + '30' }}
                    >
                      {avatar.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name input */}
              <div className="mb-6">
                <label className="block mb-2 text-gray-700 text-center">Tu nombre:</label>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
                  placeholder="Escribe tu nombre aquí"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-center text-lg"
                  maxLength={20}
                />
              </div>

              {/* Add button */}
              <div className="text-center">
                <Button
                  onClick={handleAddPlayer}
                  variant="secondary"
                  size="lg"
                  disabled={!newPlayerName.trim()}
                >
                  <UserPlus className="inline w-5 h-5 mr-2" />
                  Agregar jugador
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              onClick={() => setScreen('home')}
              variant="secondary"
              size="md"
            >
              <ArrowLeft className="inline w-5 h-5 mr-2" />
              Volver
            </Button>

            <Button
              onClick={handleStartGame}
              variant="primary"
              size="lg"
              disabled={gameState.players.length < 2}
              className="sm:px-12"
            >
              <Play className="inline w-6 h-6 mr-2" />
              ¡Comenzar juego!
            </Button>
          </div>

          {/* Helper text */}
          {gameState.players.length < 2 && (
            <p className="text-center text-gray-500 mt-4">
              Necesitas al menos 2 jugadores para comenzar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
