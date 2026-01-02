import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, helperText, className, id, ...props }, ref) => {
		const inputId =
			id || `input-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`;
		const errorId = `${inputId}-error`;
		const helperTextId = `${inputId}-helper`;

		return (
			<div className="flex flex-col gap-2">
				{label && (
					<label
						htmlFor={inputId}
						className="text-sm font-medium text-slate-300"
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					aria-invalid={error ? 'true' : 'false'}
					aria-describedby={
						error ? errorId : helperText ? helperTextId : undefined
					}
					className={cn(
						// Base styles
						'px-4 py-3 rounded-lg',
						'bg-slate-700 border-2',
						'text-slate-100 placeholder:text-slate-500',
						'transition-all duration-200',
						'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
						'disabled:opacity-50 disabled:cursor-not-allowed',
						// State styles
						error
							? 'border-red-500 focus:border-red-500 focus:ring-red-500'
							: 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500',
						// Custom className
						className
					)}
					{...props}
				/>
				{error ? (
					<p id={errorId} className="text-sm text-red-400" role="alert">
						{error}
					</p>
				) : helperText ? (
					<p id={helperTextId} className="text-xs text-slate-400">
						{helperText}
					</p>
				) : null}
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;
