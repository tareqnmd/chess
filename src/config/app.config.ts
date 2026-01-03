export const APP_CONFIG = {
	name: 'Chess',
	fullName: 'Chess - Play & Analyze',
	tagline: 'Play Against AI, Analyze Games & Learn Chess Strategy',
	version: '1.0.0',
	author: 'Md Tareq',

	url: 'https://chess.tareqnmd.com',
	baseUrl: '/',

	social: {
		twitter: '@tareqnmd',
		github: 'https://github.com/tareqnmd',
	},

	theme: {
		primaryColor: '#10b981',
		backgroundColor: '#0f172a',
		accentColor: '#34d399',
	},

	features: {
		aiOpponent: true,
		stockfishAnalysis: true,
		gameHistory: true,
		customThemes: true,
		exportPGN: true,
		multipleDifficulties: true,
	},

	game: {
		defaultTimeControl: {
			minutes: 10,
			increment: 0,
		},
		defaultBotRating: 1500,
		stockfishDepth: 18,
	},

	storageKeys: {
		boardSettings: 'chess_board_settings',
		userId: 'chess_user_id',
		gameHistory: 'chess_game_history',
		currentGame: 'chess_current_game',
		savedAnalyses: 'chess_saved_analyses',
	},

	contact: {
		email: 'tareqnmd@gmail.com',
		supportUrl: 'https://tareqnmd.com',
	},

	analytics: {
		enabled: false,
		googleAnalyticsId: 'G-XXXXXXXXXX',
		googleTagManagerId: '',
		measurementId: '',
	},

	verification: {
		google: '',
		bing: '',
		yandex: '',
		pinterest: '',
	},

	legal: {
		privacyPolicyUrl: 'https://chess.tareqnmd.com/privacy',
		termsOfServiceUrl: 'https://chess.tareqnmd.com/terms',
	},
} as const;

export type AppConfig = typeof APP_CONFIG;
