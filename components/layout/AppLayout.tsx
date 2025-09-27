import Footer from '../common/Footer';
import Header from '../common/Header';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Header />
			<main>{children}</main>
			<Footer />
		</>
	);
};

export default AppLayout;
