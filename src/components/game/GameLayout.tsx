const GameLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="grid lg:grid-cols-[minmax(300px,1fr)_minmax(300px,420px)] gap-6 lg:gap-8 items-start">
			{children}
		</div>
	);
};

export default GameLayout;

