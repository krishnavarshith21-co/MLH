import { Link } from 'react-router-dom';
export function Footer() {
return <footer className="border-t border-border bg-obsidian">
    <div className="container-enterprise py-12 flex flex-col sm:flex-row gap-8 justify-between">
      <div>
        <Link to="/" className="font-bold text-xl tracking-widest">VERYNTH</Link>
        <p className="text-secondary-text text-sm mt-4">Software evolution. With confidence.</p>
        <p className="text-secondary-text text-xs mt-6">© {new Date().getFullYear()} VERYNTH · Built for MLH</p>
      </div>
      <nav aria-label="Footer" className="flex flex-wrap gap-8 text-sm text-secondary-text">
        <Link to="/features">Features</Link>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/open-source">Open Source</Link>
        <Link to="/signin">Sign In</Link>
      </nav>
    </div>
  </footer>
}
