import { useState, useEffect, useCallback } from 'react';
import { 
	getGameHistory, 
	deleteGame, 
	clearGameHistory, 
	getGameStats,
	downloadExportData,
	type SavedGame,
	type GameStats 
} from '@/lib/storage';
import { BOTS } from '@/constants/bots';

interface HistoryPageProps {
	onAnalyzeGame?: (pgn: string, fen: string) => void;
}

const HistoryPage = ({ onAnalyzeGame }: HistoryPageProps) => {
	const [games, setGames] = useState<SavedGame[]>([]);
	const [stats, setStats] = useState<GameStats | null>(null);
	const [selectedGame, setSelectedGame] = useState<SavedGame | null>(null);

	useEffect(() => {
		setGames(getGameHistory());
		setStats(getGameStats());
	}, []);

	const handleDeleteGame = useCallback((id: string) => {
		deleteGame(id);
		setGames(getGameHistory());
		setStats(getGameStats());
		if (selectedGame?.id === id) {
			setSelectedGame(null);
		}
	}, [selectedGame]);

	const handleClearHistory = useCallback(() => {
		if (confirm('Are you sure you want to clear all game history? This cannot be undone.')) {
			clearGameHistory();
			setGames([]);
			setStats(getGameStats());
			setSelectedGame(null);
		}
	}, []);

	const handleExport = useCallback(() => {
		downloadExportData();
	}, []);

	const getResultColor = (result: 'win' | 'loss' | 'draw') => {
		switch (result) {
			case 'win': return 'text-emerald-400 bg-emerald-600/20';
			case 'loss': return 'text-red-400 bg-red-600/20';
			case 'draw': return 'text-slate-400 bg-slate-600/20';
		}
	};

	const getResultIcon = (result: 'win' | 'loss' | 'draw') => {
		switch (result) {
			case 'win': return '🏆';
			case 'loss': return '💔';
			case 'draw': return '🤝';
		}
	};

	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const getBotName = (botId: string) => {
		return BOTS.find(b => b.id === botId)?.name || botId;
	};

	return (
		<div className="grid md:grid-cols-[1fr_300px] gap-8">
			{/* Games List */}
			<div className="flex flex-col gap-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold text-slate-100">Game History</h2>
					<div className="flex gap-2">
						<button
							onClick={handleExport}
							className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm rounded-lg border border-slate-600/50 transition-all"
						>
							Export Data
						</button>
						<button
							onClick={handleClearHistory}
							disabled={games.length === 0}
							className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg border border-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Clear All
						</button>
					</div>
				</div>

				{/* Games */}
				{games.length === 0 ? (
					<div className="p-12 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
						<div className="text-5xl mb-4">📊</div>
						<h3 className="text-lg font-medium text-slate-300 mb-2">No games yet</h3>
						<p className="text-slate-500">Play some games and they'll appear here!</p>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{games.map((game) => (
							<div
								key={game.id}
								onClick={() => setSelectedGame(game)}
								className={`p-4 bg-slate-800/50 rounded-xl border transition-all cursor-pointer ${
									selectedGame?.id === game.id
										? 'border-emerald-500/50'
										: 'border-slate-700/50 hover:border-slate-600/50'
								}`}
							>
								<div className="flex items-center gap-4">
									{/* Result */}
									<div className={`px-3 py-1.5 rounded-lg font-medium ${getResultColor(game.result)}`}>
										{getResultIcon(game.result)} {game.result.toUpperCase()}
									</div>

									{/* Game Info */}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<span className="text-slate-100 font-medium">
												vs {game.settings.bot.name}
											</span>
											<span className="text-xs px-2 py-0.5 rounded-full bg-slate-600/50 text-slate-400">
												{game.settings.bot.rating}
											</span>
										</div>
										<div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
											<span>{new Date(game.date).toLocaleDateString()}</span>
											<span>•</span>
											<span>{game.moves} moves</span>
											<span>•</span>
											<span>{formatDuration(game.duration)}</span>
										</div>
									</div>

									{/* Color played */}
									<div className={`w-6 h-6 rounded-full ${
										game.settings.playerColor === 'w' 
											? 'bg-white' 
											: 'bg-slate-900 border border-slate-600'
									}`} />

									{/* Delete */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteGame(game.id);
										}}
										className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-all"
									>
										<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Stats Sidebar */}
			<div className="flex flex-col gap-6">
				{/* Overall Stats */}
				{stats && stats.totalGames > 0 && (
					<div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
						<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
							Statistics
						</h3>
						
						<div className="flex flex-col gap-4">
							{/* Win Rate */}
							<div>
								<div className="flex justify-between text-sm mb-1">
									<span className="text-slate-400">Win Rate</span>
									<span className="text-emerald-400 font-bold">{stats.winRate}%</span>
								</div>
								<div className="h-2 bg-slate-700 rounded-full overflow-hidden">
									<div 
										className="h-full bg-emerald-500 transition-all duration-500"
										style={{ width: `${stats.winRate}%` }}
									/>
								</div>
							</div>

							{/* Record */}
							<div className="grid grid-cols-3 gap-2 text-center">
								<div className="p-3 bg-emerald-600/20 rounded-lg">
									<div className="text-2xl font-bold text-emerald-400">{stats.wins}</div>
									<div className="text-xs text-emerald-400/70">Wins</div>
								</div>
								<div className="p-3 bg-slate-600/20 rounded-lg">
									<div className="text-2xl font-bold text-slate-400">{stats.draws}</div>
									<div className="text-xs text-slate-400/70">Draws</div>
								</div>
								<div className="p-3 bg-red-600/20 rounded-lg">
									<div className="text-2xl font-bold text-red-400">{stats.losses}</div>
									<div className="text-xs text-red-400/70">Losses</div>
								</div>
							</div>

							{/* Other Stats */}
							<div className="flex flex-col gap-2 pt-2 border-t border-slate-700/50">
								<div className="flex justify-between text-sm">
									<span className="text-slate-500">Total Games</span>
									<span className="text-slate-300">{stats.totalGames}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-slate-500">Avg. Moves</span>
									<span className="text-slate-300">{stats.avgMoves}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-slate-500">Longest Game</span>
									<span className="text-slate-300">{stats.longestGame} moves</span>
								</div>
								{stats.favoriteBot && (
									<div className="flex justify-between text-sm">
										<span className="text-slate-500">Most Played</span>
										<span className="text-slate-300">{getBotName(stats.favoriteBot)}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Selected Game Details */}
				{selectedGame && (
					<div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
						<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
							Game Details
						</h3>
						
						<div className="flex flex-col gap-3">
							<div className="p-3 bg-slate-700/30 rounded-lg">
								<span className="text-slate-500 text-xs uppercase tracking-wider">PGN</span>
								<pre className="mt-1 text-slate-200 text-xs font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
									{selectedGame.pgn || 'No moves recorded'}
								</pre>
							</div>
							
							<div className="flex gap-2">
								<button
									onClick={() => navigator.clipboard.writeText(selectedGame.pgn)}
									className="flex-1 py-2 px-4 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm rounded-lg border border-slate-600/50 transition-all"
								>
									Copy PGN
								</button>
								{onAnalyzeGame && (
									<button
										onClick={() => onAnalyzeGame(selectedGame.pgn, selectedGame.fen)}
										className="flex-1 py-2 px-4 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-400 text-sm rounded-lg border border-emerald-600/40 transition-all"
									>
										Analyze
									</button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HistoryPage;

