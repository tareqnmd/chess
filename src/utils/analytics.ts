/**
 * Analytics Utilities
 * Helper functions for Google Analytics and other tracking services
 */

import { APP_CONFIG } from '@/config';

declare global {
	interface Window {
		gtag?: (...args: any[]) => void;
		dataLayer?: any[];
	}
}

/**
 * Initialize Google Analytics
 */
export function initializeAnalytics() {
	if (!APP_CONFIG.analytics.enabled || !APP_CONFIG.analytics.googleAnalyticsId) {
		console.log('Analytics disabled or not configured');
		return;
	}

	// Load Google Analytics script
	const script = document.createElement('script');
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${APP_CONFIG.analytics.googleAnalyticsId}`;
	document.head.appendChild(script);

	// Initialize dataLayer
	window.dataLayer = window.dataLayer || [];
	window.gtag = function gtag(...args: any[]) {
		window.dataLayer?.push(args);
	};

	window.gtag('js', new Date());
	window.gtag('config', APP_CONFIG.analytics.googleAnalyticsId, {
		send_page_view: false, // We'll send manually
	});

	console.log('Google Analytics initialized');
}

/**
 * Track page view
 */
export function trackPageView(
	page: string,
	title?: string,
	path?: string
) {
	if (!APP_CONFIG.analytics.enabled || !window.gtag) return;

	window.gtag('event', 'page_view', {
		page_title: title || document.title,
		page_location: window.location.href,
		page_path: path || window.location.pathname,
		page: page,
	});

	console.log('Page view tracked:', page);
}

/**
 * Track custom event
 */
export function trackEvent(
	eventName: string,
	eventParams?: Record<string, any>
) {
	if (!APP_CONFIG.analytics.enabled || !window.gtag) return;

	window.gtag('event', eventName, eventParams);

	console.log('Event tracked:', eventName, eventParams);
}

/**
 * Track game start
 */
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

/**
 * Track game end
 */
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

/**
 * Track analysis
 */
export function trackAnalysis(depth: number, positionType: string = 'custom') {
	trackEvent('position_analysis', {
		depth,
		position_type: positionType,
	});
}

/**
 * Track board settings change
 */
export function trackBoardSettingsChange(settingType: string, value: any) {
	trackEvent('settings_change', {
		setting_type: settingType,
		value: String(value),
	});
}

/**
 * Track user engagement time
 */
export function trackEngagement(page: string, timeSpent: number) {
	trackEvent('user_engagement', {
		page,
		time_spent_seconds: timeSpent,
	});
}

/**
 * Track error
 */
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

/**
 * Track social share
 */
export function trackShare(platform: string, page: string) {
	trackEvent('share', {
		platform,
		page,
	});
}

/**
 * Track search (if implementing search feature)
 */
export function trackSearch(searchTerm: string, resultsCount: number) {
	trackEvent('search', {
		search_term: searchTerm,
		results_count: resultsCount,
	});
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
	if (!APP_CONFIG.analytics.enabled || !window.gtag) return;

	window.gtag('set', 'user_properties', properties);
}

/**
 * Track performance metrics
 */
export function trackPerformance(metricName: string, value: number) {
	trackEvent('performance', {
		metric_name: metricName,
		value,
	});
}

/**
 * Initialize user tracking (with user ID from storage)
 */
export function setUserId(userId: string) {
	if (!APP_CONFIG.analytics.enabled || !window.gtag) return;

	window.gtag('config', APP_CONFIG.analytics.googleAnalyticsId, {
		user_id: userId,
	});
}

