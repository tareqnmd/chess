import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	children: ReactNode;
}

const Button = ({
	variant = 'primary',
	size = 'md',
	className = '',
	children,
	...props
}: ButtonProps) => {
	const baseStyles =
		'font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

	const variantStyles = {
		primary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
		secondary:
			'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600',
		danger:
			'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30',
		ghost: 'bg-transparent hover:bg-slate-700/50 text-slate-300',
	};

	const sizeStyles = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2',
		lg: 'px-6 py-3 text-lg',
	};

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
