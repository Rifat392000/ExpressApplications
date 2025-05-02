# Fetch API vs Axios: A Complete Guide

## Introduction

When working with HTTP requests in JavaScript applications, two popular choices are the Fetch API and Axios. While both allow you to communicate with APIs, Axios provides additional features and a more user-friendly API, making development smoother and more efficient.

This guide compares Fetch and Axios side-by-side for various HTTP methods, explains their differences, and demonstrates why Axios often makes a developer's life easier.

## Table of Contents

1. [Installation](#installation)
2. [Basic Syntax Comparison](#basic-syntax-comparison)
3. [HTTP Methods Examples](#http-methods-examples)
   * [GET](#get)
   * [POST](#post)
   * [PUT](#put)
   * [PATCH](#patch)
   * [DELETE](#delete)
4. [Axios Advantages](#axios-advantages)
5. [Conclusion](#conclusion)

## Installation

**Fetch API** is built-in and requires no installation.

**Axios** requires installation via npm:

```bash
npm install axios
```

## Basic Syntax Comparison

### Fetch

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Axios

```javascript
import axios from 'axios';

axios.get('https://api.example.com/data')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
```

Axios automatically parses JSON and handles errors better.

## HTTP Methods Examples

### GET

#### Fetch

```javascript
fetch('https://api.example.com/items')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### Axios

```javascript
axios.get('https://api.example.com/items')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

### POST

#### Fetch

```javascript
fetch('https://api.example.com/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'NewItem' })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### Axios

```javascript
axios.post('https://api.example.com/items', { name: 'NewItem' })
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

### PUT

#### Fetch

```javascript
fetch('https://api.example.com/items/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'UpdatedItem' })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### Axios

```javascript
axios.put('https://api.example.com/items/1', { name: 'UpdatedItem' })
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

### PATCH

#### Fetch

```javascript
fetch('https://api.example.com/items/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'PartiallyUpdatedItem' })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### Axios

```javascript
axios.patch('https://api.example.com/items/1', { name: 'PartiallyUpdatedItem' })
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

### DELETE

#### Fetch

```javascript
fetch('https://api.example.com/items/1', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### Axios

```javascript
axios.delete('https://api.example.com/items/1')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

## Axios Advantages

* **Automatic JSON parsing**: No need to manually call `.json()`
* **Request and Response Interceptors**: Add tokens, log requests globally
* **Better error handling**: Axios surfaces HTTP status codes and messages clearly
* **CSRF/XSRF Protection**: Built-in support
* **Timeouts**: Easily set request timeouts
* **Client-side defaults**: Set global headers, base URLs
* **Progress Monitoring**: Track upload/download progress with ease
* **Supports older browsers**: Works with IE11+

## Conclusion

While Fetch is a great modern API and sufficient for many use cases, Axios provides a more feature-rich and developer-friendly experience. If you're building scalable applications or need advanced features like interceptors and better error handling, Axios is often the better choice.

For small scripts or modern browser-only projects, Fetch might be enough. Choose the tool that best suits your project's needs.