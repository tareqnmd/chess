import type { Color } from '@/components/common/types';
import type { GameSettings, TerminationType } from '@/components/game/types';
import { IndexedDBStorage } from '../../lib/storage';

const STORAGE_KEYS = {
	USER_ID: 'chess_user_id',
	GAME_HISTORY: 'chess_game_history',
	SAVED_ANALYSIS: 'chess_saved_analysis',
	USER_PREFERENCES: 'chess_user_preferences',
} as const;

const db = new IndexedDBStorage('ChessAppDB', 'appStore');

export interface SavedGame {
	id: string;
	odlId: string;
	date: string;
	pgn: string;
	fen: string;
	result: 'win' | 'loss' | 'draw' | null;
	termination: TerminationType | null;
	settings: GameSettings;
	moves: number;
	duration: number;
	startedAt: string;
	endedAt: string | null;
	status: 'playing' | 'finished';
	clockWhite: number;
	clockBlack: number;
	clockRunning: boolean;
	lastMoveTime: string | null;
}

export interface SavedAnalysis {
	id: string;
	date: string;
	fen: string;
	evaluation: number;
	bestMove: string | null;
	bestLine: string | null;
	depth: number;
	notes: string;
}

export interface UserPreferences {
	defaultBot: string;
	defaultTimeControl: string;
	defaultColor: Color;
	boardTheme: 'classic' | 'modern' | 'wood';
	soundEnabled: boolean;
}

function safeJsonParse<T>(json: string | null, fallback: T): T {
	if (!json) return fallback;
	try {
		return JSON.parse(json) as T;
	} catch {
		return fallback;
	}
}

function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function generateUUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export async function getUserId(): Promise<string> {
	let userId = await db.get<string>(STORAGE_KEYS.USER_ID);
	if (!userId) {
		userId = generateUUID();
		await db.set(STORAGE_KEYS.USER_ID, userId);
	}
	return userId;
}

export async function setUserId(id: string): Promise<void> {
	await db.set(STORAGE_KEYS.USER_ID, id);
}

export async function getGameHistory(): Promise<SavedGame[]> {
	const data = await db.get<string>(STORAGE_KEYS.GAME_HISTORY);
	const games = safeJsonParse<SavedGame[]>(data ?? null, []);
	// Migrate old games that don't have clockRunning or lastMoveTime fields
	return games.map((game) => {
		const migrated = { ...game };
		if (migrated.clockRunning === undefined) {
			migrated.clockRunning = game.status === 'playing' && game.moves > 0;
		}
		if (migrated.lastMoveTime === undefined) {
			migrated.lastMoveTime =
				game.status === 'playing' && game.moves > 0
					? new Date().toISOString()
					: null;
		}
		return migrated;
	});
}

export async function createGameInHistory(
	gameId: string,
	settings: GameSettings,
	clockWhite: number,
	clockBlack: number
): Promise<SavedGame> {
	const history = await getGameHistory();
	const now = new Date().toISOString();
	const userId = await getUserId();
	const newGame: SavedGame = {
		id: gameId,
		odlId: userId,
		date: now,
		pgn: '',
		fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
		result: null,
		termination: null,
		settings,
		moves: 0,
		duration: 0,
		startedAt: now,
		endedAt: null,
		status: 'playing',
		clockWhite,
		clockBlack,
		clockRunning: false,
		lastMoveTime: null,
	};
	const updatedHistory = [newGame, ...history].slice(0, 50);
	await db.set(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(updatedHistory));
	return newGame;
}

export async function updateGameInHistory(
	gameId: string,
	updates: Partial<
		Pick<
			SavedGame,
			| 'pgn'
			| 'fen'
			| 'moves'
			| 'duration'
			| 'clockWhite'
			| 'clockBlack'
			| 'clockRunning'
			| 'lastMoveTime'
		>
	>
): Promise<void> {
	const history = await getGameHistory();
	const index = history.findIndex((g) => g.id === gameId);
	if (index === -1) return;
	const updated: SavedGame = {
		...history[index],
		...updates,
	};
	history[index] = updated;
	await db.set(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));
}

export async function finishGameInHistory(
	gameId: string,
	result: 'win' | 'loss' | 'draw',
	termination: TerminationType,
	duration: number
): Promise<void> {
	const history = await getGameHistory();
	const index = history.findIndex((g) => g.id === gameId);
	if (index === -1) return;
	const updated: SavedGame = {
		...history[index],
		result,
		termination,
		duration,
		endedAt: new Date().toISOString(),
		status: 'finished',
		clockRunning: false,
	};
	history[index] = updated;
	await db.set(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));
}

export async function getGameById(gameId: string): Promise<SavedGame | null> {
	const history = await getGameHistory();
	return history.find((g) => g.id === gameId) || null;
}

export async function saveGame(
	game: Omit<SavedGame, 'id' | 'date' | 'odlId'>
): Promise<SavedGame> {
	const history = await getGameHistory();
	const now = new Date().toISOString();
	const userId = await getUserId();
	const newGame: SavedGame = {
		...game,
		id: generateId(),
		odlId: userId,
		date: now,
		endedAt: game.endedAt || now,
	};
	const updatedHistory = [newGame, ...history].slice(0, 50);
	await db.set(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(updatedHistory));
	return newGame;
}

export async function deleteGame(id: string): Promise<void> {
	const history = await getGameHistory();
	const filtered = history.filter((g) => g.id !== id);
	await db.set(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(filtered));
}

