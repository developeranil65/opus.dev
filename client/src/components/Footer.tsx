import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between">
        <p className="text-slate-400 text-center md:text-left">
          © {new Date().getFullYear()} Opus Polls. All rights reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/privacy" className="text-slate-400 hover:text-cyan-400">Privacy Policy</Link>
          <Link to="/terms" className="text-slate-400 hover:text-cyan-400">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}