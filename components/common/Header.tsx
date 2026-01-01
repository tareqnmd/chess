import Link from 'next/link';

const Header = () => {
	return (
		<header className="flex justify-between items-center py-2">
			<Link href="/" className="group flex items-center gap-3">
				<div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
					<span className="text-xl">♟</span>
				</div>
				<h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
					CHESS
				</h1>
			</Link>
			<nav className="flex gap-1">
				<Link
					href="/"
					className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
				>
					Play
				</Link>
				<Link
					href="/analysis"
					className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
				>
					Analysis
				</Link>
			</nav>
		</header>
	);
};

export default Header;
