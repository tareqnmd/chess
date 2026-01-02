import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ToggleButtonProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'onChange'
> {
	selected: boolean;
	size?: 'sm' | 'md' | 'lg';
	variant?: 'circle' | 'rounded';
}

const ToggleButton = ({
	selected,
	size = 'md',
	variant = 'rounded',
	className,
	children,
	...props
}: ToggleButtonProps) => {
	return (
		<button
			className={cn(
				// Base styles
				'inline-flex items-center justify-center',
				'transition-all duration-200',
				'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
				'active:scale-95',
				'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
				// Variant styles
				variant === 'circle' && 'rounded-full',
				variant === 'rounded' && 'rounded-lg',
				// Selected state
				selected
					? 'ring-2 ring-emerald-500'
					: 'ring-1 ring-slate-600 hover:ring-slate-500',
				// Size styles
				size === 'sm' && 'min-w-8 min-h-8 p-1',
				size === 'md' && 'min-w-10 min-h-10 p-2',
				size === 'lg' && 'min-w-12 min-h-12 p-3',
				// Custom className
				className
			)}
			aria-pressed={selected}
			{...props}
		>
			{children}
		</button>
	);
};

export default ToggleButton;
