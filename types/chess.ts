import type { Chess, Move, Square, Color } from 'chess.js';

export type BotLevel = 'beginner' | 'easy' | 'intermediate' | 'advanced' | 'master';

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
	initialTime: number; // in seconds
	increment: number; // in seconds
}

export interface GameSettings {
	bot: Bot;
	timeControl: TimeControl;
	playerColor: Color;
}

export interface ClockState {
	white: number; // remaining time in ms
	black: number;
	activeColor: Color | null;
	isRunning: boolean;
}

export interface GameState {
	chess: Chess;
	fen: string;
	history: Move[];
	status: GameStatus;
	winner: Color | 'draw' | null;
	settings: GameSettings | null;
}

export type GameStatus = 
	| 'idle' 
	| 'playing' 
	| 'checkmate' 
	| 'stalemate' 
	| 'draw' 
	| 'timeout' 
	| 'resigned';

export interface MoveWithNotation extends Move {
	notation: string;
	moveNumber: number;
}

export type { Chess, Move, Square, Color };

