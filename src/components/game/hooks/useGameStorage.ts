import { useCallback, useEffect, useRef } from 'react';
import type {
	GameState,
	GameSettings,
	TerminationType,
} from '@/components/game/types';
import { GameStatus } from '@/components/game/types';
import type { Color } from '@/components/common/types';
import {
	saveGame,
	saveCurrentGame,
	getCurrentGame,
	clearCurrentGame,
	getUserPreferences,
	saveUserPreferences,
	getUserId,
	addMoveToCurrentGame,
	initializeGameSession,
	type SavedGame,
	type CurrentGameState,
} from '@/lib/storage';

interface UseGameStorageReturn {
	userId: string;
	autoSave: (state: GameState, clockWhite: number, clockBlack: number) => void;
	loadSavedGame: () => CurrentGameState | null;
	clearSavedGame: () => void;
	saveCompletedGame: (
		state: GameState,
		result: 'win' | 'loss' | 'draw',
		termination: TerminationType,
		duration: number
	) => SavedGame | null;
	getDefaultSettings: () => {
		botId: string;
		timeControlId: string;
		color: Color;
	};
	saveDefaultSettings: (
		botId: string,
		timeControlId: string,
		color: Color
	) => void;
	initializeGame: (
		settings: GameSettings,
		clockWhite: number,
		clockBlack: number
	) => string;
	recordMove: (
		move: { san: string; fen: string; color: 'w' | 'b'; clockTime: number },
		pgn: string
	) => void;
}

export function useGameStorage(): UseGameStorageReturn {
	const lastSaveRef = useRef<number>(0);
	const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const userId = getUserId();

	useEffect(() => {
		const interval = saveIntervalRef.current;
		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, []);

	const initializeGame = useCallback(
		(
			settings: GameSettings,
			clockWhite: number,
			clockBlack: number
		): string => {
			return initializeGameSession(settings, clockWhite, clockBlack);
		},
		[]
	);

	const recordMove = useCallback(
		(
			move: { san: string; fen: string; color: 'w' | 'b'; clockTime: number },
			pgn: string
		) => {
			addMoveToCurrentGame(move, pgn);
		},
		[]
	);

	const autoSave = useCallback(
		(state: GameState, clockWhite: number, clockBlack: number) => {
			const now = Date.now();
			if (now - lastSaveRef.current < 5000) return;

			if (
				state.status !== GameStatus.PLAYING ||
				!state.settings ||
				!state.gameId
			)
				return;

			lastSaveRef.current = now;

			const currentGame = getCurrentGame();

			saveCurrentGame({
				gameId: state.gameId,
				fen: state.fen,
				pgn: state.pgn,
				settings: state.settings,
				clockWhite,
				clockBlack,
				moveHistory: currentGame?.moveHistory || [],
				startedAt: state.startedAt || new Date().toISOString(),
			});
		},
		[]
	);

	const loadSavedGame = useCallback((): CurrentGameState | null => {
		return getCurrentGame();
	}, []);

	const clearSavedGame = useCallback(() => {
		clearCurrentGame();
	}, []);

	const saveCompletedGame = useCallback(
		(
			state: GameState,
			result: 'win' | 'loss' | 'draw',
			termination: TerminationType,
			duration: number
		): SavedGame | null => {
			if (!state.settings) return null;

			const saved = saveGame({
				pgn: state.pgn,
				fen: state.fen,
				result,
				termination,
				settings: state.settings,
				moves: state.history.length,
				duration,
				startedAt: state.startedAt || new Date().toISOString(),
			});

			clearCurrentGame();

			return saved;
		},
		[]
	);

	const getDefaultSettings = useCallback(() => {
		const prefs = getUserPreferences();
		return {
			botId: prefs.defaultBot,
			timeControlId: prefs.defaultTimeControl,
			color: prefs.defaultColor,
		};
	}, []);

	const saveDefaultSettings = useCallback(
		(botId: string, timeControlId: string, color: Color) => {
			saveUserPreferences({
				defaultBot: botId,
				defaultTimeControl: timeControlId,
				defaultColor: color,
			});
		},
		[]
	);

	return {
		userId,
		autoSave,
		loadSavedGame,
		clearSavedGame,
		saveCompletedGame,
		getDefaultSettings,
		saveDefaultSettings,
		initializeGame,
		recordMove,
	};
}
