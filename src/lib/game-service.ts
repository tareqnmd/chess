import { Chess } from 'chess.js';
import type { Color } from '@/components/common/types';
import {
	getUserId,
	getGameHistory,
	deleteGame as deleteGameFromStorage,
	clearGameHistory,
	getGameStats,
	type SavedGame,
	type GameStats,
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
		this.userId = getUserId();
	}

	getGameById(gameId: string): SavedGame | null {
		const history = getGameHistory();
		return history.find((g) => g.id === gameId) || null;
	}

	getAllGames(): SavedGame[] {
		return getGameHistory();
	}

	getUserGames(): SavedGame[] {
		const history = getGameHistory();
		return history.filter((g) => g.odlId === this.userId);
	}

	getStats(): GameStats {
		return getGameStats();
	}

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

	getGamesForAnalysis(): GameForAnalysis[] {
		const games = this.getAllGames();
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

	deleteGame(gameId: string): boolean {
		const game = this.getGameById(gameId);
		if (!game) return false;

		if (game.odlId !== this.userId) {
			console.warn('Cannot delete game owned by another user');
			return false;
		}

		deleteGameFromStorage(gameId);
		return true;
	}

	clearAllHistory(): void {
		clearGameHistory();
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

	getGamePgn(gameId: string): string | null {
		const game = this.getGameById(gameId);
		return game?.pgn || null;
	}

	getGameFen(gameId: string): string | null {
		const game = this.getGameById(gameId);
		return game?.fen || null;
	}
}

export const gameService = new GameService();

export { GameService };
