import type { Job } from "@/types/hireflow";
import { formatDate, splitRequirements } from "@/utils/formatters";

/*
  JobBoard
  - Lista vagas e exibe detalhes da vaga selecionada
  - `appliedJobIds` é um `Set<number>` usado para desabilitar o botao de candidatura
*/

type JobBoardProps = {
  jobs: Job[];
  selectedJob: Job | null;
  appliedJobIds: Set<number>;
  loading: boolean;
  onSelectJob: (jobId: number) => void;
  onApply: (jobId: number) => void;
};

export function JobBoard({ jobs, selectedJob, appliedJobIds, loading, onSelectJob, onApply }: JobBoardProps) {
  const requirementTags = selectedJob ? Array.from(new Set(splitRequirements(selectedJob.requirements))) : [];

  return (
    <section className="grid gap-5">
      <div className="section-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Vagas abertas</p>
            <h2 className="section-title">Oportunidades publicadas</h2>
          </div>
          <span className="status-pill">{jobs.length} vagas</span>
        </div>

        {jobs.length === 0 ? (
          <p className="empty-state">Nenhuma vaga carregada ainda.</p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {jobs.map((job) => (
              <button
                className={`job-row ${selectedJob?.id === job.id ? "job-row-active" : ""}`}
                key={job.id}
                type="button"
                onClick={() => onSelectJob(job.id)}
              >
                <span className="text-left">
                  <span className="block text-base font-semibold text-[#101828]">{job.title}</span>
                  <span className="block text-sm text-[#667085]">{job.company.name}</span>
                </span>
                <span className="text-sm text-[#53657f]">{formatDate(job.created_at)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedJob ? (
        <div className="section-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">{selectedJob.company.name}</p>
              <h2 className="section-title">{selectedJob.title}</h2>
            </div>
            {selectedJob.company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={`Logo ${selectedJob.company.name}`}
                className="h-12 w-24 rounded border border-[#d9dee8] object-contain p-2"
                src={selectedJob.company.logo_url}
              />
            ) : null}
          </div>

          <p className="leading-7 text-[#344054]">{selectedJob.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {requirementTags.map((requirement, index) => (
              <span className="requirement-chip" key={`${selectedJob.id}-${requirement}-${index}`}>
                {requirement}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="button-primary"
              disabled={loading || appliedJobIds.has(selectedJob.id)}
              type="button"
              onClick={() => onApply(selectedJob.id)}
            >
              {appliedJobIds.has(selectedJob.id) ? "Candidatura enviada" : "Candidatar-se"}
            </button>
            <span className="self-center text-sm text-[#667085]">
              Envie um curriculo para atualizar o score automaticamente.
            </span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
