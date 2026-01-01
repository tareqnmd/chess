'use client';

import { useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import GameLayout from '../GameLayout';
import GameBoard from './GameBoard';
import GameSettings from './GameSettings';
import GameStatus from './GameStatus';
import ChessClock from './ChessClock';
import MoveHistory from './MoveHistory';
import GameControls from './GameControls';
import { useChessGame } from '../hooks/useChessGame';
import { useChessClock } from '../hooks/useChessClock';
import type { GameSettings as GameSettingsType, Square } from '@/types/chess';

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
	} = useChessClock(setTimeoutWinner);

	const prevFenRef = useRef(gameState.fen);

	// Handle clock when moves are made
	useEffect(() => {
		if (gameState.status !== 'playing' || !gameState.settings) return;

		if (prevFenRef.current !== gameState.fen) {
			const chess = new Chess(gameState.fen);
			switchTurn(chess.turn());
			prevFenRef.current = gameState.fen;
		}
	}, [gameState.fen, gameState.status, gameState.settings, switchTurn]);

	// Stop clock when game ends
	useEffect(() => {
		if (gameState.status !== 'playing' && gameState.status !== 'idle') {
			stopClock();
		}
	}, [gameState.status, stopClock]);

	const handleStartGame = useCallback((settings: GameSettingsType) => {
		startGame(settings);
		startClock(settings.timeControl);
	}, [startGame, startClock]);

	const handleNewGame = useCallback(() => {
		resetGame();
		if (gameState.settings) {
			resetClock(gameState.settings.timeControl);
		}
	}, [resetGame, resetClock, gameState.settings]);

	const handleMove = useCallback((from: Square, to: Square, promotion?: string): boolean => {
		return makeMove(from, to, promotion);
	}, [makeMove]);

	const isIdle = gameState.status === 'idle';
	const isPlaying = gameState.status === 'playing';
	const isGameOver = gameState.status !== 'playing' && gameState.status !== 'idle';

	return (
		<GameLayout>
			{/* Chess Board - Always visible */}
			<div className="relative">
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
				{/* Disabled overlay when idle */}
				{isIdle && (
					<div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
						<div className="text-center">
							<div className="text-5xl mb-3">♟️</div>
							<p className="text-slate-300 font-medium">Configure game settings to start</p>
						</div>
					</div>
				)}
			</div>

			{/* Side Panel */}
			<div className="flex flex-col gap-6">
				{/* Show settings when idle */}
				{isIdle ? (
					<GameSettings onStartGame={handleStartGame} />
				) : (
					<>
						{/* Opponent Info */}
						{gameState.settings && (
							<div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
								<span className="text-4xl">{gameState.settings.bot.avatar}</span>
								<div>
									<h3 className="font-semibold text-slate-100">{gameState.settings.bot.name}</h3>
									<p className="text-sm text-slate-400">Rating: {gameState.settings.bot.rating}</p>
								</div>
								{!isPlayerTurn && isPlaying && (
									<div className="ml-auto px-3 py-1 bg-emerald-600/20 text-emerald-400 text-sm rounded-full border border-emerald-600/30">
										Thinking...
									</div>
								)}
							</div>
						)}

						{/* Clock */}
						{gameState.settings && (
							<ChessClock
								clockState={clockState}
								formatTime={formatTime}
								playerColor={gameState.settings.playerColor}
								isGameOver={isGameOver}
							/>
						)}

						{/* Move History */}
						<div className="flex-1 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
							<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
								Moves
							</h3>
							<MoveHistory history={gameState.history} />
						</div>

						{/* Game Controls */}
						<GameControls
							onResign={resign}
							onNewGame={handleNewGame}
							isGameOver={isGameOver}
							isPlaying={isPlaying}
						/>
					</>
				)}
			</div>
		</GameLayout>
	);
};

export default GamePlay;
