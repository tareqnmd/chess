/**
 * LocalStorage utilities for persisting chess game data and analysis
 */

import type { GameSettings, Color } from '@/types/chess';

// Storage keys
const STORAGE_KEYS = {
	USER_ID: 'chess_user_id',
	GAME_HISTORY: 'chess_game_history',
	SAVED_ANALYSIS: 'chess_saved_analysis',
	USER_PREFERENCES: 'chess_user_preferences',
	CURRENT_GAME: 'chess_current_game',
	ACTIVE_GAMES: 'chess_active_games',
} as const;

// Types for stored data
export interface SavedGame {
	id: string;
	odlId: string; // User ID who played the game
	date: string;
	pgn: string;
	fen: string;
	result: 'win' | 'loss' | 'draw';
	settings: GameSettings;
	moves: number;
	duration: number; // in seconds
	startedAt: string;
	endedAt: string;
}

// Active game being played (with full move history)
export interface ActiveGame {
	id: string;
	odlId: string; // User ID
	pgn: string;
	fen: string;
	settings: GameSettings;
	clockWhite: number;
	clockBlack: number;
	moveHistory: MoveRecord[];
	startedAt: string;
	lastMoveAt: string;
	status: 'playing' | 'paused';
}

// Individual move record with timestamp
export interface MoveRecord {
	san: string;
	fen: string;
	timestamp: string;
	color: 'w' | 'b';
	clockTime: number; // remaining time when move was made
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

export interface CurrentGameState {
	gameId: string;
	odlId: string;
	fen: string;
	pgn: string;
	settings: GameSettings;
	clockWhite: number;
	clockBlack: number;
	moveHistory: MoveRecord[];
	startedAt: string;
	savedAt: string;
}

// Helper to safely parse JSON
function safeJsonParse<T>(json: string | null, fallback: T): T {
	if (!json) return fallback;
	try {
		return JSON.parse(json) as T;
	} catch {
		return fallback;
	}
}

// Generate unique ID (short ID for games)
function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Generate UUID v4 for user identification
function generateUUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// ==================== User ID (ODL ID) ====================

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

// ==================== Game History ====================

export function getGameHistory(): SavedGame[] {
	const data = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
	return safeJsonParse<SavedGame[]>(data, []);
}

export function saveGame(game: Omit<SavedGame, 'id' | 'date' | 'odlId' | 'endedAt'>): SavedGame {
	const history = getGameHistory();
	const now = new Date().toISOString();
	const newGame: SavedGame = {
		...game,
		id: generateId(),
		odlId: getUserId(),
		date: now,
		endedAt: now,
	};
	
	// Keep last 50 games
	const updatedHistory = [newGame, ...history].slice(0, 50);
	localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(updatedHistory));
	
	return newGame;
}

// ==================== Active Games ====================

export function getActiveGames(): ActiveGame[] {
	const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_GAMES);
	return safeJsonParse<ActiveGame[]>(data, []);
}

export function getActiveGameById(gameId: string): ActiveGame | null {
	const games = getActiveGames();
	return games.find(g => g.id === gameId) || null;
}

export function createActiveGame(settings: GameSettings, clockWhite: number, clockBlack: number): ActiveGame {
	const games = getActiveGames();
	const now = new Date().toISOString();
	
	const newGame: ActiveGame = {
		id: generateId(),
		odlId: getUserId(),
		pgn: '',
		fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
		settings,
		clockWhite,
		clockBlack,
		moveHistory: [],
		startedAt: now,
		lastMoveAt: now,
		status: 'playing',
	};
	
	// Keep only active games for current user, max 5
	const userGames = games.filter(g => g.odlId === getUserId()).slice(0, 4);
	const otherGames = games.filter(g => g.odlId !== getUserId());
	
	localStorage.setItem(STORAGE_KEYS.ACTIVE_GAMES, JSON.stringify([newGame, ...userGames, ...otherGames]));
	
	return newGame;
}

