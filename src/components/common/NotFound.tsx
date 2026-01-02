import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
			<div className="text-8xl sm:text-9xl font-bold text-emerald-400/20 mb-4">
				404
			</div>
			<h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4">
				Page Not Found
			</h1>
			<p className="text-slate-400 mb-8 max-w-md">
				The page you're looking for doesn't exist or has been moved.
			</p>
			<Link
				to="/"
				className="px-6 py-3 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-400 rounded-lg border border-emerald-600/40 transition-all font-medium"
			>
				Go Home
			</Link>
		</div>
	);
};

export default NotFound;
