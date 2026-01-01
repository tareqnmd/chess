import { Chess, Move } from 'chess.js';
import type { BotLevel } from '@/types/chess';

// Piece values for evaluation
const PIECE_VALUES: Record<string, number> = {
	p: 100,
	n: 320,
	b: 330,
	r: 500,
	q: 900,
	k: 20000,
};

// Piece-square tables for positional evaluation
const PAWN_TABLE = [
	0, 0, 0, 0, 0, 0, 0, 0,
	50, 50, 50, 50, 50, 50, 50, 50,
	10, 10, 20, 30, 30, 20, 10, 10,
	5, 5, 10, 25, 25, 10, 5, 5,
	0, 0, 0, 20, 20, 0, 0, 0,
	5, -5, -10, 0, 0, -10, -5, 5,
	5, 10, 10, -20, -20, 10, 10, 5,
	0, 0, 0, 0, 0, 0, 0, 0,
];

const KNIGHT_TABLE = [
	-50, -40, -30, -30, -30, -30, -40, -50,
	-40, -20, 0, 0, 0, 0, -20, -40,
	-30, 0, 10, 15, 15, 10, 0, -30,
	-30, 5, 15, 20, 20, 15, 5, -30,
	-30, 0, 15, 20, 20, 15, 0, -30,
	-30, 5, 10, 15, 15, 10, 5, -30,
	-40, -20, 0, 5, 5, 0, -20, -40,
	-50, -40, -30, -30, -30, -30, -40, -50,
];

const BISHOP_TABLE = [
	-20, -10, -10, -10, -10, -10, -10, -20,
	-10, 0, 0, 0, 0, 0, 0, -10,
	-10, 0, 5, 10, 10, 5, 0, -10,
	-10, 5, 5, 10, 10, 5, 5, -10,
	-10, 0, 10, 10, 10, 10, 0, -10,
	-10, 10, 10, 10, 10, 10, 10, -10,
	-10, 5, 0, 0, 0, 0, 5, -10,
	-20, -10, -10, -10, -10, -10, -10, -20,
];

const ROOK_TABLE = [
	0, 0, 0, 0, 0, 0, 0, 0,
	5, 10, 10, 10, 10, 10, 10, 5,
	-5, 0, 0, 0, 0, 0, 0, -5,
	-5, 0, 0, 0, 0, 0, 0, -5,
	-5, 0, 0, 0, 0, 0, 0, -5,
	-5, 0, 0, 0, 0, 0, 0, -5,
	-5, 0, 0, 0, 0, 0, 0, -5,
	0, 0, 0, 5, 5, 0, 0, 0,
];

const QUEEN_TABLE = [
	-20, -10, -10, -5, -5, -10, -10, -20,
	-10, 0, 0, 0, 0, 0, 0, -10,
	-10, 0, 5, 5, 5, 5, 0, -10,
	-5, 0, 5, 5, 5, 5, 0, -5,
	0, 0, 5, 5, 5, 5, 0, -5,
	-10, 5, 5, 5, 5, 5, 0, -10,
	-10, 0, 5, 0, 0, 0, 0, -10,
	-20, -10, -10, -5, -5, -10, -10, -20,
];

const KING_MIDDLE_TABLE = [
	-30, -40, -40, -50, -50, -40, -40, -30,
	-30, -40, -40, -50, -50, -40, -40, -30,
	-30, -40, -40, -50, -50, -40, -40, -30,
	-30, -40, -40, -50, -50, -40, -40, -30,
	-20, -30, -30, -40, -40, -30, -30, -20,
	-10, -20, -20, -20, -20, -20, -20, -10,
	20, 20, 0, 0, 0, 0, 20, 20,
	20, 30, 10, 0, 0, 10, 30, 20,
];

const PIECE_TABLES: Record<string, number[]> = {
	p: PAWN_TABLE,
	n: KNIGHT_TABLE,
	b: BISHOP_TABLE,
	r: ROOK_TABLE,
	q: QUEEN_TABLE,
	k: KING_MIDDLE_TABLE,
};

// Get the index for piece-square table lookup
function getSquareIndex(square: string, isWhite: boolean): number {
	const file = square.charCodeAt(0) - 97; // a=0, h=7
	const rank = parseInt(square[1]) - 1; // 1=0, 8=7
	const index = isWhite ? (7 - rank) * 8 + file : rank * 8 + file;
	return index;
}

// Evaluate board position
function evaluateBoard(chess: Chess): number {
	const board = chess.board();
	let score = 0;

	for (let row = 0; row < 8; row++) {
		for (let col = 0; col < 8; col++) {
			const piece = board[row][col];
			if (piece) {
				const isWhite = piece.color === 'w';
				const pieceValue = PIECE_VALUES[piece.type];
				const square = String.fromCharCode(97 + col) + (8 - row);
				const tableIndex = getSquareIndex(square, isWhite);
				const positionValue = PIECE_TABLES[piece.type]?.[tableIndex] || 0;

				const totalValue = pieceValue + positionValue;
				score += isWhite ? totalValue : -totalValue;
			}
		}
	}

	// Bonus for mobility
	const moves = chess.moves().length;
	const turn = chess.turn();
	score += turn === 'w' ? moves * 2 : -moves * 2;

	return score;
}

