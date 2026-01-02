import GameSettings from '@/components/game/play/GameSettings';
import type { GameSettings as GameSettingsType } from '@/components/game/types';
import { TerminationType } from '@/components/game/types';
import { Spinner } from '@/components/ui';
import {
	clearCurrentGame,
	getCurrentGame,
	initializeGameSession,
	saveGame,
} from '@/lib/storage';
import { Chess } from 'chess.js';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const HomePage = () => {
	const navigate = useNavigate();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const checkSavedGame = () => {
			const savedGame = getCurrentGame();

			if (savedGame && savedGame.settings) {
				const chess = new Chess(savedGame.fen);

				const isCheckmate = chess.isCheckmate();
				const isStalemate = chess.isStalemate();
				const isInsufficientMaterial = chess.isInsufficientMaterial();
				const isThreefoldRepetition = chess.isThreefoldRepetition();
				const isDraw = chess.isDraw();

				const isGameEnded =
					isCheckmate ||
					isStalemate ||
					isInsufficientMaterial ||
					isThreefoldRepetition ||
					isDraw;

				if (!isGameEnded) {
					navigate(`/play/${savedGame.gameId}`, { replace: true });
					return;
				}

				const duration = Math.floor(
					(Date.now() - new Date(savedGame.startedAt).getTime()) / 1000
				);

				let result: 'win' | 'loss' | 'draw';
				let termination: TerminationType;
				const winner = chess.turn() === 'w' ? 'b' : 'w';

				if (isCheckmate) {
					result = winner === savedGame.settings.playerColor ? 'win' : 'loss';
					termination = TerminationType.CHECKMATE;
				} else if (isStalemate) {
					result = 'draw';
					termination = TerminationType.STALEMATE;
				} else if (isInsufficientMaterial) {
					result = 'draw';
					termination = TerminationType.INSUFFICIENT_MATERIAL;
				} else if (isThreefoldRepetition) {
					result = 'draw';
					termination = TerminationType.THREEFOLD_REPETITION;
				} else {
					result = 'draw';
					termination = TerminationType.FIFTY_MOVE;
				}

				saveGame({
					pgn: savedGame.pgn,
					fen: savedGame.fen,
					result,
					termination,
					settings: savedGame.settings,
					moves: savedGame.moveHistory.length,
					duration,
					startedAt: savedGame.startedAt,
				});

				clearCurrentGame();

				toast.info('Previous game saved to history');
			}

			setIsChecking(false);
		};

		checkSavedGame();
	}, [navigate]);

	const handleStartGame = useCallback(
		(settings: GameSettingsType) => {
			const newGameId = initializeGameSession(
				settings,
				settings.timeControl.initialTime * 1000,
				settings.timeControl.initialTime * 1000
			);

			toast.success(`Game started vs ${settings.bot.name}`);

			navigate(`/play/${newGameId}`);
		},
		[navigate]
	);

	if (isChecking) {
		return (
			<div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
				<div className="text-center">
					<Spinner size="lg" />
					<p className="mt-4 text-slate-400">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
			<div className="w-full max-w-2xl">
				<GameSettings onStartGame={handleStartGame} />
			</div>
		</div>
	);
};

export default HomePage;
