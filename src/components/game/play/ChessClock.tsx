import type { ClockState, Color } from '@/types/chess';

interface ChessClockProps {
	clockState: ClockState;
	formatTime: (ms: number) => string;
	playerColor: Color;
	isGameOver: boolean;
}

// Map chess.js color format to clock state keys
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
		const isActive = clockState.activeColor === color && clockState.isRunning;
		const isLow = clockState[colorKey] < 30000; // Less than 30 seconds
		const isCritical = clockState[colorKey] < 10000; // Less than 10 seconds

		let baseStyles = 'rounded-xl p-4 font-mono text-3xl font-bold transition-all duration-300';

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
			{/* Opponent's clock (top) */}
			<div className={getClockStyles(opponentColor)} aria-label={`${opponentColor === 'w' ? 'White' : 'Black'} time remaining`}>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div
							className={`w-4 h-4 rounded-full ${
								opponentColor === 'w' ? 'bg-white' : 'bg-slate-900 border border-slate-600'
							}`}
						/>
						<span className="text-sm font-medium opacity-70">
							{opponentColor === 'w' ? 'White' : 'Black'}
						</span>
					</div>
					<span className="tabular-nums">{formatTime(clockState[colorToKey(opponentColor)])}</span>
				</div>
			</div>

			{/* Player's clock (bottom) */}
			<div className={getClockStyles(playerColor)} aria-label={`Your time remaining (${playerColor === 'w' ? 'White' : 'Black'})`}>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div
							className={`w-4 h-4 rounded-full ${
								playerColor === 'w' ? 'bg-white' : 'bg-slate-900 border border-slate-600'
							}`}
						/>
						<span className="text-sm font-medium opacity-70">
							{playerColor === 'w' ? 'White' : 'Black'} (You)
						</span>
					</div>
					<span className="tabular-nums">{formatTime(clockState[colorToKey(playerColor)])}</span>
				</div>
			</div>
		</div>
	);
};

export default ChessClock;

