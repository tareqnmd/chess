import { APP_CONFIG } from '@/config';

const Footer = () => {
	return (
		<footer className="border-t border-slate-700/50">
			<div className="container text-center text-slate-500 text-sm">
				<p>
					© {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
				</p>
				<p className="mt-2 text-xs">v{APP_CONFIG.version}</p>
			</div>
		</footer>
	);
};

export default Footer;
