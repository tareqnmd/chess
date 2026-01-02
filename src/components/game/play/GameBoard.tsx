import type { GameState } from '@/components/game/types';
import type { BoardSettings } from '@/components/common/types';
import ChessBoard from '@/components/common/ChessBoard';

interface GameBoardProps {
	gameState: GameState;
	onMove: (from: string, to: string, promotion?: string) => boolean;
	isPlayerTurn: boolean;
	disabled?: boolean;
	settings?: BoardSettings;
}

const GameBoard = ({
	gameState,
	onMove,
	isPlayerTurn,
	disabled = false,
	settings,
}: GameBoardProps) => {
	return (
		<ChessBoard
			mode="game"
			fen={gameState.fen}
			playerColor={gameState.settings?.playerColor}
			onMove={onMove}
			isPlayerTurn={isPlayerTurn}
			disabled={disabled}
			botName={gameState.settings?.bot.name}
			settings={settings}
		/>
	);
};

export default GameBoard;
