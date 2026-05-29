import React from 'react';
import { Cell } from '../types';
import {
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  Star,
  Clock,
  Award,
} from 'lucide-react';

interface BoardCellProps {
  cell: Cell;
  players: { id: string; name: string; avatar: string; color: string }[];
}

const CELL_CONFIG: Record<
  string,
  { icon: React.ReactNode; label: string; accent: string }
> = {
  question: {
    icon: <HelpCircle className="w-4 h-4 text-blue-600" />,
    label: '❓ Pregunta',
    accent: 'bg-blue-100 text-blue-700',
  },
  'teacher-action': {
    icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
    label: '⬆️ Acción',
    accent: 'bg-emerald-100 text-emerald-700',
  },
  barrier: {
    icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
    label: '🚧 Barrera',
    accent: 'bg-red-100 text-red-700',
  },
  reward: {
    icon: <Star className="w-4 h-4 text-amber-600" />,
    label: '⭐ Premio',
    accent: 'bg-amber-100 text-amber-700',
  },
  'skip-turn': {
    icon: <Clock className="w-4 h-4 text-slate-600" />,
    label: '⏳ Espera',
    accent: 'bg-slate-100 text-slate-700',
  },
};

export function BoardCell({ cell, players }: BoardCellProps) {
  const isStartOrEnd = cell.id === 1 || cell.id === 30;
  const config = CELL_CONFIG[cell.type];

  const getCellBg = () => {
    if (isStartOrEnd) return 'bg-gradient-to-br from-indigo-600 to-purple-600';
    if (cell.type === 'normal') return 'bg-gray-50 border border-gray-200';
    // Todas las casillas especiales usan el gradiente amarillo-naranja
    return 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-orange-200';
  };

  const numberBg = isStartOrEnd
    ? 'bg-white text-indigo-700'
    : cell.type === 'normal'
    ? 'bg-gray-700 text-white'
    : 'bg-white/70 text-gray-800';

  return (
    <div
      className={`
        relative rounded-xl shadow-md p-2 min-h-[80px] sm:min-h-[100px]
        ${getCellBg()}
        ${isStartOrEnd ? 'ring-4 ring-white' : ''}
        transition-transform hover:scale-105
      `}
    >
      {/* Número de casilla */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${numberBg}`}
      >
        {cell.id}
      </div>

      {/* Ícono de tipo en la esquina superior derecha */}
      {config && (
        <div className="absolute top-1 right-1" title={config.label}>
          {config.icon}
        </div>
      )}

      {/* Inicio / Meta */}
      {isStartOrEnd && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
          {cell.id === 1 ? '🏁' : '🎯'}
        </div>
      )}

      {/* Jugadores en esta casilla */}
      {players.length > 0 && (
        <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1 justify-center">
          {players.map(player => (
            <div
              key={player.id}
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white"
              style={{ backgroundColor: player.color }}
              title={player.name}
            >
              {player.avatar}
            </div>
          ))}
        </div>
      )}

      {/* Etiqueta de la casilla (solo en casillas especiales sin jugadores o con espacio) */}
      {config && !isStartOrEnd && cell.label && (
        <div className="absolute inset-x-0 bottom-0 p-1 text-[0.55rem] text-gray-700 text-center leading-tight font-semibold truncate px-2">
          {cell.label}
        </div>
      )}
    </div>
  );
}
