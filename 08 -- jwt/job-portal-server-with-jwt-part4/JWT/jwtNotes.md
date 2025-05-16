**HMAC** stands for **Hash-based Message Authentication Code**. It's a cryptographic technique used to ensure both the **integrity** and **authenticity** of a message.

### 🔐 What HMAC Does:

* **Ensures data hasn’t been tampered with** (integrity).
* **Verifies the message came from a trusted sender** (authenticity).

---

### 🛠 How HMAC Works:

HMAC uses two things:

1. A **cryptographic hash function** (e.g., SHA-256)
2. A **shared secret key** (only known by sender and receiver)

The process:

```
HMAC(message, secret) = hash_function(secret + message)
```

> The output is a unique signature that changes if **either the message or the secret changes**.

---

### 🔒 In JWTs (JSON Web Tokens):

When JWTs are signed using something like `HS256`, that’s **HMAC with SHA-256**. It means:

* The signature is generated using a **shared secret key** and **SHA-256 hash**.
* Both the server that issues the token and the one verifying it must have the same secret.

---

### ✅ Example:

```js
jwt.sign(payload, 'my-secret-key', { algorithm: 'HS256' });
```

This signs the token using HMAC-SHA256 with `'my-secret-key'`.

