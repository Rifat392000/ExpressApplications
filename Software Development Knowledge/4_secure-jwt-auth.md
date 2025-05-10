# Secure JWT Authentication System

A production-ready JWT authentication implementation using:

* **Node.js + Express (backend)**
* **React (frontend)**
* **Asymmetric JWT (RS256)**
* **HTTP-only cookies** for maximum security
* **Access + Refresh Token strategy**

## 🧠 Project Architecture

```
📦project-root
 ┣ 📂server (Node.js + Express)
 ┃ ┣ 📂keys
 ┃ ┃ ┣ 📜private.key
 ┃ ┃ ┗ 📜public.key
 ┃ ┣ 📜authController.js
 ┃ ┣ 📜authMiddleware.js
 ┃ ┣ 📜server.js
 ┃ ┗ 📜.env
 ┗ 📂client (React)
   ┣ 📜App.jsx
   ┗ 📜authService.js
```

## 🔐 Server: Node.js + Express (Secure Auth with JWT)

### 1. **Install Dependencies**

```bash
npm install express jsonwebtoken cookie-parser cors dotenv helmet
```

### 2. **Generate RSA Keys**

```bash
mkdir -p server/keys
openssl genrsa -out server/keys/private.key 2048
openssl rsa -in server/keys/private.key -pubout -out server/keys/public.key
```

### 3. **Create `.env` File**

```
NODE_ENV=development
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

### 4. **`server.js`**

```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const authRoutes = require('./authController');

const app = express();

// Security headers
app.use(helmet());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: process.env.CLIENT_ORIGIN, 
  credentials: true 
}));

// Routes
app.use('/api/auth', authRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```

### 5. **`authMiddleware.js`**

```js
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, 'keys', 'public.key'), 
  'utf8'
);

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const user = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ message: 'Invalid token', code: 'INVALID_TOKEN' });
  }
};

exports.verifyRefreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No refresh token provided.' });
  }
  
  try {
    const user = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    req.user = user;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};
```

### 6. **`authController.js`**

```js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { verifyToken, verifyRefreshToken } = require('./authMiddleware');

const PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, 'keys', 'private.key'), 
  'utf8'
);

const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, 'keys', 'public.key'), 
  'utf8'
);

// Mock user database - in a real app, use a proper database
const users = [
  { id: 1, username: 'admin', password: '1234', role: 'admin', isActive: true },
  { id: 2, username: 'user', password: 'password', role: 'user', isActive: true }
];

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role }, 
    PRIVATE_KEY, 
    {
      algorithm: 'RS256',
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    }
  );
}

function generateRefreshToken(userId) {
  return jwt.sign(
    { id: userId }, 
    PRIVATE_KEY, 
    {
      algorithm: 'RS256',
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    }
  );
}

