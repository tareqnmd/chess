import type { Color } from '@/components/common/types';
import { Chess } from 'chess.js';
import {
	clearGameHistory,
	deleteGame as deleteGameFromStorage,
	getGameHistory,
	getGameStats,
	getUserId,
	type GameStats,
	type SavedGame,
} from './storage';

export interface GameForAnalysis {
	id: string;
	pgn: string;
	fen: string;
	playerColor: Color;
	opponentName: string;
	result: 'win' | 'loss' | 'draw' | null;
	date: string;
	moves: number;
}

class GameService {
	private userId: string;

	constructor() {
		// userId must be set asynchronously
		this.userId = '';
		this.initUserId();
	}

	async initUserId() {
		this.userId = await getUserId();
	}
	// All methods below should be inside the class

	async getGameById(gameId: string): Promise<SavedGame | null> {
		const history = await getGameHistory();
		return history.find((g) => g.id === gameId) || null;
	}

	async getAllGames(): Promise<SavedGame[]> {
		return await getGameHistory();
	}

	async getUserGames(): Promise<SavedGame[]> {
		const history = await getGameHistory();
		return history.filter((g) => g.odlId === this.userId);
	}

	async getStats(): Promise<GameStats> {
		return await getGameStats();
	}

	async getGameForAnalysis(gameId: string): Promise<GameForAnalysis | null> {
		const game = await this.getGameById(gameId);
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

	async getGamesForAnalysis(): Promise<GameForAnalysis[]> {
		const games = await this.getAllGames();
		return games.map((game) => ({
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

	async deleteGame(gameId: string): Promise<boolean> {
		const game = await this.getGameById(gameId);
		if (!game) return false;
		if (game.odlId !== this.userId) {
			console.warn('Cannot delete game owned by another user');
			return false;
		}
		await deleteGameFromStorage(gameId);
		return true;
	}

	async clearAllHistory(): Promise<void> {
		await clearGameHistory();
	}

	validatePgn(pgn: string): { valid: boolean; error?: string; fen?: string } {
		try {
			const chess = new Chess();
			chess.loadPgn(pgn);
			return { valid: true, fen: chess.fen() };
		} catch (e) {
			return {
				valid: false,
				error: e instanceof Error ? e.message : 'Invalid PGN',
			};
		}
	}

	validateFen(fen: string): { valid: boolean; error?: string } {
		try {
			new Chess(fen);
			return { valid: true };
		} catch (e) {
			return {
				valid: false,
				error: e instanceof Error ? e.message : 'Invalid FEN',
			};
		}
	}

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

	importPgnForAnalysis(pgn: string): { fen: string; moves: string[] } | null {
		const result = this.parsePgn(pgn);
		if (!result) return null;
		return result;
	}

	async getGamePgn(gameId: string): Promise<string | null> {
		const game = await this.getGameById(gameId);
		return game?.pgn || null;
	}

	async getGameFen(gameId: string): Promise<string | null> {
		const game = await this.getGameById(gameId);
		return game?.fen || null;
	}
}

export const gameService = new GameService();

export { GameService };
