import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AnalysisPage from './components/analysis/AnalysisPage';
import { BoardSettingsModal } from './components/common/BoardSettingsModal';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import NotFound from './components/common/NotFound';
import type { BoardSettings } from './components/common/types';
import GamePlay from './components/game/play/GamePlay';
import HistoryPage from './components/history/HistoryPage';
import {
	getUserId,
	loadBoardSettings,
	saveBoardSettings,
} from './lib/board-settings-storage';
import {
	initializeAnalytics,
	setUserId,
	trackPageView,
} from './utils/analytics';
import { updatePageMeta } from './utils/meta';

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const [boardSettings, setBoardSettings] = useState<BoardSettings>(() =>
		loadBoardSettings()
	);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const handleAnalyzeGame = useCallback(
		(pgn: string, fen: string) => {
			navigate('/analysis', { state: { pgn, fen } });
		},
		[navigate]
	);

	useEffect(() => {
		initializeAnalytics();

		const userId = getUserId();
		setUserId(userId);
	}, []);

	useEffect(() => {
		const getPageFromPath = (pathname: string) => {
			if (pathname === '/') return 'play';
			if (pathname.startsWith('/analysis')) return 'analysis';
			if (pathname.startsWith('/history')) return 'history';
			return 'play';
		};

		const currentPage = getPageFromPath(location.pathname);
		updatePageMeta(currentPage);
		trackPageView(currentPage);
	}, [location.pathname]);

	const handleSaveSettings = useCallback((settings: BoardSettings) => {
		setBoardSettings(settings);
		saveBoardSettings(settings);
	}, []);

	return (
		<div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
			<Toaster
				position="bottom-right"
				expand={false}
				richColors
				closeButton
				theme="dark"
			/>
			<div className="min-h-screen grid grid-rows-[auto_1fr_auto] gap-4 md:gap-6 lg:gap-8">
				<Header onOpenSettings={() => setIsSettingsOpen(true)} />
				<main className="container">
					<Routes>
						<Route
							path="/"
							element={<GamePlay boardSettings={boardSettings} />}
						/>
						<Route
							path="/analysis"
							element={<AnalysisPage boardSettings={boardSettings} />}
						/>
						<Route
							path="/history"
							element={<HistoryPage onAnalyzeGame={handleAnalyzeGame} />}
						/>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</main>
				<Footer />
			</div>
			<BoardSettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				settings={boardSettings}
				onSave={handleSaveSettings}
			/>
		</div>
	);
}

export default App;
