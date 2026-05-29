import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  useEffect,
} from 'react';
import { GameState, Player, GameScreen, CellType } from '../types';
import { boardCells } from '../data/boardCells';
import { getRandomQuestion } from '../data/questions';
import { playerColors } from '../data/avatars';
import { supabase } from '../../lib/supabase';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface GameContextType {
  gameState: GameState;
  myPlayerId: string | null;
  pendingAction: 'create' | 'join' | null;
  pendingJoinCode: string | null;
  initCreate: () => void;
  initJoin: (code: string) => void;
  createRoom: (name: string, avatar: string) => Promise<void>;
  joinRoom: (name: string, avatar: string) => Promise<{ ok: boolean; reason?: string }>;
  startGame: () => Promise<void>;
  rollDice: () => void;
  answerQuestion: (isCorrect: boolean) => void;
  resetGame: () => void;
  setScreen: (screen: GameScreen) => void;
  joinSession: (code: string) => Promise<boolean>;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const MS_PER_CELL = 650;
const LS_CODE = 'tbi_session_code';
const LS_PID  = 'tbi_player_id';

const initialState: GameState = {
  screen: 'home',
  players: [],
  currentPlayerIndex: 0,
  board: boardCells,
  currentQuestion: null,
  winner: null,
  diceValue: null,
  isRollingDice: false,
  isMoving: false,
  sessionCode: null,
  sessionStatus: 'lobby',
  hostPlayerId: null,
  isSpectator: false,
};

function mkCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ─── Helpers de ruta ──────────────────────────────────────────────────────────

function buildPath(from: number, spaces: number): number[] {
  if (!spaces) return [];
  const path: number[] = [];
  const step = spaces > 0 ? 1 : -1;
  let pos = from;
  for (let i = 0; i < Math.abs(spaces); i++) {
    pos = Math.max(1, Math.min(30, pos + step));
    path.push(pos);
    if (pos === 30 || pos === 1) break;
  }
  return path;
}

interface MoveResult {
  path: number[];
  finalPos: number;
  cellEffect: CellType | null;
}

function computeMove(board: typeof boardCells, from: number, spaces: number): MoveResult {
  const main = buildPath(from, spaces);
  const landing = main.at(-1) ?? from;
  if (landing === 30) return { path: main, finalPos: 30, cellEffect: null };

  const cell = board.find(c => c.id === landing);
  const type = cell?.type ?? 'normal';

  if (type === 'barrier') {
    const back = buildPath(landing, -2);
    return { path: [...main, ...back], finalPos: back.at(-1) ?? landing, cellEffect: 'barrier' };
  }
  if (type === 'teacher-action' || type === 'reward') {
    const fwd = buildPath(landing, cell?.effect ?? 2);
    return { path: [...main, ...fwd], finalPos: fwd.at(-1) ?? landing, cellEffect: type };
  }
  return { path: main, finalPos: landing, cellEffect: type === 'normal' ? null : type };
}

/** Calcula el estado del SIGUIENTE turno a partir del estado actual. */
function nextTurnState(state: GameState): GameState {
  let idx = (state.currentPlayerIndex + 1) % state.players.length;
  let players = state.players;
  if (players[idx]?.skipNextTurn) {
    players = players.map((p, i) => i === idx ? { ...p, skipNextTurn: false } : p);
    idx = (idx + 1) % players.length;
  }
  return { ...state, players, currentPlayerIndex: idx, diceValue: null, isRollingDice: false, isMoving: false };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState]       = useState<GameState>(initialState);
  const [myPlayerId, setMyPlayerId]     = useState<string | null>(null);
  const [pendingAction, setPendingAction]     = useState<'create' | 'join' | null>(null);
  const [pendingJoinCode, setPendingJoinCode] = useState<string | null>(null);

  const stateRef   = useRef(gameState);
  const pidRef     = useRef(myPlayerId);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  // Almacena si el canal ya completó la suscripción (para no enviar antes de tiempo)
  const channelReadyRef = useRef(false);
  const nextTurnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyState = (s: GameState) => { stateRef.current = s; setGameState(s); };
  const applyPid   = (id: string | null) => { pidRef.current = id; setMyPlayerId(id); };

  // ─── LocalStorage ──────────────────────────────────────────────────────────
  const saveSession  = (code: string, pid: string) => {
    localStorage.setItem(LS_CODE, code);
    localStorage.setItem(LS_PID, pid);
  };
  const clearSession = () => {
    localStorage.removeItem(LS_CODE);
    localStorage.removeItem(LS_PID);
  };

  // ─── Animación por ruta ────────────────────────────────────────────────────
  const animatePath = (playerIndex: number, path: number[], onDone: () => void) => {
    if (!path.length) { onDone(); return; }
    let i = 0;
    const tick = () => {
      const pos = path[i];
      setGameState(prev => {
        const players = [...prev.players];
        players[playerIndex] = { ...players[playerIndex], position: pos };
        return { ...prev, players, isMoving: true };
      });
      stateRef.current = {
        ...stateRef.current,
        players: stateRef.current.players.map((p, idx) =>
          idx === playerIndex ? { ...p, position: pos } : p),
        isMoving: true,
      };
      i++;
      if (i < path.length) setTimeout(tick, MS_PER_CELL);
      else setTimeout(onDone, 350);
    };
    setTimeout(tick, 300);
  };

  // ─── Supabase: persistencia ────────────────────────────────────────────────
  const persist = (s: GameState) => {
    if (!s.sessionCode) return;
    supabase.from('game_sessions')
      .update({ game_state: s as unknown as Record<string, unknown> })
      .eq('session_code', s.sessionCode)
      .then(() => {/* fire-and-forget */});
  };

  // ─── Envío de Broadcasts (espera a que el canal esté listo) ───────────────
  const safeSend = (event: string, payload: unknown) => {
    if (!channelRef.current || !channelReadyRef.current) return;
    channelRef.current.send({ type: 'broadcast', event, payload });
  };

  const broadcastMovement = (playerIndex: number, path: number[], final: GameState, nextTurn: GameState) => {
    safeSend('movement', { playerIndex, path, finalState: final, nextTurnState: nextTurn });
  };

  const broadcastState = (s: GameState) => {
    safeSend('state', s);
  };

  // ─── Canal Supabase Broadcast ──────────────────────────────────────────────
  /**
   * Crea y suscribe el canal. Devuelve una Promise que resuelve cuando
   * el canal está listo para enviar mensajes (status = SUBSCRIBED).
   */
  const subscribeToChannel = (code: string, asSpectator = false): Promise<void> => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelReadyRef.current = false;

    return new Promise(resolve => {
      const ch = supabase.channel(`tbi-room-${code}`, {
        config: { broadcast: { self: false } },
      });

      // ── Evento MOVEMENT: animamos la ruta recibida ─────────────────────
      ch.on('broadcast', { event: 'movement' }, ({ payload }) => {
        const { playerIndex, path, finalState, nextTurnState: nts } = payload as {
          playerIndex: number;
          path: number[];
          finalState: GameState;
          nextTurnState: GameState;
        };

        const fromPos = stateRef.current.players[playerIndex]?.position
          ?? finalState.players[playerIndex]?.position;

        const preState: GameState = {
          ...(asSpectator
            ? { ...finalState, board: boardCells, isSpectator: true, screen: 'spectator' as GameScreen }
            : { ...finalState, board: boardCells }),
          isMoving: true,
          players: finalState.players.map((p, i) =>
            i === playerIndex ? { ...p, position: fromPos } : p),
        };
        applyState(preState);

        animatePath(playerIndex, path, () => {
          const afterAnim: GameState = {
            ...(asSpectator
              ? { ...finalState, board: boardCells, isSpectator: true, screen: 'spectator' as GameScreen }
              : { ...finalState, board: boardCells }),
            isMoving: false,
          };
          applyState(afterAnim);

          // Si la pantalla es game-board, hay que avanzar el turno tras una pausa
          if (finalState.screen === 'game-board' && nts) {
            const safeNts = { ...nts, board: boardCells };
            const amNext = safeNts.players[safeNts.currentPlayerIndex]?.id === pidRef.current;

            if (nextTurnTimerRef.current) clearTimeout(nextTurnTimerRef.current);
            nextTurnTimerRef.current = setTimeout(() => {
              applyState(asSpectator ? { ...safeNts, isSpectator: true, screen: 'spectator' as GameScreen } : safeNts);
              // El próximo jugador es responsable de hacer broadcast del cambio de turno
              if (amNext && !asSpectator) broadcastState(safeNts);
            }, 1500);
          }
        });
      });

      // ── Evento STATE: cambio de estado sin animación ───────────────────
      ch.on('broadcast', { event: 'state' }, ({ payload }) => {
        const incoming = { ...(payload as GameState), board: boardCells };
        applyState(asSpectator
          ? { ...incoming, isSpectator: true, screen: 'spectator' as GameScreen }
          : incoming);
      });

      // ── Suscripción ────────────────────────────────────────────────────
      ch.subscribe(status => {
        if (status === 'SUBSCRIBED') {
          channelReadyRef.current = true;
          resolve();
        }
      });

      channelRef.current = ch;
    });
  };

  // ─── Reconexión al cargar la página ───────────────────────────────────────
  useEffect(() => {
    const code = localStorage.getItem(LS_CODE);
    const pid  = localStorage.getItem(LS_PID);
    if (!code || !pid) return;

    supabase.from('game_sessions')
      .select('game_state, status')
      .eq('session_code', code)
      .single()
      .then(async ({ data, error }) => {
        if (error || !data) { clearSession(); return; }
        if (data.status === 'finished') { clearSession(); return; }

        const s = data.game_state as GameState;
        if (!s.players.some(p => p.id === pid)) { clearSession(); return; }

        // Detectar estado obsoleto: el dado fue lanzado pero el turno no se avanzó
        // (puede ocurrir si el jugador recargó durante los 1.5s de pausa visual)
        const isStale =
          s.screen === 'game-board' &&
          (s.diceValue !== null || s.isMoving) &&
          !s.isRollingDice;

        const cleanState: GameState = isStale ? nextTurnState(s) : s;

        // Suscribir el canal ANTES de aplicar el estado
        await subscribeToChannel(code);
        applyPid(pid);
        applyState({ ...cleanState, board: boardCells });

        // Si el estado estaba obsoleto, actualizar a todos los demás
        if (isStale) {
          persist(cleanState);
          broadcastState(cleanState);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── applySync: aplica + persiste + broadcast ──────────────────────────────
  const applySync = (s: GameState) => {
    applyState(s);
    persist(s);
    broadcastState(s);
  };

  // ─── API pública ──────────────────────────────────────────────────────────

  const setScreen = (screen: GameScreen) =>
    applyState({ ...stateRef.current, screen });

  const initCreate = () => {
    setPendingAction('create');
    setPendingJoinCode(null);
    applyState({ ...initialState, board: boardCells, screen: 'player-join' });
  };

  const initJoin = (code: string) => {
    setPendingAction('join');
    setPendingJoinCode(code.toUpperCase());
    applyState({ ...initialState, board: boardCells, screen: 'player-join' });
  };

  const createRoom = async (name: string, avatar: string) => {
    const code = mkCode();
    const pid  = `player-${Date.now()}`;
    const player: Player = { id: pid, name, avatar, position: 1, stars: 0, color: playerColors[0] };

    const s: GameState = {
      ...initialState,
      board: boardCells,
      screen: 'lobby',
      sessionCode: code,
      sessionStatus: 'lobby',
      hostPlayerId: pid,
      players: [player],
    };

    await supabase.from('game_sessions').insert({
      session_code: code,
      game_state: s as unknown as Record<string, unknown>,
      status: 'waiting',
    });

    await subscribeToChannel(code);
    applyPid(pid);
    applyState(s);
    saveSession(code, pid);
  };

  const joinRoom = async (
    name: string,
    avatar: string,
  ): Promise<{ ok: boolean; reason?: string }> => {
    const code = pendingJoinCode;
    if (!code) return { ok: false, reason: 'Código no encontrado' };

    const { data, error } = await supabase
      .from('game_sessions')
      .select('game_state, status')
      .eq('session_code', code)
      .single();

    if (error || !data) return { ok: false, reason: 'Sala no encontrada' };
    if (data.status === 'playing') return { ok: false, reason: 'La partida ya comenzó' };

    const current = data.game_state as GameState;
    if (current.players.length >= 6) return { ok: false, reason: 'La sala está llena (máx. 6)' };

    const pid = `player-${Date.now()}`;
    const newPlayer: Player = {
      id: pid, name, avatar, position: 1, stars: 0,
      color: playerColors[current.players.length % playerColors.length],
    };

    const updated: GameState = {
      ...current,
      board: boardCells,
      players: [...current.players, newPlayer],
    };

    // Guardar en DB
    await supabase.from('game_sessions')
      .update({ game_state: updated as unknown as Record<string, unknown> })
      .eq('session_code', code);

    // Suscribir canal y luego broadcast
    await subscribeToChannel(code);
    applyPid(pid);
    applyState(updated);
    saveSession(code, pid);

    // Notificar al host y demás
    broadcastState(updated);

    return { ok: true };
  };

  const startGame = async () => {
    const s = stateRef.current;
    if (s.players.length < 2) return;

    const next: GameState = { ...s, screen: 'game-board', sessionStatus: 'playing' };

    await supabase.from('game_sessions')
      .update({ status: 'playing' })
      .eq('session_code', s.sessionCode ?? '');

    applySync(next);
  };

  const rollDice = () => {
    const s = stateRef.current;
    if (s.isRollingDice || s.isMoving) return;
    if (pidRef.current !== s.players[s.currentPlayerIndex]?.id) return;

    applyState({ ...s, isRollingDice: true, diceValue: null });

    const diceValue = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      const cur = stateRef.current;
      const playerIndex = cur.currentPlayerIndex;
      const from = cur.players[playerIndex].position;

      const { path, finalPos, cellEffect } = computeMove(cur.board, from, diceValue);

      // Construir estado final (posiciones actualizadas + efecto de pantalla)
      const updatedPlayers = cur.players.map((p, i) => {
        if (i !== playerIndex) return p;
        const pos = finalPos;
        const skip = cellEffect === 'skip-turn';
        return { ...p, position: pos, ...(skip ? { skipNextTurn: true } : {}) };
      });

      const finalState: GameState = (() => {
        const base = { ...cur, players: updatedPlayers, diceValue, isRollingDice: false, isMoving: false };
        if (finalPos === 30)
          return { ...base, winner: updatedPlayers[playerIndex], screen: 'victory' as GameScreen, sessionStatus: 'finished' as const };
        if (cellEffect === 'question')
          return { ...base, currentQuestion: getRandomQuestion(), screen: 'question' as GameScreen };
        return base;
      })();

      const nts = nextTurnState(finalState);

      // Mostrar dado y animar movimiento
      applyState({ ...cur, diceValue, isRollingDice: false, isMoving: true });

      animatePath(playerIndex, path, () => {
        // 1. Aplicar estado final localmente
        applyState({ ...finalState, isMoving: false });

        if (finalState.screen === 'game-board') {
          // 2. Persistir el SIGUIENTE turno inmediatamente (seguridad ante recargas)
          persist(nts);
          // 3. Broadcast del movimiento (otros animan + ellos avanzan el turno)
          broadcastMovement(playerIndex, path, { ...finalState, isMoving: false }, nts);
          // 4. Localmente, mostrar resultado 1.5s y avanzar
          if (nextTurnTimerRef.current) clearTimeout(nextTurnTimerRef.current);
          nextTurnTimerRef.current = setTimeout(() => {
            applyState(nts);
            // No hacer broadcast aquí: el próximo jugador (receptor) lo hace
          }, 1500);
        } else {
          // Pregunta o victoria: persistir y broadcast sin auto-avance
          persist({ ...finalState, isMoving: false });
          broadcastMovement(playerIndex, path, { ...finalState, isMoving: false }, nts);
        }
      });
    }, 1500);
  };

  const answerQuestion = (isCorrect: boolean) => {
    const s = stateRef.current;
    const effect = isCorrect
      ? Math.floor(Math.random() * 3) + 1
      : -(Math.floor(Math.random() * 2) + 1);

    const playerIndex = s.currentPlayerIndex;
    const from = s.players[playerIndex].position;
    const path = buildPath(from, effect);
    const finalPos = path.at(-1) ?? from;

    const updatedPlayers = s.players.map((p, i) =>
      i === playerIndex ? { ...p, position: finalPos } : p);

    const finalState: GameState = finalPos === 30
      ? { ...s, players: updatedPlayers, currentQuestion: null, screen: 'victory', sessionStatus: 'finished', winner: updatedPlayers[playerIndex], isMoving: false }
      : { ...s, players: updatedPlayers, currentQuestion: null, screen: 'game-board', isMoving: false };

    const nts = nextTurnState(finalState);

    // Cerrar pantalla de pregunta para todos
    const transition: GameState = { ...s, currentQuestion: null, screen: 'game-board', isMoving: true };
    applyState(transition);
    broadcastState({ ...transition, isMoving: false });

    setTimeout(() => {
      animatePath(playerIndex, path, () => {
        applyState({ ...finalState, isMoving: false });

        if (finalState.screen === 'game-board') {
          persist(nts);
          broadcastMovement(playerIndex, path, { ...finalState, isMoving: false }, nts);
          if (nextTurnTimerRef.current) clearTimeout(nextTurnTimerRef.current);
          nextTurnTimerRef.current = setTimeout(() => {
            applyState(nts);
          }, 1500);
        } else {
          persist({ ...finalState, isMoving: false });
          broadcastMovement(playerIndex, path, { ...finalState, isMoving: false }, nts);
        }
      });
    }, 500);
  };

  const resetGame = () => {
    if (nextTurnTimerRef.current) clearTimeout(nextTurnTimerRef.current);
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelRef.current = null;
    channelReadyRef.current = false;
    applyPid(null);
    setPendingAction(null);
    setPendingJoinCode(null);
    clearSession();
    applyState({ ...initialState, board: boardCells });
  };

  const joinSession = async (code: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('game_state')
      .eq('session_code', code.toUpperCase())
      .single();

    if (error || !data) return false;

    await subscribeToChannel(code.toUpperCase(), true);
    applyState({
      ...(data.game_state as GameState),
      board: boardCells,
      isSpectator: true,
      screen: 'spectator',
    });

    return true;
  };

  return (
    <GameContext.Provider value={{
      gameState, myPlayerId, pendingAction, pendingJoinCode,
      initCreate, initJoin, createRoom, joinRoom, startGame,
      rollDice, answerQuestion, resetGame, setScreen, joinSession,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
