import { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import AnalysisBoard from './AnalysisBoard';
import AnalysisPanel from './AnalysisPanel';
import { useAnalysis } from '../game/hooks/useAnalysis';
import { gameService } from '@/lib/game-service';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

interface AnalysisPageProps {
	importedPgn?: string;
	importedFen?: string;
}

const AnalysisPage = ({ importedPgn, importedFen }: AnalysisPageProps) => {
	const [fen, setFen] = useState(importedFen || INITIAL_FEN);
	const [fenInput, setFenInput] = useState(importedFen || INITIAL_FEN);
	const [pgnInput, setPgnInput] = useState(importedPgn || '');
	const [moveList, setMoveList] = useState<string[]>([]);
	const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
	const [showPgnInput, setShowPgnInput] = useState(false);
	const [pgnError, setPgnError] = useState<string | null>(null);

	const {
		analysisState,
		savedAnalyses,
		analyzePosition,
		stopAnalysis,
		saveCurrentAnalysis,
		removeSavedAnalysis,
	} = useAnalysis();

	// Load imported PGN on mount
	useEffect(() => {
		if (importedPgn) {
			handleLoadPgn(importedPgn);
		} else if (importedFen) {
			setFen(importedFen);
			setFenInput(importedFen);
		}
	}, [importedPgn, importedFen]);

	// Handle move made on the board (via drag-drop or click)
	const handleFenChange = useCallback((newFen: string) => {
		// Try to detect what move was made by comparing positions
		try {
			const oldChess = new Chess(fen);
			new Chess(newFen);
			
			// Find the move by trying all legal moves from old position
			const legalMoves = oldChess.moves({ verbose: true });
			let foundMove: string | null = null;
			
			for (const move of legalMoves) {
				const testChess = new Chess(fen);
				testChess.move(move.san);
				if (testChess.fen() === newFen) {
					foundMove = move.san;
					break;
				}
			}
			
			if (foundMove) {
				// A legal move was made - add it to the move list
				// If we're in the middle of a game, truncate future moves and add the new one
				const newMoveList = [...moveList.slice(0, currentMoveIndex + 1), foundMove];
				setMoveList(newMoveList);
				setCurrentMoveIndex(newMoveList.length - 1);
				setFen(newFen);
				setFenInput(newFen);
				return;
			}
		} catch {
			// If anything fails, just set the new FEN
		}
		
		// Fallback: just update FEN and clear move list (e.g., if position was set up manually)
		setFen(newFen);
		setFenInput(newFen);
		setMoveList([]);
		setCurrentMoveIndex(-1);
	}, [fen, moveList, currentMoveIndex]);

	const handleLoadPgn = useCallback((pgn: string) => {
		setPgnError(null);
		
		const result = gameService.parsePgn(pgn);
		if (!result) {
			setPgnError('Invalid PGN format');
			return false;
		}

		setPgnInput(pgn);
		setMoveList(result.moves);
		setCurrentMoveIndex(result.moves.length - 1);
		setFen(result.fen);
		setFenInput(result.fen);
		setShowPgnInput(false);
		return true;
	}, []);

	const handlePgnSubmit = useCallback(() => {
		handleLoadPgn(pgnInput);
	}, [pgnInput, handleLoadPgn]);

	const goToMove = useCallback((index: number) => {
		if (index < -1 || index >= moveList.length) return;

		const chess = new Chess();
		for (let i = 0; i <= index; i++) {
			chess.move(moveList[i]);
		}
		
		const newFen = chess.fen();
		setCurrentMoveIndex(index);
		setFen(newFen);
		setFenInput(newFen);
	}, [moveList]);

	const goToStart = useCallback(() => goToMove(-1), [goToMove]);
	const goToPrevMove = useCallback(() => goToMove(currentMoveIndex - 1), [goToMove, currentMoveIndex]);
	const goToNextMove = useCallback(() => goToMove(currentMoveIndex + 1), [goToMove, currentMoveIndex]);
	const goToEnd = useCallback(() => goToMove(moveList.length - 1), [goToMove, moveList.length]);

	const handleFenInputSubmit = useCallback(() => {
		const validation = gameService.validateFen(fenInput);
		if (validation.valid) {
			setFen(fenInput);
			// Clear move list when FEN is manually changed
			setMoveList([]);
			setCurrentMoveIndex(-1);
		} else {
			// Invalid FEN, reset input
			setFenInput(fen);
		}
	}, [fenInput, fen]);

	const handleAnalyze = useCallback(() => {
		analyzePosition(fen, 18);
	}, [analyzePosition, fen]);

	const handleSave = useCallback(() => {
		saveCurrentAnalysis();
	}, [saveCurrentAnalysis]);

	const handleLoadAnalysis = useCallback((loadFen: string) => {
		setFen(loadFen);
		setFenInput(loadFen);
	}, []);

	const handleReset = useCallback(() => {
		setFen(INITIAL_FEN);
		setFenInput(INITIAL_FEN);
		setPgnInput('');
		setMoveList([]);
		setCurrentMoveIndex(-1);
		setPgnError(null);
	}, []);

	return (
		<div className="grid md:grid-cols-[minmax(300px,600px)_minmax(300px,400px)] gap-8 items-start justify-center">
			<div className="flex flex-col gap-4">
				<AnalysisBoard
					fen={fen}
					onFenChange={handleFenChange}
					analysis={analysisState.currentAnalysis}
					isAnalyzing={analysisState.isAnalyzing}
				/>
				{moveList.length > 0 && (
					<div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
						<div className="flex items-center justify-between mb-3">
							<span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
								Move {currentMoveIndex + 1} / {moveList.length}
							</span>
							<div className="flex gap-1">
								<button
									onClick={goToStart}
									disabled={currentMoveIndex === -1}
									className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
									title="Go to start"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
									</svg>
								</button>
								<button
									onClick={goToPrevMove}
									disabled={currentMoveIndex === -1}
									className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
									title="Previous move"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
									</svg>
								</button>
								<button
									onClick={goToNextMove}
									disabled={currentMoveIndex === moveList.length - 1}
									className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
									title="Next move"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</button>
								<button
									onClick={goToEnd}
									disabled={currentMoveIndex === moveList.length - 1}
									className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
									title="Go to end"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
									</svg>
								</button>
							</div>
						</div>
						<div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-slate-900/50 rounded-lg">
							{moveList.map((move, index) => (
								<button
									key={index}
									onClick={() => goToMove(index)}
									className={`px-2 py-1 text-xs font-mono rounded transition-all ${
										index === currentMoveIndex
											? 'bg-emerald-600/40 text-emerald-300 border border-emerald-500/50'
											: 'bg-slate-700/30 text-slate-400 hover:bg-slate-600/40 hover:text-slate-300'
									}`}
								>
									{index % 2 === 0 && (
										<span className="text-slate-500 mr-1">{Math.floor(index / 2) + 1}.</span>
									)}
									{move}
								</button>
							))}
						</div>
					</div>
				)}
				<div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
					<button
						onClick={() => setShowPgnInput(!showPgnInput)}
						className="flex items-center justify-between w-full text-sm font-medium text-slate-400 uppercase tracking-wider"
					>
						<span>Import PGN</span>
						<svg
							className={`w-4 h-4 transition-transform ${showPgnInput ? 'rotate-180' : ''}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					
					{showPgnInput && (
						<div className="mt-3 flex flex-col gap-2">
							<textarea
								value={pgnInput}
								onChange={(e) => setPgnInput(e.target.value)}
								placeholder="Paste PGN here...&#10;&#10;Example:&#10;1. e4 e5 2. Nf3 Nc6 3. Bb5 a6"
								className="w-full h-32 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
							/>
							{pgnError && (
								<p className="text-red-400 text-sm">{pgnError}</p>
							)}
							<button
								onClick={handlePgnSubmit}
								className="w-full py-2 px-4 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-400 text-sm rounded-lg border border-emerald-600/40 transition-all"
							>
								Load PGN
							</button>
						</div>
					)}
				</div>
				<div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
					<label className="text-sm font-medium text-slate-400 uppercase tracking-wider block mb-2">
						Position (FEN)
					</label>
					<div className="flex gap-2">
						<input
							type="text"
							value={fenInput}
							onChange={(e) => setFenInput(e.target.value)}
							onBlur={handleFenInputSubmit}
							onKeyDown={(e) => e.key === 'Enter' && handleFenInputSubmit()}
							className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
							placeholder="Enter FEN..."
						/>
						<button
							onClick={handleReset}
							className="px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg border border-slate-600/50 transition-all"
							title="Reset to starting position"
						>
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						</button>
					</div>
				</div>
			</div>
			<AnalysisPanel
				analysis={analysisState.currentAnalysis}
				isAnalyzing={analysisState.isAnalyzing}
				onAnalyze={handleAnalyze}
				onStop={stopAnalysis}
				onSave={handleSave}
				savedAnalyses={savedAnalyses}
				onLoadAnalysis={handleLoadAnalysis}
				onDeleteAnalysis={removeSavedAnalysis}
			/>
		</div>
	);
};

export default AnalysisPage;