function setCookies(res, accessToken, refreshToken) {
  // Set access token cookie
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user.id);

  setCookies(res, accessToken, refreshToken);

  res.json({ 
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

// Refresh token route
router.post('/refresh', verifyRefreshToken, (req, res) => {
  const userId = req.user.id;
  
  // Find user by ID
  const user = users.find(u => u.id === userId);
  
  if (!user || !user.isActive) {
    return res.status(403).json({ message: 'User invalid or deactivated' });
  }

  const accessToken = generateAccessToken(user);
  
  // Set only the new access token
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.json({ message: 'Token refreshed' });
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

// Protected route example
router.get('/protected', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);

  if (!user || !user.isActive) {
    return res.status(403).json({ message: 'User invalid or deactivated' });
  }

  res.json({
    message: 'This is protected data',
    user: { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    }
  });
});

// Check auth status
router.get('/status', verifyToken, (req, res) => {
  res.json({ 
    isAuthenticated: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

module.exports = router;
```


---

### 🧮 Breakdown: `15 * 60 * 1000`

This calculates the number of **milliseconds in 15 minutes**, which is needed for the `maxAge` cookie setting.

| Unit     | Multiplier        |
| -------- | ----------------- |
| 1 minute | 60 seconds        |
| 1 second | 1000 milliseconds |

So:

```
15 minutes
= 15 * 60 seconds
= 900 seconds
= 900 * 1000 milliseconds
= 900,000 milliseconds
```

✅ `15 * 60 * 1000` = `900000` milliseconds = **15 minutes**

---

This value tells the browser:

> *“Keep this cookie alive for 900,000 milliseconds, then automatically delete it.”*






## ⚛️ Client: React Implementation

### 1. **Install Dependencies**

```bash
npm install axios
```

### 2. **`authService.js`**

```js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth';

// Configure axios to include credentials (cookies)
axios.defaults.withCredentials = true;

export const authService = {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  async logout() {
    try {
      const response = await axios.post(`${API_URL}/logout`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  async getProtectedData() {
    try {
      const response = await axios.get(`${API_URL}/protected`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
        // Try to refresh the token
        try {
          await this.refreshToken();
          // Retry the original request
          const retryResponse = await axios.get(`${API_URL}/protected`);
          return retryResponse.data;
        } catch (refreshError) {
          throw refreshError.response?.data || { message: 'Authentication failed' };
        }
      }
      throw error.response?.data || { message: 'Request failed' };
    }
  },

  async refreshToken() {
    try {
      const response = await axios.post(`${API_URL}/refresh`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token refresh failed' };
    }
  },

  async checkAuthStatus() {
    try {
      const response = await axios.get(`${API_URL}/status`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await this.refreshToken();
          const retryResponse = await axios.get(`${API_URL}/status`);
          return retryResponse.data;
        } catch {
          return { isAuthenticated: false };
        }
      }
      return { isAuthenticated: false };
    }
  }
};
```

### 3. **`App.jsx`**

```jsx
import { useState, useEffect } from 'react';
import { authService } from './authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated, user } = await authService.checkAuthStatus();
        setIsAuthenticated(isAuthenticated);
        setUser(user);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      setLoading(true);
      const response = await authService.login(loginData.username, loginData.password);
      setIsAuthenticated(true);
      setUser(response.user);
      setMessage(`Welcome, ${response.user.username}!`);
    } catch (error) {
      setMessage(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setMessage('Logged out successfully');
    } catch (error) {
      setMessage(error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const getProtectedData = async () => {
    try {
      setLoading(true);
      const response = await authService.getProtectedData();
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message || 'Failed to fetch protected data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !message) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>JWT Auth Demo</h1>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px',
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px' 
        }}>
          {message}
        </div>
      )}
      
      {!isAuthenticated ? (
        <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '100%' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <p>
            <strong>Logged in as:</strong> {user?.username} ({user?.role})
          </p>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={getProtectedData}
              disabled={loading}
              style={{
                padding: '10px 15px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Loading...' : 'Get Protected Data'}
            </button>
            
            <button 
              onClick={handleLogout}
              disabled={loading}
              style={{
                padding: '10px 15px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Loading...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h3>Test Credentials</h3>
        <div style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace'
        }}>
          <p>Admin: username=admin, password=1234</p>
          <p>User: username=user, password=password</p>
        </div>
      </div>
    </div>
  );
}

export default App;
```

## ✅ Security Best Practices Implemented

| Practice | Description |
|---|---|
| **RS256 JWT (Asymmetric)** | More secure than HS256; private key signs, public key verifies |
| **HTTP-only cookies** | Prevents JavaScript from accessing tokens, mitigating XSS attacks |
| **Access + Refresh token** | Short-lived access tokens with refresh capability for better security |
| **Secure & SameSite cookies** | Prevents CSRF attacks and ensures cookies only sent over HTTPS |
| **Token expiration** | Limited token lifetime reduces risk if tokens are compromised |
| **Proper error handling** | Specific error codes for better client-side handling |
| **Environment variables** | Configuration stored securely in environment variables |
| **Helmet middleware** | Sets security HTTP headers to protect against common attacks |
| **Centralized auth service** | Clean separation of auth logic for maintainability |
| **Token verification middleware** | Reusable verification for all protected routes |

## 📋 Deployment Checklist

1. **Set environment variables** in production:
   - Set `NODE_ENV=production`
   - Set proper `CLIENT_ORIGIN` value
   - Use stronger token expiry settings if needed

2. **Secure your private key**:
   - Never commit keys to source control
   - Use secrets management in production
   - Consider key rotation strategy

3. **Enable HTTPS**:
   - Required for secure cookie transmission
   - Set `secure: true` in cookie options

4. **Consider rate limiting**:
   - Add rate limiting to login and refresh endpoints
   - Prevents brute force attacks

5. **Add monitoring**:
   - Log authentication failures
   - Set up alerts for suspicious activity
