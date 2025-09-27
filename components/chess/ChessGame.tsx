import ChessBoard from './ChessBoard';
import GameCreate from './GameCreate';

const ChessGame = () => {
	return (
		<div className="grid md:grid-cols-[7fr_5fr]">
			<ChessBoard />
			<GameCreate />
		</div>
	);
};

export default ChessGame;
