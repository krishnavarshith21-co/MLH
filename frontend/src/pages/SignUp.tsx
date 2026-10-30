import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, User as UserIcon, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory flex">
      {/* Left Column: Branded Visual (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-midnight-slate to-obsidian p-12 flex-col justify-between border-r border-border overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-champagne/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 z-10 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-champagne to-teal flex items-center justify-center">
            <span className="text-obsidian font-bold text-sm font-heading">V</span>
          </div>
          <span className="text-xl font-bold font-heading text-ivory group-hover:text-champagne transition-colors">
            VERYNTH
          </span>
        </Link>

        {/* Center Editorial Visual */}
        <div className="z-10 max-w-md my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/10 border border-champagne/20 text-xs font-mono text-champagne uppercase mb-4">
            <Sparkles size={13} />
            Join VERYNTH
          </div>
          <h2 className="text-3xl font-bold font-heading text-ivory leading-tight">
            Developer-controlled AI code evolution for modern engineering teams.
          </h2>
          <p className="mt-4 text-sm text-secondary-text leading-relaxed">
            Eliminate hours of manual API rewrite toil. Import your projects, detect deprecated calls via AST, and test Qwen2.5-Coder patches safely.
          </p>
        </div>

        {/* Footer info */}
        <div className="z-10 text-xs text-secondary-text font-mono">
          <span>SMRU Hack Day 2026 • Track 1 Open-Weight AI</span>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-champagne to-teal flex items-center justify-center">
                <span className="text-obsidian font-bold text-sm font-heading">V</span>
              </div>
              <span className="text-xl font-bold font-heading text-ivory">VERYNTH</span>
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-ivory">
            Create an Account
          </h1>
          <p className="text-sm text-secondary-text mt-2">
            Start managing and verifying dependency upgrades.
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-error/10 border border-error/30 text-error text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-secondary-text uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-midnight-slate border border-border text-sm text-ivory placeholder-secondary-text/50 focus:outline-none focus:border-champagne transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary-text uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-midnight-slate border border-border text-sm text-ivory placeholder-secondary-text/50 focus:outline-none focus:border-champagne transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary-text uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-midnight-slate border border-border text-sm text-ivory placeholder-secondary-text/50 focus:outline-none focus:border-champagne transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-ivory"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary-text uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-midnight-slate border border-border text-sm text-ivory placeholder-secondary-text/50 focus:outline-none focus:border-champagne transition-colors"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              disabled={loading}
              icon={<ArrowRight size={16} />}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-xs text-secondary-text mt-6">
            Already have an account?{' '}
            <Link to="/signin" className="text-champagne font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

