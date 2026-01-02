export interface PositionAnalysis {
	fen: string;
	evaluation: number;
	mate: number | null;
	bestMove: string | null;
	bestLine: string | null;
	depth: number;
}

export interface AnalysisState {
	isAnalyzing: boolean;
	currentAnalysis: PositionAnalysis | null;
	history: PositionAnalysis[];
}
