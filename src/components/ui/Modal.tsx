import { useEffect, type ReactNode } from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	footer?: ReactNode;
}

export const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	footer,
}: ModalProps) => {
	// Close on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen, onClose]);

	// Prevent body scroll when modal is open
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
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Modal content */}
			<div className="relative bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-700">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-slate-700">
					<h2 id="modal-title" className="text-2xl font-bold text-white">
						{title}
					</h2>
					<button
						onClick={onClose}
						className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700"
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
