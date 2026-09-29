import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Cell, Player } from '../types';
import { BoardCell, CELL_STYLES } from './BoardCell';

const COLS = 6;

interface BoardProps {
  board: Cell[];
  players: Player[];
  currentPlayerIndex: number;
}

// Posición en serpiente: fila 0 de izquierda a derecha, fila 1 de derecha a izquierda, etc.
function cellPos(id: number) {
  const idx = id - 1;
  const row = Math.floor(idx / COLS);
  const col = row % 2 === 0 ? idx % COLS : COLS - 1 - (idx % COLS);
  return { row, col };
}

// Pequeño desplazamiento para que varias fichas en la misma casilla no se tapen
const OFFSETS = [
  [0, 0], [-0.18, -0.12], [0.18, -0.12], [-0.18, 0.14], [0.18, 0.14], [0, 0.2],
];

export function Board({ board, players, currentPlayerIndex }: BoardProps) {
  const reduceMotion = useReducedMotion();
  const rows = Math.ceil(board.length / COLS);
  const currentPlayer = players[currentPlayerIndex];

  const pathPoints = board
    .map(c => {
      const { row, col } = cellPos(c.id);
      return `${col + 0.5},${row + 0.5}`;
    })
    .join(' ');

  return (
    <div>
      <div
        className="relative w-full"
        style={{ aspectRatio: `${COLS} / ${rows}` }}
      >
        {/* Camino que une las casillas */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${COLS} ${rows}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            points={pathPoints}
            fill="none"
            stroke="#c7d2fe"
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points={pathPoints}
            fill="none"
            stroke="#818cf8"
            strokeWidth={2}
            strokeDasharray="2 8"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Casillas */}
        <div
          className="absolute inset-0 grid gap-1.5 sm:gap-3"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {board.map(cell => {
            const { row, col } = cellPos(cell.id);
            return (
              <div key={cell.id} style={{ gridRow: row + 1, gridColumn: col + 1 }}>
                <BoardCell cell={cell} isActive={currentPlayer?.position === cell.id} />
              </div>
            );
          })}
        </div>

        {/* Fichas animadas */}
        {players.map(player => {
          const { row, col } = cellPos(Math.max(1, Math.min(board.length, player.position)));
          const sameCell = players.filter(p => p.position === player.position);
          const [dx, dy] = sameCell.length > 1 ? OFFSETS[sameCell.indexOf(player) % OFFSETS.length] : [0, 0];
          const isCurrent = player.id === currentPlayer?.id;
          return (
            <motion.div
              key={player.id}
              className="absolute pointer-events-none"
              style={{ width: `${100 / COLS}%`, height: `${100 / rows}%`, zIndex: isCurrent ? 20 : 10 }}
              initial={false}
              animate={{
                left: `${((col + dx) / COLS) * 100}%`,
                top: `${((row + dy) / rows) * 100}%`,
              }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  key={player.position}
                  initial={reduceMotion ? false : { y: 0 }}
                  animate={reduceMotion ? {} : { y: [0, -10, 0] }}
                  transition={{ duration: 0.35 }}
                  className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-xl border-2 sm:border-[3px] border-white shadow-lg ${isCurrent ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`}
                  style={{ backgroundColor: player.color }}
                  title={`${player.name} — casilla ${player.position}`}
                  aria-label={`${player.name} en la casilla ${player.position}`}
                  role="img"
                >
                  {player.avatar}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leyenda */}
      <ul className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
        {Object.entries(CELL_STYLES).map(([type, s]) => (
          <li key={type} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-semibold ${s.bg}`}>
            {s.icon}
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
