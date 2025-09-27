import { Chess } from 'chess.js';

export const gameStatus = (fen: string) => {
	try {
		const chess = new Chess(fen);
		const isInCheck = chess.inCheck();
		const isDraw = chess.isDraw();
		const isDrawByFiftyMoves = chess.isDrawByFiftyMoves();
		const isInsufficientMaterial = chess.isInsufficientMaterial();
		const isGameOver = chess.isGameOver();
		const isStalemate = chess.isStalemate();
		const isThreefoldRepetition = chess.isThreefoldRepetition();
		return {
			isInCheck,
			isDraw,
			isDrawByFiftyMoves,
			isInsufficientMaterial,
			isGameOver,
			isStalemate,
			isThreefoldRepetition,
		};
	} catch (error) {
		throw new Error('Invalid FEN');
	}
};
