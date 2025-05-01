# Understanding `process.env.PORT` in Node.js

## Overview

`process.env.PORT` is a way to access the **environment variable** named `PORT` in a Node.js application.

- `process` is a global object in Node.js that provides information and control over the current Node.js process
- `env` is a property of `process` that stores all environment variables as key-value pairs (all values are strings)
- `PORT` is the name of a specific environment variable that usually tells your server **which port it should listen on**

## Example Usage

In a typical Node.js server setup:

```javascript
const express = require('express');
const app = express();

// Use the port from the environment variable, or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Why This Matters

- **Deployment environments** (like Heroku, AWS, Vercel) often automatically set the `PORT` environment variable for you — you don't pick it yourself
- **Locally**, you usually don't have `PORT` set unless you manually define it (in `.env` files, or in your terminal)

## Setting Environment Variables

### Using a `.env` File with `dotenv`

The `dotenv` package is commonly used to load environment variables from a `.env` file:

1. Install the package:
   ```
   npm install dotenv
   ```

2. Create a `.env` file in your project root:
   ```
   PORT=4000
   ```

3. Load the variables in your application:
   ```javascript
   require('dotenv').config();
   const PORT = process.env.PORT || 3000;
   ```

### Setting Directly in the Terminal

You can also set environment variables directly when running your application:

```bash
# Unix/Mac
PORT=4000 node server.js

# Windows (Command Prompt)
set PORT=4000 && node server.js

# Windows (PowerShell)
$env:PORT=4000; node server.js
```

## Best Practices

- Always provide a default value (e.g., `PORT || 3000`) to ensure your application works even if the environment variable isn't set
- Keep sensitive information like API keys in environment variables, not hardcoded in your source code
- Include a sample `.env.example` file in your repository to document what environment variables your application needs, without exposing actual values
