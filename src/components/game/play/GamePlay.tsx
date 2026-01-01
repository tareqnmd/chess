import type { GameSettings as GameSettingsType } from '@/types/chess';
import { Chess } from 'chess.js';
import { useCallback, useEffect, useRef } from 'react';
import GameLayout from '../GameLayout';
import { useChessClock } from '../hooks/useChessClock';
import { useChessGame } from '../hooks/useChessGame';
import { useGameStorage } from '../hooks/useGameStorage';
import ChessClock from './ChessClock';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import GameSettings from './GameSettings';
import GameStatus from './GameStatus';
import MoveHistory from './MoveHistory';

const GamePlay = () => {
	const {
		gameState,
		startGame,
		makeMove,
		resetGame,
		resign,
		setTimeoutWinner,
		isPlayerTurn,
	} = useChessGame();

	const {
		clockState,
		startClock,
		switchTurn,
		stopClock,
		resetClock,
		formatTime,
		startCountdown,
	} = useChessClock(setTimeoutWinner);

	const { autoSave, saveCompletedGame, clearSavedGame, recordMove } =
		useGameStorage();

	const prevFenRef = useRef(gameState.fen);
	const prevHistoryLengthRef = useRef(0);
	const gameStartTimeRef = useRef<number>(0);
	const clockStartedRef = useRef(false);

	useEffect(() => {
		if (gameState.status !== 'playing' || !gameState.settings) return;

		if (prevFenRef.current !== gameState.fen) {
			const chess = new Chess(gameState.fen);
			const currentTurn = chess.turn();
			switchTurn(currentTurn);
			prevFenRef.current = gameState.fen;

			if (gameState.history.length >= 2 && !clockStartedRef.current) {
				startCountdown();
				clockStartedRef.current = true;
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
		gameState,
		recordMove,
		startCountdown,
	]);

	useEffect(() => {
		if (gameState.status !== 'playing' && gameState.status !== 'idle') {
			stopClock();

			if (gameState.settings && gameStartTimeRef.current) {
				const duration = Math.floor(
					(Date.now() - gameStartTimeRef.current) / 1000
				);
				let result: 'win' | 'loss' | 'draw' = 'draw';

				if (gameState.winner === gameState.settings.playerColor) {
					result = 'win';
				} else if (gameState.winner && gameState.winner !== 'draw') {
					result = 'loss';
				}

				saveCompletedGame(gameState, result, duration);
			}
		}
	}, [gameState.status, stopClock, gameState, saveCompletedGame]);

	const handleStartGame = useCallback(
		(settings: GameSettingsType) => {
			startGame(settings);
			startClock(settings.timeControl);
			gameStartTimeRef.current = Date.now();
			clockStartedRef.current = false;
			clearSavedGame();
		},
		[startGame, startClock, clearSavedGame]
	);

	const handleNewGame = useCallback(() => {
		resetGame();
		if (gameState.settings) {
			resetClock(gameState.settings.timeControl);
		}
		gameStartTimeRef.current = 0;
		clockStartedRef.current = false;
	}, [resetGame, resetClock, gameState.settings]);

	const handleMove = useCallback(
		(from: string, to: string, promotion?: string): boolean => {
			return makeMove(from, to, promotion);
		},
		[makeMove]
	);

	const isIdle = gameState.status === 'idle';
	const isPlaying = gameState.status === 'playing';
	const isGameOver =
		gameState.status !== 'playing' && gameState.status !== 'idle';

	return (
		<GameLayout>
			<section className={`relative ${isIdle ? 'hidden lg:block' : ''}`} aria-label="Chess board">
				<GameBoard
					gameState={gameState}
					onMove={handleMove}
					isPlayerTurn={isPlayerTurn}
					disabled={isIdle}
				/>
				{isGameOver && gameState.settings && (
					<GameStatus
						status={gameState.status}
						winner={gameState.winner}
						playerColor={gameState.settings.playerColor}
						bot={gameState.settings.bot}
					/>
				)}
			</section>

			<aside className="flex flex-col gap-6">
				{isIdle ? (
					<GameSettings onStartGame={handleStartGame} />
				) : (
					<>
						{gameState.settings && (
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
						)}

						{gameState.settings && (
							<section aria-label="Game clock">
								<ChessClock
									clockState={clockState}
									formatTime={formatTime}
									playerColor={gameState.settings.playerColor}
									isGameOver={isGameOver}
								/>
							</section>
						)}

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
