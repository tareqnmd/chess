import Link from 'next/link';

const Header = () => {
	return (
		<header className="flex justify-between items-center">
			<h1 className="text-2xl font-bold">CHESS - T32</h1>
			<nav className="flex gap-4">
				<Link href="/">Play</Link>
				<Link href="/analysis">Analysis</Link>
			</nav>
		</header>
	);
};

export default Header;
