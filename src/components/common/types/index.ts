import type {
	Chess,
	Move as ChessJsMove,
	Square as ChessJsSquare,
	Color as ChessJsColor,
} from 'chess.js';

export type { Chess };
export type Move = ChessJsMove;
export type Square = ChessJsSquare;
export type Color = ChessJsColor;

export type PieceTheme =
	| 'cburnett'
	| 'alpha'
	| 'california'
	| 'cardinal'
	| 'cases'
	| 'chessnut'
	| 'companion'
	| 'dubrovny'
	| 'fantasy'
	| 'fresca'
	| 'gioco'
	| 'governor'
	| 'horsey'
	| 'icpieces'
	| 'kosal'
	| 'leipzig'
	| 'letter'
	| 'libra'
	| 'maestro'
	| 'merida'
	| 'pirouetti'
	| 'pixel'
	| 'reillycraig'
	| 'riohacha'
	| 'shapes'
	| 'spatial'
	| 'staunty'
	| 'tatiana';

export interface BoardTheme {
	light: string;
	dark: string;
}

export interface BoardSettings {
	userId: string;
	pieceTheme: PieceTheme;
	boardTheme: BoardTheme;
	showCoordinates: boolean;
	animationDuration: number;
	boardSize?: number;
}
