/**
 * Application Configuration
 * Central place for app-wide settings and constants
 */

export const APP_CONFIG = {
	// App Identity
	name: 'Chess',
	fullName: 'Chess - Play & Analyze',
	tagline: 'Play Against AI, Analyze Games & Learn Chess Strategy',
	version: '1.0.0',
	author: 'Chess App',
	
	// URLs
	url: 'https://yourchessapp.com',
	baseUrl: '/',
	
	// Social Media
	social: {
		twitter: '@yourhandle',
		github: 'https://github.com/yourusername/chess',
	},
	
	// Theme
	theme: {
		primaryColor: '#10b981', // emerald-500
		backgroundColor: '#0f172a', // slate-900
		accentColor: '#34d399', // emerald-400
	},
	
	// Features
	features: {
		aiOpponent: true,
		stockfishAnalysis: true,
		gameHistory: true,
		customThemes: true,
		exportPGN: true,
		multipleDifficulties: true,
	},
	
	// Game Settings
	game: {
		defaultTimeControl: {
			minutes: 10,
			increment: 0,
		},
		defaultBotRating: 1500,
		stockfishDepth: 18,
	},
	
	// Storage Keys
	storageKeys: {
		boardSettings: 'chess_board_settings',
		userId: 'chess_user_id',
		gameHistory: 'chess_game_history',
		currentGame: 'chess_current_game',
		savedAnalyses: 'chess_saved_analyses',
	},
	
	// Contact & Support
	contact: {
		email: 'support@yourchessapp.com',
		supportUrl: 'https://yourchessapp.com/support',
	},
	
	// Analytics (optional)
	analytics: {
		enabled: false,
		googleAnalyticsId: 'GA_MEASUREMENT_ID',
	},
	
	// Legal
	legal: {
		privacyPolicyUrl: 'https://yourchessapp.com/privacy',
		termsOfServiceUrl: 'https://yourchessapp.com/terms',
	},
} as const;

export type AppConfig = typeof APP_CONFIG;

