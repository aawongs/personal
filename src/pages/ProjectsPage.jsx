import BentoBubble from '../components/BentoBubble';

const projects = [
  {
    title: 'Software Lead, Neonatal Asphyxia Project',
    description:
      'Developed a hypothermia-therapy platform with mobile and web features tailored for low-resource clinical deployments.',
  },
  {
    title: 'Project Researcher, GIDAS',
    description:
      'Analyzed gene-symptom associations and completed literature reviews supporting translational research priorities.',
  },
  {
    title: 'Founder, Project ZZZs',
    description:
      'Built a campus sleep health initiative using data-driven methods to improve student well-being outcomes.',
  },
  {
    title: 'Data Analytics Intern, IDPH',
    description:
      'Built automated reporting workflows and visualizations that reached 60,000+ residents.',
  },
];

function ProjectsPage() {
  return (
    <div className="space-y-4">
      <BentoBubble delay={0.05}>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Projects</p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Portfolio Work</h1>
      </BentoBubble>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, index) => (
          <BentoBubble key={project.title} delay={0.1 + index * 0.07} className="min-h-44">
            <h2 className="text-xl font-semibold text-white">{project.title}</h2>
            <p className="mt-3 text-slate-200">{project.description}</p>
          </BentoBubble>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
