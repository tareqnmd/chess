import NextTopLoader from 'nextjs-toploader';
import Footer from '../common/Footer';
import Header from '../common/Header';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<NextTopLoader
				color="var(--primary)"
				showSpinner={false}
			/>
			<div className="container px-4 py-8 mx-auto grid grid-rows-[auto_1fr_auto] min-h-screen gap-8">
				<Header />
				<main>{children}</main>
				<Footer />
			</div>
		</>
	);
};

export default AppLayout;
