import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import type { BoardSettings, PieceTheme } from '@/types/board-settings';
import { BOARD_THEMES } from '@/types/board-settings';

interface BoardSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
	settings: BoardSettings;
	onSave: (settings: BoardSettings) => void;
}

const PIECE_THEMES: { value: PieceTheme; label: string }[] = [
	{ value: 'cburnett', label: 'Classic (CBurnett)' },
	{ value: 'alpha', label: 'Alpha' },
	{ value: 'california', label: 'California' },
	{ value: 'cardinal', label: 'Cardinal' },
	{ value: 'cases', label: 'Cases' },
	{ value: 'chessnut', label: 'Chessnut' },
	{ value: 'companion', label: 'Companion' },
	{ value: 'dubrovny', label: 'Dubrovny' },
	{ value: 'fantasy', label: 'Fantasy' },
	{ value: 'fresca', label: 'Fresca' },
	{ value: 'gioco', label: 'Gioco' },
	{ value: 'governor', label: 'Governor' },
	{ value: 'horsey', label: 'Horsey' },
	{ value: 'icpieces', label: 'IC Pieces' },
	{ value: 'kosal', label: 'Kosal' },
	{ value: 'leipzig', label: 'Leipzig' },
	{ value: 'letter', label: 'Letter' },
	{ value: 'libra', label: 'Libra' },
	{ value: 'maestro', label: 'Maestro' },
	{ value: 'merida', label: 'Merida' },
	{ value: 'pirouetti', label: 'Pirouetti' },
	{ value: 'pixel', label: 'Pixel' },
	{ value: 'reillycraig', label: 'Reilly Craig' },
	{ value: 'riohacha', label: 'Riohacha' },
	{ value: 'shapes', label: 'Shapes' },
	{ value: 'spatial', label: 'Spatial' },
	{ value: 'staunty', label: 'Staunty' },
	{ value: 'tatiana', label: 'Tatiana' },
];

export const BoardSettingsModal = ({
	isOpen,
	onClose,
	settings,
	onSave,
}: BoardSettingsModalProps) => {
	const [localSettings, setLocalSettings] = useState<BoardSettings>(settings);

	const handleSave = () => {
		onSave(localSettings);
		onClose();
	};

	const handleCancel = () => {
		setLocalSettings(settings);
		onClose();
	};

	const handleThemeSelect = (themeName: string) => {
		const theme = BOARD_THEMES[themeName];
		if (theme) {
			setLocalSettings({
				...localSettings,
				boardTheme: theme,
			});
		}
	};

	const handleCustomColor = (type: 'light' | 'dark', color: string) => {
		setLocalSettings({
			...localSettings,
			boardTheme: {
				...localSettings.boardTheme,
				[type]: color,
			},
		});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleCancel}
			title="Board Settings"
			footer={
				<>
					<Button variant="secondary" onClick={handleCancel}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleSave}>
						Save Settings
					</Button>
				</>
			}
		>
			<div className="space-y-6">
				{/* User ID Display */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">
						Your User ID
					</label>
					<div className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-400 font-mono">
						{localSettings.userId}
					</div>
				</div>

				{/* Piece Theme */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">
						Piece Style
					</label>
					<Select
						value={localSettings.pieceTheme}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
							setLocalSettings({
								...localSettings,
								pieceTheme: e.target.value as PieceTheme,
							})
						}
					>
						{PIECE_THEMES.map((theme) => (
							<option key={theme.value} value={theme.value}>
								{theme.label}
							</option>
						))}
					</Select>
				</div>

				{/* Board Theme Presets */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-3">
						Board Theme
					</label>
					<div className="grid grid-cols-3 gap-3">
						{Object.entries(BOARD_THEMES).map(([name, theme]) => (
							<button
								key={name}
								onClick={() => handleThemeSelect(name)}
								className={`
									relative p-3 rounded-lg border-2 transition-all
									${
										localSettings.boardTheme.light === theme.light &&
										localSettings.boardTheme.dark === theme.dark
											? 'border-emerald-500 ring-2 ring-emerald-500/50'
											: 'border-slate-700 hover:border-slate-600'
									}
								`}
								aria-label={`Select ${name} theme`}
							>
								<div className="flex gap-1 mb-2">
									<div
										className="w-8 h-8 rounded"
										style={{ backgroundColor: theme.light }}
									/>
									<div
										className="w-8 h-8 rounded"
										style={{ backgroundColor: theme.dark }}
									/>
								</div>
								<span className="text-xs text-slate-300 capitalize">
									{name}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Custom Colors */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Light Squares
						</label>
						<div className="flex gap-2">
							<input
								type="color"
								value={localSettings.boardTheme.light}
								onChange={(e) => handleCustomColor('light', e.target.value)}
								className="w-12 h-10 rounded border border-slate-700 bg-slate-900 cursor-pointer"
							/>
							<input
								type="text"
								value={localSettings.boardTheme.light}
								onChange={(e) => handleCustomColor('light', e.target.value)}
								className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono"
								placeholder="#ffffff"
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Dark Squares
						</label>
						<div className="flex gap-2">
							<input
								type="color"
								value={localSettings.boardTheme.dark}
								onChange={(e) => handleCustomColor('dark', e.target.value)}
								className="w-12 h-10 rounded border border-slate-700 bg-slate-900 cursor-pointer"
							/>
							<input
								type="text"
								value={localSettings.boardTheme.dark}
								onChange={(e) => handleCustomColor('dark', e.target.value)}
								className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono"
								placeholder="#000000"
							/>
						</div>
					</div>
				</div>

				{/* Show Coordinates */}
				<div className="flex items-center justify-between">
					<label className="text-sm font-medium text-slate-300">
						Show Board Coordinates
					</label>
					<button
						onClick={() =>
							setLocalSettings({
								...localSettings,
								showCoordinates: !localSettings.showCoordinates,
							})
						}
						className={`
							relative inline-flex h-6 w-11 items-center rounded-full transition-colors
							${localSettings.showCoordinates ? 'bg-emerald-600' : 'bg-slate-700'}
						`}
						role="switch"
						aria-checked={localSettings.showCoordinates}
					>
						<span
							className={`
								inline-block h-4 w-4 transform rounded-full bg-white transition-transform
								${localSettings.showCoordinates ? 'translate-x-6' : 'translate-x-1'}
							`}
						/>
					</button>
				</div>

				{/* Animation Duration */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">
						Animation Speed: {localSettings.animationDuration}ms
					</label>
					<input
						type="range"
						min="0"
						max="500"
						step="50"
						value={localSettings.animationDuration}
						onChange={(e) =>
							setLocalSettings({
								...localSettings,
								animationDuration: Number(e.target.value),
							})
						}
						className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
					/>
					<div className="flex justify-between text-xs text-slate-500 mt-1">
						<span>Instant</span>
						<span>Slow</span>
					</div>
				</div>
			</div>
		</Modal>
	);
};
