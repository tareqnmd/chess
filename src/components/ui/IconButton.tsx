import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'info';
	size?: 'sm' | 'md' | 'lg';
	icon: ReactNode;
}

const IconButton = ({
	variant = 'ghost',
	size = 'md',
	icon,
	className,
	...props
}: IconButtonProps) => {
	return (
		<button
			className={cn(
				'inline-flex items-center justify-center',
				'rounded-lg',
				'transition-all duration-200',
				'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
				'active:scale-95',
				'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
				// Variant styles
				variant === 'primary' && [
					'bg-emerald-600 hover:bg-emerald-500',
					'text-white',
					'focus-visible:ring-emerald-500',
				],
				variant === 'secondary' && [
					'bg-slate-700 hover:bg-slate-600',
					'text-slate-200',
					'border border-slate-600',
					'focus-visible:ring-slate-500',
				],
				variant === 'danger' && [
					'bg-red-600/20 hover:bg-red-600/30',
					'text-red-400 hover:text-red-300',
					'border border-red-600/30',
					'focus-visible:ring-red-500',
				],
				variant === 'ghost' && [
					'bg-transparent hover:bg-slate-700/50',
					'text-slate-300 hover:text-slate-100',
					'focus-visible:ring-slate-500',
				],
				variant === 'info' && [
					'bg-blue-600/20 hover:bg-blue-600/30',
					'text-blue-400 hover:text-blue-300',
					'border border-blue-600/30',
					'focus-visible:ring-blue-500',
				],
				// Size styles
				size === 'sm' && 'p-1.5',
				size === 'md' && 'p-2',
				size === 'lg' && 'p-3',
				// Custom className
				className
			)}
			{...props}
		>
			{icon}
		</button>
	);
};

export default IconButton;
