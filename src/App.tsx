import { useCallback, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import AnalysisPage from './components/analysis/AnalysisPage';
import { BoardSettingsModal } from './components/common/BoardSettingsModal';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
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

type Page = 'play' | 'analysis' | 'history';

interface AnalysisImport {
	pgn?: string;
	fen?: string;
}

function App() {
	const [currentPage, setCurrentPage] = useState<Page>('play');
	const [analysisImport, setAnalysisImport] = useState<AnalysisImport>({});
	const [boardSettings, setBoardSettings] = useState<BoardSettings>(() =>
		loadBoardSettings()
	);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const handleAnalyzeGame = useCallback((pgn: string, fen: string) => {
		setAnalysisImport({ pgn, fen });
		setCurrentPage('analysis');
	}, []);

	const handleNavigate = useCallback((page: Page) => {
		if (page !== 'analysis') {
			setAnalysisImport({});
		}
		setCurrentPage(page);

		updatePageMeta(page);

		trackPageView(page);
	}, []);

	useEffect(() => {
		initializeAnalytics();

		const userId = getUserId();
		setUserId(userId);

		updatePageMeta(currentPage);

		trackPageView(currentPage);
	}, [currentPage]);

	const handleSaveSettings = useCallback((settings: BoardSettings) => {
		setBoardSettings(settings);
		saveBoardSettings(settings);
	}, []);

	const renderPage = () => {
		switch (currentPage) {
			case 'play':
				return <GamePlay boardSettings={boardSettings} />;
			case 'analysis':
				return (
					<AnalysisPage
						importedPgn={analysisImport.pgn}
						importedFen={analysisImport.fen}
						boardSettings={boardSettings}
					/>
				);
			case 'history':
				return <HistoryPage onAnalyzeGame={handleAnalyzeGame} />;
			default:
				return <GamePlay boardSettings={boardSettings} />;
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
			<Toaster
				position="bottom-right"
				expand={false}
				richColors
				closeButton
				theme="dark"
			/>
			<div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
				<Header
					currentPage={currentPage}
					onNavigate={handleNavigate}
					onOpenSettings={() => setIsSettingsOpen(true)}
				/>
				<main className="mt-8">{renderPage()}</main>
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
