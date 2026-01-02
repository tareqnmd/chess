import { Link, NavLink } from 'react-router-dom';
import { BoardSettingsButton } from './BoardSettingsButton';

interface HeaderProps {
	onOpenSettings: () => void;
}

const Header = ({ onOpenSettings }: HeaderProps) => {
	const navLinkClass = ({ isActive }: { isActive: boolean }) =>
		`text-sm font-medium transition-all ${
			isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
		}`;

	return (
		<header className="border-b border-slate-700/50">
			<div className="container">
				<div className="flex justify-between items-center flex-wrap gap-4">
					<Link to="/" className="no-underline">
						<h1 className="text-xl sm:text-2xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">
							Chess
						</h1>
					</Link>

					<div className="flex items-center gap-4">
						<nav
							className="flex gap-3 sm:gap-4 md:gap-6"
							aria-label="Main navigation"
						>
							<NavLink to="/" className={navLinkClass} end>
								Play
							</NavLink>
							<NavLink to="/analysis" className={navLinkClass}>
								Analysis
							</NavLink>
							<NavLink to="/history" className={navLinkClass}>
								History
							</NavLink>
						</nav>

						<BoardSettingsButton onClick={onOpenSettings} />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
