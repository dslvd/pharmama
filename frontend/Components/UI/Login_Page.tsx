'use client'

import { useState } from 'react'

interface LoginPageProps {
  onLogin: (role: 'superuser' | 'clinic') => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username && password) {
      onLogin('superuser')
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg p-8 border border-[#E0D5C7]">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-[#2D1B4E] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">Rx</span>
            </div>
            <h1 className="ml-3 text-2xl font-bold text-[#2D1B4E]">PharmaMa</h1>
          </div>

          <h2 className="text-center text-lg font-semibold text-[#2D1B4E] mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2D1B4E] mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-[#D4C8B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1B4E]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D1B4E] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-[#D4C8B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1B4E]"
              />
            </div>

            <button
              type="submit"
              disabled={!username || !password}
              className="w-full bg-[#2D1B4E] text-white py-2 rounded-lg font-semibold hover:bg-[#1a0f2e] transition-colors disabled:opacity-50"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
