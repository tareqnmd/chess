import { useRef, useEffect } from 'react';
import type { Move } from '@/components/common/types';

interface MoveHistoryProps {
	history: Move[];
}

const MoveHistory = ({ history }: MoveHistoryProps) => {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [history]);

	const movePairs: { moveNumber: number; white?: Move; black?: Move }[] = [];
	for (let i = 0; i < history.length; i += 2) {
		movePairs.push({
			moveNumber: Math.floor(i / 2) + 1,
			white: history[i],
			black: history[i + 1],
		});
	}

	const getMoveStyles = (
		move: Move | undefined,
		isLastMove: boolean
	): string => {
		let styles = 'px-2 py-1 rounded font-mono text-sm transition-colors ';

		if (!move) {
			return styles;
		}

		if (isLastMove) {
			styles += 'bg-emerald-600/30 text-emerald-300';
		} else if (move.captured) {
			styles += 'text-amber-300 hover:bg-slate-600/50';
		} else if (move.san.includes('+')) {
			styles += 'text-red-300 hover:bg-slate-600/50';
		} else if (move.san.includes('#')) {
			styles += 'text-red-400 font-bold hover:bg-slate-600/50';
		} else {
			styles += 'text-slate-300 hover:bg-slate-600/50';
		}

		return styles;
	};

	if (history.length === 0) {
		return (
			<div className="max-h-48 h-48 flex items-center justify-center text-slate-500 text-sm">
				No moves yet
			</div>
		);
	}

	const lastMove = history[history.length - 1];

	return (
		<div
			ref={scrollRef}
			className="max-h-48 overflow-y-auto custom-scrollbar pr-2"
			role="list"
			aria-label="Move history"
		>
			<div className="flex flex-col gap-1">
				{movePairs.map((pair) => {
					const isLastWhite = pair.white === lastMove;
					const isLastBlack = pair.black === lastMove;

					return (
						<div
							key={pair.moveNumber}
							className="flex items-center gap-2 text-sm"
							role="listitem"
						>
							<span className="w-8 text-slate-500 font-mono text-right shrink-0">
								{pair.moveNumber}.
							</span>
							<div className="flex-1 grid grid-cols-2 gap-2">
								<span className={getMoveStyles(pair.white, isLastWhite)}>
									{pair.white?.san || ''}
								</span>
								<span className={getMoveStyles(pair.black, isLastBlack)}>
									{pair.black?.san || ''}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default MoveHistory;
