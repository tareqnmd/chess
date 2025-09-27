'use client';
import { Chess } from 'chess.js';
import { useState } from 'react';
import GameChessBoard from '../GameChessBoard';
import useStockFishGameData from '../hooks/useStockFishGameData';

const GameBoard = () => {
	const [game] = useState<Chess>(new Chess());
	const fen = game.fen();
	const { isReady, evaluation } = useStockFishGameData(fen);
	console.log(isReady, evaluation);

	return <GameChessBoard />;
};

export default GameBoard;
