import React, { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';
import { setAuthToken, setUser } from '../utils/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ...
      // Bu yerda to'liq yo'l (/api bilan) berilishi kerak
      const response = await api.post('/api/auth/login', { username, password });
      // ...
      const { token, user } = response.data;

      setAuthToken(token);
      setUser(user);

      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h1>EduPlatform Tizimiga Kirish</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Foydalanuvchi nomi</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Parol</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Kirish</button>
      </form>
    </div>
  );
}
