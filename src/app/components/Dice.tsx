import React from 'react';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  onRoll: () => void;
  disabled?: boolean;
}

// Posiciones de los puntos para cada cara del dado (grid 3x3, índices 0-8)
// 0 1 2
// 3 4 5
// 6 7 8
const DOT_POSITIONS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function DiceFace({ value }: { value: number }) {
  const dots = DOT_POSITIONS[value] ?? [];
  return (
    <div className="grid grid-cols-3 gap-1 w-full h-full p-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {dots.includes(i) && (
            <div className="w-3 h-3 rounded-full bg-white shadow-inner" />
          )}
        </div>
      ))}
    </div>
  );
}

export function Dice({ value, isRolling, onRoll, disabled }: DiceProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onRoll}
        disabled={disabled || isRolling}
        className={`
          w-24 h-24 rounded-2xl shadow-2xl
          bg-gradient-to-br from-indigo-600 to-purple-700
          transition-all duration-300
          flex items-center justify-center
          ${isRolling ? 'animate-[spin_0.6s_linear_infinite]' : 'hover:scale-110 active:scale-95'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label={isRolling ? 'Lanzando dado...' : value ? `Dado: ${value}` : 'Lanzar dado'}
      >
        {isRolling ? (
          <span className="text-4xl select-none">🎲</span>
        ) : value ? (
          <DiceFace value={value} />
        ) : (
          <span className="text-white text-2xl font-bold select-none">?</span>
        )}
      </button>

      {value && !isRolling && (
        <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-1 text-white text-lg font-bold">
          ¡{value}!
        </div>
      )}

      {!disabled && !isRolling && !value && (
        <p className="text-white/80 text-sm">¡Haz clic para lanzar!</p>
      )}
    </div>
  );
}
