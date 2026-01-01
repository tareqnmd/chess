import { useState } from 'react';
import { BOTS } from '@/constants/bots';
import { TIME_CONTROLS } from '@/constants/timeControls';
import type { Bot, TimeControl, GameSettings, Color } from '@/types/chess';

interface GameSettingsProps {
	onStartGame: (settings: GameSettings) => void;
}

const GameSettingsComponent = ({ onStartGame }: GameSettingsProps) => {
	const [selectedBot, setSelectedBot] = useState<Bot>(BOTS[2]); // Intermediate default
	const [selectedTime, setSelectedTime] = useState<TimeControl>(TIME_CONTROLS[1]); // 5m default
	const [playerColor, setPlayerColor] = useState<Color>('w');

	const handleStartGame = () => {
		onStartGame({
			bot: selectedBot,
			timeControl: selectedTime,
			playerColor,
		});
	};

	const handleBotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const bot = BOTS.find(b => b.id === e.target.value);
		if (bot) setSelectedBot(bot);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const time = TIME_CONTROLS.find(tc => tc.id === e.target.value);
		if (time) setSelectedTime(time);
	};

	return (
		<div className="flex flex-col gap-5 p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
			{/* Bot Selection */}
			<div className="space-y-2">
				<label className="block text-sm font-medium text-slate-300">
					Opponent
				</label>
				<select
					value={selectedBot.id}
					onChange={handleBotChange}
					className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
				>
					{BOTS.map((bot) => (
						<option key={bot.id} value={bot.id}>
							{bot.avatar} {bot.name} ({bot.rating})
						</option>
					))}
				</select>
				<p className="text-xs text-slate-400">
					{selectedBot.description}
				</p>
			</div>

			{/* Time Control Selection */}
			<div className="space-y-2">
				<label className="block text-sm font-medium text-slate-300">
					Time Control
				</label>
				<select
					value={selectedTime.id}
					onChange={handleTimeChange}
					className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
				>
					{TIME_CONTROLS.map((tc) => (
						<option key={tc.id} value={tc.id}>
							{tc.name}
						</option>
					))}
				</select>
				<p className="text-xs text-slate-400">
					{selectedTime.increment > 0
						? `${selectedTime.initialTime / 60} minutes + ${selectedTime.increment}s per move`
						: `${selectedTime.initialTime / 60} minutes total`}
				</p>
			</div>

			{/* Color Selection */}
			<div className="space-y-2">
				<label className="block text-sm font-medium text-slate-300">
					Play as
				</label>
				<div className="grid grid-cols-2 gap-3">
					<button
						onClick={() => setPlayerColor('w')}
						className={`py-3 px-4 rounded-lg font-medium transition-all border-2 ${
							playerColor === 'w'
								? 'bg-white text-slate-900 border-emerald-500'
								: 'bg-white text-slate-700 border-slate-400 hover:border-slate-500'
						}`}
					>
						White
					</button>
					<button
						onClick={() => setPlayerColor('b')}
						className={`py-3 px-4 rounded-lg font-medium transition-all border-2 ${
							playerColor === 'b'
								? 'bg-slate-900 text-white border-emerald-500'
								: 'bg-slate-900 text-slate-300 border-slate-600 hover:border-slate-500'
						}`}
					>
						Black
					</button>
				</div>
			</div>

			{/* Start Button */}
			<button
				onClick={handleStartGame}
				className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg transition-all hover:shadow-xl active:scale-95"
			>
				Start Game
			</button>
		</div>
	);
};

export default GameSettingsComponent;

