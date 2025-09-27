import AppLayout from '@/components/layout/AppLayout';
import '@/style/globals.css';
import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';

const font = Lexend({
	variable: '--font-lexend',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'CHESS - T32',
	description: 'Play Chess!',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				suppressHydrationWarning
				id="chess-t32"
				className={`${font.variable} antialiased`}
			>
				<AppLayout>{children}</AppLayout>
			</body>
		</html>
	);
}
