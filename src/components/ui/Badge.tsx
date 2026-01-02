import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
	size?: 'sm' | 'md' | 'lg';
	children: ReactNode;
}

const Badge = ({
	variant = 'default',
	size = 'md',
	className,
	children,
	...props
}: BadgeProps) => {
	return (
		<span
			className={cn(
				// Base styles
				'inline-flex items-center justify-center',
				'font-medium rounded-md',
				'transition-colors duration-200',
				// Variant styles
				variant === 'default' && [
					'bg-slate-700/50',
					'text-slate-300',
					'border border-slate-600/50',
				],
				variant === 'primary' && [
					'bg-emerald-600/20',
					'text-emerald-400',
					'border border-emerald-600/30',
				],
				variant === 'success' && [
					'bg-green-600/20',
					'text-green-400',
					'border border-green-600/30',
				],
				variant === 'warning' && [
					'bg-yellow-600/20',
					'text-yellow-400',
					'border border-yellow-600/30',
				],
				variant === 'danger' && [
					'bg-red-600/20',
					'text-red-400',
					'border border-red-600/30',
				],
				variant === 'info' && [
					'bg-blue-600/20',
					'text-blue-400',
					'border border-blue-600/30',
				],
				// Size styles
				size === 'sm' && 'px-2 py-0.5 text-xs',
				size === 'md' && 'px-2.5 py-1 text-sm',
				size === 'lg' && 'px-3 py-1.5 text-base',
				// Custom className
				className
			)}
			{...props}
		>
			{children}
		</span>
	);
};

export default Badge;
