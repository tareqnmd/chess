import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
	variant?: 'default' | 'elevated' | 'outlined';
}

const Card = ({
	children,
	padding = 'md',
	variant = 'default',
	className,
	...props
}: CardProps) => {
	return (
		<div
			className={cn(
				// Base styles
				'rounded-xl',
				'transition-colors duration-200',
				// Variant styles
				variant === 'default' && [
					'bg-slate-800/50',
					'border border-slate-700/50',
				],
				variant === 'elevated' && [
					'bg-slate-800/80',
					'border border-slate-700/50',
					'shadow-lg shadow-slate-950/20',
				],
				variant === 'outlined' && [
					'bg-transparent',
					'border-2 border-slate-700',
				],
				// Padding styles
				padding === 'none' && 'p-0',
				padding === 'sm' && 'p-4',
				padding === 'md' && 'p-6',
				padding === 'lg' && 'p-8',
				padding === 'xl' && 'p-10',
				// Custom className
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export default Card;