export function updateActiveGame(
	gameId: string, 
	updates: Partial<Pick<ActiveGame, 'pgn' | 'fen' | 'clockWhite' | 'clockBlack' | 'status'>>
): ActiveGame | null {
	const games = getActiveGames();
	const index = games.findIndex(g => g.id === gameId);
	
	if (index === -1) return null;
	
	const updated: ActiveGame = {
		...games[index],
		...updates,
		lastMoveAt: new Date().toISOString(),
	};
	
	games[index] = updated;
	localStorage.setItem(STORAGE_KEYS.ACTIVE_GAMES, JSON.stringify(games));
	
	return updated;
}

export function addMoveToActiveGame(
	gameId: string,
	move: { san: string; fen: string; color: 'w' | 'b'; clockTime: number },
	pgn: string
): ActiveGame | null {
	const games = getActiveGames();
	const index = games.findIndex(g => g.id === gameId);
	
	if (index === -1) return null;
	
	const now = new Date().toISOString();
	const moveRecord: MoveRecord = {
		...move,
		timestamp: now,
	};
	
	const updated: ActiveGame = {
		...games[index],
		pgn,
		fen: move.fen,
		clockWhite: move.color === 'w' ? move.clockTime : games[index].clockWhite,
		clockBlack: move.color === 'b' ? move.clockTime : games[index].clockBlack,
		moveHistory: [...games[index].moveHistory, moveRecord],
		lastMoveAt: now,
	};
	
	games[index] = updated;
	localStorage.setItem(STORAGE_KEYS.ACTIVE_GAMES, JSON.stringify(games));
	
	return updated;
}

export function deleteActiveGame(gameId: string): void {
	const games = getActiveGames();
	const filtered = games.filter(g => g.id !== gameId);
	localStorage.setItem(STORAGE_KEYS.ACTIVE_GAMES, JSON.stringify(filtered));
}

export function completeActiveGame(
	gameId: string, 
	result: 'win' | 'loss' | 'draw',
	duration: number
): SavedGame | null {
	const activeGame = getActiveGameById(gameId);
	if (!activeGame) return null;
	
	// Save to game history
	const saved = saveGame({
		pgn: activeGame.pgn,
		fen: activeGame.fen,
		result,
		settings: activeGame.settings,
		moves: activeGame.moveHistory.length,
		duration,
		startedAt: activeGame.startedAt,
	});
	
	// Remove from active games
	deleteActiveGame(gameId);
	
	return saved;
}

export function deleteGame(id: string): void {
	const history = getGameHistory();
	const filtered = history.filter(g => g.id !== id);
	localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(filtered));
}

export function clearGameHistory(): void {
	localStorage.removeItem(STORAGE_KEYS.GAME_HISTORY);
}

// ==================== Saved Analysis ====================

export function getSavedAnalyses(): SavedAnalysis[] {
	const data = localStorage.getItem(STORAGE_KEYS.SAVED_ANALYSIS);
	return safeJsonParse<SavedAnalysis[]>(data, []);
}

export function saveAnalysis(analysis: Omit<SavedAnalysis, 'id' | 'date'>): SavedAnalysis {
	const analyses = getSavedAnalyses();
	const newAnalysis: SavedAnalysis = {
		...analysis,
		id: generateId(),
		date: new Date().toISOString(),
	};
	
	// Keep last 100 analyses
	const updated = [newAnalysis, ...analyses].slice(0, 100);
	localStorage.setItem(STORAGE_KEYS.SAVED_ANALYSIS, JSON.stringify(updated));
	
	return newAnalysis;
}

export function updateAnalysisNotes(id: string, notes: string): void {
	const analyses = getSavedAnalyses();
	const updated = analyses.map(a => 
		a.id === id ? { ...a, notes } : a
	);
	localStorage.setItem(STORAGE_KEYS.SAVED_ANALYSIS, JSON.stringify(updated));
}

export function deleteAnalysis(id: string): void {
	const analyses = getSavedAnalyses();
	const filtered = analyses.filter(a => a.id !== id);
	localStorage.setItem(STORAGE_KEYS.SAVED_ANALYSIS, JSON.stringify(filtered));
}

