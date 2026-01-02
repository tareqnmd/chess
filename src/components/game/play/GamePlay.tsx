import type { BoardSettings } from '@/components/common/types';
import { GameStatus } from '@/components/game/types';
import {
	finishGameInHistory,
	getGameById,
	updateGameInHistory,
} from '@/lib/storage';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import GameLayout from '../GameLayout';
import { useChessClock } from '../hooks/useChessClock';
import { useChessGame } from '../hooks/useChessGame';
import { useGameStorage } from '../hooks/useGameStorage';
import ChessClock from './ChessClock';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import GameStatusComponent from './GameStatus';
import MoveHistory from './MoveHistory';

interface GamePlayProps {
	boardSettings: BoardSettings;
}

const GamePlay = ({ boardSettings }: GamePlayProps) => {
	const { gameId } = useParams<{ gameId: string }>();
	const navigate = useNavigate();

	const {
		gameState,
		startGame,
		restoreGame,
		makeMove,
		resign,
		setTimeoutWinner,
		isPlayerTurn,
	} = useChessGame();

	const { clockState, startClock, stopClock, resetClock, formatTime } =
		useChessClock(setTimeoutWinner);

	useGameStorage(); // Still needed for default settings

	const prevFenRef = useRef(gameState.fen);
	const prevMovesCountRef = useRef(0);
	const gameStartTimeRef = useRef<number>(0);
	const gameInitializedRef = useRef(false);
	const lastSaveRef = useRef<number>(0);

	// Initialize or restore game from history
	useEffect(() => {
		if (gameInitializedRef.current) return;
		gameInitializedRef.current = true;

		if (!gameId) {
			navigate('/', { replace: true });
			return;
		}

		const savedGame = getGameById(gameId);

		if (!savedGame) {
			toast.error('Game not found');
			navigate('/', { replace: true });
			return;
		}

		if (savedGame.status === 'finished') {
			toast.error('This game has already finished');
			navigate('/history', { replace: true });
			return;
		}

		// Check if it's a new game or resuming
		if (savedGame.moves === 0) {
			// New game
			startGame(savedGame.settings);
			startClock(savedGame.settings.timeControl);
			gameStartTimeRef.current = new Date(savedGame.startedAt).getTime();
		} else {
			// Resuming game
			restoreGame(
				savedGame.id,
				savedGame.fen,
				savedGame.pgn,
				savedGame.settings,
				savedGame.startedAt
			);

			resetClock(
				savedGame.settings.timeControl,
				savedGame.clockWhite,
				savedGame.clockBlack
			);

			gameStartTimeRef.current = new Date(savedGame.startedAt).getTime();
			prevMovesCountRef.current = savedGame.moves;

			toast.info('Game resumed');
		}
	}, [gameId, navigate, startGame, startClock, restoreGame, resetClock]);

	// Auto-save game state to history
	useEffect(() => {
		if (
			gameState.status !== GameStatus.PLAYING ||
			!gameState.settings ||
			!gameId
		)
			return;

		if (
			prevFenRef.current !== gameState.fen ||
			gameState.history.length !== prevMovesCountRef.current
		) {
			prevFenRef.current = gameState.fen;
			prevMovesCountRef.current = gameState.history.length;

			// Throttle saves to every 2 seconds
			const now = Date.now();
			if (now - lastSaveRef.current < 2000) return;
			lastSaveRef.current = now;

			const duration = Math.floor((now - gameStartTimeRef.current) / 1000);

			updateGameInHistory(gameId, {
				pgn: gameState.pgn,
				fen: gameState.fen,
				moves: gameState.history.length,
				duration,
				clockWhite: clockState.white,
				clockBlack: clockState.black,
			});
		}
	}, [
		gameState.fen,
		gameState.status,
		gameState.settings,
		gameState.pgn,
		gameState.history.length,
		gameId,
		clockState.white,
		clockState.black,
	]);

	useEffect(() => {
		if (
			gameState.status !== GameStatus.PLAYING &&
			gameState.status !== GameStatus.IDLE
		) {
			stopClock();

			if (
				gameState.settings &&
				gameStartTimeRef.current &&
				gameState.termination &&
				gameId
			) {
				const duration = Math.floor(
					(Date.now() - gameStartTimeRef.current) / 1000
				);
				let result: 'win' | 'loss' | 'draw' = 'draw';

				if (gameState.winner === gameState.settings.playerColor) {
					result = 'win';
					toast.success('Congratulations! You won! 🏆');
				} else if (gameState.winner && gameState.winner !== 'draw') {
					result = 'loss';
					toast.error('Game over! You lost 💔');
				} else {
					toast.info('Game ended in a draw 🤝');
				}

				// Finish the game in history
				finishGameInHistory(gameId, result, gameState.termination, duration);

				setTimeout(() => {
					navigate('/history', { replace: true });
				}, 3000);
			}
		}
	}, [gameState.status, stopClock, gameState, gameId, navigate]);

	const handleNewGame = useCallback(() => {
		navigate('/', { replace: true });
	}, [navigate]);

	const handleMove = useCallback(
		(from: string, to: string, promotion?: string): boolean => {
			return makeMove(from, to, promotion);
		},
		[makeMove]
	);

	const isPlaying = gameState.status === GameStatus.PLAYING;
	const isGameOver =
		gameState.status !== GameStatus.PLAYING &&
		gameState.status !== GameStatus.IDLE;

	return (
		<GameLayout>
			<section className="relative" aria-label="Chess board">
				<GameBoard
					gameState={gameState}
					onMove={handleMove}
					isPlayerTurn={isPlayerTurn}
					disabled={false}
					settings={boardSettings}
				/>
				{isGameOver && gameState.settings && (
					<GameStatusComponent
						status={gameState.status}
						winner={gameState.winner}
						playerColor={gameState.settings.playerColor}
						bot={gameState.settings.bot}
						termination={gameState.termination}
					/>
				)}
			</section>

			<aside className="flex flex-col gap-6">
				{gameState.settings && (
					<>
						<section className="flex items-center gap-4 p-5 bg-slate-800/50 rounded-xl border border-slate-700/50">
							<span className="text-4xl" aria-hidden="true">
								{gameState.settings.bot.avatar}
							</span>
							<div className="flex-1">
								<h3 className="font-semibold text-slate-100">
									{gameState.settings.bot.name}
								</h3>
								<p className="text-sm text-slate-400">
									Rating: {gameState.settings.bot.rating}
								</p>
							</div>
							{!isPlayerTurn && isPlaying && (
								<div className="px-3 py-1 bg-emerald-600/20 text-emerald-400 text-sm rounded-full border border-emerald-600/30">
									Thinking...
								</div>
							)}
						</section>

						<section aria-label="Game clock">
							<ChessClock
								clockState={clockState}
								formatTime={formatTime}
								playerColor={gameState.settings.playerColor}
								isGameOver={isGameOver}
							/>
						</section>

						<section className="flex-1 p-5 bg-slate-800/50 rounded-xl border border-slate-700/50">
							<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
								Moves
							</h3>
							<MoveHistory history={gameState.history} />
						</section>

						<section aria-label="Game controls">
							<GameControls
								onResign={resign}
								onNewGame={handleNewGame}
								isGameOver={isGameOver}
								isPlaying={isPlaying}
							/>
						</section>
					</>
				)}
			</aside>
		</GameLayout>
	);
};

export default GamePlay;
