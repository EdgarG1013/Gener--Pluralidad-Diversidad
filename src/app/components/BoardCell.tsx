import React from 'react';
import { Cell } from '../types';
import {
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  Star,
  Clock,
  Flag,
  Target,
} from 'lucide-react';

interface BoardCellProps {
  cell: Cell;
  isActive?: boolean; // hay un jugador del turno actual en esta casilla
}

type Style = { icon: React.ReactNode; name: string; bg: string; ring: string };

export const CELL_STYLES: Record<string, Style> = {
  question: {
    icon: <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
    name: 'Pregunta',
    bg: 'bg-sky-100 text-sky-800 border-sky-300',
    ring: 'ring-sky-400',
  },
  'teacher-action': {
    icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />,
    name: 'Acción positiva',
    bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    ring: 'ring-emerald-400',
  },
  barrier: {
    icon: <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />,
    name: 'Barrera',
    bg: 'bg-rose-100 text-rose-800 border-rose-300',
    ring: 'ring-rose-400',
  },
  reward: {
    icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" />,
    name: 'Premio',
    bg: 'bg-amber-100 text-amber-800 border-amber-300',
    ring: 'ring-amber-400',
  },
  'skip-turn': {
    icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />,
    name: 'Pierde turno',
    bg: 'bg-slate-200 text-slate-700 border-slate-400',
    ring: 'ring-slate-400',
  },
};

const START_END: Style = {
  icon: null,
  name: '',
  bg: 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-indigo-700',
  ring: 'ring-indigo-400',
};

export function BoardCell({ cell, isActive }: BoardCellProps) {
  const isStart = cell.id === 1;
  const isEnd = cell.id === 30;
  const style = isStart || isEnd ? START_END : CELL_STYLES[cell.type] ?? CELL_STYLES.question;
  const effectText =
    cell.effect && (cell.type === 'teacher-action' || cell.type === 'reward')
      ? `+${cell.effect}`
      : cell.type === 'barrier' && cell.effect
      ? `${cell.effect}`
      : null;

  const aria = isStart
    ? 'Casilla 1: Inicio'
    : isEnd
    ? 'Casilla 30: Meta'
    : `Casilla ${cell.id}: ${style.name}${cell.label && cell.type !== 'question' ? ` — ${cell.label}` : ''}${effectText ? ` (${effectText})` : ''}`;

  return (
    <div
      role="img"
      aria-label={aria}
      title={aria}
      className={`
        relative h-full w-full rounded-xl sm:rounded-2xl border-2 border-b-4 p-1 sm:p-1.5
        flex flex-col items-center justify-center gap-0.5 text-center
        ${style.bg}
        ${isActive ? `ring-4 ${style.ring} ring-offset-2` : ''}
        transition-shadow
      `}
    >
      <span className="absolute top-0.5 left-1 sm:top-1 sm:left-1.5 text-[0.6rem] sm:text-xs font-bold opacity-70">
        {cell.id}
      </span>

      {effectText && (
        <span className="absolute top-0.5 right-1 sm:top-1 sm:right-1.5 text-[0.6rem] sm:text-xs font-extrabold">
          {effectText}
        </span>
      )}

      {isStart || isEnd ? (
        <>
          {isStart ? <Flag className="w-5 h-5 sm:w-6 sm:h-6" /> : <Target className="w-5 h-5 sm:w-6 sm:h-6" />}
          <span className="text-[0.6rem] sm:text-xs font-bold uppercase tracking-wide">
            {isStart ? 'Inicio' : 'Meta'}
          </span>
        </>
      ) : (
        <>
          {style.icon}
          {cell.type !== 'question' && (
            <span className="hidden sm:block text-[0.6rem] md:text-[0.65rem] font-semibold leading-tight line-clamp-2 px-0.5">
              {cell.label}
            </span>
          )}
        </>
      )}
    </div>
  );
}
