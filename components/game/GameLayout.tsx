const GameLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="grid md:grid-cols-[minmax(300px,600px)_minmax(300px,400px)] gap-8 items-start justify-center">
			{children}
		</div>
	);
};

export default GameLayout;
