/**
 * Commitlint Configuration
 * Enforces conventional commit messages
 * Format: type(scope?): subject
 */

export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feat', // New feature
				'fix', // Bug fix
				'docs', // Documentation only
				'style', // Code style/formatting (no code change)
				'refactor', // Code refactoring
				'perf', // Performance improvement
				'test', // Adding/updating tests
				'build', // Build system or dependencies
				'ci', // CI/CD changes
				'chore', // Other changes (no src/test changes)
				'revert', // Revert previous commit
			],
		],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'subject-empty': [2, 'never'],
		'subject-case': [0], // Allow any case for subject
		'subject-full-stop': [2, 'never', '.'],
		'header-max-length': [2, 'always', 100],
		'body-leading-blank': [2, 'always'],
		'footer-leading-blank': [2, 'always'],
	},
};
