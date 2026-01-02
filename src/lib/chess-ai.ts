import { Chess } from 'chess.js';
import type { BotLevel } from '@/components/game/types';
import { getEngine } from './stockfish-engine';

const BOT_CONFIG: Record<
	BotLevel,
	{ skillLevel: number; depth: number; movetime?: number }
> = {
	beginner: { skillLevel: 0, depth: 1, movetime: 100 },
	easy: { skillLevel: 3, depth: 3, movetime: 300 },
	intermediate: { skillLevel: 8, depth: 6, movetime: 500 },
	advanced: { skillLevel: 14, depth: 10, movetime: 800 },
	master: { skillLevel: 20, depth: 15, movetime: 1200 },
};

export async function calculateBotMove(
	fen: string,
	level: BotLevel
): Promise<string | null> {
	const config = BOT_CONFIG[level];
	const engine = getEngine();

	engine.setSkillLevel(config.skillLevel);

	const baseDelay = {
		beginner: 200,
		easy: 400,
		intermediate: 600,
		advanced: 800,
		master: 1000,
	};

	await new Promise((resolve) =>
		setTimeout(resolve, baseDelay[level] + Math.random() * 300)
	);

	const bestMove = await engine.findBestMove(fen, {
		depth: config.depth,
		movetime: config.movetime,
	});

	return bestMove;
}

export function parseUCIMove(
	uciMove: string
): { from: string; to: string; promotion?: string } | null {
	if (!uciMove || uciMove.length < 4) return null;

	const from = uciMove.substring(0, 2);
	const to = uciMove.substring(2, 4);
	const promotion = uciMove.length > 4 ? uciMove[4] : undefined;

	return { from, to, promotion };
}

export async function analyzePosition(fen: string, depth = 12) {
	const engine = getEngine();
	const evaluation = await engine.evaluate(fen, depth);

	if (!evaluation) return null;

	const chess = new Chess(fen);
	const isWhiteTurn = chess.turn() === 'w';

	let evalScore = evaluation.positionEvaluation
		? parseInt(evaluation.positionEvaluation) / 100
		: 0;

	if (!isWhiteTurn) {
		evalScore = -evalScore;
	}

	return {
		evaluation: evalScore,
		mate: evaluation.possibleMate ? parseInt(evaluation.possibleMate) : null,
		bestLine: evaluation.pv,
		depth: evaluation.depth,
	};
}
