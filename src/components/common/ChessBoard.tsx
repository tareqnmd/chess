import type { BoardSettings } from '@/components/common/types';
import { Chess, Square } from 'chess.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { toast } from 'sonner';

type PieceDataType = {
	pieceType: string;
};

type DraggingPieceDataType = {
	isSparePiece: boolean;
	position: string;
	pieceType: string;
};

type SquareHandlerArgs = {
	piece: PieceDataType | null;
	square: string;
};

type PieceHandlerArgs = {
	isSparePiece: boolean;
	piece: PieceDataType;
	square: string | null;
};

type PieceDropHandlerArgs = {
	piece: DraggingPieceDataType;
	sourceSquare: string;
	targetSquare: string | null;
};

type BoardMode = 'game' | 'analysis';

interface ChessBoardProps {
	fen: string;
	mode: BoardMode;
	disabled?: boolean;
	settings?: BoardSettings;

	playerColor?: 'w' | 'b';
	onMove?: (from: string, to: string, promotion?: string) => boolean;
	isPlayerTurn?: boolean;
	botName?: string;

	onFenChange?: (fen: string) => void;
	bestMove?: string;
	isAnalyzing?: boolean;

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

	const boardOrientation =
		customOrientation || (playerColor === 'b' ? 'black' : 'white');

	const canInteract =
		mode === 'analysis' ? !disabled : !disabled && isPlayerTurn;

