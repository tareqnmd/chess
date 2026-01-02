import type { PositionAnalysis } from '@/components/analysis/types';
import type { SavedAnalysis } from '@/lib/storage';
import { Button, IconButton, Badge } from '@/components/ui';

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
		<aside className="flex flex-col gap-6">
			<section className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50">
				<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
					Engine Analysis
				</h3>

				<div className="flex gap-3 mb-4">
					{isAnalyzing ? (
						<Button onClick={onStop} variant="danger" className="flex-1">
							Stop
						</Button>
					) : (
						<Button onClick={onAnalyze} variant="info" className="flex-1">
							Analyze
						</Button>
					)}
					<Button onClick={onSave} disabled={!analysis} variant="secondary">
						Save
					</Button>
				</div>

				{analysis && (
					<div className="flex flex-col gap-3">
						<div className="h-6 bg-slate-900 rounded-full overflow-hidden relative">
							<div
								className="h-full bg-linear-to-r from-slate-100 to-slate-300 transition-all duration-500"
								style={{
									width: `${getEvalBarWidth(analysis.evaluation, analysis.mate)}%`,
								}}
							/>
							<div className="absolute inset-0 flex items-center justify-center">
								<span
									className={`text-sm font-bold ${getEvalColor(analysis.evaluation, analysis.mate)}`}
								>
									{formatEvaluation(analysis.evaluation, analysis.mate)}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex items-center gap-2">
								<span className="text-sm text-slate-500">Depth:</span>
								<Badge variant="default" size="sm">
									{analysis.depth}
								</Badge>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-sm text-slate-500">Best:</span>
								<Badge variant="primary" size="sm">
									{analysis.bestMove || '-'}
								</Badge>
							</div>
						</div>

						{analysis.bestLine && (
							<div className="p-3 bg-slate-700/30 rounded-lg">
								<span className="text-slate-500 text-xs uppercase tracking-wider">
									Best Line:
								</span>
								<p className="mt-1 text-slate-200 font-mono text-sm break-all">
									{analysis.bestLine}
								</p>
							</div>
						)}
					</div>
				)}
			</section>

			<section className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50 flex-1">
				<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
					Saved Positions ({savedAnalyses.length})
				</h3>

				<div
					className="flex flex-col gap-2 max-h-64 overflow-y-auto"
					role="list"
				>
					{savedAnalyses.length === 0 ? (
						<p className="text-slate-500 text-sm text-center py-4">
							No saved analyses yet
						</p>
					) : (
						savedAnalyses.map((saved) => (
							<article
								key={saved.id}
								className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg group"
								role="listitem"
							>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span
											className={`font-mono font-bold ${getEvalColor(saved.evaluation, null)}`}
										>
											{formatEvaluation(saved.evaluation, null)}
										</span>
										<Badge variant="default" size="sm">
											d{saved.depth}
										</Badge>
									</div>
									<p className="text-xs text-slate-500 truncate">
										{new Date(saved.date).toLocaleDateString()}
									</p>
								</div>
								<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									<IconButton
										onClick={() => onLoadAnalysis(saved.fen)}
										variant="info"
										size="sm"
										title="Load position"
										aria-label="Load position"
										icon={
											<svg
												className="w-4 h-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
												/>
											</svg>
										}
									/>
									<IconButton
										onClick={() => onDeleteAnalysis(saved.id)}
										variant="danger"
										size="sm"
										title="Delete"
										aria-label="Delete"
										icon={
											<svg
												className="w-4 h-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										}
									/>
								</div>
							</article>
						))
					)}
				</div>
			</section>
		</aside>
	);
};

export default AnalysisPanel;
