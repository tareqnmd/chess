import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
	size?: 'sm' | 'md' | 'lg' | 'xl';
	variant?: 'primary' | 'secondary' | 'white';
}

const Spinner = ({
	size = 'md',
	variant = 'primary',
	className,
	...props
}: SpinnerProps) => {
	return (
		<div
			role="status"
			aria-label="Loading"
			className={cn('inline-block', className)}
			{...props}
		>
			<div
				className={cn(
					'animate-spin rounded-full border-2 border-solid border-current border-r-transparent',
					// Size styles
					size === 'sm' && 'h-4 w-4',
					size === 'md' && 'h-6 w-6',
					size === 'lg' && 'h-8 w-8',
					size === 'xl' && 'h-12 w-12',
					// Variant styles
					variant === 'primary' && 'text-emerald-500',
					variant === 'secondary' && 'text-slate-400',
					variant === 'white' && 'text-white'
				)}
			/>
			<span className="sr-only">Loading...</span>
		</div>
	);
};

export default Spinner;
