import type { Chess, Color, Move } from '@/components/common/types';

export type BotLevel =
	| 'beginner'
	| 'easy'
	| 'intermediate'
	| 'advanced'
	| 'master';

export interface Bot {
	id: BotLevel;
	name: string;
	description: string;
	rating: string;
	depth: number;
	avatar: string;
}

export interface TimeControl {
	id: string;
	name: string;
	initialTime: number;
	increment: number;
}

export interface GameSettings {
	bot: Bot;
	timeControl: TimeControl;
	playerColor: Color;
}

export interface ClockState {
	white: number;
	black: number;
	activeColor: Color | null;
	isRunning: boolean;
}

export type GameStatus =
	| 'idle'
	| 'playing'
	| 'checkmate'
	| 'stalemate'
	| 'draw'
	| 'timeout'
	| 'resigned';

export interface GameState {
	gameId: string | null;
	chess: Chess;
	fen: string;
	pgn: string;
	history: Move[];
	status: GameStatus;
	winner: Color | 'draw' | null;
	settings: GameSettings | null;
	startedAt: string | null;
}
