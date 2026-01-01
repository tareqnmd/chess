import type { PositionAnalysis } from '@/types/chess';
import type { SavedAnalysis } from '@/lib/storage';

interface AnalysisPanelProps {
	analysis: PositionAnalysis | null;
	isAnalyzing: boolean;
	onAnalyze: () => void;
	onStop: () => void;
	onSave: () => void;
	savedAnalyses: SavedAnalysis[];
	onLoadAnalysis: (fen: string) => void;
	onDeleteAnalysis: (id: string) => void;
}

const AnalysisPanel = ({
	analysis,
	isAnalyzing,
	onAnalyze,
	onStop,
	onSave,
	savedAnalyses,
	onLoadAnalysis,
	onDeleteAnalysis,
}: AnalysisPanelProps) => {
	const formatEvaluation = (eval_: number, mate: number | null) => {
		if (mate !== null) {
			return `M${mate > 0 ? '+' : ''}${mate}`;
		}
		const sign = eval_ > 0 ? '+' : '';
		return `${sign}${eval_.toFixed(2)}`;
	};

	const getEvalBarWidth = (eval_: number, mate: number | null) => {
		if (mate !== null) {
			return mate > 0 ? 100 : 0;
		}
		// Clamp evaluation between -5 and +5 for visual purposes
		const clamped = Math.max(-5, Math.min(5, eval_));
		return ((clamped + 5) / 10) * 100;
	};

	const getEvalColor = (eval_: number, mate: number | null) => {
		if (mate !== null) {
			return mate > 0 ? 'text-emerald-400' : 'text-red-400';
		}
		if (eval_ > 1) return 'text-emerald-400';
		if (eval_ < -1) return 'text-red-400';
		return 'text-slate-300';
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Analysis Controls */}
			<div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
				<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
					Engine Analysis
				</h3>
				
				<div className="flex gap-3 mb-4">
					{isAnalyzing ? (
						<button
							onClick={onStop}
							className="flex-1 py-2 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium rounded-lg border border-red-600/30 transition-all"
						>
							Stop
						</button>
					) : (
						<button
							onClick={onAnalyze}
							className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-500/25 transition-all"
						>
							Analyze
						</button>
					)}
					<button
						onClick={onSave}
						disabled={!analysis}
						className="py-2 px-4 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-medium rounded-lg border border-slate-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Save
					</button>
				</div>

				{/* Evaluation Display */}
				{analysis && (
					<div className="space-y-3">
						{/* Eval Bar */}
						<div className="h-6 bg-slate-900 rounded-full overflow-hidden relative">
							<div
								className="h-full bg-gradient-to-r from-slate-100 to-slate-300 transition-all duration-500"
								style={{ width: `${getEvalBarWidth(analysis.evaluation, analysis.mate)}%` }}
							/>
							<div className="absolute inset-0 flex items-center justify-center">
								<span className={`text-sm font-bold ${getEvalColor(analysis.evaluation, analysis.mate)}`}>
									{formatEvaluation(analysis.evaluation, analysis.mate)}
								</span>
							</div>
						</div>

						{/* Analysis Details */}
						<div className="grid grid-cols-2 gap-3 text-sm">
							<div className="p-2 bg-slate-700/30 rounded-lg">
								<span className="text-slate-500">Depth:</span>
								<span className="ml-2 text-slate-200 font-mono">{analysis.depth}</span>
							</div>
							<div className="p-2 bg-slate-700/30 rounded-lg">
								<span className="text-slate-500">Best:</span>
								<span className="ml-2 text-emerald-400 font-mono">{analysis.bestMove || '-'}</span>
							</div>
						</div>

						{/* Best Line */}
						{analysis.bestLine && (
							<div className="p-3 bg-slate-700/30 rounded-lg">
								<span className="text-slate-500 text-xs uppercase tracking-wider">Best Line:</span>
								<p className="mt-1 text-slate-200 font-mono text-sm break-all">
									{analysis.bestLine}
								</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Saved Analyses */}
			<div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex-1">
				<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
					Saved Positions ({savedAnalyses.length})
				</h3>
				
				<div className="space-y-2 max-h-64 overflow-y-auto">
					{savedAnalyses.length === 0 ? (
						<p className="text-slate-500 text-sm text-center py-4">
							No saved analyses yet
						</p>
					) : (
						savedAnalyses.map((saved) => (
							<div
								key={saved.id}
								className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg group"
							>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span className={`font-mono font-bold ${getEvalColor(saved.evaluation, null)}`}>
											{formatEvaluation(saved.evaluation, null)}
										</span>
										<span className="text-slate-500 text-xs">
											d{saved.depth}
										</span>
									</div>
									<p className="text-xs text-slate-500 truncate">
										{new Date(saved.date).toLocaleDateString()}
									</p>
								</div>
								<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									<button
										onClick={() => onLoadAnalysis(saved.fen)}
										className="p-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded"
										title="Load position"
									>
										<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
										</svg>
									</button>
									<button
										onClick={() => onDeleteAnalysis(saved.id)}
										className="p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded"
										title="Delete"
									>
										<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default AnalysisPanel;

