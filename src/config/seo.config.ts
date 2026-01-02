import { APP_CONFIG } from './app.config';

const DEFAULT_DESCRIPTION =
	'Master chess with AI opponents, powerful analysis tools powered by Stockfish, and comprehensive game history. Choose from multiple difficulty levels and improve your chess skills.';

export const SEO_CONFIG = {
	title: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
	titleTemplate: '%s | Chess',
	defaultTitle: 'Chess - Play Against AI, Analyze Games & Learn Chess Strategy',

	description: DEFAULT_DESCRIPTION,

	keywords: [
		'chess',
		'chess game',
		'play chess online',
		'chess AI',
		'chess analysis',
		'stockfish',
		'chess strategy',
		'learn chess',
		'chess puzzles',
		'chess training',
		'chess engine',
		'chess board',
		'chess tactics',
		'chess openings',
		'online chess',
	],

	canonical: APP_CONFIG.url,

	language: 'en',
	locale: 'en_US',

	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},

	structuredData: {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: APP_CONFIG.name,
		applicationCategory: 'Game',
		applicationSubCategory: 'Chess Game',
		operatingSystem: 'Any',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
		},
		description: DEFAULT_DESCRIPTION,
		featureList: [
			'Play against AI opponents',
			'Multiple difficulty levels (Beginner to Master)',
			'Stockfish chess engine analysis',
			'Game history tracking and review',
			'Position analysis with evaluation',
			'Customizable board and piece themes',
			'Time controls and clock management',
			'Move history and notation',
			'PGN import and export',
		],
		screenshot: `${APP_CONFIG.url}/chess.svg`,
		softwareVersion: APP_CONFIG.version,
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: '4.8',
			ratingCount: '150',
		},
		author: {
			'@type': 'Organization',
			name: APP_CONFIG.author,
		},
	},

	additional: {
		author: APP_CONFIG.author,
		creator: APP_CONFIG.author,
		publisher: APP_CONFIG.author,
		formatDetection: {
			telephone: false,
			date: false,
			address: false,
			email: false,
		},
		themeColor: APP_CONFIG.theme.backgroundColor,
		mobileWebAppCapable: true,
		appleMobileWebAppCapable: true,
		appleMobileWebAppStatusBarStyle: 'black-translucent',
		appleMobileWebAppTitle: APP_CONFIG.name,
	},
} as const;

export type SEOConfig = typeof SEO_CONFIG;
