import type { Bot } from '@/types/chess';

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

export const getBotById = (id: string): Bot | undefined => {
	return BOTS.find((bot) => bot.id === id);
};

