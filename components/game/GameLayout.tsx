const GameLayout = ({ children }: { children: React.ReactNode }) => {
	return <div className="grid md:grid-cols-[7fr_5fr]">{children}</div>;
};

export default GameLayout;
