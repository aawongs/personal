import BentoBubble from '../components/BentoBubble';

const publications = [
  'SLEEP (2026): "Computational modeling of sleep opportunity..."',
  'IEEE Xplore (2025): "Evaluating home-based eeg systems..."',
  'Annals of Neurology (2024): "Effectiveness of behavioral interventions for insomnia..."',
];

const awards = ['Stanford CARE Scholar (2024).'];

const certifications = [
  'DeepLearning.AI ML Specializations (2026).',
  'Human Subjects Research (HSR) CITI Certification (2025).',
];

function AchievementsPage() {
  return (
    <div className="space-y-4">
      <BentoBubble delay={0.05}>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Achievements</p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Research, Awards, and Credentials</h1>
      </BentoBubble>

      <div className="grid gap-4 lg:grid-cols-3">
        <BentoBubble delay={0.12}>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Research (Publications)</p>
          <ul className="mt-3 space-y-2 text-slate-200">
            {publications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </BentoBubble>

        <BentoBubble delay={0.19}>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Awards</p>
          <ul className="mt-3 space-y-2 text-slate-200">
            {awards.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </BentoBubble>

        <BentoBubble delay={0.26}>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Certifications</p>
          <ul className="mt-3 space-y-2 text-slate-200">
            {certifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </BentoBubble>
      </div>
    </div>
  );
}

export default AchievementsPage;
