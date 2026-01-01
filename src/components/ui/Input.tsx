import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, className = '', id, ...props }, ref) => {
		const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`;
		const errorId = `${inputId}-error`;
		
		return (
			<div className="flex flex-col gap-2">
				{label && (
					<label htmlFor={inputId} className="text-sm font-medium text-slate-300">
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					aria-invalid={error ? 'true' : 'false'}
					aria-describedby={error ? errorId : undefined}
					className={`px-4 py-3 bg-slate-700 border-2 ${error ? 'border-red-500' : 'border-slate-600'} rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${className}`}
					{...props}
				/>
				{error && (
					<p id={errorId} className="text-sm text-red-400" role="alert">{error}</p>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;

