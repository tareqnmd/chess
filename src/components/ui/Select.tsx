import { cn } from '@/lib/utils';
import { ReactNode, SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	children: ReactNode;
	helperText?: string;
	error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ label, helperText, error, className, children, id, ...props }, ref) => {
		const selectId =
			id || `select-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`;
		const helperTextId = `${selectId}-helper`;
		const errorId = `${selectId}-error`;

		return (
			<div className="flex flex-col gap-2">
				{label && (
					<label
						htmlFor={selectId}
						className="text-sm font-medium text-slate-300"
					>
						{label}
					</label>
				)}
				<select
					ref={ref}
					id={selectId}
					aria-invalid={error ? 'true' : 'false'}
					aria-describedby={
						error ? errorId : helperText ? helperTextId : undefined
					}
					className={cn(
						// Base styles
						'w-full px-4 py-3 pr-10 rounded-lg',
						'bg-slate-700 border',
						'text-slate-100',
						'cursor-pointer appearance-none',
						'whitespace-nowrap overflow-hidden text-ellipsis',
						'transition-all duration-200',
						'focus:outline-none',
						'disabled:opacity-50 disabled:cursor-not-allowed',
						// Custom select arrow
						"bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23cbd5e1%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]",
						'bg-size-[1.5em] bg-position-[right_0.5rem_center] bg-no-repeat',
						// State styles
						error
							? 'border-red-500 focus:border-red-600'
							: 'border-slate-600 focus:border-emerald-500',
						// Custom className
						className
					)}
					{...props}
				>
					{children}
				</select>
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

Select.displayName = 'Select';

export default Select;
