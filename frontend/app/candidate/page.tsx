"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CandidatePanel } from "@/components/CandidatePanel";
import { DashboardHeader } from "@/components/DashboardHeader";
import { JobBoard } from "@/components/JobBoard";
import { Notices } from "@/components/Notices";
import { PrivateRoute, useSession } from "@/components/PrivateRoute";
import { api } from "@/services/api";
import type { Application, Job, Resume, UserRole } from "@/types/hireflow";

const allowedRoles: UserRole[] = ["candidate"];

function CandidateDashboard({ token }: { token: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? jobs[0] ?? null,
    [jobs, selectedJobId],
  );

  const appliedJobIds = useMemo(
    () => new Set(applications.map((application) => application.job.id)),
    [applications],
  );

  const refreshJobs = useCallback(async () => {
    const nextJobs = await api.jobs();
    setJobs(nextJobs);
    setSelectedJobId((current) => current ?? nextJobs[0]?.id ?? null);
  }, []);

  const refreshApplications = useCallback(async () => {
    setApplications(await api.applications(token));
  }, [token]);

  const refreshResumes = useCallback(async () => {
    setResumes(await api.resumes(token));
  }, [token]);

  useEffect(() => {
    async function loadPageData() {
      try {
        await Promise.all([refreshJobs(), refreshApplications(), refreshResumes()]);
      } catch {
        setError("Nao foi possivel carregar os dados do candidato.");
      }
    }

    void loadPageData();
  }, [refreshApplications, refreshJobs, refreshResumes]);

  async function handleApply(jobId: number) {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.apply(token, jobId);
      await refreshApplications();
      setMessage("Candidatura registrada com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao candidatar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadResume(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = new FormData(form).get("pdf_file");

    if (!(file instanceof File) || !file.name) {
      setError("Selecione um PDF antes de enviar.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await api.uploadResume(token, file);
      await Promise.all([refreshApplications(), refreshResumes()]);
      form.reset();
      setMessage(
        result.updated_applications.length > 0
          ? "Curriculo enviado. Scores das candidaturas foram atualizados."
          : "Curriculo enviado e processado.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar curriculo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-6">
      <section className="candidate-summary-grid">
        <div className="summary-card summary-card-strong">
          <p className="section-kicker">Vagas disponiveis</p>
          <strong>{jobs.length}</strong>
          <span>oportunidades publicadas</span>
        </div>
        <div className="summary-card">
          <p className="section-kicker">Candidaturas</p>
          <strong>{applications.length}</strong>
          <span>processos acompanhados</span>
        </div>
        <div className="summary-card">
          <p className="section-kicker">Proximo passo</p>
          <strong>PDF</strong>
          <span>{resumes.length > 0 ? "curriculo processado" : "envie seu curriculo"}</span>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <JobBoard
          appliedJobIds={appliedJobIds}
          jobs={jobs}
          loading={loading}
          selectedJob={selectedJob}
          onApply={handleApply}
          onSelectJob={setSelectedJobId}
        />

        <aside className="grid content-start gap-5">
          <Notices error={error} message={message} />
          <CandidatePanel
            applications={applications}
            loading={loading}
            resumes={resumes}
            onUploadResume={handleUploadResume}
          />
        </aside>
      </div>
    </div>
  );
}

function CandidatePageInner() {
  const { tokens, user } = useSession();
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#172033]">
      <DashboardHeader active="candidate" user={user} />
      <CandidateDashboard token={tokens.access} />
    </main>
  );
}

export default function CandidatePage() {
  return (
    <PrivateRoute allowedRoles={allowedRoles}>
      <CandidatePageInner />
    </PrivateRoute>
  );
}
