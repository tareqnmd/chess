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
			<Header />
			<main>{children}</main>
			<Footer />
		</>
	);
};

export default AppLayout;
