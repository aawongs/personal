import { Linkedin, Mail } from 'lucide-react';

function Footer() {
  return (
    <footer className="mx-auto mt-8 w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="glass flex flex-col items-start justify-between gap-4 rounded-2xl px-5 py-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-300">Contact</p>
          <p className="text-sm text-slate-200">Connect with Andrew Wong</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-slate-700/50 p-2.5 text-cyan-200 transition hover:bg-slate-700/80 hover:text-white"
            aria-label="LinkedIn"
            title="LinkedIn - Andrew Wong"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:aawong@umich.edu"
            className="rounded-full bg-slate-700/50 p-2.5 text-cyan-200 transition hover:bg-slate-700/80 hover:text-white"
            aria-label="Email"
            title="Email Andrew Wong"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
