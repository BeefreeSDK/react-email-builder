# Contributing to @beefree.io/react

First off, thank you for considering contributing to `@beefree.io/react`! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Code Style](#code-style)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/npm-react.git
   cd npm-react
   ```
3. **Install dependencies**:
   ```bash
   yarn install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

### Running the Development Server

```bash
yarn start
```

This will start the development server with hot reload at `http://localhost:3003`.

### Building the Library

```bash
yarn build
```

### Running Tests

```bash
# Watch mode
yarn test

# Single run
yarn test:ci

# With coverage
yarn test:ci --coverage
```

### Linting

```bash
yarn lint
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools

### Examples

```bash
feat(useBuilder): add support for dynamic language switching
fix(Builder): prevent memory leak on unmount
docs(README): update installation instructions
test(useBuilder): add tests for config updates
```

### Commit Message Validation

This project uses Husky and commitlint to enforce conventional commits. Invalid commit messages will be rejected.

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**: `yarn test:ci`
4. **Ensure linting passes**: `yarn lint`
5. **Update CHANGELOG.md** under `[Unreleased]` section
6. **Create the PR** with a clear description of changes
7. **Link related issues** using keywords (e.g., "Fixes #123")

### PR Title Format

Follow the same convention as commits:

```
feat: add collaborative editing support
fix: resolve memory leak in Builder component
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] Tests pass locally
- [ ] Linting passes
- [ ] Documentation updated
- [ ] CHANGELOG updated
```

## Testing

### Writing Tests

- Place tests in `__tests__` directories alongside source files
- Use descriptive test names
- Test both success and error cases
- Maintain > 80% code coverage

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Arrange
    const input = setupInput()
    
    // Act
    const result = performAction(input)
    
    // Assert
    expect(result).toBe(expected)
  })
})
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable `strict` mode
- Avoid `any` types when possible
- Use explicit return types for functions

### React

- Use functional components with hooks
- Use `useCallback` and `useMemo` appropriately
- Avoid inline arrow functions in JSX props

### Naming Conventions

- **Components**: PascalCase (`Builder`, `MyComponent`)
- **Hooks**: camelCase with `use` prefix (`useBuilder`, `useRegistry`)
- **Files**: Match the component/hook name
- **Constants**: UPPER_SNAKE_CASE

### Code Organization

```typescript
// 1. Imports (grouped and sorted)
import { useState } from 'react'
import type { SomeType } from './types'

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component/Function
export const Component = (props: Props) => {
  // 4. Hooks
  const [state, setState] = useState()
  
  // 5. Handlers
  const handleClick = () => {}
  
  // 6. Effects
  useEffect(() => {}, [])
  
  // 7. Render
  return <div />
}
```

## Questions?

Feel free to open an issue for questions or discussions!

Thank you for your contribution! 🚀
