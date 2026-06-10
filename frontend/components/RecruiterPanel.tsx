import type { FormEvent } from "react";
import type { Application, Company, Job } from "@/types/hireflow";

/*
  RecruiterPanel
  - Interface para recrutadores: criar empresas, publicar vagas e visualizar ranking
  - Mantem formulários simples; callbacks para submissao são fornecidos pelo container pai.
*/

type RecruiterPanelProps = {
  companies: Company[];
  jobs: Job[];
  ranking: Application[];
  rankingJobId: number | null;
  loading: boolean;
  onCreateCompany: (event: FormEvent<HTMLFormElement>) => void;
  onCreateJob: (event: FormEvent<HTMLFormElement>) => void;
  onLoadRanking: (jobId: number) => void;
};

export function RecruiterPanel({
  companies,
  jobs,
  ranking,
  rankingJobId,
  loading,
  onCreateCompany,
  onCreateJob,
  onLoadRanking,
}: RecruiterPanelProps) {
  const selectedRankingJob = jobs.find((job) => job.id === rankingJobId);

  return (
    <div className="recruiter-workspace">
      <section className="recruiter-stack">
        <form className="section-panel grid gap-4" onSubmit={onCreateCompany}>
          <div>
            <p className="section-kicker">Empresa</p>
            <h2 className="section-title">Cadastrar empresa</h2>
          </div>
          <label className="sr-only" htmlFor="company-name">
            Nome da empresa
          </label>
          <input id="company-name" className="field" name="name" placeholder="Nome da empresa" required />

          <label className="sr-only" htmlFor="company-logo">
            Logo da empresa
          </label>
          <input id="company-logo" className="field file-field" name="logo" accept="image/*" required type="file" />

          <label className="sr-only" htmlFor="company-primary-color">
            Cor principal (hex)
          </label>
          <input id="company-primary-color" className="field" name="primary_color" placeholder="Cor principal" required />

          <label className="sr-only" htmlFor="company-description">
            Descricao da empresa
          </label>
          <textarea id="company-description" className="field min-h-24" name="description" placeholder="Descricao da empresa" required />
          <button className="button-secondary" disabled={loading} type="submit">
            Salvar empresa
          </button>
        </form>

        <form className="section-panel grid gap-4" onSubmit={onCreateJob}>
          <div>
            <p className="section-kicker">Vaga</p>
            <h2 className="section-title">Publicar vaga</h2>
          </div>
          <label className="sr-only" htmlFor="job-company_id">
            Empresa
          </label>
          <select id="job-company_id" className="field" name="company_id" required>
            <option value="">Empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="job-title">
            Titulo da vaga
          </label>
          <input id="job-title" className="field" name="title" placeholder="Titulo da vaga" required />

          <label className="sr-only" htmlFor="job-description">
            Descricao da vaga
          </label>
          <textarea id="job-description" className="field min-h-24" name="description" placeholder="Descricao" required />

          <label className="sr-only" htmlFor="job-requirements">
            Requisitos (separados por virgula)
          </label>
          <textarea
            id="job-requirements"
            className="field min-h-24"
            name="requirements"
            placeholder="Requisitos separados por virgula"
            required
          />
          <button className="button-primary" disabled={loading || companies.length === 0} type="submit">
            Publicar
          </button>
          {companies.length === 0 ? (
            <p className="helper-text">Cadastre uma empresa antes de publicar a primeira vaga.</p>
          ) : null}
        </form>
      </section>

      <section className="section-panel recruiter-ranking-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Ranking</p>
            <h2 className="section-title">Candidatos por vaga</h2>
          </div>
          <span className="status-pill">{jobs.length}</span>
        </div>

        {jobs.length === 0 ? (
          <p className="empty-state">Quando suas vagas receberem candidaturas, o ranking aparece aqui.</p>
        ) : (
          <div className="grid gap-3">
            {jobs.map((job) => (
              <button className="job-row" key={job.id} type="button" onClick={() => onLoadRanking(job.id)}>
                <span className="text-left">
                  <span className="block font-medium">{job.title}</span>
                  <span className="text-sm text-[#667085]">{job.company.name}</span>
                </span>
                <span className="text-sm text-[#53657f]">Ver ranking</span>
              </button>
            ))}
          </div>
        )}

        {rankingJobId ? (
          <div className="ranking-block">
            <div>
              <p className="section-kicker">Resultado</p>
              <h3 className="compact-title">{selectedRankingJob?.title ?? "Vaga selecionada"}</h3>
            </div>
            {ranking.length === 0 ? (
              <p className="empty-state">Nenhum candidato encontrado para esta vaga.</p>
            ) : (
              <div className="grid gap-3">
                {ranking.map((application) => (
                  <div className="result-row" key={application.id}>
                    <span className="font-medium">{application.candidate_username}</span>
                    <strong>{application.score}%</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
