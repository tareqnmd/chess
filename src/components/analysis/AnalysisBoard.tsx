import type { PositionAnalysis } from '@/types/chess';
import ChessBoard from '@/components/common/ChessBoard';

interface AnalysisBoardProps {
	fen: string;
	onFenChange: (fen: string) => void;
	analysis: PositionAnalysis | null;
	isAnalyzing: boolean;
}

const AnalysisBoard = ({
	fen,
	onFenChange,
	analysis,
	isAnalyzing,
}: AnalysisBoardProps) => {
	return (
		<ChessBoard
			mode="analysis"
			fen={fen}
			onFenChange={onFenChange}
			bestMove={analysis?.bestMove}
			isAnalyzing={isAnalyzing}
		/>
	);
};

export default AnalysisBoard;
