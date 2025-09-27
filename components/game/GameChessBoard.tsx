import { Chessboard } from 'react-chessboard';

const GameChessBoard = () => {
	return (
		<Chessboard
			options={{
				boardStyle: {
					borderRadius: '12px',
					maxWidth: '600px',
				},
			}}
		/>
	);
};

export default GameChessBoard;
