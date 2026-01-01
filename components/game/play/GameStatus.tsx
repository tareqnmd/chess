'use client';

import type { GameStatus as GameStatusType, Color, Bot } from '@/types/chess';

interface GameStatusProps {
	status: GameStatusType;
	winner: Color | 'draw' | null;
	playerColor: Color;
	bot: Bot;
}

const GameStatus = ({ status, winner, playerColor, bot }: GameStatusProps) => {
	if (status === 'idle' || status === 'playing') return null;

	const playerWon = winner === playerColor;
	const isDraw = winner === 'draw';

	const getStatusMessage = () => {
		switch (status) {
			case 'checkmate':
				return playerWon ? 'Checkmate! You win!' : `Checkmate! ${bot.name} wins!`;
			case 'timeout':
				return playerWon ? 'Time\'s up! You win!' : 'Time\'s up! You lose!';
			case 'resigned':
				return playerWon ? `${bot.name} resigned!` : 'You resigned';
			case 'stalemate':
				return 'Stalemate! Draw!';
			case 'draw':
				return 'Draw!';
			default:
				return 'Game Over';
		}
	};

	const getIcon = () => {
		if (isDraw) return '🤝';
		if (playerWon) return '🏆';
		return '💔';
	};

	const getBackgroundClass = () => {
		if (isDraw) return 'from-slate-600/90 to-slate-700/90 border-slate-500';
		if (playerWon) return 'from-emerald-600/90 to-teal-600/90 border-emerald-400';
		return 'from-red-600/90 to-rose-700/90 border-red-400';
	};

	return (
		<div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-xl z-10">
			<div
				className={`text-center p-8 rounded-2xl bg-gradient-to-br ${getBackgroundClass()} border-2 shadow-2xl transform animate-bounce-in`}
			>
				<div className="text-6xl mb-4">{getIcon()}</div>
				<h2 className="text-2xl font-bold text-white mb-2">{getStatusMessage()}</h2>
				<p className="text-sm text-white/70">
					{isDraw
						? 'Neither player wins'
						: playerWon
						? 'Congratulations!'
						: 'Better luck next time!'}
				</p>
			</div>
		</div>
	);
};

export default GameStatus;

