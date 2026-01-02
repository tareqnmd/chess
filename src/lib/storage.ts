import type { Color } from '@/components/common/types';
import type { GameSettings, TerminationType } from '@/components/game/types';

const STORAGE_KEYS = {
	USER_ID: 'chess_user_id',
	GAME_HISTORY: 'chess_game_history',
	SAVED_ANALYSIS: 'chess_saved_analysis',
	USER_PREFERENCES: 'chess_user_preferences',
} as const;

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

export function getUserId(): string {
	let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
	if (!userId) {
		userId = generateUUID();
		localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
	}
	return userId;
}

export function setUserId(id: string): void {
	localStorage.setItem(STORAGE_KEYS.USER_ID, id);
}

export function getGameHistory(): SavedGame[] {
	const data = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
	return safeJsonParse<SavedGame[]>(data, []);
}

export function createGameInHistory(
	gameId: string,
	settings: GameSettings,
	clockWhite: number,
	clockBlack: number
): SavedGame {
	const history = getGameHistory();
	const now = new Date().toISOString();
	const newGame: SavedGame = {
		id: gameId,
		odlId: getUserId(),
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
	};

	const updatedHistory = [newGame, ...history].slice(0, 50);
	localStorage.setItem(
		STORAGE_KEYS.GAME_HISTORY,
		JSON.stringify(updatedHistory)
	);

	return newGame;
}

export function updateGameInHistory(
	gameId: string,
	updates: Partial<
		Pick<
			SavedGame,
			'pgn' | 'fen' | 'moves' | 'duration' | 'clockWhite' | 'clockBlack'
		>
	>
): void {
	const history = getGameHistory();
	const index = history.findIndex((g) => g.id === gameId);

	if (index === -1) return;

	const updated: SavedGame = {
		...history[index],
		...updates,
	};

	history[index] = updated;
	localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));
}

export function finishGameInHistory(
	gameId: string,
	result: 'win' | 'loss' | 'draw',
	termination: TerminationType,
	duration: number
): void {
	const history = getGameHistory();
	const index = history.findIndex((g) => g.id === gameId);

	if (index === -1) return;

	const updated: SavedGame = {
		...history[index],
		result,
		termination,
		duration,
		endedAt: new Date().toISOString(),
		status: 'finished',
	};

	history[index] = updated;
	localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));
}

export function getGameById(gameId: string): SavedGame | null {
	const history = getGameHistory();
	return history.find((g) => g.id === gameId) || null;
}

export function saveGame(
	game: Omit<SavedGame, 'id' | 'date' | 'odlId'>
): SavedGame {
	const history = getGameHistory();
	const now = new Date().toISOString();
	const newGame: SavedGame = {
		...game,
		id: generateId(),
		odlId: getUserId(),
		date: now,
		endedAt: game.endedAt || now,
	};

	const updatedHistory = [newGame, ...history].slice(0, 50);
	localStorage.setItem(
		STORAGE_KEYS.GAME_HISTORY,
		JSON.stringify(updatedHistory)
	);

	return newGame;
}

export function deleteGame(id: string): void {
	const history = getGameHistory();
	const filtered = history.filter((g) => g.id !== id);
	localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(filtered));
}

export function clearGameHistory(): void {
	localStorage.removeItem(STORAGE_KEYS.GAME_HISTORY);
}

export function getSavedAnalyses(): SavedAnalysis[] {
	const data = localStorage.getItem(STORAGE_KEYS.SAVED_ANALYSIS);
	return safeJsonParse<SavedAnalysis[]>(data, []);
}

export function saveAnalysis(
	analysis: Omit<SavedAnalysis, 'id' | 'date'>
): SavedAnalysis {
	const analyses = getSavedAnalyses();
	const newAnalysis: SavedAnalysis = {
		...analysis,
		id: generateId(),
		date: new Date().toISOString(),
	};

	const updated = [newAnalysis, ...analyses].slice(0, 100);
	localStorage.setItem(STORAGE_KEYS.SAVED_ANALYSIS, JSON.stringify(updated));

	return newAnalysis;
}

export function updateAnalysisNotes(id: string, notes: string): void {
	const analyses = getSavedAnalyses();
	const updated = analyses.map((a) => (a.id === id ? { ...a, notes } : a));
	localStorage.setItem(STORAGE_KEYS.SAVED_ANALYSIS, JSON.stringify(updated));
}

export function deleteAnalysis(id: string): void {
	const analyses = getSavedAnalyses();
	const filtered = analyses.filter((a) => a.id !== id);
	localStorage.setItem(STORAGE_KEYS.SAVED_ANALYSIS, JSON.stringify(filtered));
}

export function clearSavedAnalyses(): void {
	localStorage.removeItem(STORAGE_KEYS.SAVED_ANALYSIS);
}

const DEFAULT_PREFERENCES: UserPreferences = {
	defaultBot: 'intermediate',
	defaultTimeControl: 'blitz-5',
	defaultColor: 'w',
	boardTheme: 'modern',
	soundEnabled: true,
};

export function getUserPreferences(): UserPreferences {
	const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
	return {
		...DEFAULT_PREFERENCES,
		...safeJsonParse<Partial<UserPreferences>>(data, {}),
	};
}

export function saveUserPreferences(
	prefs: Partial<UserPreferences>
): UserPreferences {
	const current = getUserPreferences();
	const updated = { ...current, ...prefs };
	localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
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

export function getGameStats(): GameStats {
	const history = getGameHistory();
	// Only count finished games for stats
	const finishedGames = history.filter((g) => g.status === 'finished');

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

	const wins = finishedGames.filter((g) => g.result === 'win').length;
	const losses = finishedGames.filter((g) => g.result === 'loss').length;
	const draws = finishedGames.filter((g) => g.result === 'draw').length;
	const totalMoves = finishedGames.reduce((sum, g) => sum + g.moves, 0);
	const longestGame = Math.max(...finishedGames.map((g) => g.moves));

	const botCounts = finishedGames.reduce(
		(acc, g) => {
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

export function exportAllData(): ExportData {
	return {
		version: '1.0',
		exportDate: new Date().toISOString(),
		gameHistory: getGameHistory(),
		savedAnalyses: getSavedAnalyses(),
		preferences: getUserPreferences(),
	};
}

export function importData(data: ExportData): boolean {
	try {
		if (data.gameHistory) {
			localStorage.setItem(
				STORAGE_KEYS.GAME_HISTORY,
				JSON.stringify(data.gameHistory)
			);
		}
		if (data.savedAnalyses) {
			localStorage.setItem(
				STORAGE_KEYS.SAVED_ANALYSIS,
				JSON.stringify(data.savedAnalyses)
			);
		}
		if (data.preferences) {
			localStorage.setItem(
				STORAGE_KEYS.USER_PREFERENCES,
				JSON.stringify(data.preferences)
			);
		}
		return true;
	} catch {
		return false;
	}
}

export function downloadExportData(): void {
	const data = exportAllData();
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
