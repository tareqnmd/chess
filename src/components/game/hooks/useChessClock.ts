import type { Color } from '@/components/common/types';
import type { ClockState, TimeControl } from '@/components/game/types';
import { useCallback, useEffect, useRef, useState } from 'react';

const colorToKey = (color: Color): 'white' | 'black' => {
	return color === 'w' ? 'white' : 'black';
};

interface UseChessClockReturn {
	clockState: ClockState;
	startClock: (timeControl: TimeControl) => void;
	switchTurn: (newActiveColor: Color) => void;
	pauseClock: () => void;
	resumeClock: () => void;
	stopClock: () => void;
	resetClock: (
		timeControl: TimeControl,
		whiteTime?: number,
		blackTime?: number
	) => void;
	addIncrement: (color: Color, increment: number) => void;
	formatTime: (ms: number) => string;
	startCountdown: () => void;
}

export function useChessClock(
	onTimeout?: (loser: Color) => void
): UseChessClockReturn {
	const [clockState, setClockState] = useState<ClockState>({
		white: 0,
		black: 0,
		activeColor: null,
		isRunning: false,
	});

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const lastTickRef = useRef<number>(0);
	const incrementRef = useRef<number>(0);

	const clearTimer = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const startTimer = useCallback(() => {
		clearTimer();
		lastTickRef.current = Date.now();

		intervalRef.current = setInterval(() => {
			const now = Date.now();
			const elapsed = now - lastTickRef.current;
			lastTickRef.current = now;

			setClockState((prev) => {
				if (!prev.isRunning || !prev.activeColor) return prev;

				const activeKey = colorToKey(prev.activeColor);
				const newTime = Math.max(0, prev[activeKey] - elapsed);

				if (newTime === 0) {
					clearTimer();
					onTimeout?.(prev.activeColor);
					return {
						...prev,
						[activeKey]: 0,
						isRunning: false,
					};
				}

				return {
					...prev,
					[activeKey]: newTime,
				};
			});
		}, 100);
	}, [clearTimer, onTimeout]);

	useEffect(() => {
		return () => clearTimer();
	}, [clearTimer]);

	const startClock = useCallback((timeControl: TimeControl) => {
		const initialTimeMs = timeControl.initialTime * 1000;
		incrementRef.current = timeControl.increment * 1000;

		setClockState({
			white: initialTimeMs,
			black: initialTimeMs,
			activeColor: 'w',
			isRunning: false,
		});
	}, []);

	const switchTurn = useCallback((newActiveColor: Color) => {
		setClockState((prev) => {
			const previousColor = prev.activeColor;
			if (previousColor && incrementRef.current > 0) {
				const prevKey = colorToKey(previousColor);
				return {
					...prev,
					[prevKey]: prev[prevKey] + incrementRef.current,
					activeColor: newActiveColor,
				};
			}
			return {
				...prev,
				activeColor: newActiveColor,
			};
		});
	}, []);

	const pauseClock = useCallback(() => {
		clearTimer();
		setClockState((prev) => ({ ...prev, isRunning: false }));
	}, [clearTimer]);

	const resumeClock = useCallback(() => {
		setClockState((prev) => ({ ...prev, isRunning: true }));
		startTimer();
	}, [startTimer]);

	const stopClock = useCallback(() => {
		clearTimer();
		setClockState((prev) => ({
			...prev,
			isRunning: false,
			activeColor: null,
		}));
	}, [clearTimer]);

	const resetClock = useCallback(
		(timeControl: TimeControl, whiteTime?: number, blackTime?: number) => {
			clearTimer();
			const initialTimeMs = timeControl.initialTime * 1000;
			incrementRef.current = timeControl.increment * 1000;

			setClockState({
				white: whiteTime !== undefined ? whiteTime : initialTimeMs,
				black: blackTime !== undefined ? blackTime : initialTimeMs,
				activeColor: null,
				isRunning: false,
			});
		},
		[clearTimer]
	);

	const addIncrement = useCallback((color: Color, increment: number) => {
		const key = colorToKey(color);
		setClockState((prev) => ({
			...prev,
			[key]: prev[key] + increment * 1000,
		}));
	}, []);

	const formatTime = useCallback((ms: number): string => {
		const totalSeconds = Math.ceil(ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		if (minutes >= 60) {
			const hours = Math.floor(minutes / 60);
			const remainingMinutes = minutes % 60;
			return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}

		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}, []);

	const startCountdown = useCallback(() => {
		setClockState((prev) => ({ ...prev, isRunning: true }));
		lastTickRef.current = Date.now();
		startTimer();
	}, [startTimer]);

	return {
		clockState,
		startClock,
		switchTurn,
		pauseClock,
		resumeClock,
		stopClock,
		resetClock,
		addIncrement,
		formatTime,
		startCountdown,
	};
}
