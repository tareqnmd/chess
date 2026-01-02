import ChessBoard from '@/components/common/ChessBoard';
import type { BoardSettings } from '@/types/board-settings';
import type { PositionAnalysis } from '@/types/chess';

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
			bestMove={analysis?.bestMove ?? undefined}
			isAnalyzing={isAnalyzing}
			settings={settings}
		/>
	);
};

export default AnalysisBoard;
