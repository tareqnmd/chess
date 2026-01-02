import { Button } from '@/components/ui';

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
		<div className="flex gap-2 sm:gap-3">
			{isPlaying && !isGameOver && (
				<Button
					onClick={onResign}
					variant="danger"
					size="lg"
					className="flex-1"
				>
					<svg
						className="w-5 h-5 sm:w-5 sm:h-5"
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
					<span className="hidden sm:inline">Resign</span>
					<span className="sm:hidden text-sm">Resign</span>
				</Button>
			)}

			<Button
				onClick={onNewGame}
				variant={isGameOver ? 'primary' : 'secondary'}
				size="lg"
				className="flex-1"
			>
				<svg
					className="w-5 h-5 sm:w-5 sm:h-5"
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
				<span className="hidden sm:inline">
					{isGameOver ? 'Play Again' : 'New Game'}
				</span>
				<span className="sm:hidden text-sm">
					{isGameOver ? 'Again' : 'New'}
				</span>
			</Button>
		</div>
	);
};

export default GameControls;
