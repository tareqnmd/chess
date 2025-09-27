'use client';
import { useEffect, useRef, useState } from 'react';
type EngineMessage = {
	uciMessage: string;
	bestMove?: string;
	ponder?: string;
	positionEvaluation?: string;
	possibleMate?: string;
	depth?: number;
};

type EngineData = {
	isReady: boolean;
	evaluation: {
		bestMove?: string;
		positionEvaluation?: string;
		possibleMate?: string;
		depth?: number;
	} | null;
};

const useStockFishGameData = (fen: string, depth: number = 12) => {
	const engineRef = useRef<any>(null);
	const [engineData, setEngineData] = useState<EngineData>({
		isReady: false,
		evaluation: null,
	});

	useEffect(() => {
		// Dynamically import engine
		import('../../../public/stockfish/engine').then((module) => {
			try {
				engineRef.current = new module.default();

				// Set up message handler
				engineRef.current.onMessage((messageData: EngineMessage) => {
					// Update ready state
					if (messageData.uciMessage === 'readyok') {
						setEngineData((prev) => ({ ...prev, isReady: true }));
					}

					// Update evaluation data
					if (
						messageData.bestMove ||
						messageData.positionEvaluation ||
						messageData.possibleMate
					) {
						setEngineData((prev) => ({
							...prev,
							evaluation: {
								bestMove: messageData.bestMove,
								positionEvaluation: messageData.positionEvaluation,
								possibleMate: messageData.possibleMate,
								depth: messageData.depth,
							},
						}));
					}
				});
			} catch (error) {
				console.error('Failed to initialize Stockfish engine:', error);
			}
		});

		// Cleanup function
		return () => {
			if (engineRef.current) {
				engineRef.current.terminate();
				engineRef.current = null;
			}
		};
	}, []); // Only run once on mount

	// Effect to evaluate position when FEN changes
	useEffect(() => {
		if (engineRef.current?.isReady && fen) {
			engineRef.current.evaluatePosition(fen, depth);
		}
	}, [fen, depth]);

	return engineData;
};

export default useStockFishGameData;
