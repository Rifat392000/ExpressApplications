**Comprehensive breakdown** of the differences between **Encode**, **Decode**, **Encrypt**, **Decrypt**, and **Hash Functions**

---

## 🔷 1. ENCODING & DECODING

### 🔹 Encoding

* **Purpose:** To transform data into a different format using a publicly known scheme.
* **Goal:** Make data **readable** or **transportable** (e.g., over a network).
* **Not for security** — anyone can decode it if they know the method.

### Examples of encoding schemes:

* Base64
* URL Encoding
* ASCII
* UTF-8

#### ✅ Example: Base64 Encoding in JavaScript

```javascript
const originalText = "Hello World!";
const encodedText = btoa(originalText); // Encode
console.log(encodedText); // "SGVsbG8gV29ybGQh"

const decodedText = atob(encodedText); // Decode
console.log(decodedText); // "Hello World!"
```

### 🔹 Decoding

* **Reverses encoding**.
* Returns the data to its original format using the same encoding scheme.

---

## 🔷 2. ENCRYPTION & DECRYPTION

### 🔹 Encryption

* **Purpose:** To **secure** data by converting it into a form that only authorized parties can read.
* Uses an **encryption algorithm** and **key(s)**.
* Two main types:

  * **Symmetric encryption** (same key for encryption/decryption)
  * **Asymmetric encryption** (public key for encryption, private key for decryption)

### 🔹 Decryption

* **Purpose:** To **convert encrypted data** (ciphertext) back into readable form (plaintext).

#### ✅ Example: AES Symmetric Encryption in Node.js (Crypto module)

```javascript
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const text = "Secret message";
const encrypted = encrypt(text);
const decrypted = decrypt(encrypted);

console.log({ encrypted, decrypted });
```

---

## 🔷 3. HASH FUNCTIONS

### 🔹 Hashing

* **Purpose:** To transform input (data) into a fixed-size string (hash).
* **One-way function**: **Cannot be reversed.**
* Commonly used for:

  * Storing passwords securely
  * Data integrity checks
  * Digital signatures

### Characteristics:

* Same input → same hash
* Small change in input → very different hash
* **Irreversible** (unlike encryption)

#### ✅ Example: SHA-256 Hashing in JavaScript (Node.js)

```javascript
const crypto = require('crypto');

const password = "mySecurePassword";
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log(hash); // e.g., "5e88489da4..."
```

---

## 🔄 COMPARISON TABLE

| Feature      | Encoding                     | Encryption                 | Hashing                             |
| ------------ | ---------------------------- | -------------------------- | ----------------------------------- |
| Purpose      | Data transformation          | Data confidentiality       | Data integrity/checking             |
| Reversible   | ✅ Yes                        | ✅ Yes (with key)           | ❌ No (One-way)                      |
| Secure?      | ❌ No                         | ✅ Yes                      | ✅ Yes (for storage)                 |
| Key Required | ❌ No                         | ✅ Yes                      | ❌ No                                |
| Use Case     | Data transport (e.g. Base64) | Secure messages (AES, RSA) | Password storage, file verification |
| Output       | Human-readable               | Ciphertext                 | Fixed-size hash                     |

---

## 🔚 Summary

| Action  | Can reverse? | Secures data? | Example Use Case              |
| ------- | ------------ | ------------- | ----------------------------- |
| Encode  | ✅ Yes        | ❌ No          | Transfer binary via URL       |
| Decode  | ✅ Yes        | ❌ No          | Read Base64 from email        |
| Encrypt | ✅ Yes        | ✅ Yes         | Send a secure message         |
| Decrypt | ✅ Yes        | ✅ Yes         | Read a secure message         |
| Hash    | ❌ No         | ✅ (one-way)   | Password storage, file checks |

---

Would you like visual diagrams or real-world analogies added to this explanation?
