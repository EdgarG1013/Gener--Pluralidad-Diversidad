import { useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { useGame } from '../context/GameContext';
import { GameEvent } from '../types';

const ICONS: Record<GameEvent['kind'], string> = {
  'teacher-action': '⬆️',
  reward: '⭐',
  barrier: '🚧',
  'skip-turn': '⏳',
  question: '❓',
  normal: '•',
  'answer-correct': '🎉',
  'answer-wrong': '💭',
  host: '👩‍🏫',
};

const POSITIVE: GameEvent['kind'][] = ['teacher-action', 'reward', 'answer-correct'];
const NEGATIVE: GameEvent['kind'][] = ['barrier', 'answer-wrong'];

/** Muestra una notificación educativa cada vez que llega un evento nuevo. */
export function GameEventToasts() {
  const { gameState } = useGame();
  const event = gameState.lastEvent;
  const seen = useRef<string | null>(event?.id ?? null);

  useEffect(() => {
    if (!event || event.id === seen.current) return;
    seen.current = event.id;
    const opts = { description: event.message, icon: ICONS[event.kind], duration: 6000 };
    if (POSITIVE.includes(event.kind)) toast.success(event.title, opts);
    else if (NEGATIVE.includes(event.kind)) toast.error(event.title, opts);
    else toast.info(event.title, opts);
  }, [event]);

  return <Toaster position="top-center" richColors closeButton />;
}
