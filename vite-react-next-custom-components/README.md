# Vite React Next Custom Components

This package provides a collection of pre-built, custom React components meant for your Next.js and Vite applications. 

## Prerequisites
⚠️ **IMPORTANT: These components are built on top of [shadcn/ui](https://ui.shadcn.com/).** You MUST initialize shadcn/ui in your project before using these components.

Ensure your project uses `lucide-react` for icons and has a standard Shadcn setup with the `cn` utility in `lib/utils`.

## Installation & Usage

You do not need to install this package as a dependency. Instead, use `npx` to add components directly into your codebase.

We provide a short CLI command `custs` to quickly add components to your project. The components will be automatically installed in your `components/custom-components` (or `src/components/custom-components`) folder.

### Install a single component
```bash
npx custs add ApplicationButton
```

### Install ALL custom components at once
```bash
npx custs add all
```

### Note on Imports
The CLI automatically attempts to rewrite the internal monorepo aliases (`@workspace/ui/components`) into the standard Shadcn UI aliases (`@/components/ui/`). Depending on your project's `tsconfig.json` path setup, you may need to adjust the alias paths in the downloaded files slightly if you don't use the standard `@/` alias.
