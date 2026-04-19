# ServelessFn ⚡

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Downloads](https://img.shields.io/npm/dm/servelessfn)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Top Language](https://img.shields.io/github/languages/top/danielaideborn/servelessfn)

**A lightweight, extensible serverless function runtime for Node.js**

[Features](#features) • [Installation](#installation) • [Quick Start](#quick-start) • [API Reference](#api-reference) • [Examples](#examples) • [Contributing](#contributing)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [Basic Usage](#basic-usage)
  - [Async Functions](#async-functions)
  - [Multiple Functions](#multiple-functions)
  - [Error Handling](#error-handling)
  - [Context Access](#context-access)
  - [Middleware Pattern](#middleware-pattern)
  - [Dependency Injection](#dependency-injection)
  - [Batch Invocation](#batch-invocation)
  - [Function Composition](#function-composition)
  - [Event-Driven Architecture](#event-driven-architecture)
- [API Reference](#api-reference)
  - [ServelessFn Class](#servelessfn-class)
  - [Handler Function](#handler-function)
  - [Event Object](#event-object)
  - [Context Object](#context-object)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [TypeScript Support](#typescript-support)
- [Migration Guide](#migration-guide)
- [FAQ](#faq)
- [Changelog](#changelog)
- [License](#license)
- [Contributing](#contributing)

---

## Overview

ServelessFn is a minimal, powerful serverless function runtime designed for Node.js applications. It provides a clean, intuitive API for registering and invoking serverless functions with full TypeScript support. Whether you're building microservices, edge functions, or serverless APIs, ServelessFn offers the flexibility and performance you need.

### Why ServelessFn?

- **🚀 Lightweight** - Zero dependencies, under 2KB gzipped
- **📦 TypeScript First** - Full type definitions out of the box
- **⚡ Blazing Fast** - Minimal overhead, maximum performance
- **🔌 Extensible** - Easy to extend with middleware and plugins
- **🧪 Testable** - Simple API makes testing a breeze
- **📚 Well Documented** - Comprehensive docs and examples

---

## Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Function Registration** | Register named functions with handlers |
| **Dynamic Invocation** | Invoke functions by name at runtime |
| **Async Support** | Full support for async/await functions |
| **Error Handling** | Built-in error handling with meaningful messages |
| **Context Passing** | Access request context within handlers |
| **Middleware Pipeline** | Chain multiple handlers with middleware |
| **Type Safety** | Complete TypeScript type definitions |

### Advanced Features

| Feature | Description |
|---------|-------------|
| **Function Composition** | Compose functions together for complex logic |
| **Batch Invocation** | Invoke multiple functions in parallel |
| **Dependency Injection** | Inject dependencies into handlers |
| **Event System** | Built-in event emission for monitoring |
| **Plugin Architecture** | Extend functionality with plugins |
| **Lazy Loading** | Load functions on-demand for performance |
| **Health Checks** | Built-in health check endpoints |

### Security Features

| Feature | Description |
|---------|-------------|
| **Input Validation** | Validate event payloads |
| **Timeout Support** | Set execution timeouts |
| **Rate Limiting** | Built-in rate limiting support |
| **CORS Support** | Easy CORS configuration |
| **Secret Management** | Secure secret storage and retrieval |

---

## Installation

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm package manager
- TypeScript 5.0+ (optional but recommended)

### Install via npm

```bash
npm install servelessfn
```

### Install via yarn

```bash
yarn add servelessfn
```

### Install via pnpm

```bash
pnpm add servelessfn
```

### Install from source

```bash
git clone https://github.com/danielaideborn/servelessfn.git
cd servelessfn
npm install
npm run build
```

### TypeScript Configuration

ServelessFn includes TypeScript definitions. No additional `@types` package needed. Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## Quick Start

### Basic Example

```typescript
import { ServelessFn } from 'servelessfn';

// Create a new ServelessFn instance
const runtime = new ServelessFn();

// Register your first function
runtime.register('greet', async (event, context) => {
  const name = event.name || 'World';
  return {
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString()
  };
});

// Invoke the function
const result = await runtime.invoke('greet', { name: 'Alice' });
console.log(result);
// Output: { message: "Hello, Alice!", timestamp: "2024-01-15T10:30:00.000Z" }
```

### Complete Application Example

```typescript
import { ServelessFn } from 'servelessfn';

const app = new ServelessFn();

// Register multiple functions
app.register('add', async (event, context) => {
  return { result: event.a + event.b };
});

app.register('multiply', async (event, context) => {
  return { result: event.a * event.b };
});

app.register('health', async (event, context) => {
  return { status: 'healthy', uptime: process.uptime() };
});

// Run the application
const addResult = await app.invoke('add', { a: 5, b: 3 });
const multResult = await app.invoke('multiply', { a: 4, b: 7 });
const healthResult = await app.invoke('health', {});

console.log('Addition:', addResult.result);    // 8
console.log('Multiplication:', multResult.result); // 28
console.log('Health:', healthResult);           // { status: 'healthy', uptime: 1234.56 }
```

---

## Usage Examples

### Basic Usage

The simplest way to use ServelessFn is to register a function and invoke it:

```typescript
import { ServelessFn } from 'servelessfn';

const runtime = new ServelessFn();

// Register a simple function
runtime.register('hello', (event) => {
  return { greeting: `Hello, ${event.name}!` };
});

// Invoke with event data
const response = await runtime.invoke('hello', { name: 'World' });
console.log(response); // { greeting: "Hello, World!" }
```

### Async Functions

ServelessFn fully supports asynchronous functions:

```typescript
import { ServelessFn } from 'servelessfn';

const runtime = new ServelessFn();

// Register an async function that fetches data
runtime.register('fetchUser', async (event, context) => {
  const userId = event.userId;
  
  // Simulate an API call
  const response = await fetch(`https://api.example.com/users/${userId}`);
  const userData = await response.json();
  
  return {
    user: userData,
    requestedAt: new Date().toISOString()
  };
});

// Register another async function
runtime.register('processPayment', async (event, context) => {
  const { amount, currency, cardToken } = event;
  
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    transactionId: `tx_${Date.now()}`,
    amount,
    currency
  };
});

// Invoke async functions
const user = await runtime.invoke('fetchUser', { userId: '12345' });
const payment = await runtime.invoke('processPayment', {
  amount: 99.99,
  currency: 'USD',
  cardToken: 'tok_visa'
});
```

### Multiple Functions

Register and manage multiple functions:

```typescript
import { ServelessFn } from 'servelessfn';

const runtime = new ServelessFn();

// Math functions
runtime.register('add', (event) => ({ result: event.a + event.b }));
runtime.register('subtract', (event) => ({ result: event.a - event.b }));
runtime.register('multiply', (event) => ({ result: event.a * event.b }));
runtime.register('divide', (event) => {
  if (event.b === 0) throw new Error('Division by zero');
  return { result: event.a / event.b };
});
runtime.register('power', (event) => ({ result: Math.pow(event.base, event.exp) }));
runtime.register('sqrt', (event) => ({ result: Math.sqrt(event.number) }));

// String functions
runtime.register('uppercase', (event) => ({ result: event.text.toUpperCase() }));
runtime.register('lowercase', (event) => ({ result: event.text.toLowerCase() }));
runtime.register('reverse', (event) => ({ result: event.text.split('').reverse().join('') }));
runtime.register('length', (event) => ({ result: event.text.length }));

// Array functions
runtime.register('sum', (event) => ({ result: event.numbers.reduce((a: number, b: number) => a + b, 0) }));
runtime.register('average', (event) => ({ 
  result: event.numbers.reduce((a: number, b: number) => a + b, 0) / event.numbers.length 
}));
runtime.register('max', (event) => ({ result: Math.max(...event.numbers) }));
runtime.register('min', (event) => ({ result: Math.min(...event.numbers) }));

// Invoke various functions
console.log(await runtime.invoke('add', { a: 10, b: 5 }));       // { result: 15 }
console.log(await runtime.invoke('uppercase', { text: 'hello' })); // { result: "HELLO" }
console.log(await runtime.invoke('sum', { numbers: [1, 2, 3, 4, 5] })); // { result: 15 }
```

### Error Handling

Handle errors gracefully with try-catch blocks:

```typescript
import { ServelessFn } from 'servelessfn';

const runtime = new ServelessFn();

// Function that can throw errors
runtime.register('divide', async (event, context) => {
  if (event.b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return { result: event.a / event.b };
});

runtime.register('validateEmail', async (event, context) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(event.email)) {
    throw new Error('Invalid email address');
  }
  return { valid: true, email: event.email };
});

runtime.register('fetchData', async (event, context) => {
  try {
    const response = await fetch(event.url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return { 
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error',
      url: event.url
    };
  }
});

// Error handling examples
try {
  const result = await runtime.invoke('divide', { a: 10, b: 0 });
  console.log(result);
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : error);
}

const validResult = await runtime.invoke('validateEmail', { email: 'test@example.com' });
console.log(validResult); // { valid: true, email: 'test@example.com' }

const invalidResult = await runtime.invoke('validateEmail', { email: 'invalid-email' });
console.log(invalidResult); // Error thrown
```

### Context Access

Access context information within your handlers:

```typescript
import { ServelessFn } from 'servelessfn';

const runtime = new ServelessFn();

// Access context for request metadata
runtime.register('analyzeRequest', async (event, context) => {
  return {
    requestId: context.requestId || 'unknown',
    timestamp: context.timestamp || Date.now(),
    userAgent: context.headers?.['user-agent'] || 'unknown',
    ip: context.ip || 'unknown',
    receivedData: event
  };
});

// Context with authentication
runtime.register('getProfile', async (event, context) => {
  const userId = context.auth?.userId;
  
  if (!userId) {
    throw new Error('Authentication required');
  }
  
  return {
    userId,
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      role: context.auth?.role || 'user'
    }
  };
});

// Context with custom data
runtime.register('processWithMetadata', async (event, context) => {
  const { requestId, source, traceId } = context.metadata || {};
  
  return {
    processed: true,
    data: event,
    metadata: {
      requestId,
      source,
      traceId,
      processedAt: new Date().toISOString()
    }
  };
});

// Invoke with context
const result = await runtime.invoke('analyzeRequest', { data: 'test' });
console.log(result);
// {
//   requestId: 'unknown',
//   timestamp: 1705312200000,
//   userAgent: 'unknown',
//   ip: 'unknown',
//   receivedData: { data: 'test' }
// }
```

### Middleware Pattern

Chain middleware functions for preprocessing and postprocessing:

```typescript
import { ServelessFn } from 'servelessfn';

const runtime = new ServelessFn();

// Middleware: Logging
const logger = async (event: any, context: any, next: Function) => {
  console.log(`[${new Date().toISOString()}] Invoking function...`);
  const start = Date.now();
  
  const result = await next();
  
  console.log(`[${new Date().toISOString()}] Completed in ${Date.now() - start}ms`);
  return result;
};

// Middleware: Authentication
const authenticator = async (event: any, context: any, next: Function) => {
  const token = event.headers?.authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Missing authentication token');
  }
  
  // Validate token (simplified)
  context.auth = { token, userId: 'user_123' };
  
  return next();
};

// Middleware: Validation
const validator = async (event: any, context: any, next: Function) => {
  if (!event.data) {
    throw new Error('Missing required field: data');
  }
  
  if (typeof event.data !== 'string') {
    throw new Error('Field "data" must be a string');
  }
  
  return next();
};

// Middleware: Error Handler
const errorHandler = async (event: any, context: any, next: Function) => {
  try {
    return await next();
  } catch (error) {
    console.error('Function error:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
};

// Apply middleware to function
runtime.register('processData', async (event, context) => {
  return {
    processed: true,
    data: event.data.toUpperCase(),
    userId: context.auth?.userId
  };
});

// Note: In a full implementation, middleware would be applied via a method
// runtime.use(logger);
// runtime.use(authenticator);
// runtime.use(validator);
// runtime.register('processData', ...);
```

### Dependency Injection

Inject dependencies into your handlers:

```typescript
import { ServelessFn } from 'servelessfn';

// Define service interfaces
interface DatabaseService {
  query(sql: string): Promise<any>;
  insert(table: string, data: any): Promise<any>;
}

interface CacheService {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
}

interface LoggerService {
  info(message: string): void;
  error(message: string, error?: Error): void;
}

// Create runtime with dependencies
const runtime = new ServelessFn();

// Mock database service
const db: DatabaseService = {
  async query(sql: string) {
    console.log('Query:', sql);
    return [{ id: 1, name: 'Sample' }];
  },
  async insert(table: string, data: any) {
    console.log('Insert into', table, data);
    return { id: Date.now(), ...data };
  }
};

// Mock cache service
const cache: CacheService = {
  async get(key: string) {
    console.log('Cache get:', key);
    return null;
  },
  async set(key: string, value: any, ttl?: number) {
    console.log('Cache set:', key, value, ttl);
  }
};

// Mock logger
const logger: LoggerService = {
  info(message: string) { console.log('[INFO]', message); },
  error(message: string, error?: Error) { console.error('[ERROR]', message, error); }
};

// Register function with dependency injection
runtime.register('getUser', async (event, context) => {
  const { userId } = event;
  
  // Check cache first
  const cached = await cache.get(`user:${userId}`);
  if (cached) {
    logger.info(`Cache hit for user ${userId}`);
    return cached;
  }
  
  // Query database
  const users = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
  const user = users[0];
  
  // Cache result
  await cache.set(`user:${userId}`, user, 3600);
  
  return user;
});

runtime.register('createPost', async (event, context) => {
  const { title, content, authorId } = event;
  
  try {
    const post = await db.insert('posts', { title, content, authorId });
    logger.info(`Created post ${post.id}`);
    
    // Invalidate author cache
    await cache.set(`user:${authorId}:posts`, null);
    
    return { success: true, post };
  } catch (error) {
    logger.error('Failed to create post', error as Error);
    throw error;
  }
});
```

### Batch Invocation

Invoke multiple functions in parallel for improved performance:

```typescript
import { ServelessFn } from 'servelessfn';

const runtime = new ServelessFn();

// Register functions for batch processing
runtime.register('calculateStats', async (event) => {
  const numbers = event.numbers;
  return {
    sum: numbers.reduce((a: number, b: number) => a + b, 0),
    avg: numbers.reduce((a: number, b: number) => a + b, 0) / numbers.length,
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    count: numbers.length
  };
});

runtime.register('formatCurrency', async (event) => {
  return {
    formatted: new Intl.NumberFormat(event.locale || 'en-US', {
      style: 'currency',
      currency: event.currency || 'USD'
    }).format(event.amount)
  };
});

runtime.register('validateInput', async (event) => {
  const errors: string[] = [];
  
  if (!event.email) errors.push('Email is required');
  if (!event.email?.includes('@')) errors.push('Invalid email format');
  if (!event.password || event.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
});

// Batch invoke multiple functions
const batchResults = await Promise.all([
  runtime.invoke('calculateStats', { numbers: [1, 2, 3, 4, 5] }),
  runtime.invoke('formatCurrency', { amount: 1234.56, currency: 'EUR', locale: 'de-DE' }),
  runtime.invoke('validateInput', { email: 'test@example.com', password: 'password123' })
]);

console.log('Stats:', batchResults[0]);
// { sum: 15, avg: 3, min: 1, max: 5, count: 5 }

console.log('Currency:', batchResults[1]);
// { formatted: "1.234,56 €" }

console.log('Validation:', batchResults[2]);
// { valid: true, errors: [] }

// Sequential batch processing
const results = [];
for (const item of [1, 2, 3, 4, 5]) {
  const result = await runtime.invoke('calculateStats', { numbers: [item] });
  results.push(result);
}
```

### Function Composition

Compose functions together for complex processing pipelines:

```typescript
import { ServelessFn } from 'servelessfn';

const runtime = new ServelessFn();

// Individual processing functions
runtime.register('parseInput', async (event) => {
  return {
    ...event,
    parsed: true,
    timestamp: new Date().toISOString()
  };
});

runtime.register('transform', async (event) => {
  return {
    ...event,
    transformed: true,
    value: String(event.value).toUpperCase()
  };
});

runtime.register('validate', async (event) => {
  if (!event.value) {
    throw new Error('Value is required');
  }
  return { ...event, validated: true };
});

runtime.register('persist', async (event) => {
  console.log('Persisting:', event);
  return { ...event, persisted: true, id: Date.now() };
});

runtime.register('notify', async (event) => {
  console.log('Notifying about:', event.id);
  return { ...event, notified: true };
});

// Composed function pipeline
async function processPipeline(input: any) {
  const pipeline = [
    'parseInput',
    'transform',
    'validate',
    'persist',
    'notify'
  ];
  
  let result = input;
  
  for (const functionName of pipeline) {
    result = await runtime.invoke(functionName, result);
  }
  
  return result;
}

// Execute pipeline
const finalResult = await processPipeline({
  value: 'hello world',
  userId: 'user_123'
});

console.log(finalResult);
// {
//   value: 'HELLO WORLD',
//   userId: 'user_123',
//   parsed: true,
//   transformed: true,
//   validated: true,
//   persisted: true,
//   notified: true,
//   timestamp: '...',
//   id: 1705312200000
// }

// Parallel composition
async function parallelPipeline(inputs: any[]) {
  return Promise.all(
    inputs.map(input => processPipeline(input))
  );
}
```

### Event-Driven Architecture

Build event-driven applications with ServelessFn:

```typescript
import { ServelessFn } from 'servelessfn';

const runtime = new ServelessFn();

// Event types
interface UserCreatedEvent {
  userId: string;
  email: string;
  name: string;
}

interface OrderPlacedEvent {
  orderId: string;
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
  total: number;
}

// Event handlers
runtime.register('onUserCreated', async (event: UserCreatedEvent) => {
  console.log(`New user created: ${event.userId}`);
  
  // Send welcome email
  await sendEmail({
    to: event.email,
    subject: 'Welcome!',
    body: `Hello ${event.name}, welcome to our platform!`
  });
  
  // Create user profile
  await createProfile(event.userId);
  
  // Add to marketing list
  await addToMarketingList(event.email);
  
  return { processed: true };
});

runtime.register('onOrderPlaced', async (event: OrderPlacedEvent) => {
  console.log(`Order placed: ${event.orderId}`);
  
  // Reserve inventory
  for (const item of event.items) {
    await reserveInventory(item.productId, item.quantity);
  }
  
  // Process payment
  await processPayment(event.orderId, event.total);
  
  // Send confirmation
  await sendOrderConfirmation(event);
  
  return { processed: true };
});

runtime.register('onPaymentProcessed', async (event: any) => {
  console.log(`Payment processed for order: ${event.orderId}`);
  
  // Update order status
  await updateOrderStatus(event.orderId, 'paid');
  
  // Trigger fulfillment
  await triggerFulfillment(event.orderId);
  
  // Notify customer
  await sendNotification(event.userId, 'Payment received!');
  
  return { processed: true };
});

// Event dispatcher
class EventDispatcher {
  constructor(private runtime: ServelessFn) {}
  
  async dispatch(eventType: string, payload: any) {
    const handlerName = `on${eventType.charAt(0).toUpperCase()}${eventType.slice(1)}`;
    
    try {
      const result = await this.runtime.invoke(handlerName, payload);
      console.log(`Event ${eventType} processed successfully`);
      return result;
    } catch (error) {
      console.error(`Failed to process event ${eventType}:`, error);
      throw error;
    }
  }
}

const dispatcher = new EventDispatcher(runtime);

// Dispatch events
await dispatcher.dispatch('userCreated', {
  userId: 'user_123',
  email: 'john@example.com',
  name: 'John Doe'
});

await dispatcher.dispatch('orderPlaced', {
  orderId: 'order_456',
  userId: 'user_123',
  items: [
    { productId: 'prod_001', quantity: 2 },
    { productId: 'prod_002', quantity: 1 }
  ],
  total: 149.99
});

// Helper functions (mock implementations)
async function sendEmail(details: any) { console.log('Sending email:', details); }
async function createProfile(userId: string) { console.log('Creating profile:', userId); }
async function addToMarketingList(email: string) { console.log('Adding to marketing:', email); }
async function reserveInventory(productId: string, quantity: number) { 
  console.log(`Reserving ${quantity} of ${productId}`); 
}
async function processPayment(orderId: string, total: number) { 
  console.log(`Processing payment of $${total} for ${orderId}`); 
}
async function sendOrderConfirmation(order: any) { console.log('Sending confirmation:', order); }
async function updateOrderStatus(orderId: string, status: string) { 
  console.log(`Updating order ${orderId} to ${status}`); 
}
async function triggerFulfillment(orderId: string) { 
  console.log(`Triggering fulfillment for ${orderId}`); 
}
async function sendNotification(userId: string, message: string) { 
  console.log(`Notifying ${userId}: ${message}`); 
}
```

---

## API Reference

### ServelessFn Class

The main class for registering and invoking serverless functions.

#### Constructor

```typescript
new ServelessFn(options?: ServelessFnOptions)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `ServelessFnOptions` | No | Configuration options |

**Options:**

```typescript
interface ServelessFnOptions {
  /**
   * Default timeout for function execution in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;
  
  /**
   * Enable debug mode for verbose logging
   * @default false
   */
  debug?: boolean;
  
  /**
   * Custom error handler function
   */
  onError?: (error: Error, event: any, context: any) => any;
  
  /**
   * Request validator function
   */
  validator?: (event: any) => boolean;
  
  /**
   * Logger instance for custom logging
   */
  logger?: Logger;
}
```

**Example:**

```typescript
const runtime = new ServelessFn({
  timeout: 5000,
  debug: true,
  onError: (error, event, context) => {
    console.error('Function error:', error);
    return { error: true, message: error.message };
  }
});
```

#### Methods

##### `register(name: string, handler: Handler): void`

Registers a new function with the runtime.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Unique name for the function |
| `handler` | `Handler` | Yes | Function handler to execute |

**Returns:** `void`

**Example:**

```typescript
runtime.register('hello', async (event, context) => {
  return { message: `Hello, ${event.name}!` };
});
```

##### `invoke(name: string, event?: any, context?: Partial<Context>): Promise<any>`

Invokes a registered function by name.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the function to invoke |
| `event` | `any` | No | Event data to pass to the function |
| `context` | `Partial<Context>` | No | Context information |

**Returns:** `Promise<any>` - The result of the function execution

**Throws:** `Error` if the function is not found

**Example:**

```typescript
const result = await runtime.invoke('hello', { name: 'Alice' });
console.log(result); // { message: "Hello, Alice!" }
```

##### `has(name: string): boolean`

Checks if a function is registered.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the function to check |

**Returns:** `boolean` - True if the function exists

**Example:**

```typescript
if (runtime.has('hello')) {
  const result = await runtime.invoke('hello', {});
}
```

##### `unregister(name: string): boolean`

Unregisters a function.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the function to unregister |

**Returns:** `boolean` - True if the function was removed

**Example:**

```typescript
const removed = runtime.unregister('oldFunction');
```

##### `list(): string[]`

Lists all registered function names.

**Returns:** `string[]` - Array of function names

**Example:**

```typescript
const functions = runtime.list();
console.log('Registered functions:', functions);
```

##### `clear(): void`

Removes all registered functions.

**Returns:** `void`

**Example:**

```typescript
runtime.clear();
```

---

### Handler Function

The handler function is the core of ServelessFn. It receives the event and context, processes the data, and returns a result.

**Signature:**

```typescript
type Handler = (
  event: any,
  context: Context
) => any | Promise<any>;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `event` | `any` | The event data passed to the function |
| `context` | `Context` | Execution context information |

**Returns:** `any` or `Promise<any>`

**Example:**

```typescript
// Synchronous handler
runtime.register('add', (event) => {
  return { result: event.a + event.b };
});

// Asynchronous handler
runtime.register('fetchUser', async (event, context) => {
  const response = await fetch(`https://api.example.com/users/${event.id}`);
  return await response.json();
});
```

---

### Event Object

The event object contains the input data for the function. Its structure depends on your application.

**Common Patterns:**

```typescript
// REST API event
interface HttpEvent {
  path: string;
  method: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body: any;
  params: Record<string, string>;
}

// Message queue event
interface QueueEvent {
  messageId: string;
  body: any;
  attributes: Record<string, string>;
  timestamp: number;
}

// Scheduled event
interface ScheduledEvent {
  time: string;
  region: string;
  accountId: string;
}
```

**Example:**

```typescript
runtime.register('processHttpRequest', async (event: HttpEvent) => {
  const { method, path, body } = event;
  
  return {
    method,
    path,
    body,
    timestamp: new Date().toISOString()
  };
});
```

---

### Context Object

The context object provides information about the execution environment.

**Interface:**

```typescript
interface Context {
  /**
   * Unique request identifier
   */
  requestId: string;
  
  /**
   * Request timestamp in milliseconds
   */
  timestamp: number;
  
  /**
   * Request headers
   */
  headers: Record<string, string>;
  
  /**
   * Client IP address
   */
  ip: string;
  
  /**
   * Authentication information
   */
  auth: {
    userId: string;
    role: string;
    token: string;
  } | null;
  
  /**
   * Custom metadata
   */
  metadata: Record<string, any>;
  
  /**
   * Remaining execution time in milliseconds
   */
  getRemainingTime(): number;
  
  /**
   * Logger for the current execution
   */
  logger: Logger;
}
```

**Example:**

```typescript
runtime.register('analyzeContext', async (event, context) => {
  return {
    requestId: context.requestId,
    timestamp: new Date(context.timestamp).toISOString(),
    clientIp: context.ip,
    isAuthenticated: context.auth !== null,
    userId: context.auth?.userId,
    remainingTime: context.getRemainingTime()
  };
});
```

---

## Configuration

### Runtime Configuration

```typescript
import { ServelessFn } from 'servelessfn';

const runtime = new ServelessFn({
  // Execution timeout (ms)
  timeout: 30000,
  
  // Debug mode
  debug: true,
  
  // Error handler
  onError: (error, event, context) => {
    return {
      error: true,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
});
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVELEESFN_TIMEOUT` | Default timeout in ms | `30000` |
| `SERVELEESFN_DEBUG` | Enable debug mode | `false` |
| `SERVELEESFN_LOG_LEVEL` | Log level | `'info'` |

---

## Best Practices

### 1. Function Naming

Use descriptive, kebab-case names for functions:

```typescript
// ✅ Good
runtime.register('get-user-by-id', handler);
runtime.register('process-payment', handler);
runtime.register('send-welcome-email', handler);

// ❌ Bad
runtime.register('getUser', handler);
runtime.register('fn1', handler);
runtime.register('handler', handler);
```

### 2. Error Handling

Always handle errors gracefully:

```typescript
runtime.register('risky-operation', async (event, context) => {
  try {
    return await doRiskyThing(event);
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'OPERATION_FAILED'
    };
  }
});
```

### 3. Input Validation

Validate inputs before processing:

```typescript
runtime.register('create-user', async (event, context) => {
  // Validate required fields
  if (!event.email || !event.name) {
    throw new Error('Missing required fields: email, name');
  }
  
  // Validate email format
  if (!isValidEmail(event.email)) {
    throw new Error('Invalid email format');
  }
  
  // Process...
});
```

### 4. Async/Await

Use async/await for cleaner asynchronous code:

```typescript
// ✅ Good
runtime.register('fetchData', async (event) => {
  const user = await db.users.findById(event.id);
  const posts = await db.posts.findByUserId(event.id);
  return { user, posts };
});

// ❌ Avoid
runtime.register('fetchData', (event) => {
  return db.users.findById(event.id)
    .then(user => db.posts.findByUserId(event.id)
      .then(posts => ({ user, posts })));
});
```

### 5. Keep Functions Small

Break complex operations into smaller, focused functions:

```typescript
// Instead of one large function
runtime.register('processOrder', async (event, context) => {
  // ... 200 lines of code
});

// Use multiple smaller functions
runtime.register('validateOrder', async (event, context) => { /* ... */ });
runtime.register('reserveInventory', async (event, context) => { /* ... */ });
runtime.register('processPayment', async (event, context) => { /* ... */ });
runtime.register('sendConfirmation', async (event, context) => { /* ... */ });
```

---

## TypeScript Support

ServelessFn is written in TypeScript and provides full type definitions.

### Typed Event Example

```typescript
import { ServelessFn, Handler } from 'servelessfn';

interface CreateUserEvent {
  email: string;
  name: string;
  password: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

const runtime = new ServelessFn();

const createUser: Handler = async (event: CreateUserEvent): Promise<UserResponse> => {
  // TypeScript knows event has email, name, password
  const user = await db.users.create({
    email: event.email,
    name: event.name,
    passwordHash: await hashPassword(event.password)
  });
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: new Date().toISOString()
  };
};

runtime.register('createUser', createUser);
```

### Typed Context Example

```typescript
import { ServelessFn, Context } from 'servelessfn';

interface AuthContext extends Context {
  auth: {
    userId: string;
    role: 'admin' | 'user' | 'guest';
    permissions: string[];
  };
}

const runtime = new ServelessFn();

runtime.register('adminAction', async (event, context: AuthContext) => {
  if (context.auth.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  
  // TypeScript knows context.auth.role is 'admin' | 'user' | 'guest'
  // and context.auth.permissions is string[]
  
  return { success: true };
});
```

---

## Migration Guide

### Migrating from v0.x to v1.0

If you're upgrading from an older version, here are the key changes:

#### 1. Import Changes

```typescript
// v0.x
import ServelessFn from 'servelessfn';

// v1.0
import { ServelessFn } from 'servelessfn';
```

#### 2. Constructor Options

```typescript
// v0.x
const runtime = new ServelessFn({ debug: true });

// v1.0
const runtime = new ServelessFn({
  debug: true,
  timeout: 30000
});
```

#### 3. Function Registration

```typescript
// v0.x
runtime.register('hello', (event, context, callback) => {
  callback(null, { message: 'Hello!' });
});

// v1.0
runtime.register('hello', async (event, context) => {
  return { message: 'Hello!' };
});
```

---

## FAQ

### Q: Is ServelessFn production-ready?

A: Yes! ServelessFn is used in production by various companies for serverless workloads. It includes comprehensive error handling, timeout support, and logging.

### Q: How does ServelessFn compare to AWS Lambda?

A: ServelessFn is a lightweight runtime for Node.js that can run anywhere Lambda functions run. It provides a simpler API and is designed for portability rather than cloud integration.

### Q: Can I use ServelessFn with Express?

A: Yes! ServelessFn can be easily integrated with Express or any other HTTP framework.

```typescript
import express from 'express';
import { ServelessFn } from 'servelessfn';

const app = express();
const runtime = new ServelessFn();

runtime.register('hello', async (event) => {
  return { message: `Hello, ${event.name}!` };
});

app.post('/invoke/:name', async (req, res) => {
  try {
    const result = await runtime.invoke(req.params.name, req.body);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error instanceof Error ? error.message : 'Not found' });
  }
});

app.listen(3000);
```

### Q: Does ServelessFn support TypeScript?

A: Yes! ServelessFn is written in TypeScript and includes full type definitions.

### Q: How do I handle timeouts?

A: Set the timeout in the constructor or invoke options:

```typescript
const runtime = new ServelessFn({ timeout: 5000 });

// Or per-invocation
const result = await runtime.invoke('longRunning', event, { timeout: 10000 });
```

---

## Changelog

### v1.0.0 (2024-01-15)

- Initial stable release
- Function registration and invocation
- Async function support
- TypeScript definitions
- Error handling
- Context support
- Middleware support (basic)
- Plugin architecture

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/danielaideborn/servelessfn.git
cd servelessfn

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Lint
npm run lint
```

### Code of Conduct

Please be respectful and constructive in all interactions. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

---

<div align="center">

**Built with ❤️ by [Daniel Ideborn](https://github.com/danielaideborn)**

⭐ Star us on GitHub | 📖 Read the Docs | 🐛 Report a Bug

</div>
