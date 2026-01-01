import { useState } from 'react';
import { BOTS } from '@/constants/bots';
import { TIME_CONTROLS } from '@/constants/timeControls';
import type { Bot, TimeControl, GameSettings, Color } from '@/types/chess';

interface GameSettingsProps {
	onStartGame: (settings: GameSettings) => void;
}

const GameSettingsComponent = ({ onStartGame }: GameSettingsProps) => {
	const [selectedBot, setSelectedBot] = useState<Bot>(BOTS[2]); // Intermediate default
	const [selectedTime, setSelectedTime] = useState<TimeControl>(TIME_CONTROLS[5]); // 5 min default
	const [playerColor, setPlayerColor] = useState<Color>('w');

	const handleStartGame = () => {
		onStartGame({
			bot: selectedBot,
			timeControl: selectedTime,
			playerColor,
		});
	};

	return (
		<div className="flex flex-col gap-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
			{/* Bot Selection */}
			<div className="space-y-3">
				<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
					Choose Opponent
				</h3>
				<div className="grid gap-2">
					{BOTS.map((bot) => (
						<button
							key={bot.id}
							onClick={() => setSelectedBot(bot)}
							className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left ${
								selectedBot.id === bot.id
									? 'bg-emerald-600/20 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
									: 'bg-slate-700/30 border-2 border-transparent hover:bg-slate-700/50 hover:border-slate-600'
							}`}
						>
							<span className="text-3xl">{bot.avatar}</span>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<span className="font-semibold text-slate-100">{bot.name}</span>
									<span className="text-xs px-2 py-0.5 rounded-full bg-slate-600/50 text-slate-300">
										{bot.rating}
									</span>
								</div>
								<p className="text-sm text-slate-400 truncate">{bot.description}</p>
							</div>
							{selectedBot.id === bot.id && (
								<div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
							)}
						</button>
					))}
				</div>
			</div>

			{/* Time Control Selection */}
			<div className="space-y-3">
				<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
					Time Control
				</h3>
				<div className="grid grid-cols-5 gap-2">
					{TIME_CONTROLS.map((tc) => (
						<button
							key={tc.id}
							onClick={() => setSelectedTime(tc)}
							className={`p-3 rounded-xl font-mono text-sm font-medium transition-all duration-200 ${
								selectedTime.id === tc.id
									? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
									: 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-slate-100'
							}`}
						>
							{tc.name}
						</button>
					))}
				</div>
				<p className="text-xs text-slate-500">
					{selectedTime.increment > 0
						? `${selectedTime.initialTime / 60} minutes + ${selectedTime.increment}s increment per move`
						: `${selectedTime.initialTime / 60} minutes, no increment`}
				</p>
			</div>

			{/* Color Selection */}
			<div className="space-y-3">
				<h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
					Play As
				</h3>
				<div className="flex gap-3">
					<button
						onClick={() => setPlayerColor('w')}
						className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-200 ${
							playerColor === 'w'
								? 'bg-white text-slate-900 shadow-lg shadow-white/20'
								: 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
						}`}
					>
						<div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 shadow-inner" />
						<span className="font-medium">White</span>
					</button>
					<button
						onClick={() => setPlayerColor('b')}
						className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-200 ${
							playerColor === 'b'
								? 'bg-slate-900 text-white border-2 border-slate-500 shadow-lg'
								: 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
						}`}
					>
						<div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-600" />
						<span className="font-medium">Black</span>
					</button>
				</div>
			</div>

			{/* Start Button */}
			<button
				onClick={handleStartGame}
				className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
			>
				Start Game
			</button>
		</div>
	);
};

export default GameSettingsComponent;

