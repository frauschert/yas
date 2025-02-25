# Yas - Yet another state!

This project implements a simple state management store in TypeScript. It provides a way to manage application state with listeners and middleware support.

## Installation

To get started with this project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd my-typescript-project
npm install
```

## Usage

You can create a store by importing the `createStore` function from `src/store.ts` and providing an initial state:

```typescript
import { createStore } from './src/store';

const initialState = { count: 0 };
const store = createStore(initialState);
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
