# UI Components Library

A comprehensive collection of reusable UI components built with React, TypeScript, and Tailwind CSS.

## Components

### Button

A versatile button component with multiple variants and sizes.

**Props:**

- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' | 'info' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `fullWidth`: boolean (default: false)
- All standard button HTML attributes

**Usage:**

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="lg" onClick={handleClick}>
	Click Me
</Button>;
```

---

### IconButton

A button component specifically designed for icons.

**Props:**

- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' | 'info' (default: 'ghost')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `icon`: ReactNode (required)
- All standard button HTML attributes

**Usage:**

```tsx
import { IconButton } from '@/components/ui';

<IconButton
	variant="danger"
	size="sm"
	onClick={handleDelete}
	icon={<TrashIcon />}
	aria-label="Delete item"
/>;
```

---

### Card

A container component with multiple padding and variant options.

**Props:**

- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `variant`: 'default' | 'elevated' | 'outlined' (default: 'default')
- All standard div HTML attributes

**Usage:**

```tsx
import { Card } from '@/components/ui';

<Card padding="lg" variant="elevated">
	<h2>Card Title</h2>
	<p>Card content...</p>
</Card>;
```

---

### Input

An input component with label, error, and helper text support.

**Props:**

- `label`: string (optional)
- `error`: string (optional)
- `helperText`: string (optional)
- All standard input HTML attributes

**Usage:**

```tsx
import { Input } from '@/components/ui';

<Input
	label="Email"
	type="email"
	error={errors.email}
	helperText="We'll never share your email"
	placeholder="Enter your email"
/>;
```

---

### Select

A select component with label, error, and helper text support.

**Props:**

- `label`: string (optional)
- `helperText`: string (optional)
- `error`: string (optional)
- All standard select HTML attributes

**Usage:**

```tsx
import { Select } from '@/components/ui';

<Select
	label="Choose option"
	value={value}
	onChange={handleChange}
	helperText="Select your preference"
>
	<option value="1">Option 1</option>
	<option value="2">Option 2</option>
</Select>;
```

---

### Modal

A modal dialog component with customizable size and footer.

**Props:**

- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string (required)
- `children`: ReactNode (required)
- `footer`: ReactNode (optional)
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'md')
- `className`: string (optional)

**Usage:**

```tsx
import { Modal, Button } from '@/components/ui';

<Modal
	isOpen={isOpen}
	onClose={handleClose}
	title="Confirm Action"
	size="md"
	footer={
		<>
			<Button variant="secondary" onClick={handleClose}>
				Cancel
			</Button>
			<Button variant="primary" onClick={handleConfirm}>
				Confirm
			</Button>
		</>
	}
>
	<p>Are you sure you want to proceed?</p>
</Modal>;
```

---

### Badge

A badge component for labels and status indicators.

**Props:**

- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' (default: 'default')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- All standard span HTML attributes

**Usage:**

```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="sm">
	Active
</Badge>;
```

---

### Spinner

A loading spinner component.

**Props:**

- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `variant`: 'primary' | 'secondary' | 'white' (default: 'primary')
- All standard div HTML attributes

**Usage:**

```tsx
import { Spinner } from '@/components/ui';

<Spinner size="lg" variant="primary" />;
```

---

### ToggleButton

A toggle button component for selection states.

**Props:**

- `selected`: boolean (required)
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `variant`: 'circle' | 'rounded' (default: 'rounded')
- All standard button HTML attributes

**Usage:**

```tsx
import { ToggleButton } from '@/components/ui';

<ToggleButton
	selected={isSelected}
	onClick={() => setIsSelected(!isSelected)}
	variant="circle"
	size="md"
>
	<Icon />
</ToggleButton>;
```

---

## Design Principles

### Modern Tailwind CSS

All components use the latest Tailwind CSS classes and patterns:

- Modern arbitrary values syntax (`bg-gradient-to-r`, `bg-size-[1.5em]`, etc.)
- Consistent spacing with the Tailwind scale
- Proper focus states with `focus-visible:ring-*`
- Semantic color palette using Slate, Emerald, Red, Blue, etc.

### Accessibility

All components are built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader friendly
- Focus visible states

### Consistency

- Unified color scheme across all components
- Consistent sizing scale (sm, md, lg, xl)
- Standard transition durations
- Reusable patterns

### Composability

Components are designed to work together:

```tsx
<Card padding="lg">
	<Input label="Name" />
	<Select label="Type">
		<option>Option 1</option>
	</Select>
	<div className="flex gap-2 mt-4">
		<Button variant="secondary">Cancel</Button>
		<Button variant="primary">Save</Button>
	</div>
</Card>
```

## Utility Function

All components use the `cn()` utility function from `@/lib/utils` for class name merging:

```typescript
import { cn } from '@/lib/utils';

// Combines classes intelligently, handling conflicts
className={cn('base-class', condition && 'conditional-class', customClassName)}
```

## Extending Components

All components accept additional className props and spread the remaining props, making them easy to extend:

```tsx
<Button
	className="custom-additional-class"
	data-testid="submit-button"
	onClick={handleSubmit}
>
	Submit
</Button>
```
