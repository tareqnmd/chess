/**
 * Meta & Social Media Configuration
 * Open Graph, Twitter Cards, and other social media metadata
 */

import { APP_CONFIG } from './app.config';
import { SEO_CONFIG } from './seo.config';

export const META_CONFIG = {
	// Open Graph (Facebook, LinkedIn, etc.)
	openGraph: {
		type: 'website',
		url: APP_CONFIG.url,
		title: SEO_CONFIG.defaultTitle,
		description: SEO_CONFIG.description,
		siteName: APP_CONFIG.name,
		locale: SEO_CONFIG.locale,
		images: [
			{
				url: `${APP_CONFIG.url}/chess.svg`,
				width: 1200,
				height: 630,
				alt: 'Chess - Play Against AI',
				type: 'image/svg+xml',
			},
		],
	},
	
	// Twitter Card
	twitter: {
		card: 'summary_large_image',
		site: APP_CONFIG.social.twitter,
		creator: APP_CONFIG.social.twitter,
		title: SEO_CONFIG.defaultTitle,
		description: SEO_CONFIG.description,
		images: [`${APP_CONFIG.url}/chess.svg`],
	},
	
	// Page-specific metadata (can be overridden per page)
	pages: {
		play: {
			title: 'Play Chess Against AI',
			description:
				'Challenge AI opponents at different difficulty levels. Choose from Beginner to Master and improve your chess skills with intelligent opponents.',
			keywords: ['play chess', 'chess AI', 'chess bot', 'chess computer'],
		},
		analysis: {
			title: 'Chess Position Analysis',
			description:
				'Analyze chess positions with powerful Stockfish engine. Get evaluation scores, best moves, and deep insights into your games.',
			keywords: [
				'chess analysis',
				'stockfish',
				'position evaluation',
				'chess engine',
			],
		},
		history: {
			title: 'Chess Game History',
			description:
				'Review your past games, track your progress, and learn from your matches. Export games in PGN format for further analysis.',
			keywords: ['game history', 'chess records', 'pgn export', 'game review'],
		},
	},
	
	// Social Sharing defaults
	sharing: {
		title: SEO_CONFIG.defaultTitle,
		description: SEO_CONFIG.description,
		hashtags: ['chess', 'chessgame', 'learnchess', 'chessanalysis'],
		via: APP_CONFIG.social.twitter.replace('@', ''),
	},
} as const;

export type MetaConfig = typeof META_CONFIG;

/**
 * Generate page-specific meta tags
 */
export function getPageMeta(page: keyof typeof META_CONFIG.pages) {
	const pageMeta = META_CONFIG.pages[page];
	
	return {
		title: `${pageMeta.title} | ${APP_CONFIG.name}`,
		description: pageMeta.description,
		keywords: [...SEO_CONFIG.keywords, ...pageMeta.keywords],
		openGraph: {
			...META_CONFIG.openGraph,
			title: pageMeta.title,
			description: pageMeta.description,
		},
		twitter: {
			...META_CONFIG.twitter,
			title: pageMeta.title,
			description: pageMeta.description,
		},
	};
}

