import { useState } from 'react';
import { BOTS } from '@/constants/bots';
import { TIME_CONTROLS } from '@/constants/timeControls';
import type { Bot, Color, GameSettings, TimeControl } from '@/types/chess';
import { Button, Card, Select } from '@/components/ui';

interface GameSettingsProps {
	onStartGame: (settings: GameSettings) => void;
}

const GameSettingsComponent = ({ onStartGame }: GameSettingsProps) => {
	const [selectedBot, setSelectedBot] = useState<Bot>(BOTS[2]);
	const [selectedTime, setSelectedTime] = useState<TimeControl>(
		TIME_CONTROLS[1]
	);
	const [colorChoice, setColorChoice] = useState<'w' | 'b' | 'random'>('w');

	const handleStartGame = () => {
		const finalColor: Color =
			colorChoice === 'random'
				? Math.random() < 0.5
					? 'w'
					: 'b'
				: colorChoice;

		onStartGame({
			bot: selectedBot,
			timeControl: selectedTime,
			playerColor: finalColor,
		});
	};

	const handleBotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const bot = BOTS.find((b) => b.id === e.target.value);
		if (bot) setSelectedBot(bot);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const time = TIME_CONTROLS.find((tc) => tc.id === e.target.value);
		if (time) setSelectedTime(time);
	};

	return (
		<Card className="flex flex-col gap-5">
			{}
			<Select
				label="Opponent"
				value={selectedBot.id}
				onChange={handleBotChange}
				helperText={selectedBot.description}
			>
				{BOTS.map((bot) => (
					<option key={bot.id} value={bot.id}>
						{bot.avatar} {bot.name} ({bot.rating})
					</option>
				))}
			</Select>

			{}
			<Select
				label="Time Control"
				value={selectedTime.id}
				onChange={handleTimeChange}
				helperText={
					selectedTime.increment > 0
						? `${selectedTime.initialTime / 60} minutes + ${selectedTime.increment}s per move`
						: `${selectedTime.initialTime / 60} minutes total`
				}
			>
				{TIME_CONTROLS.map((tc) => (
					<option key={tc.id} value={tc.id}>
						{tc.name}
					</option>
				))}
			</Select>

			{}
			<div className="flex flex-col gap-2">
				<label className="block text-sm font-medium text-slate-300">
					Play as
				</label>
				<div className="flex gap-4 items-center">
					<button
						onClick={() => setColorChoice('w')}
						className={`w-[40px] h-[40px] rounded-full bg-white transition-all ${
							colorChoice === 'w'
								? 'ring-4 ring-emerald-500 ring-offset-2 ring-offset-slate-800'
								: 'ring-2 ring-slate-600 hover:ring-slate-500'
						}`}
						title="White"
					/>
					<button
						onClick={() => setColorChoice('b')}
						className={`w-[40px] h-[40px] rounded-full bg-slate-900 border-2 border-slate-700 transition-all ${
							colorChoice === 'b'
								? 'ring-4 ring-emerald-500 ring-offset-2 ring-offset-slate-800'
								: 'ring-2 ring-slate-600 hover:ring-slate-500'
						}`}
						title="Black"
					/>
					<button
						onClick={() => setColorChoice('random')}
						className={`w-[40px] h-[40px] rounded-full bg-gradient-to-r from-white from-50% to-slate-900 to-50% border-2 border-slate-700 transition-all ${
							colorChoice === 'random'
								? 'ring-4 ring-emerald-500 ring-offset-2 ring-offset-slate-800'
								: 'ring-2 ring-slate-600 hover:ring-slate-500'
						}`}
						title="Random"
					/>
				</div>
			</div>

			{}
			<Button
				onClick={handleStartGame}
				variant="primary"
				size="lg"
				className="w-full font-semibold"
			>
				Start Game
			</Button>
		</Card>
	);
};

export default GameSettingsComponent;