export async function clearGameHistory(): Promise<void> {
	await db.delete(STORAGE_KEYS.GAME_HISTORY);
}

export async function getSavedAnalyses(): Promise<SavedAnalysis[]> {
	const data = await db.get<string>(STORAGE_KEYS.SAVED_ANALYSIS);
	return safeJsonParse<SavedAnalysis[]>(data ?? null, []);
}

export async function saveAnalysis(
	analysis: Omit<SavedAnalysis, 'id' | 'date'>
): Promise<SavedAnalysis> {
	const analyses = await getSavedAnalyses();
	const newAnalysis: SavedAnalysis = {
		...analysis,
		id: generateId(),
		date: new Date().toISOString(),
	};
	const updated = [newAnalysis, ...analyses].slice(0, 100);
	await db.set(STORAGE_KEYS.SAVED_ANALYSIS, JSON.stringify(updated));
	return newAnalysis;
}

export async function updateAnalysisNotes(
	id: string,
	notes: string
): Promise<void> {
	const analyses = await getSavedAnalyses();
	const updated = analyses.map((a) => (a.id === id ? { ...a, notes } : a));
	await db.set(STORAGE_KEYS.SAVED_ANALYSIS, JSON.stringify(updated));
}

export async function deleteAnalysis(id: string): Promise<void> {
	const analyses = await getSavedAnalyses();
	const filtered = analyses.filter((a) => a.id !== id);
	await db.set(STORAGE_KEYS.SAVED_ANALYSIS, JSON.stringify(filtered));
}

export async function clearSavedAnalyses(): Promise<void> {
	await db.delete(STORAGE_KEYS.SAVED_ANALYSIS);
}

const DEFAULT_PREFERENCES: UserPreferences = {
	defaultBot: 'intermediate',
	defaultTimeControl: 'blitz-5',
	defaultColor: 'w',
	boardTheme: 'modern',
	soundEnabled: true,
};

export async function getUserPreferences(): Promise<UserPreferences> {
	const data = await db.get<string>(STORAGE_KEYS.USER_PREFERENCES);
	return {
		...DEFAULT_PREFERENCES,
		...safeJsonParse<Partial<UserPreferences>>(data ?? null, {}),
	};
}

export async function saveUserPreferences(
	prefs: Partial<UserPreferences>
): Promise<UserPreferences> {
	const current = await getUserPreferences();
	const updated = { ...current, ...prefs };
	await db.set(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
	return updated;
}

export interface GameStats {
	totalGames: number;
	wins: number;
	losses: number;
	draws: number;
	winRate: number;
	avgMoves: number;
	favoriteBot: string | null;
	longestGame: number;
}

export async function getGameStats(): Promise<GameStats> {
	const history = await getGameHistory();
	// Only count finished games for stats
	const finishedGames = history.filter(
		(g: SavedGame) => g.status === 'finished'
	);

	if (finishedGames.length === 0) {
		return {
			totalGames: 0,
			wins: 0,
			losses: 0,
			draws: 0,
			winRate: 0,
			avgMoves: 0,
			favoriteBot: null,
			longestGame: 0,
		};
	}

	const wins = finishedGames.filter(
		(g: SavedGame) => g.result === 'win'
	).length;
	const losses = finishedGames.filter(
		(g: SavedGame) => g.result === 'loss'
	).length;
	const draws = finishedGames.filter(
		(g: SavedGame) => g.result === 'draw'
	).length;
	const totalMoves = finishedGames.reduce(
		(sum: number, g: SavedGame) => sum + g.moves,
		0
	);
	const longestGame = Math.max(...finishedGames.map((g: SavedGame) => g.moves));

	const botCounts = finishedGames.reduce(
		(acc: Record<string, number>, g: SavedGame) => {
			acc[g.settings.bot.id] = (acc[g.settings.bot.id] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	const favoriteBot =
		Object.entries(botCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

	return {
		totalGames: finishedGames.length,
		wins,
		losses,
		draws,
		winRate: Math.round((wins / finishedGames.length) * 100),
		avgMoves: Math.round(totalMoves / finishedGames.length),
		favoriteBot,
		longestGame,
	};
}

export interface ExportData {
	version: string;
	exportDate: string;
	gameHistory: SavedGame[];
	savedAnalyses: SavedAnalysis[];
	preferences: UserPreferences;
}

export async function exportAllData(): Promise<ExportData> {
	return {
		version: '1.0',
		exportDate: new Date().toISOString(),
		gameHistory: await getGameHistory(),
		savedAnalyses: await getSavedAnalyses(),
		preferences: await getUserPreferences(),
	};
}

export async function importData(data: ExportData): Promise<boolean> {
	try {
		if (data.gameHistory) {
			await db.set(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(data.gameHistory));
		}
		if (data.savedAnalyses) {
			await db.set(
				STORAGE_KEYS.SAVED_ANALYSIS,
				JSON.stringify(data.savedAnalyses)
			);
		}
		if (data.preferences) {
			await db.set(
				STORAGE_KEYS.USER_PREFERENCES,
				JSON.stringify(data.preferences)
			);
		}
		return true;
	} catch {
		return false;
	}
}

export async function downloadExportData(): Promise<void> {
	const data = await exportAllData();
	const blob = new Blob([JSON.stringify(data, null, 2)], {
		type: 'application/json',
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `chess-data-${new Date().toISOString().split('T')[0]}.json`;
	a.click();
	URL.revokeObjectURL(url);
}
