import { Link } from 'react-router-dom';
import { Github, Twitter, Mail } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Open Source', href: '/open-source' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-obsidian border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-champagne to-teal flex items-center justify-center">
                <span className="text-obsidian font-bold text-sm font-heading">V</span>
              </div>
              <span className="text-xl font-bold font-heading text-ivory">VERYNTH</span>
            </Link>
            <p className="text-secondary-text text-sm leading-relaxed mb-6">
              AI-powered dependency migration platform. Upgrade with confidence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-secondary-text hover:text-champagne transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-secondary-text hover:text-champagne transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-secondary-text hover:text-champagne transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-ivory mb-4 font-heading">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-secondary-text hover:text-champagne transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-text">
            © {new Date().getFullYear()} VERYNTH. Built for MLH Hackathon.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-secondary-text hover:text-ivory transition-colors">Privacy</a>
            <a href="#" className="text-sm text-secondary-text hover:text-ivory transition-colors">Terms</a>
            <a href="#" className="text-sm text-secondary-text hover:text-ivory transition-colors">License</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
