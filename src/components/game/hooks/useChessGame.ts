import { useState, useCallback, useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import type { GameState, GameSettings } from '@/components/game/types';
import { GameStatus, TerminationType } from '@/components/game/types';
import type { Color, Square } from '@/components/common/types';
import { calculateBotMove, parseUCIMove } from '@/lib/chess-ai';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function generateGameId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

interface UseChessGameReturn {
	gameState: GameState;
	startGame: (settings: GameSettings) => void;
	makeMove: (from: string, to: string, promotion?: string) => boolean;
	resetGame: () => void;
	resign: () => void;
	setTimeoutWinner: (winner: Color) => void;
	isPlayerTurn: boolean;
	legalMoves: string[];
	getLegalMovesForSquare: (square: string) => string[];
}

export function useChessGame(): UseChessGameReturn {
	const chessRef = useRef(new Chess());

	const masterChessRef = useRef(new Chess());

	const [gameState, setGameState] = useState<GameState>({
		gameId: null,
		chess: chessRef.current,
		fen: INITIAL_FEN,
		pgn: '',
		history: [],
		status: GameStatus.IDLE,
		winner: null,
		termination: null,
		settings: null,
		startedAt: null,
	});

	const botThinkingRef = useRef(false);

	const updateGameState = useCallback((updates: Partial<GameState>) => {
		setGameState((prev) => ({ ...prev, ...updates }));
	}, []);

	const checkGameEnd = useCallback(
		(
			chess: Chess
		): {
			status: GameStatus;
			winner: Color | 'draw' | null;
			termination: TerminationType | null;
		} => {
			if (chess.isCheckmate()) {
				const winner = chess.turn() === 'w' ? 'b' : 'w';
				return {
					status: GameStatus.CHECKMATE,
					winner,
					termination: TerminationType.CHECKMATE,
				};
			}
			if (chess.isStalemate()) {
				return {
					status: GameStatus.STALEMATE,
					winner: 'draw',
					termination: TerminationType.STALEMATE,
				};
			}
			if (chess.isInsufficientMaterial()) {
				return {
					status: GameStatus.DRAW,
					winner: 'draw',
					termination: TerminationType.INSUFFICIENT_MATERIAL,
				};
			}
			if (chess.isThreefoldRepetition()) {
				return {
					status: GameStatus.DRAW,
					winner: 'draw',
					termination: TerminationType.THREEFOLD_REPETITION,
				};
			}
			if (chess.isDraw()) {
				// This catches fifty-move rule and other draws
				return {
					status: GameStatus.DRAW,
					winner: 'draw',
					termination: TerminationType.FIFTY_MOVE,
				};
			}
			return { status: GameStatus.PLAYING, winner: null, termination: null };
		},
		[]
	);

	const makeBotMove = useCallback(async () => {
		if (botThinkingRef.current) return;

		const { settings, status, fen } = gameState;
		if (!settings || status !== GameStatus.PLAYING) return;

		const chess = new Chess(fen);
		const isBotTurn = chess.turn() !== settings.playerColor;

		if (!isBotTurn) return;

		botThinkingRef.current = true;

		try {
			const uciMove = await calculateBotMove(fen, settings.bot.id);

			if (uciMove) {
				const parsed = parseUCIMove(uciMove);
				if (parsed) {
					const newChess = new Chess(fen);
					const result = newChess.move({
						from: parsed.from,
						to: parsed.to,
						promotion: parsed.promotion,
					});

					if (result) {
						const {
							status: newStatus,
							winner,
							termination,
						} = checkGameEnd(newChess);

						masterChessRef.current.move({
							from: parsed.from,
							to: parsed.to,
							promotion: parsed.promotion,
						});

						setGameState((prev) => ({
							...prev,
							chess: newChess,
							fen: newChess.fen(),
							pgn: masterChessRef.current.pgn(),
							history: [...prev.history, result],
							status: newStatus,
							winner,
							termination,
						}));
					}
				}
			}
		} finally {
			botThinkingRef.current = false;
		}
	}, [gameState, checkGameEnd]);

	useEffect(() => {
		if (gameState.status !== GameStatus.PLAYING || !gameState.settings) return;

		const chess = new Chess(gameState.fen);
		const isBotTurn = chess.turn() !== gameState.settings.playerColor;

		if (isBotTurn && !botThinkingRef.current) {
			makeBotMove();
		}
	}, [gameState.fen, gameState.status, gameState.settings, makeBotMove]);

	const startGame = useCallback((settings: GameSettings) => {
		const chess = new Chess();
		chessRef.current = chess;
		masterChessRef.current = new Chess();

		const gameId = generateGameId();
		const now = new Date().toISOString();

		setGameState({
			gameId,
			chess,
			fen: chess.fen(),
			pgn: '',
			history: [],
			status: GameStatus.PLAYING,
			winner: null,
			termination: null,
			settings,
			startedAt: now,
		});
	}, []);

	const makeMove = useCallback(
		(from: string, to: string, promotion?: string): boolean => {
			const { settings, status, fen } = gameState;

			if (status !== GameStatus.PLAYING || !settings) return false;

			const chess = new Chess(fen);
			const isPlayerTurn = chess.turn() === settings.playerColor;

			if (!isPlayerTurn) return false;

			try {
				const move = chess.move({
					from,
					to,
					promotion: promotion || 'q',
				});

				if (move) {
					const {
						status: newStatus,
						winner,
						termination,
					} = checkGameEnd(chess);

					masterChessRef.current.move({
						from,
						to,
						promotion: promotion || 'q',
					});

					setGameState((prev) => ({
						...prev,
						chess,
						fen: chess.fen(),
						pgn: masterChessRef.current.pgn(),
						history: [...prev.history, move],
						status: newStatus,
						winner,
						termination,
					}));

					return true;
				}
			} catch {
				return false;
			}

			return false;
		},
		[gameState, checkGameEnd]
	);

	const resetGame = useCallback(() => {
		const chess = new Chess();
		chessRef.current = chess;
		masterChessRef.current = new Chess();
		botThinkingRef.current = false;

		setGameState({
			gameId: null,
			chess,
			fen: chess.fen(),
			pgn: '',
			history: [],
			status: GameStatus.IDLE,
			winner: null,
			termination: null,
			settings: null,
			startedAt: null,
		});
	}, []);

	const resign = useCallback(() => {
		const { settings } = gameState;
		if (!settings) return;

		const winner = settings.playerColor === 'w' ? 'b' : 'w';
		updateGameState({
			status: GameStatus.RESIGNED,
			winner,
			termination: TerminationType.RESIGNATION,
		});
	}, [gameState, updateGameState]);

	const setTimeoutWinner = useCallback(
		(loser: Color) => {
			const winner = loser === 'w' ? 'b' : 'w';
			updateGameState({
				status: GameStatus.TIMEOUT,
				winner,
				termination: TerminationType.TIMEOUT,
			});
		},
		[updateGameState]
	);

	const getLegalMovesForSquare = useCallback(
		(square: string): string[] => {
			const chess = new Chess(gameState.fen);
			const moves = chess.moves({ square: square as Square, verbose: true });
			return moves.map((m) => m.to);
		},
		[gameState.fen]
	);

	const isPlayerTurn = gameState.settings
		? new Chess(gameState.fen).turn() === gameState.settings.playerColor
		: false;

	const legalMoves = new Chess(gameState.fen).moves();

	return {
		gameState,
		startGame,
		makeMove,
		resetGame,
		resign,
		setTimeoutWinner,
		isPlayerTurn,
		legalMoves,
		getLegalMovesForSquare,
	};
}
