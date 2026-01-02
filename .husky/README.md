# Git Hooks

This directory contains Git hooks managed by Husky.

## Available Hooks

### `pre-commit`

Runs before each commit:

- lint-staged (ESLint + Prettier on staged files)
- TypeScript type checking

### `commit-msg`

Validates commit message format:

- Enforces Conventional Commits format
- Examples: `feat:`, `fix:`, `docs:`, etc.

### `pre-push`

Runs before pushing:

- ESLint on all files
- TypeScript type check (entire project)
- Prettier format check
- Production build

## Bypass (Emergency Only)

```bash
# Skip pre-commit
git commit --no-verify

# Skip pre-push
git push --no-verify
```

## More Information

See [GIT-HOOKS-GUIDE.md](../GIT-HOOKS-GUIDE.md) in the project root.
