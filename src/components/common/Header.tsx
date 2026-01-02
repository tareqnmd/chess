import { BoardSettingsButton } from './BoardSettingsButton';

interface HeaderProps {
	currentPage: 'play' | 'analysis' | 'history';
	onNavigate: (page: 'play' | 'analysis' | 'history') => void;
	onOpenSettings: () => void;
}

const Header = ({ currentPage, onNavigate, onOpenSettings }: HeaderProps) => {
	return (
		<header className="mb-6">
			<div className="flex justify-between items-center flex-wrap gap-6 pb-4 sm:pb-6">
				<h1 className="text-xl sm:text-2xl font-bold text-emerald-400">
					Chess
				</h1>

				<div className="flex items-center gap-4">
					<nav
						className="flex gap-3 sm:gap-4 md:gap-6"
						aria-label="Main navigation"
					>
						<button
							onClick={() => onNavigate('play')}
							className={`text-sm font-medium transition-all ${
								currentPage === 'play'
									? 'text-emerald-400'
									: 'text-slate-400 hover:text-slate-200'
							}`}
							aria-current={currentPage === 'play' ? 'page' : undefined}
						>
							Play
						</button>
						<button
							onClick={() => onNavigate('analysis')}
							className={`text-sm font-medium transition-all ${
								currentPage === 'analysis'
									? 'text-emerald-400'
									: 'text-slate-400 hover:text-slate-200'
							}`}
							aria-current={currentPage === 'analysis' ? 'page' : undefined}
						>
							Analysis
						</button>
						<button
							onClick={() => onNavigate('history')}
							className={`text-sm font-medium transition-all ${
								currentPage === 'history'
									? 'text-emerald-400'
									: 'text-slate-400 hover:text-slate-200'
							}`}
							aria-current={currentPage === 'history' ? 'page' : undefined}
						>
							History
						</button>
					</nav>

					<BoardSettingsButton onClick={onOpenSettings} />
				</div>
			</div>
			<div className="border-b border-slate-700/50"></div>
		</header>
	);
};

export default Header;
