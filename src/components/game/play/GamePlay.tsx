import type { BoardSettings } from '@/components/common/types';
import { GameStatus } from '@/components/game/types';
import { Chess } from 'chess.js';
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
		restoreGame,
		makeMove,
		resign,
		setTimeoutWinner,
		isPlayerTurn,
	} = useChessGame();

	const {
		clockState,
		switchTurn,
		stopClock,
		resetClock,
		formatTime,
		startCountdown,
	} = useChessClock(setTimeoutWinner);

	const {
		autoSave,
		saveCompletedGame,
		clearSavedGame,
		recordMove,
		loadSavedGame,
	} = useGameStorage();

	const prevFenRef = useRef(gameState.fen);
	const prevHistoryLengthRef = useRef(0);
	const gameStartTimeRef = useRef<number>(0);
	const clockStartedRef = useRef(false);
	const gameRestoredRef = useRef(false);

	useEffect(() => {
		if (gameRestoredRef.current) return;
		gameRestoredRef.current = true;

		const savedGame = loadSavedGame();

		if (!savedGame || !savedGame.settings || savedGame.gameId !== gameId) {
			navigate('/', { replace: true });
			return;
		}

		const chess = new Chess(savedGame.fen);

		// Only restore if the game is still playable (not ended)
		const isGameEnded =
			chess.isCheckmate() ||
			chess.isStalemate() ||
			chess.isInsufficientMaterial() ||
			chess.isThreefoldRepetition() ||
			chess.isDraw();

		if (isGameEnded) {
			clearSavedGame();
			navigate('/', { replace: true });
			return;
		}

		restoreGame(
			savedGame.gameId,
			savedGame.fen,
			savedGame.pgn,
			savedGame.settings,
			savedGame.startedAt
		);

		const currentTurn = chess.turn();

		resetClock(
			savedGame.settings.timeControl,
			savedGame.clockWhite,
			savedGame.clockBlack
		);

		switchTurn(currentTurn);

		prevFenRef.current = savedGame.fen;
		prevHistoryLengthRef.current = savedGame.moveHistory.length;

		gameStartTimeRef.current = new Date(savedGame.startedAt).getTime();

		if (savedGame.moveHistory.length >= 2) {
			clockStartedRef.current = true;
			startCountdown();
		}

		toast.info('Game restored from last session');
	}, [
		gameId,
		loadSavedGame,
		restoreGame,
		resetClock,
		switchTurn,
		startCountdown,
		clearSavedGame,
		navigate,
	]);

	useEffect(() => {
		if (gameState.status !== GameStatus.PLAYING || !gameState.settings) return;

		if (prevFenRef.current !== gameState.fen) {
			const chess = new Chess(gameState.fen);
			const currentTurn = chess.turn();
			switchTurn(currentTurn);
			prevFenRef.current = gameState.fen;

			if (gameState.history.length >= 2 && !clockStartedRef.current) {
				startCountdown();
				clockStartedRef.current = true;
			}

			if (
				clockStartedRef.current &&
				!clockState.isRunning &&
				gameState.history.length > prevHistoryLengthRef.current
			) {
				startCountdown();
			}

			if (gameState.history.length > prevHistoryLengthRef.current) {
				const lastMove = gameState.history[gameState.history.length - 1];
				const moveColor = lastMove.color;
				const clockTime =
					moveColor === 'w' ? clockState.white : clockState.black;

				recordMove(
					{
						san: lastMove.san,
						fen: gameState.fen,
						color: moveColor,
						clockTime,
					},
					gameState.pgn
				);
				prevHistoryLengthRef.current = gameState.history.length;
			}

			autoSave(gameState, clockState.white, clockState.black);
		}
	}, [
		gameState.fen,
		gameState.status,
		gameState.settings,
		switchTurn,
		autoSave,
		clockState.white,
		clockState.black,
		clockState.isRunning,
		gameState,
		recordMove,
		startCountdown,
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
				gameState.termination
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

				saveCompletedGame(gameState, result, gameState.termination, duration);

				setTimeout(() => {
					navigate('/', { replace: true });
				}, 3000);
			}
		}
	}, [gameState.status, stopClock, gameState, saveCompletedGame, navigate]);

	const handleNewGame = useCallback(() => {
		clearSavedGame();
		navigate('/', { replace: true });
	}, [clearSavedGame, navigate]);

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
