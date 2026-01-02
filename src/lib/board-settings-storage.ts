import type { BoardSettings } from '@/types/board-settings';
import { DEFAULT_BOARD_SETTINGS } from '@/types/board-settings';

const BOARD_SETTINGS_KEY = 'chess_board_settings';
const USER_ID_KEY = 'chess_user_id';

/**
 * Generate a unique user ID (GUID)
 */
function generateUserId(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

/**
 * Get or create user ID
 */
export function getUserId(): string {
	try {
		let userId = localStorage.getItem(USER_ID_KEY);
		if (!userId) {
			userId = generateUserId();
			localStorage.setItem(USER_ID_KEY, userId);
		}
		return userId;
	} catch (error) {
		console.error('Failed to get/create user ID:', error);
		return generateUserId();
	}
}

/**
 * Load board settings from local storage
 */
export function loadBoardSettings(): BoardSettings {
	try {
		const userId = getUserId();
		const stored = localStorage.getItem(BOARD_SETTINGS_KEY);
		
		if (stored) {
			const settings = JSON.parse(stored) as BoardSettings;
			// Ensure userId is set
			settings.userId = userId;
			return settings;
		}
		
		return {
			...DEFAULT_BOARD_SETTINGS,
			userId,
		};
	} catch (error) {
		console.error('Failed to load board settings:', error);
		return {
			...DEFAULT_BOARD_SETTINGS,
			userId: getUserId(),
		};
	}
}

/**
 * Save board settings to local storage
 */
export function saveBoardSettings(settings: BoardSettings): void {
	try {
		// Ensure userId is set
		if (!settings.userId) {
			settings.userId = getUserId();
		}
		localStorage.setItem(BOARD_SETTINGS_KEY, JSON.stringify(settings));
	} catch (error) {
		console.error('Failed to save board settings:', error);
	}
}

/**
 * Reset board settings to defaults
 */
export function resetBoardSettings(): BoardSettings {
	const settings = {
		...DEFAULT_BOARD_SETTINGS,
		userId: getUserId(),
	};
	saveBoardSettings(settings);
	return settings;
}

