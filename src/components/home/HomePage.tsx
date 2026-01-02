import GameSettings from '@/components/game/play/GameSettings';
import type { GameSettings as GameSettingsType } from '@/components/game/types';
import { initializeGameSession } from '@/lib/storage';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const HomePage = () => {
	const navigate = useNavigate();

	const handleStartGame = useCallback(
		(settings: GameSettingsType) => {
			const newGameId = initializeGameSession(
				settings,
				settings.timeControl.initialTime * 1000,
				settings.timeControl.initialTime * 1000
			);

			toast.success(`Game started vs ${settings.bot.name}`);

			navigate(`/play/${newGameId}`);
		},
		[navigate]
	);

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
			<div className="w-full max-w-2xl">
				<GameSettings onStartGame={handleStartGame} />
			</div>
		</div>
	);
};

export default HomePage;
