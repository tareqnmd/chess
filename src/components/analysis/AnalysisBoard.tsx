import type { PositionAnalysis } from '@/types/chess';
import type { BoardSettings } from '@/types/board-settings';
import ChessBoard from '@/components/common/ChessBoard';

interface AnalysisBoardProps {
	fen: string;
	onFenChange: (fen: string) => void;
	analysis: PositionAnalysis | null;
	isAnalyzing: boolean;
	settings?: BoardSettings;
}

const AnalysisBoard = ({
	fen,
	onFenChange,
	analysis,
	isAnalyzing,
	settings,
}: AnalysisBoardProps) => {
	return (
		<ChessBoard
			mode="analysis"
			fen={fen}
			onFenChange={onFenChange}
			bestMove={analysis?.bestMove}
			isAnalyzing={isAnalyzing}
			settings={settings}
		/>
	);
};

export default AnalysisBoard;
