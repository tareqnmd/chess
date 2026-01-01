const Footer = () => {
	return (
		<footer className="mt-12">
			<div className="border-t border-slate-700/50 -mx-4"></div>
			<div className="pt-8 text-center text-slate-500 text-sm">
				<p>
					© {new Date().getFullYear()} Chess. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;

