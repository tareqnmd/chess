import type { Bot, TimeControl } from '../types';

export const BOTS: Bot[] = [
	{
		id: 'beginner',
		name: 'Rookie',
		description: 'Just learning the moves',
		rating: '400-600',
		depth: 1,
		avatar: '🐣',
	},
	{
		id: 'easy',
		name: 'Casual',
		description: 'Plays for fun',
		rating: '800-1000',
		depth: 2,
		avatar: '🎮',
	},
	{
		id: 'intermediate',
		name: 'Club Player',
		description: 'Solid fundamentals',
		rating: '1200-1400',
		depth: 3,
		avatar: '♟️',
	},
	{
		id: 'advanced',
		name: 'Expert',
		description: 'Tactical and sharp',
		rating: '1600-1800',
		depth: 4,
		avatar: '🎯',
	},
	{
		id: 'master',
		name: 'Grandmaster',
		description: 'Nearly unbeatable',
		rating: '2000+',
		depth: 5,
		avatar: '👑',
	},
];

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

export const getBotById = (id: string): Bot | undefined => {
	return BOTS.find((bot) => bot.id === id);
};

export const getTimeControlById = (id: string): TimeControl | undefined => {
	return TIME_CONTROLS.find((tc) => tc.id === id);
};
