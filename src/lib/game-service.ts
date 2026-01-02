import { Chess } from 'chess.js';
import type { GameSettings } from '@/components/game/types';
import type { Color } from '@/components/common/types';
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

function generateGameId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

class GameService {
	private userId: string;

	constructor() {
		this.userId = getUserId();
	}

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

	getCurrentGame(): CurrentGameState | null {
		return getCurrentGame();
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

	updateClock(clockWhite: number, clockBlack: number): void {
		const current = getCurrentGame();
		if (!current) return;

		saveCurrentGame({
			...current,
			clockWhite,
			clockBlack,
		});
	}

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

	cancelCurrentGame(): void {
		clearCurrentGame();
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

	getMovesFromPgn(pgn: string): MoveRecord[] | null {
		try {
			const chess = new Chess();
			chess.loadPgn(pgn);

			const moves: MoveRecord[] = [];
			const history = chess.history({ verbose: true });

			chess.reset();

			for (const move of history) {
				chess.move(move.san);
				moves.push({
					san: move.san,
					fen: chess.fen(),
					color: move.color,
					timestamp: new Date().toISOString(),
					clockTime: 0,
				});
			}

			return moves;
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