export function clearSavedAnalyses(): void {
	localStorage.removeItem(STORAGE_KEYS.SAVED_ANALYSIS);
}

// ==================== User Preferences ====================

const DEFAULT_PREFERENCES: UserPreferences = {
	defaultBot: 'intermediate',
	defaultTimeControl: 'blitz-5',
	defaultColor: 'w',
	boardTheme: 'modern',
	soundEnabled: true,
};

export function getUserPreferences(): UserPreferences {
	const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
	return { ...DEFAULT_PREFERENCES, ...safeJsonParse<Partial<UserPreferences>>(data, {}) };
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
	const current = getUserPreferences();
	const updated = { ...current, ...prefs };
	localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
	return updated;
}

// ==================== Current Game (Auto-save) ====================

export function getCurrentGame(): CurrentGameState | null {
	const data = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
	return safeJsonParse<CurrentGameState | null>(data, null);
}

export function saveCurrentGame(state: Omit<CurrentGameState, 'savedAt' | 'odlId'>): void {
	const gameState: CurrentGameState = {
		...state,
		odlId: getUserId(),
		savedAt: new Date().toISOString(),
	};
	localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(gameState));
}

export function clearCurrentGame(): void {
	localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
}

// Create a new game session and return the game ID
export function initializeGameSession(settings: GameSettings, clockWhite: number, clockBlack: number): string {
	const gameId = generateId();
	const now = new Date().toISOString();
	
	const gameState: CurrentGameState = {
		gameId,
		odlId: getUserId(),
		fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
		pgn: '',
		settings,
		clockWhite,
		clockBlack,
		moveHistory: [],
		startedAt: now,
		savedAt: now,
	};
	
	localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(gameState));
	return gameId;
}

// Add a move to the current game
export function addMoveToCurrentGame(
	move: { san: string; fen: string; color: 'w' | 'b'; clockTime: number },
	pgn: string
): CurrentGameState | null {
	const current = getCurrentGame();
	if (!current) return null;
	
	const now = new Date().toISOString();
	const moveRecord: MoveRecord = {
		...move,
		timestamp: now,
	};
	
	const updated: CurrentGameState = {
		...current,
		pgn,
		fen: move.fen,
		clockWhite: move.color === 'w' ? move.clockTime : current.clockWhite,
		clockBlack: move.color === 'b' ? move.clockTime : current.clockBlack,
		moveHistory: [...current.moveHistory, moveRecord],
		savedAt: now,
	};
	
	localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(updated));
	return updated;
}

// ==================== Stats ====================

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
	
	if (history.length === 0) {
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
	
	const wins = history.filter(g => g.result === 'win').length;
	const losses = history.filter(g => g.result === 'loss').length;
	const draws = history.filter(g => g.result === 'draw').length;
	const totalMoves = history.reduce((sum, g) => sum + g.moves, 0);
	const longestGame = Math.max(...history.map(g => g.moves));
	
	// Find favorite bot (most played)
	const botCounts = history.reduce((acc, g) => {
		acc[g.settings.bot.id] = (acc[g.settings.bot.id] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);
	
	const favoriteBot = Object.entries(botCounts)
		.sort((a, b) => b[1] - a[1])[0]?.[0] || null;
	
	return {
		totalGames: history.length,
		wins,
		losses,
		draws,
		winRate: Math.round((wins / history.length) * 100),
		avgMoves: Math.round(totalMoves / history.length),
		favoriteBot,
		longestGame,
	};
}

// ==================== Export/Import ====================

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
			localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(data.gameHistory));
		}
		if (data.savedAnalyses) {
			localStorage.setItem(STORAGE_KEYS.SAVED_ANALYSIS, JSON.stringify(data.savedAnalyses));
		}
		if (data.preferences) {
			localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data.preferences));
		}
		return true;
	} catch {
		return false;
	}
}

export function downloadExportData(): void {
	const data = exportAllData();
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `chess-data-${new Date().toISOString().split('T')[0]}.json`;
	a.click();
	URL.revokeObjectURL(url);
}

