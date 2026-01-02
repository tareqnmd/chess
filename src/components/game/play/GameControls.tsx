interface GameControlsProps {
	onResign: () => void;
	onNewGame: () => void;
	isGameOver: boolean;
	isPlaying: boolean;
}

const GameControls = ({
	onResign,
	onNewGame,
	isGameOver,
	isPlaying,
}: GameControlsProps) => {
	return (
		<div className="flex gap-3">
			{isPlaying && !isGameOver && (
				<button
					onClick={onResign}
					className="flex-1 py-3 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-medium rounded-xl border border-red-600/30 transition-all duration-200 flex items-center justify-center gap-2"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
						/>
					</svg>
					Resign
				</button>
			)}

			<button
				onClick={onNewGame}
				className={`flex-1 py-3 px-4 font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
					isGameOver
						? 'bg-emerald-600 hover:bg-emerald-500 text-white'
						: 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50'
				}`}
			>
				<svg
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
				{isGameOver ? 'Play Again' : 'New Game'}
			</button>
		</div>
	);
};

export default GameControls;
