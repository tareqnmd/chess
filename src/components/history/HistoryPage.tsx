import { BOTS } from '@/components/game/constants';
import {
	clearGameHistory,
	deleteGame,
	downloadExportData,
	getGameHistory,
	getGameStats,
	type GameStats,
	type SavedGame,
} from '@/lib/storage';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface HistoryPageProps {
	onAnalyzeGame?: (pgn: string, fen: string) => void;
}

const HistoryPage = ({ onAnalyzeGame }: HistoryPageProps) => {
	const [games, setGames] = useState<SavedGame[]>([]);
	const [stats, setStats] = useState<GameStats | null>(null);
	const [selectedGame, setSelectedGame] = useState<SavedGame | null>(null);

	useEffect(() => {
		setTimeout(() => {
			setGames(getGameHistory());
			setStats(getGameStats());
		}, 0);
	}, []);

	const handleDeleteGame = useCallback(
		(id: string) => {
			deleteGame(id);
			setGames(getGameHistory());
			setStats(getGameStats());
			if (selectedGame?.id === id) {
				setSelectedGame(null);
			}
			toast.success('Game deleted successfully');
		},
		[selectedGame]
	);

	const handleClearHistory = useCallback(() => {
		if (
			confirm(
				'Are you sure you want to clear all game history? This cannot be undone.'
			)
		) {
			clearGameHistory();
			setGames([]);
			setStats(getGameStats());
			setSelectedGame(null);
			toast.success('All game history cleared');
		}
	}, []);

	const handleExport = useCallback(() => {
		downloadExportData();
		toast.success('Game history exported successfully');
	}, []);

	const getResultColor = (result: 'win' | 'loss' | 'draw') => {
		switch (result) {
			case 'win':
				return 'text-emerald-400 bg-emerald-600/20';
			case 'loss':
				return 'text-red-400 bg-red-600/20';
			case 'draw':
				return 'text-slate-400 bg-slate-600/20';
		}
	};

	const getResultIcon = (result: 'win' | 'loss' | 'draw') => {
		switch (result) {
			case 'win':
				return '🏆';
			case 'loss':
				return '💔';
			case 'draw':
				return '🤝';
		}
	};

	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const getBotName = (botId: string) => {
		return BOTS.find((b) => b.id === botId)?.name || botId;
	};

	return (
		<div className="grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
			{}
			<section className="flex flex-col gap-6">
				{}
				<header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
					<h2 className="text-xl sm:text-2xl font-semibold text-slate-100">
						Game History
					</h2>
					<div className="flex gap-2 w-full sm:w-auto">
						<button
							onClick={handleExport}
							className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm rounded-lg border border-slate-600/50 transition-all"
							aria-label="Export game data"
						>
							Export Data
						</button>
						<button
							onClick={handleClearHistory}
							disabled={games.length === 0}
							className="flex-1 sm:flex-none px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg border border-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							aria-label="Clear all game history"
						>
							Clear All
						</button>
					</div>
				</header>

				{}
				{games.length === 0 ? (
					<div className="p-12 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
						<div className="text-5xl mb-4" aria-hidden="true">
							📊
						</div>
						<h3 className="text-lg font-medium text-slate-300 mb-2">
							No games yet
						</h3>
						<p className="text-slate-500">
							Play some games and they'll appear here!
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-3" role="list">
						{games.map((game) => (
							<article
								key={game.id}
								onClick={() => setSelectedGame(game)}
								className={`p-4 bg-slate-800/50 rounded-xl border transition-all cursor-pointer ${
									selectedGame?.id === game.id
										? 'border-emerald-500/50'
										: 'border-slate-700/50 hover:border-slate-600/50'
								}`}
								role="listitem"
								aria-label={`Game vs ${game.settings.bot.name}, ${game.result}`}
							>
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
									<div
										className={`px-3 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap ${getResultColor(game.result)}`}
									>
										{getResultIcon(game.result)} {game.result.toUpperCase()}
									</div>

									<div className="flex-1 min-w-0 w-full sm:w-auto">
										<div className="flex items-center gap-2 flex-wrap">
											<span className="text-slate-100 font-medium">
												vs {game.settings.bot.name}
											</span>
											<span className="text-xs px-2 py-0.5 rounded-full bg-slate-600/50 text-slate-400">
												{game.settings.bot.rating}
											</span>
										</div>
										<div className="flex items-center flex-wrap gap-2 sm:gap-3 text-sm text-slate-500 mt-1">
											<span>{new Date(game.date).toLocaleDateString()}</span>
											<span className="hidden sm:inline">•</span>
											<span>{game.moves} moves</span>
											<span className="hidden sm:inline">•</span>
											<span>{formatDuration(game.duration)}</span>
										</div>
									</div>

									<div className="flex items-center gap-3 ml-auto sm:ml-0">
										<div
											className={`w-6 h-6 rounded-full shrink-0 ${
												game.settings.playerColor === 'w'
													? 'bg-white'
													: 'bg-slate-900 border border-slate-600'
											}`}
										/>

										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteGame(game.id);
											}}
											className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-all"
											aria-label="Delete game"
										>
											<svg
												className="w-5 h-5"
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
										</button>
									</div>
								</div>
							</article>
						))}
					</div>
				)}
			</section>

			<aside className="flex flex-col gap-6">
				{stats && stats.totalGames > 0 && (
					<section className="p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
						<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
							Statistics
						</h3>

						<div className="flex flex-col gap-4">
							<div>
								<div className="flex justify-between text-sm mb-2">
									<span className="text-slate-400">Win Rate</span>
									<span className="text-emerald-400 font-bold">
										{stats.winRate}%
									</span>
								</div>
								<div className="h-2 bg-slate-700 rounded-full overflow-hidden">
									<div
										className="h-full bg-emerald-500 transition-all duration-500"
										style={{ width: `${stats.winRate}%` }}
									/>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
								<div className="p-2 sm:p-3 bg-emerald-600/20 rounded-lg">
									<div className="text-xl sm:text-2xl font-bold text-emerald-400">
										{stats.wins}
									</div>
									<div className="text-xs text-emerald-400/70 mt-1">Wins</div>
								</div>
								<div className="p-2 sm:p-3 bg-slate-600/20 rounded-lg">
									<div className="text-xl sm:text-2xl font-bold text-slate-400">
										{stats.draws}
									</div>
									<div className="text-xs text-slate-400/70 mt-1">Draws</div>
								</div>
								<div className="p-2 sm:p-3 bg-red-600/20 rounded-lg">
									<div className="text-xl sm:text-2xl font-bold text-red-400">
										{stats.losses}
									</div>
									<div className="text-xs text-red-400/70 mt-1">Losses</div>
								</div>
							</div>

							<div className="flex flex-col gap-2 pt-2 border-t border-slate-700/50">
								<div className="flex justify-between text-sm">
									<span className="text-slate-500">Total Games</span>
									<span className="text-slate-300 font-medium">
										{stats.totalGames}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-slate-500">Avg. Moves</span>
									<span className="text-slate-300 font-medium">
										{stats.avgMoves}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-slate-500">Longest Game</span>
									<span className="text-slate-300 font-medium">
										{stats.longestGame} moves
									</span>
								</div>
								{stats.favoriteBot && (
									<div className="flex justify-between text-sm">
										<span className="text-slate-500">Most Played</span>
										<span className="text-slate-300 font-medium">
											{getBotName(stats.favoriteBot)}
										</span>
									</div>
								)}
							</div>
						</div>
					</section>
				)}

				{selectedGame && (
					<section className="p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
						<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
							Game Details
						</h3>

						<div className="flex flex-col gap-3">
							<div className="p-3 bg-slate-700/30 rounded-lg">
								<span className="text-slate-500 text-xs uppercase tracking-wider block mb-2">
									PGN
								</span>
								<pre className="text-slate-200 text-xs font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50">
									{selectedGame.pgn || 'No moves recorded'}
								</pre>
							</div>

							<div className="flex flex-col sm:flex-row gap-2">
								<button
									onClick={() => {
										navigator.clipboard.writeText(selectedGame.pgn);
										toast.success('PGN copied to clipboard');
									}}
									className="flex-1 py-2 px-4 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm rounded-lg border border-slate-600/50 transition-all"
								>
									Copy PGN
								</button>
								{onAnalyzeGame && (
									<button
										onClick={() =>
											onAnalyzeGame(selectedGame.pgn, selectedGame.fen)
										}
										className="flex-1 py-2 px-4 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-400 text-sm rounded-lg border border-emerald-600/40 transition-all"
									>
										Analyze
									</button>
								)}
							</div>
						</div>
					</section>
				)}
			</aside>
		</div>
	);
};

export default HistoryPage;
