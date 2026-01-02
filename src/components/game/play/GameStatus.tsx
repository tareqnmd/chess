import type { Bot } from '@/components/game/types';
import { GameStatus, TerminationType } from '@/components/game/types';
import type { Color } from '@/components/common/types';

interface GameStatusProps {
	status: GameStatus;
	winner: Color | 'draw' | null;
	playerColor: Color;
	bot: Bot;
	termination?: TerminationType | null;
}

const GameStatusComponent = ({
	status,
	winner,
	playerColor,
	bot,
	termination,
}: GameStatusProps) => {
	if (status === GameStatus.IDLE || status === GameStatus.PLAYING) return null;

	const playerWon = winner === playerColor;
	const isDraw = winner === 'draw';

	const getStatusMessage = () => {
		switch (status) {
			case GameStatus.CHECKMATE:
				return playerWon
					? 'Checkmate! You win!'
					: `Checkmate! ${bot.name} wins!`;
			case GameStatus.TIMEOUT:
				return playerWon ? "Time's up! You win!" : "Time's up! You lose!";
			case GameStatus.RESIGNED:
				return playerWon ? `${bot.name} resigned!` : 'You resigned';
			case GameStatus.STALEMATE:
				return 'Stalemate! Draw!';
			case GameStatus.DRAW:
				return 'Draw!';
			default:
				return 'Game Over';
		}
	};

	const getTerminationDetails = () => {
		if (!termination) return null;

		const terminationLabels: Record<TerminationType, string> = {
			[TerminationType.CHECKMATE]: 'By Checkmate',
			[TerminationType.TIMEOUT]: 'By Timeout',
			[TerminationType.RESIGNATION]: 'By Resignation',
			[TerminationType.STALEMATE]: 'By Stalemate',
			[TerminationType.INSUFFICIENT_MATERIAL]: 'Insufficient Material',
			[TerminationType.FIFTY_MOVE]: 'Fifty-Move Rule',
			[TerminationType.THREEFOLD_REPETITION]: 'Threefold Repetition',
			[TerminationType.AGREEMENT]: 'By Agreement',
		};

		return terminationLabels[termination];
	};

	const getIcon = () => {
		if (isDraw) return '🤝';
		if (playerWon) return '🏆';
		return '💔';
	};

	const getBackgroundClass = () => {
		if (isDraw) return 'from-slate-600/90 to-slate-700/90 border-slate-500';
		if (playerWon)
			return 'from-emerald-600/90 to-teal-600/90 border-emerald-400';
		return 'from-red-600/90 to-rose-700/90 border-red-400';
	};

	return (
		<div
			className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-xl z-10"
			role="dialog"
			aria-labelledby="game-status-title"
			aria-modal="false"
		>
			<div
				className={`text-center p-8 rounded-2xl bg-gradient-to-br ${getBackgroundClass()} border-2 shadow-2xl transform animate-bounce-in`}
			>
				<div className="text-6xl mb-4" aria-hidden="true">
					{getIcon()}
				</div>
				<h2
					id="game-status-title"
					className="text-2xl font-bold text-white mb-2"
				>
					{getStatusMessage()}
				</h2>
				{getTerminationDetails() && (
					<p className="text-sm text-white/90 mb-1">
						{getTerminationDetails()}
					</p>
				)}
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

export default GameStatusComponent;
