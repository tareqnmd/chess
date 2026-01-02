import { useCallback } from 'react';
import type { Color } from '@/components/common/types';
import {
	getUserPreferences,
	saveUserPreferences,
	getUserId,
} from '@/lib/storage';

interface UseGameStorageReturn {
	userId: string;
	getDefaultSettings: () => {
		botId: string;
		timeControlId: string;
		color: Color;
	};
	saveDefaultSettings: (
		botId: string,
		timeControlId: string,
		color: Color
	) => void;
}

export function useGameStorage(): UseGameStorageReturn {
	const userId = getUserId();

	const getDefaultSettings = useCallback(() => {
		const prefs = getUserPreferences();
		return {
			botId: prefs.defaultBot,
			timeControlId: prefs.defaultTimeControl,
			color: prefs.defaultColor,
		};
	}, []);

	const saveDefaultSettings = useCallback(
		(botId: string, timeControlId: string, color: Color) => {
			saveUserPreferences({
				defaultBot: botId,
				defaultTimeControl: timeControlId,
				defaultColor: color,
			});
		},
		[]
	);

	return {
		userId,
		getDefaultSettings,
		saveDefaultSettings,
	};
}
