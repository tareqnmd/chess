import type {
	AnalysisState,
	PositionAnalysis,
} from '@/components/analysis/types';
import { getEngine } from '@/lib/stockfish-engine';
import {
	deleteAnalysis,
	getSavedAnalyses,
	saveAnalysis,
	type SavedAnalysis,
} from '@/lib/storage';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAnalysisReturn {
	analysisState: AnalysisState;
	savedAnalyses: SavedAnalysis[];
	analyzePosition: (fen: string, depth?: number) => Promise<void>;
	stopAnalysis: () => void;
	saveCurrentAnalysis: (notes?: string) => Promise<SavedAnalysis | null>;
	loadSavedAnalyses: () => void;
	removeSavedAnalysis: (id: string) => void;
	clearAnalysis: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
	const [analysisState, setAnalysisState] = useState<AnalysisState>({
		isAnalyzing: false,
		currentAnalysis: null,
		history: [],
	});

	const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
	const isAnalyzingRef = useRef(false);

	useEffect(() => {
		(async () => {
			setSavedAnalyses(await getSavedAnalyses());
		})();
	}, []);

	useEffect(() => {
		return () => {
			if (isAnalyzingRef.current) {
				getEngine().stop();
			}
		};
	}, []);

	const analyzePosition = useCallback(async (fen: string, depth = 18) => {
		if (isAnalyzingRef.current) {
			getEngine().stop();
		}

		isAnalyzingRef.current = true;
		setAnalysisState((prev) => ({
			...prev,
			isAnalyzing: true,
		}));

		try {
			const engine = getEngine();
			await engine.waitReady();

			const cleanup = engine.onMessage((data) => {
				if (data.depth && data.depth > 0) {
					const isWhiteTurn = fen.split(' ')[1] === 'w';
					let evaluation = data.positionEvaluation
						? parseInt(data.positionEvaluation) / 100
						: 0;

					if (!isWhiteTurn) {
						evaluation = -evaluation;
					}

					const mate = data.possibleMate ? parseInt(data.possibleMate) : null;

					setAnalysisState((prev) => ({
						...prev,
						currentAnalysis: {
							fen,
							evaluation,
							mate: mate ? (isWhiteTurn ? mate : -mate) : null,
							bestMove: data.bestMove || null,
							bestLine: data.pv || null,
							depth: data.depth || 0,
						},
					}));
				}
			});

			const bestMove = await engine.findBestMove(fen, { depth });

			cleanup();

			setAnalysisState((prev) => {
				const finalAnalysis: PositionAnalysis = prev.currentAnalysis || {
					fen,
					evaluation: 0,
					mate: null,
					bestMove,
					bestLine: null,
					depth,
				};

				return {
					isAnalyzing: false,
					currentAnalysis: { ...finalAnalysis, bestMove },
					history: [finalAnalysis, ...prev.history].slice(0, 20),
				};
			});
		} catch (error) {
			console.error('Analysis error:', error);
			setAnalysisState((prev) => ({
				...prev,
				isAnalyzing: false,
			}));
		} finally {
			isAnalyzingRef.current = false;
		}
	}, []);

	const stopAnalysis = useCallback(() => {
		if (isAnalyzingRef.current) {
			getEngine().stop();
			isAnalyzingRef.current = false;
			setAnalysisState((prev) => ({
				...prev,
				isAnalyzing: false,
			}));
		}
	}, []);

	const saveCurrentAnalysis = useCallback(
		async (notes = ''): Promise<SavedAnalysis | null> => {
			const { currentAnalysis } = analysisState;
			if (!currentAnalysis) return null;

			const saved = await saveAnalysis({
				fen: currentAnalysis.fen,
				evaluation: currentAnalysis.evaluation,
				bestMove: currentAnalysis.bestMove,
				bestLine: currentAnalysis.bestLine,
				depth: currentAnalysis.depth,
				notes,
			});

			setSavedAnalyses(await getSavedAnalyses());
			return saved;
		},
		[analysisState]
	);

	const loadSavedAnalyses = useCallback(async () => {
		setSavedAnalyses(await getSavedAnalyses());
	}, []);

	const removeSavedAnalysis = useCallback((id: string) => {
		deleteAnalysis(id);
		setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
	}, []);

	const clearAnalysis = useCallback(() => {
		setAnalysisState({
			isAnalyzing: false,
			currentAnalysis: null,
			history: [],
		});
	}, []);

	return {
		analysisState,
		savedAnalyses,
		analyzePosition,
		stopAnalysis,
		saveCurrentAnalysis,
		loadSavedAnalyses,
		removeSavedAnalysis,
		clearAnalysis,
	};
}
