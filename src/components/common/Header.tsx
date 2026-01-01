import { useState } from 'react';

interface HeaderProps {
	currentPage: 'play' | 'analysis' | 'history';
	onNavigate: (page: 'play' | 'analysis' | 'history') => void;
}

const Header = ({ currentPage, onNavigate }: HeaderProps) => {
	return (
		<header className="flex justify-between items-center mb-8">
			<div className="flex items-center gap-3">
				<span className="text-4xl">♟️</span>
				<h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
					Chess Master
				</h1>
			</div>
			
			<nav className="flex gap-2">
				<button
					onClick={() => onNavigate('play')}
					className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
						currentPage === 'play'
							? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
							: 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
					}`}
				>
					Play
				</button>
				<button
					onClick={() => onNavigate('analysis')}
					className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
						currentPage === 'analysis'
							? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
							: 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
					}`}
				>
					Analysis
				</button>
				<button
					onClick={() => onNavigate('history')}
					className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
						currentPage === 'history'
							? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
							: 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
					}`}
				>
					History
				</button>
			</nav>
		</header>
	);
};

export default Header;

