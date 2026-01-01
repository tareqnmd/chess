import { useState, useCallback } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import GamePlay from './components/game/play/GamePlay';
import AnalysisPage from './components/analysis/AnalysisPage';
import HistoryPage from './components/history/HistoryPage';

type Page = 'play' | 'analysis' | 'history';

interface AnalysisImport {
	pgn?: string;
	fen?: string;
}

function App() {
	const [currentPage, setCurrentPage] = useState<Page>('play');
	const [analysisImport, setAnalysisImport] = useState<AnalysisImport>({});

	const handleAnalyzeGame = useCallback((pgn: string, fen: string) => {
		setAnalysisImport({ pgn, fen });
		setCurrentPage('analysis');
	}, []);

	const handleNavigate = useCallback((page: Page) => {
		// Clear import data when navigating away from analysis
		if (page !== 'analysis') {
			setAnalysisImport({});
		}
		setCurrentPage(page);
	}, []);

	const renderPage = () => {
		switch (currentPage) {
			case 'play':
				return <GamePlay />;
			case 'analysis':
				return (
					<AnalysisPage 
						importedPgn={analysisImport.pgn} 
						importedFen={analysisImport.fen} 
					/>
				);
			case 'history':
				return <HistoryPage onAnalyzeGame={handleAnalyzeGame} />;
			default:
				return <GamePlay />;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<Header currentPage={currentPage} onNavigate={handleNavigate} />
				<main>{renderPage()}</main>
				<Footer />
			</div>
		</div>
	);
}

export default App;
