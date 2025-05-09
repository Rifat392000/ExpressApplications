// ----------------------------------------------------------
// JWT Signing Example with Base64URL Explanation
// ----------------------------------------------------------

// ✅ JWTs utilize Base64URL encoding for the header and payload,
// making them compact and URL-safe.
// ✅ The signature is also Base64URL encoded, using a modified
// version of Base64 that replaces characters for URL compatibility.
// 🔗 Source: Auth0 Community & jwt.io

// ----------------------------------------------------------
// Imports & Configuration
// ----------------------------------------------------------
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

// ----------------------------------------------------------
// HMAC SHA256 Signing (Symmetric)
// ----------------------------------------------------------
const payload1 = {
  email: "rifat@email.com",
  _id: 2566659655
};

const token1 = jwt.sign(payload1, process.env.ACCESS_TOKEN_SECRET);
console.log("Token 1 (HMAC, no expiry):", token1);

const payload2 = {
  email: "rifat@email.com",
  name: "Rifat",
  _id: 2566659655
};

const token2 = jwt.sign(payload2, process.env.ACCESS_TOKEN_SECRET, {
  expiresIn: '5h'
});
console.log("Token 2 (HMAC, expires in 5h):", token2);

// ----------------------------------------------------------
// RSA SHA256 Signing (Asymmetric)
// ----------------------------------------------------------
const privateKey = fs.readFileSync('./RSA256/private.key');

const payload3 = {
  foo: 'bar'
};

const token3 = jwt.sign(payload3, privateKey, {
  algorithm: 'RS256'
});
console.log("Token 3 (RS256):", token3);
