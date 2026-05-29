import { Cell } from '../types';

// Generate board with alternating pattern: white cells = questions
export const boardCells: Cell[] = Array.from({ length: 30 }, (_, i) => {
  const id = i + 1;
  const isWhite = id % 2 === 0; // Even numbers are white (questions)

  if (id === 1) {
    return { id: 1, type: 'normal', label: 'Inicio', effect: 0 };
  }

  if (id === 30) {
    return { id: 30, type: 'normal', label: 'Meta', effect: 0 };
  }

  if (isWhite) {
    return { id, type: 'question', label: 'Pregunta', effect: 0 };
  }

  // Black cells have special effects
  const blackCellEffects = [
    { id: 3,  type: 'teacher-action' as const, label: 'Adaptación curricular', effect: 3 },
    { id: 5,  type: 'reward'         as const, label: 'Empatía',               effect: 2 },
    { id: 7,  type: 'barrier'        as const, label: 'Falta de accesibilidad', effect: -2 },
    { id: 9,  type: 'reward'         as const, label: 'Buena acción',           effect: 2 },
    { id: 11, type: 'barrier'        as const, label: 'Indiferencia',           effect: -2 },
    { id: 13, type: 'teacher-action' as const, label: 'Grupos inclusivos',      effect: 3 },
    { id: 15, type: 'skip-turn'      as const, label: 'Pierde turno',           effect: 0 },
    { id: 17, type: 'barrier'        as const, label: 'Exclusión',              effect: -3 },
    { id: 19, type: 'reward'         as const, label: 'Solidaridad',            effect: 2 },
    { id: 21, type: 'teacher-action' as const, label: 'Comunidad inclusiva',    effect: 2 },
    { id: 23, type: 'teacher-action' as const, label: 'Materiales adaptados',   effect: 4 },
    { id: 25, type: 'barrier'        as const, label: 'Discriminación',         effect: -2 },
    { id: 27, type: 'reward'         as const, label: 'Liderazgo positivo',     effect: 2 },
    { id: 29, type: 'teacher-action' as const, label: 'Apoyo especializado',    effect: 3 },
  ];

  const specialCell = blackCellEffects.find(cell => cell.id === id);
  if (specialCell) {
    return { id, type: specialCell.type, label: specialCell.label, effect: specialCell.effect };
  }

  return { id, type: 'normal', label: '', effect: 0 };
});
