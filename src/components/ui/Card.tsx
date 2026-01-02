import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = ({
	children,
	padding = 'md',
	className = '',
	...props
}: CardProps) => {
	const paddingStyles = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8',
	};

	return (
		<div
			className={`bg-slate-800/50 rounded-xl border border-slate-700/50 ${paddingStyles[padding]} ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};

export default Card;
