import type { Chess, Move as ChessJsMove, Square as ChessJsSquare, Color as ChessJsColor } from 'chess.js';

// Re-export chess.js types
export type { Chess };
export type Move = ChessJsMove;
export type Square = ChessJsSquare;
export type Color = ChessJsColor;

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

export type GameStatus = 
	| 'idle' 
	| 'playing' 
	| 'checkmate' 
	| 'stalemate' 
	| 'draw' 
	| 'timeout' 
	| 'resigned';

// Analysis types
export interface PositionAnalysis {
	fen: string;
	evaluation: number; // in centipawns, positive = white advantage
	mate: number | null; // moves to mate, positive = white wins
	bestMove: string | null;
	bestLine: string | null;
	depth: number;
}

export interface AnalysisState {
	isAnalyzing: boolean;
	currentAnalysis: PositionAnalysis | null;
	history: PositionAnalysis[];
}
