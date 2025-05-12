`app.use(cookieParser());` is used in an Express.js app to **enable the server to read cookies from incoming HTTP requests**.

---

### 🔍 What `cookie-parser` does:

When a client (like a browser) sends a request with a `Cookie` header, `cookie-parser` parses that header and makes the cookie values available in:

```js
req.cookies
```

---

### ✅ Why it's useful:

1. **Access cookies easily:**

   ```js
   console.log(req.cookies.token); // access cookie named 'token'
   ```

2. **Used in authentication:**

   * If you're storing a **JWT or session ID** in a cookie (e.g., `Set-Cookie: token=abcd123`), you need to read that cookie on the server to validate the user.

3. **Supports signed cookies (optional):**

   * You can pass a secret: `cookieParser('yourSecret')` to read signed cookies using `req.signedCookies`.

---

### 🛠 Example:

```js
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

app.get('/', (req, res) => {
  console.log(req.cookies); // Logs all cookies sent by the client
  res.send('Cookies checked!');
});
```

---

### 💡 Without `cookie-parser`, `req.cookies` will be `undefined`.


