import type { TimeControl } from '@/types/chess';

export const TIME_CONTROLS: TimeControl[] = [
	{
		id: 'blitz-3',
		name: '3m',
		initialTime: 180,
		increment: 0,
	},
	{
		id: 'blitz-5',
		name: '5m',
		initialTime: 300,
		increment: 0,
	},
	{
		id: 'rapid-10',
		name: '10m',
		initialTime: 600,
		increment: 0,
	},
	{
		id: 'blitz-3-2',
		name: '3m+2s',
		initialTime: 180,
		increment: 2,
	},
	{
		id: 'blitz-5-3',
		name: '5m+3s',
		initialTime: 300,
		increment: 3,
	},
	{
		id: 'rapid-10-5',
		name: '10m+5s',
		initialTime: 600,
		increment: 5,
	},
];

export const getTimeControlById = (id: string): TimeControl | undefined => {
	return TIME_CONTROLS.find((tc) => tc.id === id);
};

