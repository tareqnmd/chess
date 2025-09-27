'use client';

const ErrorComponent = ({ reset }: { reset: () => void }) => {
	return (
		<div className="grid place-content-center gap-1 h-full text-center">
			<h2 className="text-xl font-bold">Something went wrong!</h2>
			<button
				className="underline"
				onClick={() => reset()}
			>
				Try again
			</button>
		</div>
	);
};

export default ErrorComponent;
