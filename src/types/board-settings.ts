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

export const DEFAULT_BOARD_SETTINGS: BoardSettings = {
	userId: '',
	pieceTheme: 'cburnett',
	boardTheme: {
		light: '#94a3b8',
		dark: '#334155',
	},
	showCoordinates: true,
	animationDuration: 200,
};

export const BOARD_THEMES: Record<string, BoardTheme> = {
	slate: {
		light: '#94a3b8',
		dark: '#334155',
	},
	blue: {
		light: '#93c5fd',
		dark: '#1e3a8a',
	},
	green: {
		light: '#86efac',
		dark: '#14532d',
	},
	brown: {
		light: '#d4a574',
		dark: '#8b4513',
	},
	purple: {
		light: '#c4b5fd',
		dark: '#5b21b6',
	},
	classic: {
		light: '#f0d9b5',
		dark: '#b58863',
	},
};
