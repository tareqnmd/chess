import { Chess, Square } from 'chess.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import type { BoardSettings } from '@/types/board-settings';

type BoardMode = 'game' | 'analysis';

interface ChessBoardProps {
	// Common props
	fen: string;
	mode: BoardMode;
	disabled?: boolean;
	settings?: BoardSettings;

	// Game mode props
	playerColor?: 'w' | 'b';
	onMove?: (from: string, to: string, promotion?: string) => boolean;
	isPlayerTurn?: boolean;
	botName?: string;

	// Analysis mode props
	onFenChange?: (fen: string) => void;
	bestMove?: string;
	isAnalyzing?: boolean;

	// Optional customization
	boardOrientation?: 'white' | 'black';
	showRightClickAnnotations?: boolean;
}

const ChessBoard = ({
	fen,
	mode,
	disabled = false,
	settings,
	playerColor,
	onMove,
	isPlayerTurn = true,
	botName,
	onFenChange,
	bestMove,
	isAnalyzing = false,
	boardOrientation: customOrientation,
	showRightClickAnnotations = true,
}: ChessBoardProps) => {
	const [selectedSquare, setSelectedSquare] = useState<string>('');
	const [optionSquares, setOptionSquares] = useState<
		Record<string, React.CSSProperties>
	>({});
	const [rightClickedSquares, setRightClickedSquares] = useState<
		Record<string, React.CSSProperties>
	>({});

	const chess = useMemo(() => new Chess(fen), [fen]);

	// Determine board orientation
	const boardOrientation =
		customOrientation || (playerColor === 'b' ? 'black' : 'white');

	// Determine if user can interact
	const canInteract = mode === 'analysis' 
		? !disabled 
		: !disabled && isPlayerTurn;

	// Color scheme based on mode
	const highlightColor = mode === 'game' 
		? 'rgba(16, 185, 129, 0.3)' // emerald for game
		: 'rgba(59, 130, 246, 0.3)'; // blue for analysis

	const moveIndicatorColor = mode === 'game'
		? 'rgba(16, 185, 129, 0.4)'
		: 'rgba(59, 130, 246, 0.4)';

	const captureIndicatorColor = 'rgba(239, 68, 68, 0.4)';

	// Use settings or defaults
	const darkSquareColor = settings?.boardTheme.dark || (mode === 'game' ? '#334155' : '#475569');
	const lightSquareColor = settings?.boardTheme.light || (mode === 'game' ? '#94a3b8' : '#cbd5e1');
	const pieceTheme = settings?.pieceTheme;
	const showCoordinates = settings?.showCoordinates ?? true;
	const animationDuration = settings?.animationDuration ?? 200;

	// Get legal moves for a square
	const getMoveOptions = useCallback(
		(square: Square) => {
			const moves = chess.moves({ square, verbose: true });

			if (moves.length === 0) {
				setOptionSquares({});
				return false;
			}

			const newSquares: Record<string, React.CSSProperties> = {};
			for (const move of moves) {
				const isCapture = chess.get(move.to as Square) &&
					chess.get(move.to as Square)?.color !== chess.get(square)?.color;
				
				newSquares[move.to] = {
					background: isCapture
						? `radial-gradient(circle, ${captureIndicatorColor} 85%, transparent 85%)`
						: `radial-gradient(circle, ${moveIndicatorColor} 25%, transparent 25%)`,
					borderRadius: '50%',
				};
			}
			newSquares[square] = {
				background: highlightColor,
			};
			setOptionSquares(newSquares);
			return true;
		},
		[chess, highlightColor, moveIndicatorColor, captureIndicatorColor]
	);

	// Reset selection when position changes
	useEffect(() => {
		setSelectedSquare('');
		setOptionSquares({});
	}, [fen]);

	// Handle square click
	const onSquareClick = useCallback(
		({ square }: { square: string; piece?: string }) => {
			if (!canInteract) return;

			if (showRightClickAnnotations && mode === 'game') {
				setRightClickedSquares({});
			}

			const clickedPiece = chess.get(square as Square);

			// Game mode - only allow player's pieces
			if (mode === 'game') {
				if (!playerColor || !onMove) return;

				// If no piece selected yet and clicking on own piece, show moves
				if (
					!selectedSquare &&
					clickedPiece &&
					clickedPiece.color === playerColor
				) {
					const hasMoves = getMoveOptions(square as Square);
					if (hasMoves) {
						setSelectedSquare(square);
					}
					return;
				}

				// If we have a piece selected, try to move
				if (selectedSquare) {
					const moves = chess.moves({
						square: selectedSquare as Square,
						verbose: true,
					});
					const foundMove = moves.find(
						(m) => m.from === selectedSquare && m.to === square
					);

					if (foundMove) {
						// Check for promotion
						const isPromotion =
							(foundMove.color === 'w' &&
								foundMove.piece === 'p' &&
								square[1] === '8') ||
							(foundMove.color === 'b' &&
								foundMove.piece === 'p' &&
								square[1] === '1');

						// Make the move
						const success = onMove(
							selectedSquare,
							square,
							isPromotion ? 'q' : undefined
						);
						if (success) {
							setSelectedSquare('');
							setOptionSquares({});
							return;
						}
					}

					// Invalid move or clicking on another own piece
					if (clickedPiece && clickedPiece.color === playerColor) {
						const hasMoves = getMoveOptions(square as Square);
						setSelectedSquare(hasMoves ? square : '');
					} else {
						setSelectedSquare('');
						setOptionSquares({});
					}
				}
			}
			// Analysis mode - allow any piece
			else {
				if (!onFenChange) return;

				if (!selectedSquare) {
					if (clickedPiece) {
						const hasMoves = getMoveOptions(square as Square);
						if (hasMoves) setSelectedSquare(square);
					}
					return;
				}

				// Try to make move
				try {
					const newChess = new Chess(fen);
					const move = newChess.move({
						from: selectedSquare,
						to: square,
						promotion: 'q',
					});
					if (move) {
						onFenChange(newChess.fen());
					}
				} catch {
					// Invalid move
				}

				setSelectedSquare('');
				setOptionSquares({});

				// Select new piece if clicking on one
				if (clickedPiece) {
					const hasMoves = getMoveOptions(square as Square);
					if (hasMoves) setSelectedSquare(square);
				}
			}
		},
		[
			canInteract,
			mode,
			playerColor,
			onMove,
			onFenChange,
			selectedSquare,
			chess,
			fen,
			getMoveOptions,
			showRightClickAnnotations,
		]
	);

	// Handle piece drop
	const onPieceDrop = useCallback(
		({
			piece,
			sourceSquare,
			targetSquare,
		}: {
			piece: string;
			sourceSquare: string;
			targetSquare: string | null;
		}): boolean => {
			if (!targetSquare || !canInteract) return false;

			// Game mode - validate player's piece
			if (mode === 'game') {
				if (!playerColor || !onMove) return false;

				const pieceColor = piece[0] === 'w' ? 'w' : 'b';
				if (pieceColor !== playerColor) {
					return false;
				}

				// Validate the move with chess.js
				const moves = chess.moves({
					square: sourceSquare as Square,
					verbose: true,
				});
				const validMove = moves.find((m) => m.to === targetSquare);

				if (!validMove) {
					setOptionSquares({});
					setSelectedSquare('');
					return false;
				}

				// Check for promotion
				const isPawn = piece[1].toLowerCase() === 'p';
				const isPromotion =
					isPawn &&
					((pieceColor === 'w' && targetSquare[1] === '8') ||
						(pieceColor === 'b' && targetSquare[1] === '1'));

				// Make the move
				const success = onMove(
					sourceSquare,
					targetSquare,
					isPromotion ? 'q' : undefined
				);

				setOptionSquares({});
				setSelectedSquare('');

				return success;
			}
			// Analysis mode
			else {
				if (!onFenChange) return false;

				try {
					const newChess = new Chess(fen);
					const move = newChess.move({
						from: sourceSquare,
						to: targetSquare,
						promotion: 'q',
					});
					if (move) {
						onFenChange(newChess.fen());
						setOptionSquares({});
						setSelectedSquare('');
						return true;
					}
				} catch {
					// Invalid move
				}
				return false;
			}
		},
		[canInteract, mode, playerColor, onMove, onFenChange, chess, fen]
	);

	// Handle right click for annotations (game mode only)
	const onSquareRightClick = useCallback(
		({ square }: { square: string; piece?: string }) => {
			if (mode === 'game' && showRightClickAnnotations) {
				const color = 'rgba(239, 68, 68, 0.5)';
				setRightClickedSquares((prev) => ({
					...prev,
					[square]: prev[square] ? {} : { backgroundColor: color },
				}));
			}
		},
		[mode, showRightClickAnnotations]
	);

	// Check if piece can be dragged
	const canDragPiece = useCallback(
		({ piece }: { isSparePiece: boolean; piece: string; square: string }): boolean => {
			if (!canInteract) return false;
			
			if (mode === 'analysis') return true;
			
			if (!playerColor) return false;
			const pieceColor = piece[0] === 'w' ? 'w' : 'b';
			return pieceColor === playerColor;
		},
		[canInteract, mode, playerColor]
	);

	// When drag starts, show move options
	const onPieceDrag = useCallback(
		({ piece, square }: { isSparePiece: boolean; piece: string; square: string }) => {
			if (!canInteract) return;
			
			if (mode === 'analysis') {
				getMoveOptions(square as Square);
				return;
			}
			
			if (!playerColor) return;
			const pieceColor = piece[0] === 'w' ? 'w' : 'b';
			if (pieceColor === playerColor) {
				getMoveOptions(square as Square);
			}
		},
		[canInteract, mode, playerColor, getMoveOptions]
	);

	// Highlight best move in analysis mode
	const bestMoveSquares = useMemo(() => {
		if (mode !== 'analysis' || !bestMove || bestMove.length < 4) return {};
		const from = bestMove.substring(0, 2);
		const to = bestMove.substring(2, 4);
		return {
			[from]: { backgroundColor: 'rgba(34, 197, 94, 0.5)' },
			[to]: { backgroundColor: 'rgba(34, 197, 94, 0.3)' },
		};
	}, [mode, bestMove]);

	// Chessboard options
	const chessboardOptions = useMemo(
		() => ({
			id: mode === 'game' ? 'PlayVsBot' : 'AnalysisBoard',
			position: fen,
			boardOrientation,
			onSquareClick,
			onPieceDrop,
			onSquareRightClick,
			canDragPiece,
			onPieceDrag,
			allowDragging: canInteract,
			squareStyles: {
				...optionSquares,
				...(mode === 'game' ? rightClickedSquares : bestMoveSquares),
			},
			darkSquareStyle: { backgroundColor: darkSquareColor },
			lightSquareStyle: { backgroundColor: lightSquareColor },
			boardStyle: {
				borderRadius: '8px',
				boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
			},
			animationDurationInMs: animationDuration,
			...(pieceTheme && { pieceTheme }),
			...(showCoordinates !== undefined && { showBoardNotation: showCoordinates }),
		}),
		[
			mode,
			fen,
			boardOrientation,
			onSquareClick,
			onPieceDrop,
			onSquareRightClick,
			canDragPiece,
			onPieceDrag,
			canInteract,
			optionSquares,
			rightClickedSquares,
			bestMoveSquares,
			darkSquareColor,
			lightSquareColor,
			animationDuration,
			pieceTheme,
			showCoordinates,
		]
	);

	const ariaLabel = mode === 'game' ? 'Game board' : 'Chess analysis board';
	const showBotThinking = mode === 'game' && !isPlayerTurn && botName;

	return (
		<div className="relative" role="region" aria-label={ariaLabel}>
			{/* @ts-expect-error react-chessboard type mismatch */}
			<Chessboard options={chessboardOptions} />

			{/* Bot thinking indicator */}
			{showBotThinking && (
				<div
					className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700"
					role="status"
					aria-live="polite"
				>
					<div className="flex gap-1" aria-hidden="true">
						<span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
						<span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
						<span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
					</div>
					<span className="text-sm text-slate-300">
						{botName} is thinking...
					</span>
				</div>
			)}

			{/* Analyzing indicator */}
			{isAnalyzing && mode === 'analysis' && (
				<div
					className="absolute top-4 right-4 flex items-center gap-2 bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-lg"
					role="status"
					aria-live="polite"
				>
					<div className="w-2 h-2 bg-white rounded-full animate-pulse" aria-hidden="true" />
					<span className="text-sm text-white font-medium">Analyzing...</span>
				</div>
			)}
		</div>
	);
};

export default ChessBoard;

