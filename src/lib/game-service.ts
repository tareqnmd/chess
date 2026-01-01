/**
 * Game Service - Helper functions for game CRUD operations
 * Users can only update games via moves, not directly modify game data
 */

import { Chess } from 'chess.js';
import type { GameSettings, Color } from '@/types/chess';
import {
	getUserId,
	getGameHistory,
	saveGame,
	deleteGame as deleteGameFromStorage,
	clearGameHistory,
	getCurrentGame,
	saveCurrentGame,
	clearCurrentGame,
	addMoveToCurrentGame,
	getGameStats,
	type SavedGame,
	type CurrentGameState,
	type MoveRecord,
	type GameStats,
} from './storage';

// ==================== Types ====================

export interface GameCreateParams {
	settings: GameSettings;
	clockWhite: number;
	clockBlack: number;
}

export interface MoveParams {
	san: string;
	fen: string;
	color: Color;
	clockTime: number;
	pgn: string;
}

export interface GameCompleteParams {
	result: 'win' | 'loss' | 'draw';
	duration: number;
}

export interface GameForAnalysis {
	id: string;
	pgn: string;
	fen: string;
	playerColor: Color;
	opponentName: string;
	result: 'win' | 'loss' | 'draw';
	date: string;
	moves: number;
}

// ==================== Game ID Generation ====================

function generateGameId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ==================== Game Service Class ====================

class GameService {
	private userId: string;

	constructor() {
		this.userId = getUserId();
	}

	// ==================== Create Operations ====================

	/**
	 * Create a new game session
	 * @returns The game ID
	 */
	createGame(params: GameCreateParams): string {
		const gameId = generateGameId();
		const now = new Date().toISOString();

		const gameState: CurrentGameState = {
			gameId,
			odlId: this.userId,
			fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
			pgn: '',
			settings: params.settings,
			clockWhite: params.clockWhite,
			clockBlack: params.clockBlack,
			moveHistory: [],
			startedAt: now,
			savedAt: now,
		};

		saveCurrentGame(gameState);
		return gameId;
	}

	// ==================== Read Operations ====================

	/**
	 * Get current active game
	 */
	getCurrentGame(): CurrentGameState | null {
		return getCurrentGame();
	}

	/**
	 * Get game by ID from history
	 */
	getGameById(gameId: string): SavedGame | null {
		const history = getGameHistory();
		return history.find(g => g.id === gameId) || null;
	}

	/**
	 * Get all games from history
	 */
	getAllGames(): SavedGame[] {
		return getGameHistory();
	}

	/**
	 * Get user's games only
	 */
	getUserGames(): SavedGame[] {
		const history = getGameHistory();
		return history.filter(g => g.odlId === this.userId);
	}

	/**
	 * Get game statistics
	 */
	getStats(): GameStats {
		return getGameStats();
	}

	/**
	 * Get game formatted for analysis
	 */
	getGameForAnalysis(gameId: string): GameForAnalysis | null {
		const game = this.getGameById(gameId);
		if (!game) return null;

		return {
			id: game.id,
			pgn: game.pgn,
			fen: game.fen,
			playerColor: game.settings.playerColor,
			opponentName: game.settings.bot.name,
			result: game.result,
			date: game.date,
			moves: game.moves,
		};
	}

	/**
	 * Get all games formatted for analysis
	 */
	getGamesForAnalysis(): GameForAnalysis[] {
		const games = this.getAllGames();
		return games.map(game => ({
			id: game.id,
			pgn: game.pgn,
			fen: game.fen,
			playerColor: game.settings.playerColor,
			opponentName: game.settings.bot.name,
			result: game.result,
			date: game.date,
			moves: game.moves,
		}));
	}

	// ==================== Update Operations (via moves only) ====================

	/**
	 * Add a move to the current game
	 * This is the ONLY way to update a game - users cannot directly modify game data
	 */
	addMove(params: MoveParams): CurrentGameState | null {
		return addMoveToCurrentGame(
			{
				san: params.san,
				fen: params.fen,
				color: params.color,
				clockTime: params.clockTime,
			},
			params.pgn
		);
	}

