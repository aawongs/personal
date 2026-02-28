import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { name: 'Home', to: '/' },
  { name: 'Research', to: '/research' },
  { name: 'Projects', to: '/projects' },
  { name: 'Achievements', to: '/achievements' },
];

function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="glass mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Andrew Wong</p>
        <div className="flex items-center gap-2 sm:gap-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-cyan-400/20 text-cyan-200'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </motion.nav>
    </header>
  );
}

export default Navbar;
