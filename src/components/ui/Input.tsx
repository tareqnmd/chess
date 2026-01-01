import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, className = '', ...props }, ref) => {
		return (
			<div className="flex flex-col gap-2">
				{label && (
					<label className="text-sm font-medium text-slate-300">
						{label}
					</label>
				)}
				<input
					ref={ref}
					className={`px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${className}`}
					{...props}
				/>
				{error && (
					<p className="text-sm text-red-400">{error}</p>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;

