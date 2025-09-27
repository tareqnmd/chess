import GameLayout from '../GameLayout';
import ChessBoard from './GameBoard';
import GameCreate from './GameCreate';

const GamePlay = () => {
	return (
		<GameLayout>
			<ChessBoard />
			<GameCreate />
		</GameLayout>
	);
};

export default GamePlay;
