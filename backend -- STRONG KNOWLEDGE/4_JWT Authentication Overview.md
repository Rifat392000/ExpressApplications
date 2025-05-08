Sure! Here's a well-organized, serial explanation of all the listed interview questions along with concise and complete answers:

---

### **1. What is JWT, and why is it used?**

**JWT (JSON Web Token)** is a compact, URL-safe token used to securely transmit information between parties as a JSON object.
It is primarily used for **authentication and authorization** in stateless web applications. Once a user logs in, a server issues a JWT that the client stores and sends with each request to authenticate.

---

### **2. What are the three parts of a JWT? Explain their purpose.**

A JWT consists of **three base64url-encoded parts**:

1. **Header** – Contains metadata about the token, typically the signing algorithm (e.g., HS256).
2. **Payload** – Contains claims (data), such as user ID or expiration (`exp`) timestamp.
3. **Signature** – Created using the header, payload, and a secret key; used to verify token integrity.

Format:
`<header>.<payload>.<signature>`

---

### **3. What is a JWT, and what are its three components?**

This is a duplicate of question 2. Answer combined above.

---

### **4. Explain the difference between signed and encrypted JWTs.**

* **Signed JWTs (JWS)**: Ensure **data integrity**. They are **not encrypted**, so the payload is readable, but tampering can be detected via the signature.
* **Encrypted JWTs (JWE)**: Provide **confidentiality** by encrypting the contents. Only the recipient can decrypt the payload.

🔑 **Signed**: Data integrity
🔒 **Encrypted**: Data confidentiality

---

### **5. How does JWT differ from session-based authentication?**

| Feature             | JWT (Token-based)                 | Session-based                    |
| ------------------- | --------------------------------- | -------------------------------- |
| Server-side storage | No (stateless)                    | Yes (session stored server-side) |
| Scalability         | High                              | Lower (due to server memory)     |
| Transmission        | Sent via headers (usually)        | Sent via cookies                 |
| Revocation          | Harder (requires token blacklist) | Easy (delete session)            |

---

### **6. How do you store JWTs on the client side? What are the trade-offs between localStorage and cookies?**

#### **Options:**

* **localStorage**:

  * ✔ Easy to use
  * ❌ Vulnerable to XSS attacks

* **HTTP-only cookies**:

  * ✔ More secure (not accessible via JS)
  * ❌ Vulnerable to CSRF (if not configured properly)

📝 **Recommendation**: Use **HTTP-only cookies** with **`SameSite=Strict` or `Lax`** and **HTTPS** to enhance security.

---

### **7. What measures can you take to prevent JWT from being tampered with?**

* Use **strong signing algorithms** (e.g., HS256 or RS256).
* Keep your **secret/private key secure**.
* **Validate the signature** on every request server-side.
* Implement **token expiration** (`exp`) and other standard claims like `iat`, `nbf`.
* Use **JWT libraries** that follow spec properly (like `jsonwebtoken` in Node.js).

---

### **8. How can you prevent a JWT from being stolen (e.g., token hijacking)?**

* Use **HTTP-only cookies** to store JWTs.
* Enable **HTTPS** to prevent MITM attacks.
* Implement **short-lived access tokens** and **refresh tokens**.
* Apply **CORS policies** correctly.
* Monitor for unusual behavior (IP/device changes).
* Implement **token revocation** strategies (blacklists, rotating refresh tokens).

---

### **9. Explain the difference between request and response interceptors in Axios.**

* **Request Interceptors**: Executed **before** a request is sent.
  → Example use: attach JWT in headers, log requests, add custom headers.

* **Response Interceptors**: Executed **after** a response is received.
  → Example use: handle global errors, auto-refresh token on 401 errors.

```js
axios.interceptors.request.use(config => {
  // Modify request
  return config;
});

axios.interceptors.response.use(response => {
  // Handle response
  return response;
});
```

---

### **10. How would you add a custom header to all Axios requests using interceptors?**

Use a request interceptor:

```js
axios.interceptors.request.use(config => {
  config.headers['X-Custom-Header'] = 'MyHeaderValue';
  return config;
});
```

This ensures the custom header is attached to every request made using Axios.

---

### **11. How can you include a JWT in the headers of an Axios request?**

Use the `Authorization` header in a request interceptor:

```js
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // or from a cookie or state
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

