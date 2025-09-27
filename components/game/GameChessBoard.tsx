import { Chessboard, ChessboardOptions } from 'react-chessboard';

const GameChessBoard = ({
	chessOptions,
}: {
	chessOptions?: ChessboardOptions;
}) => {
	return (
		<Chessboard
			options={{
				boardStyle: {
					borderRadius: '12px',
					maxWidth: '600px',
				},
				...chessOptions,
			}}
		/>
	);
};

export default GameChessBoard;