	/**
	 * Update clock state for current game
	 */
	updateClock(clockWhite: number, clockBlack: number): void {
		const current = getCurrentGame();
		if (!current) return;

		saveCurrentGame({
			...current,
			clockWhite,
			clockBlack,
		});
	}

	/**
	 * Complete a game and save to history
	 */
	completeGame(params: GameCompleteParams): SavedGame | null {
		const current = getCurrentGame();
		if (!current) return null;

		const saved = saveGame({
			pgn: current.pgn,
			fen: current.fen,
			result: params.result,
			settings: current.settings,
			moves: current.moveHistory.length,
			duration: params.duration,
			startedAt: current.startedAt,
		});

		clearCurrentGame();
		return saved;
	}

	// ==================== Delete Operations ====================

	/**
	 * Delete a game from history
	 */
	deleteGame(gameId: string): boolean {
		const game = this.getGameById(gameId);
		if (!game) return false;

		// Only allow deleting own games
		if (game.odlId !== this.userId) {
			console.warn('Cannot delete game owned by another user');
			return false;
		}

		deleteGameFromStorage(gameId);
		return true;
	}

	/**
	 * Cancel current game (without saving to history)
	 */
	cancelCurrentGame(): void {
		clearCurrentGame();
	}

	/**
	 * Clear all game history for current user
	 */
	clearAllHistory(): void {
		clearGameHistory();
	}

	// ==================== Validation ====================

	/**
	 * Validate a PGN string
	 */
	validatePgn(pgn: string): { valid: boolean; error?: string; fen?: string } {
		try {
			const chess = new Chess();
			chess.loadPgn(pgn);
			return { valid: true, fen: chess.fen() };
		} catch (e) {
			return { valid: false, error: e instanceof Error ? e.message : 'Invalid PGN' };
		}
	}

	/**
	 * Validate a FEN string
	 */
	validateFen(fen: string): { valid: boolean; error?: string } {
		try {
			new Chess(fen);
			return { valid: true };
		} catch (e) {
			return { valid: false, error: e instanceof Error ? e.message : 'Invalid FEN' };
		}
	}

	/**
	 * Parse PGN and extract moves
	 */
	parsePgn(pgn: string): { moves: string[]; fen: string } | null {
		try {
			const chess = new Chess();
			chess.loadPgn(pgn);
			const moves = chess.history();
			return { moves, fen: chess.fen() };
		} catch {
			return null;
		}
	}

	/**
	 * Get moves list from PGN for replay
	 */
	getMovesFromPgn(pgn: string): MoveRecord[] | null {
		try {
			const chess = new Chess();
			chess.loadPgn(pgn);
			
			const moves: MoveRecord[] = [];
			const history = chess.history({ verbose: true });
			
			// Reset and replay to get FEN at each position
			chess.reset();
			
			for (const move of history) {
				chess.move(move.san);
				moves.push({
					san: move.san,
					fen: chess.fen(),
					color: move.color,
					timestamp: new Date().toISOString(),
					clockTime: 0, // Unknown for imported games
				});
			}
			
			return moves;
		} catch {
			return null;
		}
	}

	// ==================== Import/Export ====================

	/**
	 * Import a game from PGN for analysis (not saved as played game)
	 */
	importPgnForAnalysis(pgn: string): { fen: string; moves: string[] } | null {
		const result = this.parsePgn(pgn);
		if (!result) return null;
		return result;
	}

	/**
	 * Get PGN for a game
	 */
	getGamePgn(gameId: string): string | null {
		const game = this.getGameById(gameId);
		return game?.pgn || null;
	}

	/**
	 * Get final FEN for a game
	 */
	getGameFen(gameId: string): string | null {
		const game = this.getGameById(gameId);
		return game?.fen || null;
	}
}

// Export singleton instance
export const gameService = new GameService();

// Export class for testing
export { GameService };