	const highlightColor =
		mode === 'game' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)';

	const moveIndicatorColor =
		mode === 'game' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)';

	const captureIndicatorColor = 'rgba(239, 68, 68, 0.4)';

	const darkSquareColor =
		settings?.boardTheme.dark || (mode === 'game' ? '#334155' : '#475569');
	const lightSquareColor =
		settings?.boardTheme.light || (mode === 'game' ? '#94a3b8' : '#cbd5e1');
	const pieceTheme = settings?.pieceTheme;
	const showCoordinates = settings?.showCoordinates ?? true;
	const animationDuration = settings?.animationDuration ?? 200;

	const getMoveOptions = useCallback(
		(square: Square) => {
			const moves = chess.moves({ square, verbose: true });

			if (moves.length === 0) {
				setOptionSquares({});
				return false;
			}

			const newSquares: Record<string, React.CSSProperties> = {};
			for (const move of moves) {
				const isCapture =
					chess.get(move.to as Square) &&
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

	useEffect(() => {
		setTimeout(() => {
			setSelectedSquare('');
			setOptionSquares({});
		}, 0);
	}, [fen]);

	const onSquareClick = useCallback(
		({ square }: SquareHandlerArgs) => {
			if (!canInteract) return;

			if (showRightClickAnnotations && mode === 'game') {
				setRightClickedSquares({});
			}

			const clickedPiece = chess.get(square as Square);

			if (mode === 'game') {
				if (!playerColor || !onMove) return;

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

				if (selectedSquare) {
					const moves = chess.moves({
						square: selectedSquare as Square,
						verbose: true,
					});
					const foundMove = moves.find(
						(m) => m.from === selectedSquare && m.to === square
					);

					if (foundMove) {
						const isPromotion =
							(foundMove.color === 'w' &&
								foundMove.piece === 'p' &&
								square[1] === '8') ||
							(foundMove.color === 'b' &&
								foundMove.piece === 'p' &&
								square[1] === '1');

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

					if (clickedPiece && clickedPiece.color === playerColor) {
						const hasMoves = getMoveOptions(square as Square);
						setSelectedSquare(hasMoves ? square : '');
					} else {
						setSelectedSquare('');
						setOptionSquares({});
					}
				}
			} else {
				if (!onFenChange) return;

				if (!selectedSquare) {
					if (clickedPiece) {
						const hasMoves = getMoveOptions(square as Square);
						if (hasMoves) setSelectedSquare(square);
					}
					return;
				}

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
					return false;
				}

				setSelectedSquare('');
				setOptionSquares({});

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

	const onPieceDrop = useCallback(
		({ piece, sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
			if (!targetSquare || !canInteract) return false;

			const pieceType = piece.pieceType;

			if (mode === 'game') {
				if (!playerColor || !onMove) return false;

				const pieceColor = pieceType[0] === 'w' ? 'w' : 'b';
				if (pieceColor !== playerColor) {
					return false;
				}

				const moves = chess.moves({
					square: sourceSquare as Square,
					verbose: true,
				});
				const validMove = moves.find((m) => m.to === targetSquare);

				if (!validMove) {
					setOptionSquares({});
					setSelectedSquare('');
					toast.error('Invalid move');
					return false;
				}

				const isPawn = pieceType[1].toLowerCase() === 'p';
				const isPromotion =
					isPawn &&
					((pieceColor === 'w' && targetSquare[1] === '8') ||
						(pieceColor === 'b' && targetSquare[1] === '1'));

				const success = onMove(
					sourceSquare,
					targetSquare,
					isPromotion ? 'q' : undefined
				);

				setOptionSquares({});
				setSelectedSquare('');

				return success;
			} else {
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
					toast.error('Invalid move');
					return false;
				} catch {
					toast.error('Invalid move');
					return false;
				}
			}
			return false;
		},
		[canInteract, mode, playerColor, onMove, onFenChange, chess, fen]
	);

	const onSquareRightClick = useCallback(
		({ square }: SquareHandlerArgs) => {
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

	const canDragPiece = useCallback(
		({ piece }: PieceHandlerArgs): boolean => {
			if (!canInteract) return false;

			if (mode === 'analysis') return true;

			if (!playerColor) return false;
			const pieceColor = piece.pieceType[0] === 'w' ? 'w' : 'b';
			return pieceColor === playerColor;
		},
		[canInteract, mode, playerColor]
	);

	const onPieceDrag = useCallback(
		({ piece, square }: PieceHandlerArgs) => {
			if (!canInteract) return;

			if (mode === 'analysis') {
				getMoveOptions(square as Square);
				return;
			}

			if (!playerColor) return;
			const pieceColor = piece.pieceType[0] === 'w' ? 'w' : 'b';
			if (pieceColor === playerColor) {
				getMoveOptions(square as Square);
			}
		},
		[canInteract, mode, playerColor, getMoveOptions]
	);

	const bestMoveSquares = useMemo(() => {
		if (mode !== 'analysis' || !bestMove || bestMove.length < 4) return {};
		const from = bestMove.substring(0, 2);
		const to = bestMove.substring(2, 4);
		return {
			[from]: { backgroundColor: 'rgba(34, 197, 94, 0.5)' },
			[to]: { backgroundColor: 'rgba(34, 197, 94, 0.3)' },
		};
	}, [mode, bestMove]);

	const checkSquare = useMemo(() => {
		if (!chess.inCheck()) return {};

		const turn = chess.turn();
		const kingSquare = chess
			.board()
			.flat()
			.findIndex(
				(piece) => piece && piece.type === 'k' && piece.color === turn
			);

		if (kingSquare === -1) return {};

		const file = String.fromCharCode(97 + (kingSquare % 8));
		const rank = 8 - Math.floor(kingSquare / 8);
		const square = `${file}${rank}`;

		return {
			[square]: {
				backgroundColor: 'rgba(239, 68, 68, 0.8)',
				boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
			},
		};
	}, [chess]);

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
			showNotation: showCoordinates,
			squareStyles: {
				...optionSquares,
				...(mode === 'game' ? rightClickedSquares : bestMoveSquares),
				...checkSquare,
			},
			darkSquareStyle: { backgroundColor: darkSquareColor },
			lightSquareStyle: { backgroundColor: lightSquareColor },
			darkSquareNotationStyle: {
				color: 'rgba(255, 255, 255, 0.9)',
				fontWeight: '600',
			},
			lightSquareNotationStyle: {
				color: 'rgba(0, 0, 0, 0.8)',
				fontWeight: '600',
			},
			boardStyle: {
				borderRadius: '8px',
				boxShadow:
					'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
			},
			animationDurationInMs: animationDuration,
			...(pieceTheme && { pieceTheme }),
			...(showCoordinates !== undefined && {
				showBoardNotation: showCoordinates,
			}),
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
			checkSquare,
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
			{}
			<Chessboard options={chessboardOptions} />

			{}
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

			{}
			{isAnalyzing && mode === 'analysis' && (
				<div
					className="absolute top-4 right-4 flex items-center gap-2 bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-lg"
					role="status"
					aria-live="polite"
				>
					<div
						className="w-2 h-2 bg-white rounded-full animate-pulse"
						aria-hidden="true"
					/>
					<span className="text-sm text-white font-medium">Analyzing...</span>
				</div>
			)}
		</div>
	);
};

export default ChessBoard;
