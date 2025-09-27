import Link from 'next/link';

const RootNotFound = () => {
	return (
		<div className="grid place-content-center gap-1 h-full text-center">
			<h2 className="text-xl font-bold">Page not found!</h2>
			<Link
				className="underline"
				href={'/'}
			>
				Go back to home
			</Link>
		</div>
	);
};

export default RootNotFound;
