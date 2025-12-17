# Random Name Generator

A React + TypeScript application for generating random names for places, people, and creatures.

## Features

- **Multiple Categories**: Generate names for Places, People, and Creatures.
- **Customizable**: Adjust the number of syllables and the number of names to generate.
- **Extensible**: Built with a modular syllable-based generation system that is easy to extend with new data.

## Getting Started

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Run Development Server**:

    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/data/`: Contains the syllable data for different categories.
- `src/generators/`: Contains the logic for combining syllables.
- `src/App.tsx`: The main UI component.

## Extending

To add a new category:

1.  Create a new data file in `src/data/` (e.g., `items.ts`).
2.  Export prefixes, middles, and suffixes.
3.  Update `src/generators/SyllableGenerator.ts` to include the new type and data.
4.  Update the UI in `src/App.tsx` to add the new option.
    import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
