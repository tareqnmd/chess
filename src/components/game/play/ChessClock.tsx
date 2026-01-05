import type { Color } from '@/components/common/types';
import type { ClockState } from '@/components/game/types';

interface ChessClockProps {
	clockState: ClockState;
	formatTime: (ms: number) => string;
	playerColor: Color;
	isGameOver: boolean;
}

const colorToKey = (color: Color): 'white' | 'black' => {
	return color === 'w' ? 'white' : 'black';
};

const ChessClock = ({
	clockState,
	formatTime,
	playerColor,
	isGameOver,
}: ChessClockProps) => {
	const opponentColor = playerColor === 'w' ? 'b' : 'w';

	const getClockStyles = (color: Color) => {
		const colorKey = colorToKey(color);
		// ...existing code without comments...
		const isActive = clockState.activeColor === color;
		const isLow = clockState[colorKey] < 30000;
		const isCritical = clockState[colorKey] < 10000;

		let baseStyles =
			'rounded-xl p-4 font-mono text-3xl font-bold transition-all duration-300';

		if (isGameOver) {
			baseStyles += ' opacity-50';
		} else if (isActive) {
			if (isCritical) {
				baseStyles += ' bg-red-600/90 text-white animate-pulse';
			} else if (isLow) {
				baseStyles += ' bg-amber-600/90 text-white';
			} else {
				baseStyles += ' bg-emerald-600/90 text-white';
			}
		} else {
			baseStyles += ' bg-slate-700/50 text-slate-300';
		}

		return baseStyles;
	};

	return (
		<div className="flex flex-col gap-3" role="timer">
			<div
				className={getClockStyles(opponentColor)}
				aria-label={`${opponentColor === 'w' ? 'White' : 'Black'} time remaining`}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div
							className={`w-4 h-4 rounded-full ${
								opponentColor === 'w'
									? 'bg-white'
									: 'bg-slate-900 border border-slate-600'
							}`}
						/>
						<span className="text-sm font-medium opacity-70">
							{opponentColor === 'w' ? 'White' : 'Black'}
						</span>
					</div>
					<span className="tabular-nums">
						{formatTime(clockState[colorToKey(opponentColor)])}
					</span>
				</div>
			</div>

			<div
				className={getClockStyles(playerColor)}
				aria-label={`Your time remaining (${playerColor === 'w' ? 'White' : 'Black'})`}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div
							className={`w-4 h-4 rounded-full ${
								playerColor === 'w'
									? 'bg-white'
									: 'bg-slate-900 border border-slate-600'
							}`}
						/>
						<span className="text-sm font-medium opacity-70">
							{playerColor === 'w' ? 'White' : 'Black'} (You)
						</span>
					</div>
					<span className="tabular-nums">
						{formatTime(clockState[colorToKey(playerColor)])}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ChessClock;
