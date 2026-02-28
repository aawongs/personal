import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BentoBubble from '../components/BentoBubble';

const researchItems = [
  {
    id: 'umich-2025',
    title: 'Computational Neuroscience Researcher',
    subtitle: 'University of Michigan (2025-Present)',
    detail:
      'Focused on statistical and machine-learning models, reproducible reporting, and scalable analysis workflows in Python and R.',
  },
  {
    id: 'feinberg-2023',
    title: 'Neuroscience Research Intern',
    subtitle: 'Feinberg School of Medicine (2023-2025)',
    detail:
      'Analyzed actigraphy and behavioral time-series data for sleep studies and built Shiny dashboards to support interpretation and decision-making.',
  },
  {
    id: 'uiuc-neural',
    title: 'Neural Engineering Research Intern',
    subtitle: 'University of Illinois',
    detail:
      'Evaluated home-based EEG technologies and quantified technology-access inequities across diverse community contexts.',
  },
];

function ResearchPage() {
  const [activeId, setActiveId] = useState(researchItems[0].id);
  const activeItem = researchItems.find((item) => item.id === activeId);

  return (
    <div className="space-y-4">
      <BentoBubble delay={0.05}>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Research</p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Animated Research Grid</h1>
      </BentoBubble>

      <div className="grid gap-4 lg:grid-cols-3">
        {researchItems.map((item, index) => {
          const isActive = item.id === activeId;
          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 + index * 0.08 }}
              whileHover={{ scale: 1.03, boxShadow: '0 0 0 1px rgba(34,211,238,0.55), 0 0 36px rgba(34,211,238,0.20)' }}
              onClick={() => setActiveId(item.id)}
              className={[
                'glass text-left rounded-3xl p-5 transition-all',
                isActive ? 'ring-1 ring-cyan-300/60 shadow-glow' : 'ring-1 ring-transparent',
              ].join(' ')}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{index + 1}</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{item.subtitle}</p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={activeId}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="glass rounded-3xl p-6"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Detailed View</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{activeItem?.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{activeItem?.subtitle}</p>
          <p className="mt-4 text-slate-200">{activeItem?.detail}</p>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}

export default ResearchPage;
