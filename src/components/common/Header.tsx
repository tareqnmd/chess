import { useState } from 'react';

interface HeaderProps {
	currentPage: 'play' | 'analysis' | 'history';
	onNavigate: (page: 'play' | 'analysis' | 'history') => void;
}

const Header = ({ currentPage, onNavigate }: HeaderProps) => {
	return (
		<header className="mb-8 pb-6 border-b border-slate-700/50">
			<div className="flex justify-between items-center">
				<h1 className="text-xl font-bold text-emerald-400">
					chess
				</h1>
				
				<nav className="flex gap-6">
					<button
						onClick={() => onNavigate('play')}
						className={`text-sm font-medium transition-all ${
							currentPage === 'play'
								? 'text-emerald-400'
								: 'text-slate-400 hover:text-slate-200'
						}`}
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
					>
						History
					</button>
				</nav>
			</div>
		</header>
	);
};

export default Header;

