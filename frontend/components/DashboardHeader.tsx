"use client";

import { useRouter } from "next/navigation";
import { clearTokens } from "@/services/auth";
import type { User } from "@/types/hireflow";

/*
  DashboardHeader
  - Cabeçalho usado nas áreas privadas (candidato / recrutador)
  - Exibe informações do usuário e ação de logout
*/

type DashboardHeaderProps = {
  active: "candidate" | "recruiter";
  user: User;
};

const headerCopy = {
  candidate: {
    eyebrow: "Area do candidato",
    title: "Mapa de oportunidades",
    subtitle: "Explore vagas, envie seu curriculo e acompanhe seu encaixe em cada processo.",
  },
  recruiter: {
    eyebrow: "Central do recrutador",
    title: "Mesa de recrutamento",
    subtitle: "Publique oportunidades, organize empresas e acompanhe candidatos por compatibilidade.",
  },
};

export function DashboardHeader({ active, user }: DashboardHeaderProps) {
  const router = useRouter();
  const copy = headerCopy[active];

  function handleLogout() {
    clearTokens();
    router.replace("/login");
  }

  return (
    <header className={`dashboard-header dashboard-header-${active}`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="dashboard-heading">
          <p>{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <span>{copy.subtitle}</span>
        </div>

        <div className="dashboard-actions">
          <div className="profile-chip">
            <span>{active === "candidate" ? "C" : "R"}</span>
            <strong>{user.username}</strong>
          </div>
          <button className="button-secondary" type="button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
