import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import type { GameState } from '@/types/chess';

interface GameBoardProps {
	gameState: GameState;
	onMove: (from: string, to: string, promotion?: string) => boolean;
	isPlayerTurn: boolean;
	disabled?: boolean;
}

const GameBoard = ({ gameState, onMove, isPlayerTurn, disabled = false }: GameBoardProps) => {
	const [moveFrom, setMoveFrom] = useState<string>('');
	const [optionSquares, setOptionSquares] = useState<Record<string, React.CSSProperties>>({});
	const [rightClickedSquares, setRightClickedSquares] = useState<Record<string, React.CSSProperties>>({});

	const boardOrientation = gameState.settings?.playerColor === 'b' ? 'black' : 'white';
	const isGameOver = gameState.status !== 'playing' && gameState.status !== 'idle';
	const canInteract = !disabled && !isGameOver && isPlayerTurn && gameState.status === 'playing';

	// Get legal moves for a square
	const getMoveOptions = useCallback((square: Square) => {
		const chess = new Chess(gameState.fen);
		const moves = chess.moves({ square, verbose: true });

		if (moves.length === 0) {
			setOptionSquares({});
			return false;
		}

		const newSquares: Record<string, React.CSSProperties> = {};
		for (const move of moves) {
			newSquares[move.to] = {
				background:
					chess.get(move.to as Square) &&
					chess.get(move.to as Square)?.color !== chess.get(square)?.color
						? 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 85%, transparent 85%)'
						: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 25%, transparent 25%)',
				borderRadius: '50%',
			};
		}
		newSquares[square] = {
			background: 'rgba(16, 185, 129, 0.3)',
		};
		setOptionSquares(newSquares);
		return true;
	}, [gameState.fen]);

	// Reset selection when turn changes
	useEffect(() => {
		setMoveFrom('');
		setOptionSquares({});
	}, [gameState.fen]);

	// Handle square click (v5 API: receives { square, piece } object)
	const onSquareClick = useCallback(({ square, piece }: { square: string; piece?: string }) => {
		if (!canInteract || !gameState.settings) return;

		setRightClickedSquares({});

		const chess = new Chess(gameState.fen);
		const clickedPiece = chess.get(square as Square);

		// If no piece selected yet and clicking on own piece, show moves
		if (!moveFrom && clickedPiece && clickedPiece.color === gameState.settings.playerColor) {
			const hasMoves = getMoveOptions(square as Square);
			if (hasMoves) {
				setMoveFrom(square);
			}
			return;
		}

		// If we have a piece selected, try to move
		if (moveFrom) {
			const moves = chess.moves({ square: moveFrom as Square, verbose: true });
			const foundMove = moves.find((m) => m.from === moveFrom && m.to === square);

			if (foundMove) {
				// Check for promotion
				const isPromotion =
					(foundMove.color === 'w' && foundMove.piece === 'p' && square[1] === '8') ||
					(foundMove.color === 'b' && foundMove.piece === 'p' && square[1] === '1');

				// Make the move
				const success = onMove(moveFrom, square, isPromotion ? 'q' : undefined);
				if (success) {
					setMoveFrom('');
					setOptionSquares({});
					return;
				}
			}

			// Invalid move or clicking on another own piece
			if (clickedPiece && clickedPiece.color === gameState.settings.playerColor) {
				const hasMoves = getMoveOptions(square as Square);
				setMoveFrom(hasMoves ? square : '');
			} else {
				setMoveFrom('');
				setOptionSquares({});
			}
		}
	}, [canInteract, gameState.settings, gameState.fen, moveFrom, getMoveOptions, onMove]);

	// Handle piece drop (v5 API: receives { piece, sourceSquare, targetSquare } object)
	const onPieceDrop = useCallback(({ piece, sourceSquare, targetSquare }: { 
		piece: string; 
		sourceSquare: string; 
		targetSquare: string | null;
	}): boolean => {
		// If dropped off board, reject
		if (!targetSquare) return false;
		
		if (!canInteract || !gameState.settings) return false;

		// Validate it's player's piece
		const pieceColor = piece[0] === 'w' ? 'w' : 'b';
		if (pieceColor !== gameState.settings.playerColor) {
			return false;
		}

		// Validate the move with chess.js
		const chess = new Chess(gameState.fen);
		const moves = chess.moves({ square: sourceSquare as Square, verbose: true });
		const validMove = moves.find(m => m.to === targetSquare);

		if (!validMove) {
			setOptionSquares({});
			setMoveFrom('');
			return false;
		}

		// Check for promotion
		const isPawn = piece[1].toLowerCase() === 'p';
		const isPromotion =
			isPawn &&
			((pieceColor === 'w' && targetSquare[1] === '8') ||
				(pieceColor === 'b' && targetSquare[1] === '1'));

		// Make the move
		const success = onMove(sourceSquare, targetSquare, isPromotion ? 'q' : undefined);
		
		setOptionSquares({});
		setMoveFrom('');
		
		return success;
	}, [canInteract, gameState.settings, gameState.fen, onMove]);

	// Handle right click for annotations
	const onSquareRightClick = useCallback(({ square }: { square: string; piece?: string }) => {
		const color = 'rgba(239, 68, 68, 0.5)';
		setRightClickedSquares(prev => ({
			...prev,
			[square]: prev[square] ? {} : { backgroundColor: color },
		}));
	}, []);

	// Check if piece can be dragged (v5 API)
	const canDragPiece = useCallback(({ piece, square }: { isSparePiece: boolean; piece: string; square: string }): boolean => {
		if (!canInteract || !gameState.settings) return false;
		const pieceColor = piece[0] === 'w' ? 'w' : 'b';
		return pieceColor === gameState.settings.playerColor;
	}, [canInteract, gameState.settings]);

	// When drag starts, show move options
	const onPieceDrag = useCallback(({ piece, square }: { isSparePiece: boolean; piece: string; square: string }) => {
		if (!canInteract || !gameState.settings) return;
		const pieceColor = piece[0] === 'w' ? 'w' : 'b';
		if (pieceColor === gameState.settings.playerColor) {
			getMoveOptions(square as Square);
		}
	}, [canInteract, gameState.settings, getMoveOptions]);

	// Chessboard options (v5 API)
	const chessboardOptions = useMemo(() => ({
		id: 'PlayVsBot',
		position: gameState.fen,
		boardOrientation: boardOrientation as 'white' | 'black',
		onSquareClick,
		onPieceDrop,
		onSquareRightClick,
		canDragPiece,
		onPieceDrag,
		allowDragging: canInteract,
		squareStyles: {
			...optionSquares,
			...rightClickedSquares,
		},
		darkSquareStyle: { backgroundColor: '#334155' },
		lightSquareStyle: { backgroundColor: '#94a3b8' },
		boardStyle: {
			borderRadius: '8px',
			boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
		},
		animationDurationInMs: 200,
	}), [
		gameState.fen,
		boardOrientation,
		onSquareClick,
		onPieceDrop,
		onSquareRightClick,
		canDragPiece,
		onPieceDrag,
		canInteract,
		optionSquares,
		rightClickedSquares,
	]);

	return (
		<div className="relative">
			<Chessboard options={chessboardOptions} />
			
			{/* Thinking indicator */}
			{gameState.status === 'playing' && !isPlayerTurn && (
				<div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700">
					<div className="flex gap-1">
						<span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
						<span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
						<span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
					</div>
					<span className="text-sm text-slate-300">
						{gameState.settings?.bot.name} is thinking...
					</span>
				</div>
			)}
		</div>
	);
};

export default GameBoard;

