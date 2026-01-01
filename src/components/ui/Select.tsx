import { SelectHTMLAttributes, ReactNode, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	children: ReactNode;
	helperText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ label, helperText, className = '', children, id, ...props }, ref) => {
		const selectId = id || `select-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`;
		const helperTextId = `${selectId}-helper`;
		
		return (
			<div className="flex flex-col gap-2">
				{label && (
					<label htmlFor={selectId} className="text-sm font-medium text-slate-300">
						{label}
					</label>
				)}
				<select
					ref={ref}
					id={selectId}
					aria-describedby={helperText ? helperTextId : undefined}
					className={`px-4 py-3 pr-10 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23cbd5e1%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat ${className}`}
					{...props}
				>
					{children}
				</select>
				{helperText && (
					<p id={helperTextId} className="text-xs text-slate-400">{helperText}</p>
				)}
			</div>
		);
	}
);

Select.displayName = 'Select';

export default Select;

