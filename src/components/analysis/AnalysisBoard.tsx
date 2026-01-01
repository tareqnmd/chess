import type { PositionAnalysis } from '@/types/chess';
import { Chess, Square } from 'chess.js';
import { useCallback, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';

interface AnalysisBoardProps {
	fen: string;
	onFenChange: (fen: string) => void;
	analysis: PositionAnalysis | null;
	isAnalyzing: boolean;
}

const AnalysisBoard = ({
	fen,
	onFenChange,
	analysis,
	isAnalyzing,
}: AnalysisBoardProps) => {
	const [selectedSquare, setSelectedSquare] = useState<string>('');
	const [optionSquares, setOptionSquares] = useState<
		Record<string, React.CSSProperties>
	>({});

	const chess = useMemo(() => new Chess(fen), [fen]);

	const getMoveOptions = useCallback(
		(square: Square) => {
			const moves = chess.moves({ square, verbose: true });
			if (moves.length === 0) {
				setOptionSquares({});
				return false;
			}

			const newSquares: Record<string, React.CSSProperties> = {};
			for (const move of moves) {
				newSquares[move.to] = {
					background: chess.get(move.to as Square)
						? 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 85%, transparent 85%)'
						: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 25%, transparent 25%)',
					borderRadius: '50%',
				};
			}
			newSquares[square] = {
				background: 'rgba(59, 130, 246, 0.3)',
			};
			setOptionSquares(newSquares);
			return true;
		},
		[chess]
	);

	const onSquareClick = useCallback(
		({ square }: { square: string; piece?: string }) => {
			const clickedPiece = chess.get(square as Square);

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
		},
		[chess, fen, selectedSquare, getMoveOptions, onFenChange]
	);

	const onPieceDrop = useCallback(
		({
			sourceSquare,
			targetSquare,
		}: {
			piece: string;
			sourceSquare: string;
			targetSquare: string | null;
		}): boolean => {
			if (!targetSquare) return false;

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
		},
		[fen, onFenChange]
	);

	const onPieceDrag = useCallback(
		({ square }: { isSparePiece: boolean; piece: string; square: string }) => {
			getMoveOptions(square as Square);
		},
		[getMoveOptions]
	);

	// Allow all pieces to be dragged in analysis mode
	const canDragPiece = useCallback((): boolean => {
		return true;
	}, []);

	// Highlight best move if available
	const bestMoveSquares = useMemo(() => {
		if (!analysis?.bestMove || analysis.bestMove.length < 4) return {};
		const from = analysis.bestMove.substring(0, 2);
		const to = analysis.bestMove.substring(2, 4);
		return {
			[from]: { backgroundColor: 'rgba(34, 197, 94, 0.5)' },
			[to]: { backgroundColor: 'rgba(34, 197, 94, 0.3)' },
		};
	}, [analysis?.bestMove]);

	const chessboardOptions = useMemo(
		() => ({
			id: 'AnalysisBoard',
			position: fen,
			onSquareClick,
			onPieceDrop,
			onPieceDrag,
			canDragPiece,
			allowDragging: true,
			squareStyles: {
				...optionSquares,
				...bestMoveSquares,
			},
			darkSquareStyle: { backgroundColor: '#475569' },
			lightSquareStyle: { backgroundColor: '#cbd5e1' },
			boardStyle: {
				borderRadius: '8px',
				boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
			},
			animationDurationInMs: 200,
		}),
		[
			fen,
			onSquareClick,
			onPieceDrop,
			onPieceDrag,
			canDragPiece,
			optionSquares,
			bestMoveSquares,
		]
	);

	return (
		<div className="relative" role="region" aria-label="Chess analysis board">
			{/* @ts-expect-error react-chessboard type mismatch */}
			<Chessboard options={chessboardOptions} />

			{isAnalyzing && (
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

export default AnalysisBoard;
