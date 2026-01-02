import { APP_CONFIG } from '@/config';

type GtagCommand = 'config' | 'set' | 'event' | 'js';
type GtagConfigParams = {
	send_page_view?: boolean;
	user_id?: string;
	[key: string]: string | number | boolean | undefined;
};
type GtagEventParams = {
	[key: string]: string | number | boolean | undefined;
};

declare global {
	interface Window {
		gtag?: (
			command: GtagCommand,
			targetId: string | Date,
			config?: GtagConfigParams | GtagEventParams
		) => void;
		dataLayer?: unknown[];
	}
}

export function initializeAnalytics() {
	if (
		!APP_CONFIG.analytics.enabled ||
		!APP_CONFIG.analytics.googleAnalyticsId
	) {
		console.log('Analytics disabled or not configured');
		return;
	}

	const script = document.createElement('script');
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${APP_CONFIG.analytics.googleAnalyticsId}`;
	document.head.appendChild(script);

	window.dataLayer = window.dataLayer || [];
	window.gtag = function gtag(
		command: GtagCommand,
		targetId: string | Date,
		config?: GtagConfigParams | GtagEventParams
	) {
		window.dataLayer?.push([command, targetId, config]);
	};

	window.gtag('js', new Date());
	window.gtag('config', APP_CONFIG.analytics.googleAnalyticsId, {
		send_page_view: false,
	});

	console.log('Google Analytics initialized');
}

export function trackPageView(page: string, title?: string, path?: string) {
	if (!APP_CONFIG.analytics.enabled || !window.gtag) return;

	window.gtag('event', 'page_view', {
		page_title: title || document.title,
		page_location: window.location.href,
		page_path: path || window.location.pathname,
		page: page,
	});

	console.log('Page view tracked:', page);
}

export function trackEvent(
	eventName: string,
	eventParams?: Record<string, string | number | boolean | undefined>
) {
	if (!APP_CONFIG.analytics.enabled || !window.gtag) return;

	window.gtag('event', eventName, eventParams);

	console.log('Event tracked:', eventName, eventParams);
}

export function trackGameStart(
	botName: string,
	botRating: number,
	timeControl: string,
	playerColor: string
) {
	trackEvent('game_start', {
		bot_name: botName,
		bot_rating: botRating,
		time_control: timeControl,
		player_color: playerColor,
	});
}

export function trackGameEnd(
	result: 'win' | 'loss' | 'draw',
	moves: number,
	duration: number
) {
	trackEvent('game_end', {
		result,
		moves,
		duration_seconds: duration,
	});
}

export function trackAnalysis(depth: number, positionType: string = 'custom') {
	trackEvent('position_analysis', {
		depth,
		position_type: positionType,
	});
}

export function trackBoardSettingsChange(
	settingType: string,
	value: string | number | boolean
) {
	trackEvent('settings_change', {
		setting_type: settingType,
		value: String(value),
	});
}

export function trackEngagement(page: string, timeSpent: number) {
	trackEvent('user_engagement', {
		page,
		time_spent_seconds: timeSpent,
	});
}

export function trackError(
	errorMessage: string,
	errorLocation: string,
	severity: 'low' | 'medium' | 'high' = 'medium'
) {
	trackEvent('error', {
		error_message: errorMessage,
		error_location: errorLocation,
		severity,
	});
}

export function trackShare(platform: string, page: string) {
	trackEvent('share', {
		platform,
		page,
	});
}

export function trackSearch(searchTerm: string, resultsCount: number) {
	trackEvent('search', {
		search_term: searchTerm,
		results_count: resultsCount,
	});
}
export function setUserProperties(
	properties: Record<string, string | number | boolean | undefined>
) {
	if (!APP_CONFIG.analytics.enabled || !window.gtag) return;

	window.gtag('set', 'user_properties', properties);
}

export function trackPerformance(metricName: string, value: number) {
	trackEvent('performance', {
		metric_name: metricName,
		value,
	});
}

export function setUserId(userId: string) {
	if (!APP_CONFIG.analytics.enabled || !window.gtag) return;

	window.gtag('config', APP_CONFIG.analytics.googleAnalyticsId, {
		user_id: userId,
	});
}
