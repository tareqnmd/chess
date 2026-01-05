import type { Color } from '@/components/common/types';
import {
	getUserId,
	getUserPreferences,
	saveUserPreferences,
	UserPreferences,
} from '@/lib/storage';
import { useCallback, useEffect, useState } from 'react';

interface UseGameStorageReturn {
	userId: string | null;
	getDefaultSettings: () => {
		botId: string;
		timeControlId: string;
		color: Color;
	} | null;
	saveDefaultSettings: (
		botId: string,
		timeControlId: string,
		color: Color
	) => Promise<void>;
}

export function useGameStorage(): UseGameStorageReturn {
	const [userId, setUserId] = useState<string | null>(null);
	const [prefs, setPrefs] = useState<UserPreferences | null>(null);

	useEffect(() => {
		(async () => {
			setUserId(await getUserId());
			const resolvedPrefs = await getUserPreferences();
			setPrefs(resolvedPrefs);
		})();
	}, []);

	const getDefaultSettings = useCallback(() => {
		if (!prefs) return null;
		return {
			botId: prefs.defaultBot,
			timeControlId: prefs.defaultTimeControl,
			color: prefs.defaultColor,
		};
	}, [prefs]);

	const saveDefaultSettings = useCallback(
		async (botId: string, timeControlId: string, color: Color) => {
			await saveUserPreferences({
				defaultBot: botId,
				defaultTimeControl: timeControlId,
				defaultColor: color,
			});
			const resolvedPrefs = await getUserPreferences();
			setPrefs(resolvedPrefs);
		},
		[]
	);

	return {
		userId,
		getDefaultSettings,
		saveDefaultSettings,
	};
}
