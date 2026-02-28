import BentoBubble from '../components/BentoBubble';

function HomePage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <BentoBubble className="sm:col-span-2 lg:col-span-4" delay={0.05}>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300">Home</p>
        <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">Andrew Wong</h1>
        <p className="mt-3 max-w-3xl text-slate-200">
          Double Concentration student in Neuroscience and Data Science at the University of Michigan
          (2025-2029).
        </p>
      </BentoBubble>

      <BentoBubble className="sm:col-span-2 lg:col-span-2" delay={0.12}>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Focus</p>
        <p className="mt-3 text-slate-200">
          Computational neuroscience, machine learning, and reproducible analytics for brain-behavior
          discovery.
        </p>
      </BentoBubble>

      <BentoBubble className="sm:col-span-2 lg:col-span-6" delay={0.2}>
        <h2 className="text-xl font-semibold text-white">What I Do</h2>
        <p className="mt-3 text-slate-200">
          I build computational pipelines to analyze neural and behavioral datasets, design statistical and
          machine-learning workflows, and quantify brain-behavior relationships with transparent,
          reproducible reporting.
        </p>
      </BentoBubble>
    </div>
  );
}

export default HomePage;
