import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	footer?: ReactNode;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	className?: string;
}

export const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	footer,
	size = 'md',
	className,
}: ModalProps) => {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Modal Content */}
			<div
				className={cn(
					'relative flex flex-col',
					'bg-slate-800 rounded-xl shadow-xl border border-slate-700',
					'max-h-[90vh] w-full',
					'animate-in fade-in zoom-in-95 duration-200',
					// Size variants
					size === 'sm' && 'max-w-md',
					size === 'md' && 'max-w-2xl',
					size === 'lg' && 'max-w-4xl',
					size === 'xl' && 'max-w-6xl',
					size === 'full' && 'max-w-[calc(100vw-2rem)]',
					className
				)}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-slate-700">
					<h2 id="modal-title" className="text-2xl font-bold text-white">
						{title}
					</h2>
					<button
						onClick={onClose}
						className={cn(
							'rounded-lg p-1',
							'text-slate-400 hover:text-white hover:bg-slate-700',
							'transition-all duration-200',
							'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'
						)}
						aria-label="Close modal"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Body */}
				<div className="flex-1 overflow-y-auto p-6">{children}</div>

				{/* Footer */}
				{footer && (
					<div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
};
