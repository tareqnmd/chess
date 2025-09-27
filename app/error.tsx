'use client';
import ErrorComponent from '@/components/common/ErrorComponent';

export default function Error({ reset }: { reset: () => void }) {
	return <ErrorComponent reset={reset} />;
}
