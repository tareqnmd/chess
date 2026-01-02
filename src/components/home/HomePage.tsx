import GameSettings from '@/components/game/play/GameSettings';
import type { GameSettings as GameSettingsType } from '@/components/game/types';
import { createGameInHistory } from '@/lib/storage';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function generateUUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

const HomePage = () => {
	const navigate = useNavigate();

	const handleStartGame = useCallback(
		(settings: GameSettingsType) => {
			const newGameId = generateUUID();
			const initialTime = settings.timeControl.initialTime * 1000;

			createGameInHistory(newGameId, settings, initialTime, initialTime);

			toast.success(`Game started vs ${settings.bot.name}`);

			navigate(`/play/${newGameId}`);
		},
		[navigate]
	);

	return (
		<div className="w-full max-w-2xl mx-auto flex items-center justify-center h-full">
			<GameSettings onStartGame={handleStartGame} />
		</div>
	);
};

export default HomePage;
