import type { FormEvent } from "react";
import type { Application, Resume } from "@/types/hireflow";

/*
  CandidatePanel
  - Painel principal do candidato: upload de curriculo e listagem de candidaturas
  - Extrai palavras-chave simples do texto do curriculo para apresentar "tags".
  - Props:
    - `applications`: candidaturas do usuario
    - `resumes`: curriculos enviados (mais recente em [0])
*/

type CandidatePanelProps = {
  applications: Application[];
  resumes: Resume[];
  loading: boolean;
  onUploadResume: (event: FormEvent<HTMLFormElement>) => void;
};

function extractResumeTags(text: string) {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4);

  return Array.from(new Set(words)).slice(0, 8);
}

export function CandidatePanel({ applications, resumes, loading, onUploadResume }: CandidatePanelProps) {
  const latestResume = resumes[0];
  const resumeTags = latestResume ? extractResumeTags(latestResume.extracted_text) : [];

  return (
    <>
      <div className="resume-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Curriculo</p>
            <h2 className="section-title">Perfil profissional</h2>
          </div>
          <span className="status-pill">{resumes.length} PDFs</span>
        </div>

        {latestResume ? (
          <div className="resume-insights">
            <div>
              <span className="insight-label">Texto extraido</span>
              <strong>{latestResume.extracted_text.length}</strong>
              <small>caracteres analisados</small>
            </div>
            <div>
              <span className="insight-label">Ultimo arquivo</span>
              <strong>PDF</strong>
              <small>{latestResume.pdf_file.split("/").pop()}</small>
            </div>
          </div>
        ) : (
          <p className="empty-state">Envie seu primeiro curriculo para liberar tags e scores mais precisos.</p>
        )}

        {resumeTags.length > 0 ? (
          <div className="resume-tags">
            {resumeTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}

        <form className="grid gap-4" onSubmit={onUploadResume}>
          <label className="sr-only" htmlFor="pdf_file">
            Enviar PDF do curriculo
          </label>
          <input id="pdf_file" className="field file-field" name="pdf_file" accept="application/pdf" required type="file" />
          <button className="button-primary" disabled={loading} type="submit">
            Atualizar curriculo
          </button>
        </form>
      </div>

      <div className="section-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Minhas vagas</p>
            <h2 className="section-title">Candidaturas</h2>
          </div>
          <span className="status-pill">{applications.length}</span>
        </div>

        {applications.length === 0 ? (
          <p className="empty-state">Suas candidaturas aparecem aqui depois de escolher uma vaga.</p>
        ) : (
          <div className="grid gap-3">
            {applications.map((application) => (
              <div className="result-row" key={application.id}>
                <span>
                  <span className="block font-medium">{application.job.title}</span>
                  <span className="text-sm text-[#667085]">{application.job.company.name}</span>
                </span>
                <strong>{application.score}%</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
