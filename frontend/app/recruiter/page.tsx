"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Notices } from "@/components/Notices";
import { PrivateRoute, useSession } from "@/components/PrivateRoute";
import { RecruiterPanel } from "@/components/RecruiterPanel";
import { api } from "@/services/api";
import type { Application, Company, Job, UserRole } from "@/types/hireflow";

const allowedRoles: UserRole[] = ["recruiter", "admin"];

function RecruiterDashboard({ token }: { token: string }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [ranking, setRanking] = useState<Application[]>([]);
  const [rankingJobId, setRankingJobId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshRecruiterData = useCallback(async () => {
    const [nextCompanies, nextJobs] = await Promise.all([
      api.companies(token),
      api.recruiterJobs(token),
    ]);
    setCompanies(nextCompanies);
    setJobs(nextJobs);
  }, [token]);

  useEffect(() => {
    let ignore = false;

    async function loadPageData() {
      try {
        const [nextCompanies, nextJobs] = await Promise.all([
          api.companies(token),
          api.recruiterJobs(token),
        ]);

        if (!ignore) {
          setCompanies(nextCompanies);
          setJobs(nextJobs);
        }
      } catch {
        if (!ignore) {
          setError("Nao foi possivel carregar os dados do recrutador.");
        }
      }
    }

    void loadPageData();

    return () => {
      ignore = true;
    };
  }, [token]);

  async function handleCreateCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const logo = formData.get("logo");

    if (!(logo instanceof File) || !logo.name) {
      setError("Selecione uma logo para cadastrar a empresa.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.createCompany(token, {
        name: String(formData.get("name")),
        logo,
        primary_color: String(formData.get("primary_color")),
        description: String(formData.get("description")),
      });
      await refreshRecruiterData();
      form.reset();
      setMessage("Empresa cadastrada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao cadastrar empresa.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.createJob(token, {
        company_id: Number(formData.get("company_id")),
        title: String(formData.get("title")),
        description: String(formData.get("description")),
        requirements: String(formData.get("requirements")),
      });
      await refreshRecruiterData();
      form.reset();
      setMessage("Vaga publicada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar vaga.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadRanking(jobId: number) {
    setLoading(true);
    setError("");
    setRankingJobId(jobId);

    try {
      setRanking(await api.ranking(token, jobId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar ranking.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-12 pt-6">
      <section className="recruiter-command">
        <div>
          <p className="section-kicker">Operacao</p>
          <h2>Monte o funil da vaga e acompanhe compatibilidade.</h2>
        </div>
        <div className="command-metrics">
          <span>
            <strong>{companies.length}</strong>
            empresas
          </span>
          <span>
            <strong>{jobs.length}</strong>
            vagas
          </span>
          <span>
            <strong>{ranking.length}</strong>
            candidatos no ranking
          </span>
        </div>
      </section>

      <section className="grid gap-5">
        <div className="dashboard-intro">
          <p className="section-kicker">Fluxo recomendado</p>
          <h2>Empresa, vaga e ranking.</h2>
          <p>
            Comece cadastrando uma empresa. Depois publique uma vaga com requisitos separados por virgula e use o
            ranking para comparar candidatos.
          </p>
        </div>

        <div className="grid content-start gap-5">
          <Notices error={error} message={message} />
          <RecruiterPanel
            companies={companies}
            jobs={jobs}
            loading={loading}
            ranking={ranking}
            rankingJobId={rankingJobId}
            onCreateCompany={handleCreateCompany}
            onCreateJob={handleCreateJob}
            onLoadRanking={handleLoadRanking}
          />
        </div>
      </section>
    </div>
  );
}

function RecruiterPageInner() {
  const { tokens, user } = useSession();
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#172033]">
      <DashboardHeader active="recruiter" user={user} />
      <RecruiterDashboard token={tokens.access} />
    </main>
  );
}

export default function RecruiterPage() {
  return (
    <PrivateRoute allowedRoles={allowedRoles}>
      <RecruiterPageInner />
    </PrivateRoute>
  );
}
