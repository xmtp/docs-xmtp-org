# Troubleshooting

This document provides troubleshooting tips for common developer support questions.

## Why is my app failing with a "Buffer is not found" error?

If you run into issues with `Buffer` and `polyfills`, try this solution:

::::steps

### Install the buffer dependency

```bash [Bash]
npm i buffer
```

### Create a new file `polyfills.js` in the root of your project

```tsx [TypeScript]
import { Buffer } from "buffer";

window.Buffer = window.Buffer ?? Buffer;
```

### On the first line of your main file, import `polyfills`

- ReactJS: `index.js` or `index.tsx`
- VueJS: `main.js`
- NuxtJS: `app.vue`

```tsx [TypeScript]
// it has to be on the first line of the file for it to work
import "./polyfills";
```

::::