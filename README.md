# Uhuu Starter Examples

Welcome to the **Uhuu Starter Examples** repository! This repository provides a set of starter examples for building and running Uhuu templates using `React`, `Vite`, and `Lerna`.

## Installation

To get started with a specific example, you can quickly clone and set up an example template using the following command:

```bash
npm create uhuu-starter@latest -- --example direct-mail
```

Replace `direct-mail` with the name of any other example to set up that template.

## Structure and Setup

Each example template in the `examples` folder is managed as an individual package using `Vite`, allowing you to run, build, and test each example independently.

### Getting Started

To begin working with these examples, install the required dependencies and start the development server for a specific template.

**Install Dependencies**:
```bash
npm install
```

#### Run Examples

```bash
# Start a specific template in development mode
npm run dev [template-name]

# Start a specific template in Uhuu integration mode
npm run uhuu [template-name]

# Build a specific template for production
npm run build [template-name]
```

**Example Commands**

```bash
# Run the basic-pagedjs template in development mode
npm run dev basic-pagedjs

# Run the basic-pagedjs template in Uhuu integration mode
npm run uhuu basic-pagedjs

# Build the basic-pagedjs template for production
npm run build basic-pagedjs
```

### Notes

- **Development Mode**: Launches the selected template with hot-reloading enabled for quick iteration.
- **Uhuu Mode**: Prepares the template for use with the Uhuu Editor.
- **Build**: Compiles the selected template into a production-ready format.

Explore the examples to get started with building Uhuu templates!
