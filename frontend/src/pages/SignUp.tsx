import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { OrbitSpheres } from '../components/three/OrbitSpheres';
import { useAuthStore } from '../store/authStore';

export function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D14] text-[#F2F0EA] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      {/* Container holding the split view - View 6 & Image 8 in reference */}
      <div className="w-full max-w-6xl rounded-3xl bg-[#151D2A] border border-[#2B3544] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT COLUMN: Sign Up Form */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div>
            {/* Top Brand Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C6B99A] via-[#8FA39A] to-[#54C7BE] p-[1px] shadow-sm">
                <div className="w-full h-full rounded-[7px] bg-[#090D14] flex items-center justify-center">
                  <span className="text-[#F2F0EA] font-extrabold text-xs font-heading">V</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold font-heading text-[#F2F0EA] tracking-wide leading-none">
                  VERYNTH
                </span>
                <span className="text-[9px] font-body text-[#54C7BE] tracking-widest uppercase mt-0.5">
                  AI EVOLUTION
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F2F0EA] tracking-tight">
                Create Your Account
              </h1>
              <p className="text-base text-[#9AA7B5] mt-3 font-body">
                Start migrating dependencies with AI-powered confidence.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-[#E47979]/10 border border-[#E47979]/30 text-[#E47979] text-xs flex items-start gap-2.5 mb-6">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-body font-medium text-[#9AA7B5] uppercase mb-2.5">
                  Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA7B5]"
                  />
                  <input
                    id="name" autoComplete="name" required type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090D14] border border-[#2B3544] text-sm text-[#F2F0EA] placeholder-[#9AA7B5]/50 focus:outline-none focus:border-[#C6B99A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-body font-medium text-[#9AA7B5] uppercase mb-2.5">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA7B5]"
                  />
                  <input
                    id="email" autoComplete="email" required type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090D14] border border-[#2B3544] text-sm text-[#F2F0EA] placeholder-[#9AA7B5]/50 focus:outline-none focus:border-[#C6B99A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-body font-medium text-[#9AA7B5] uppercase mb-2.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA7B5]"
                  />
                  <input
                    id="password" autoComplete="new-password" required type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#090D14] border border-[#2B3544] text-sm text-[#F2F0EA] placeholder-[#9AA7B5]/50 focus:outline-none focus:border-[#C6B99A] transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA7B5] hover:text-[#F2F0EA]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] font-body text-[#9AA7B5]/80 mt-1.5">
                  Use at least 8 characters with a mix of letters, numbers, and symbols.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                className="w-full bg-[#C6B99A] text-[#090D14] hover:bg-[#DDD2BA] font-semibold h-12 text-sm justify-center rounded-[10px] mt-2"
              >
                Create Account
              </Button>
            </form>

            {/* Divider 'or' */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2B3544]" />
              </div>
              <span className="relative px-3 bg-[#151D2A] text-xs text-[#9AA7B5] font-body">
                or
              </span>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-[#9AA7B5]">
            Already have an account?{' '}
            <Link to="/signin" className="text-[#C6B99A] hover:underline font-semibold ml-1 inline-flex items-center gap-1">
              Sign in <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Luxury 3D Orbiting Spheres Showcase Card */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-[#121926] via-[#090D14] to-[#121926] p-10 flex-col justify-between items-center text-center border-l border-[#2B3544] overflow-hidden">
          {/* Subtle ambient lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(84,199,190,0.12)_0,transparent_70%)] pointer-events-none" />

          {/* 3D Orbiting Spheres Canvas */}
          <div className="w-full flex-1 flex items-center justify-center my-auto">
            <OrbitSpheres />
          </div>

          {/* Showcase Info at Bottom */}
          <div className="relative z-10 max-w-sm w-full pt-4 border-t border-[#2B3544]/60">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xl font-extrabold font-heading text-[#F2F0EA] tracking-wider">
                VERYNTH
              </span>
            </div>
            <p className="text-[10px] font-body tracking-widest text-[#54C7BE] uppercase mb-4">
              AI EVOLUTION
            </p>
            <div className="w-12 h-[1px] bg-[#2B3544] mx-auto mb-4" />
            <h3 className="text-lg font-bold font-heading text-[#F2F0EA] mb-2">
              Upgrade With Confidence.
            </h3>
            <p className="text-xs text-[#9AA7B5] leading-relaxed font-body">
              Open-weight AI for safer software evolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
