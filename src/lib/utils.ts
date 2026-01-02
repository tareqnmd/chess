import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

export function formatTime(ms: number): string {
	if (ms < 0) ms = 0;

	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
