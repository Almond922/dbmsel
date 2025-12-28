'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [pwdError, setPwdError] = useState('');

  const validate = () => {
    setEmailError('');
    setPwdError('');
    let ok = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email)) {
      setEmailError('Please enter a valid email');
      ok = false;
    }
    if (!password || password.length < 6) {
      setPwdError('Password must be at least 6 characters');
      ok = false;
    }
    return ok;
  };

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      const data = await res.json();
      if (!res.ok) setError(data.error || 'Login failed');
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side: optional illustration / info on larger screens */}
        <div className="hidden md:flex flex-col items-start justify-center px-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Welcome back</h2>
          <p className="text-gray-600">Sign in to manage listings, requests and assignments.</p>
        </div>

        {/* Right side: form */}
        <div className="flex items-center justify-center">
          <form onSubmit={submit} className="p-6 sm:p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Sign in</h1>

            {error && (
              <div role="alert" aria-live="assertive" className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm mb-1 text-gray-600">Email</label>
              <input
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 ${emailError ? 'border-red-300' : 'border-gray-200'}`}
                type="email"
                placeholder="you@example.com"
                disabled={loading}
              />
              {emailError && <div className="text-sm text-red-600 mt-1">{emailError}</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm mb-1 text-gray-600">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border rounded px-3 py-2 pr-12 focus:outline-none focus:ring focus:ring-blue-200 ${pwdError ? 'border-red-300' : 'border-gray-200'}`}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-2 py-1"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? 'Hide' : 'Show'}
                </button>
              </div>
              {pwdError && <div className="text-sm text-red-600 mt-1">{pwdError}</div>}
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l-3 3-2-2-3 3V12z"></path></svg>
              )}
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
            </button>

            <p className="mt-4 text-sm text-gray-600">No account? Use the register API or ask admin to create one.</p>
          </form>
        </div>
      </div>
    </main>
  );
}