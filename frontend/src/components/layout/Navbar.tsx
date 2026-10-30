import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Open Source', href: '/open-source' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#090D14]/92 backdrop-blur-xl border-b border-[#2B3544]/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-[#090D14]/75 backdrop-blur-md border-b border-[#2B3544]/40'
        }`}
      >
        <div className="container-enterprise">
          <div className="flex items-center justify-between h-[76px]">
            {/* LEFT: Logo & Wordmark */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group select-none">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#C6B99A] via-[#8FA39A] to-[#54C7BE] p-[1px] shadow-sm transition-transform duration-200 group-hover:scale-105">
                  <div className="w-full h-full rounded-[11px] bg-[#090D14] flex items-center justify-center">
                    <span className="font-heading font-extrabold text-[#F2F0EA] text-base tracking-wider">
                      V
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold font-heading text-[#F2F0EA] tracking-tight group-hover:text-[#C6B99A] transition-colors duration-200">
                    VERYNTH
                  </span>
                  <span className="text-[10px] font-body text-[#54C7BE] tracking-widest uppercase -mt-1 hidden sm:block">
                    AI Evolution
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER: Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative text-sm font-medium transition-all duration-200 py-1.5 ${
                      isActive
                        ? 'text-[#C6B99A] font-semibold'
                        : 'text-[#9AA7B5] hover:text-[#F2F0EA]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C6B99A] rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT: Actions */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="secondary" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ArrowRight size={15} />}
                      iconPosition="right"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE: Hamburger Button */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-[#9AA7B5] hover:text-[#F2F0EA] hover:bg-[#1D2735] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C6B99A]/40"
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed top-[76px] left-0 right-0 z-40 bg-[#090D14]/98 backdrop-blur-2xl border-b border-[#2B3544] md:hidden shadow-2xl overflow-hidden"
          >
            <div className="container-enterprise py-6 flex flex-col gap-5">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-[#1D2735] text-[#C6B99A]'
                          : 'text-[#F2F0EA] hover:bg-[#151D2A] hover:text-[#C6B99A]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#2B3544] flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="w-full">
                      <Button variant="primary" size="lg" className="w-full">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" size="lg" className="w-full" onClick={logout}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/signin" className="w-full">
                      <Button variant="secondary" size="lg" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup" className="w-full">
                      <Button variant="primary" size="lg" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