// Minimax with alpha-beta pruning
function minimax(
	chess: Chess,
	depth: number,
	alpha: number,
	beta: number,
	isMaximizing: boolean
): number {
	if (depth === 0 || chess.isGameOver()) {
		if (chess.isCheckmate()) {
			return isMaximizing ? -Infinity : Infinity;
		}
		if (chess.isDraw()) {
			return 0;
		}
		return evaluateBoard(chess);
	}

	const moves = chess.moves({ verbose: true });

	// Move ordering: prioritize captures, checks, and promotions
	moves.sort((a, b) => {
		let scoreA = 0;
		let scoreB = 0;
		if (a.captured) scoreA += PIECE_VALUES[a.captured];
		if (b.captured) scoreB += PIECE_VALUES[b.captured];
		if (a.promotion) scoreA += 800;
		if (b.promotion) scoreB += 800;
		return scoreB - scoreA;
	});

	if (isMaximizing) {
		let maxEval = -Infinity;
		for (const move of moves) {
			chess.move(move);
			const evaluation = minimax(chess, depth - 1, alpha, beta, false);
			chess.undo();
			maxEval = Math.max(maxEval, evaluation);
			alpha = Math.max(alpha, evaluation);
			if (beta <= alpha) break;
		}
		return maxEval;
	} else {
		let minEval = Infinity;
		for (const move of moves) {
			chess.move(move);
			const evaluation = minimax(chess, depth - 1, alpha, beta, true);
			chess.undo();
			minEval = Math.min(minEval, evaluation);
			beta = Math.min(beta, evaluation);
			if (beta <= alpha) break;
		}
		return minEval;
	}
}

// Get the best move for the AI
export function getBestMove(chess: Chess, level: BotLevel): Move | null {
	const moves = chess.moves({ verbose: true });
	if (moves.length === 0) return null;

	const isMaximizing = chess.turn() === 'w';

	// Beginner: mostly random with occasional good moves
	if (level === 'beginner') {
		// 70% random, 30% slightly evaluated
		if (Math.random() < 0.7) {
			return moves[Math.floor(Math.random() * moves.length)];
		}
		// Simple 1-ply evaluation
		let bestMove = moves[0];
		let bestValue = isMaximizing ? -Infinity : Infinity;

		for (const move of moves) {
			chess.move(move);
			const value = evaluateBoard(chess);
			chess.undo();

			if (isMaximizing ? value > bestValue : value < bestValue) {
				bestValue = value;
				bestMove = move;
			}
		}
		return bestMove;
	}

	// For other levels, use minimax with appropriate depth
	const depths: Record<BotLevel, number> = {
		beginner: 1,
		easy: 2,
		intermediate: 3,
		advanced: 4,
		master: 5,
	};

	const depth = depths[level];
	let bestMove = moves[0];
	let bestValue = isMaximizing ? -Infinity : Infinity;

	// Add some randomness for lower levels
	const randomFactor: Record<BotLevel, number> = {
		beginner: 0.3,
		easy: 0.15,
		intermediate: 0.08,
		advanced: 0.03,
		master: 0,
	};

	// Evaluate moves with randomness factor
	const evaluatedMoves: { move: Move; value: number }[] = [];

	for (const move of moves) {
		chess.move(move);
		const value = minimax(chess, depth - 1, -Infinity, Infinity, !isMaximizing);
		chess.undo();
		
		// Add randomness to evaluation for lower levels
		const noise = (Math.random() - 0.5) * 100 * randomFactor[level];
		evaluatedMoves.push({ move, value: value + noise });
	}

	// Sort and pick the best
	evaluatedMoves.sort((a, b) => 
		isMaximizing ? b.value - a.value : a.value - b.value
	);

	bestMove = evaluatedMoves[0].move;
	bestValue = evaluatedMoves[0].value;

	// For lower levels, sometimes pick a suboptimal move
	if (level !== 'master' && Math.random() < randomFactor[level]) {
		const topMoves = evaluatedMoves.slice(0, Math.min(3, evaluatedMoves.length));
		bestMove = topMoves[Math.floor(Math.random() * topMoves.length)].move;
	}

	return bestMove;
}

// Calculate move asynchronously to avoid blocking UI
export function calculateBotMove(
	fen: string,
	level: BotLevel
): Promise<Move | null> {
	return new Promise((resolve) => {
		// Small delay to make it feel more natural
		const thinkingTime = {
			beginner: 300,
			easy: 500,
			intermediate: 800,
			advanced: 1200,
			master: 1500,
		};

		const delay = thinkingTime[level] + Math.random() * 500;

		setTimeout(() => {
			const chess = new Chess(fen);
			const move = getBestMove(chess, level);
			resolve(move);
		}, delay);
	});
}

