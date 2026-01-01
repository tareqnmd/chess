'use client';

import { useRef, useEffect } from 'react';
import type { Move } from '@/types/chess';

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

	// Group moves into pairs (white, black)
	const movePairs: { moveNumber: number; white?: Move; black?: Move }[] = [];
	for (let i = 0; i < history.length; i += 2) {
		movePairs.push({
			moveNumber: Math.floor(i / 2) + 1,
			white: history[i],
			black: history[i + 1],
		});
	}

	const getMoveNotation = (move: Move): string => {
		return move.san;
	};

	const getMoveStyles = (move: Move, isLastMove: boolean): string => {
		let styles = 'px-2 py-1 rounded font-mono text-sm transition-colors ';
		
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
			<div className="h-48 flex items-center justify-center text-slate-500 text-sm">
				No moves yet
			</div>
		);
	}

	return (
		<div
			ref={scrollRef}
			className="h-48 overflow-y-auto custom-scrollbar pr-2"
		>
			<div className="space-y-1">
				{movePairs.map((pair, idx) => {
					const isLastWhite = pair.white && !pair.black && idx === movePairs.length - 1;
					const isLastBlack = pair.black && idx === movePairs.length - 1;

					return (
						<div
							key={pair.moveNumber}
							className="flex items-center gap-2 text-sm"
						>
							<span className="w-8 text-slate-500 font-mono text-right shrink-0">
								{pair.moveNumber}.
							</span>
							<div className="flex-1 grid grid-cols-2 gap-1">
								{pair.white && (
									<span className={getMoveStyles(pair.white, isLastWhite || false)}>
										{getMoveNotation(pair.white)}
									</span>
								)}
								{pair.black && (
									<span className={getMoveStyles(pair.black, isLastBlack)}>
										{getMoveNotation(pair.black)}
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default MoveHistory;

