# ServelessFn ⚡

**Serverless Runtime** - Deploy functions.

## Features

- **📝 Register** - Register functions
- **🚀 Invoke** - Call functions
- **📦 Events** - Event handlers

## Installation

```bash
npm install servelessfn
```

## Usage

```typescript
import { ServelessFn } from 'servelessfn';

const fn = new ServelessFn();

// Register
fn.register('hello', async (event, context) => {
  return { message: `Hello, ${event.name || 'World'}!` };
});

// Invoke
const result = await fn.invoke('hello', { name: 'John' });
console.log(result.message); // "Hello, John!"
```

## License

MIT
