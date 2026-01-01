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
	const [colorChoice, setColorChoice] = useState<'w' | 'b' | 'random'>('w');

	const handleStartGame = () => {
		// If random, choose a random color
		const finalColor: Color = colorChoice === 'random' 
			? (Math.random() < 0.5 ? 'w' : 'b')
			: colorChoice;

		onStartGame({
			bot: selectedBot,
			timeControl: selectedTime,
			playerColor: finalColor,
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
					className="w-full px-4 py-3 pr-10 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23cbd5e1%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat"
					style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '2.5rem' }}
				>
					{BOTS.map((bot) => (
						<option key={bot.id} value={bot.id} className="py-2 px-4">
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
					className="w-full px-4 py-3 pr-10 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23cbd5e1%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat"
					style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '2.5rem' }}
				>
					{TIME_CONTROLS.map((tc) => (
						<option key={tc.id} value={tc.id} className="py-2 px-4">
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
				<div className="grid grid-cols-3 gap-2">
					<button
						onClick={() => setColorChoice('w')}
						className={`py-3 px-4 rounded-lg font-medium transition-all border-2 ${
							colorChoice === 'w'
								? 'bg-white text-slate-900 border-emerald-500'
								: 'bg-white text-slate-700 border-slate-400 hover:border-slate-500'
						}`}
					>
						White
					</button>
					<button
						onClick={() => setColorChoice('b')}
						className={`py-3 px-4 rounded-lg font-medium transition-all border-2 ${
							colorChoice === 'b'
								? 'bg-slate-900 text-white border-emerald-500'
								: 'bg-slate-900 text-slate-300 border-slate-600 hover:border-slate-500'
						}`}
					>
						Black
					</button>
					<button
						onClick={() => setColorChoice('random')}
						className={`py-3 px-4 rounded-lg font-medium transition-all border-2 ${
							colorChoice === 'random'
								? 'bg-emerald-600 text-white border-emerald-500'
								: 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'
						}`}
					>
						Random
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

