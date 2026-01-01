import type { TimeControl } from '@/types/chess';

export const TIME_CONTROLS: TimeControl[] = [
	{
		id: 'bullet-1',
		name: '1 min',
		initialTime: 60,
		increment: 0,
	},
	{
		id: 'bullet-1-1',
		name: '1 | 1',
		initialTime: 60,
		increment: 1,
	},
	{
		id: 'bullet-2-1',
		name: '2 | 1',
		initialTime: 120,
		increment: 1,
	},
	{
		id: 'blitz-3',
		name: '3 min',
		initialTime: 180,
		increment: 0,
	},
	{
		id: 'blitz-3-2',
		name: '3 | 2',
		initialTime: 180,
		increment: 2,
	},
	{
		id: 'blitz-5',
		name: '5 min',
		initialTime: 300,
		increment: 0,
	},
	{
		id: 'blitz-5-3',
		name: '5 | 3',
		initialTime: 300,
		increment: 3,
	},
	{
		id: 'rapid-10',
		name: '10 min',
		initialTime: 600,
		increment: 0,
	},
	{
		id: 'rapid-10-5',
		name: '10 | 5',
		initialTime: 600,
		increment: 5,
	},
	{
		id: 'rapid-15-10',
		name: '15 | 10',
		initialTime: 900,
		increment: 10,
	},
];

export const getTimeControlById = (id: string): TimeControl | undefined => {
	return TIME_CONTROLS.find((tc) => tc.id === id);
};

