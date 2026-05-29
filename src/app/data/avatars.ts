export interface Avatar {
  id: string;
  emoji: string;
  name: string;
  color: string;
}

export const avatars: Avatar[] = [
  { id: 'girl-1', emoji: '👧🏽', name: 'Niña', color: '#FF6B9D' },
  { id: 'boy-1', emoji: '👦🏾', name: 'Niño', color: '#4ECDC4' },
  { id: 'girl-2', emoji: '👧🏻', name: 'Niña', color: '#FFE66D' },
  { id: 'boy-2', emoji: '👦🏿', name: 'Niño', color: '#A8DADC' },
  { id: 'girl-3', emoji: '👧🏿', name: 'Niña', color: '#F4A261' },
  { id: 'boy-3', emoji: '👦🏼', name: 'Niño', color: '#95E1D3' },
  { id: 'girl-glasses', emoji: '👓', name: 'Con gafas', color: '#B589D6' },
  { id: 'boy-glasses', emoji: '🤓', name: 'Con gafas', color: '#C7CEEA' },
  { id: 'wheelchair', emoji: '🦽', name: 'Silla de ruedas', color: '#FFD93D' },
  { id: 'student-1', emoji: '🧒🏽', name: 'Estudiante', color: '#6BCF7F' },
  { id: 'student-2', emoji: '🧒🏻', name: 'Estudiante', color: '#FF8B94' },
  { id: 'student-3', emoji: '🧒🏿', name: 'Estudiante', color: '#AED9E0' }
];

export const playerColors = [
  '#8B5CF6', // Púrpura vibrante
  '#06B6D4', // Cian moderno
  '#F59E0B', // Ámbar
  '#EC4899', // Rosa fuerte
  '#10B981', // Esmeralda
  '#6366F1'  // Índigo
];
