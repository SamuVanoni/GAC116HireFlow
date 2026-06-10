"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPanel } from "@/components/AuthPanel";
import { Notices } from "@/components/Notices";
import { api } from "@/services/api";
import { getStoredTokens, storeTokens } from "@/services/auth";

type AuthRole = "candidate" | "recruiter";
type AuthMode = "login" | "register";

function routeForRole(role: string) {
  return role === "candidate" ? "/candidate" : "/recruiter";
}

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<AuthRole | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function redirectAuthenticatedUser() {
      const tokens = getStoredTokens();
      if (!tokens) return;

      try {
        const user = await api.me(tokens.access);
        if (!ignore) router.replace(routeForRole(user.role));
      } catch {
        return;
      }
    }

    void redirectAuthenticatedUser();

    return () => {
      ignore = true;
    };
  }, [router]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const tokens = await api.login(String(formData.get("username")), String(formData.get("password")));
      storeTokens(tokens);

      const user = await api.me(tokens.access);
      router.replace(routeForRole(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const role = String(formData.get("role")) as AuthRole;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.register({
        username: String(formData.get("username")),
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        role,
        first_name: String(formData.get("first_name")),
        last_name: String(formData.get("last_name")),
        birth_date: role === "candidate" ? String(formData.get("birth_date")) : undefined,
        university: role === "candidate" ? String(formData.get("university")) : undefined,
        course: role === "candidate" ? String(formData.get("course")) : undefined,
        desired_area: role === "candidate" ? String(formData.get("desired_area")) : undefined,
      });

      form.reset();
      setAuthMode("login");
      setMessage("Conta criada. Agora entre com seu usuario e senha.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-brand-panel">
        <div className="brand-wordmark">
          <span>HireFlow</span>
          <small>GAC116</small>
        </div>
        <div className="login-copy">
          <p className="section-kicker">HireFlow</p>
          <h1>Escolha seu espaco e continue o processo seletivo.</h1>
          <p>
            Candidatos acompanham vagas e curriculos. Recrutadores organizam empresas, vagas e rankings com foco.
          </p>
        </div>
      </section>

      <section className="login-action-panel">
        <Notices error={error} message={message} />

        {!selectedRole ? (
          <div className="role-picker">
            <div>
              <p className="section-kicker">Acesso</p>
              <h2 className="auth-title">Como voce quer entrar?</h2>
            </div>

            <button className="role-card candidate-card" type="button" onClick={() => setSelectedRole("candidate")}>
              <span className="role-icon">C</span>
              <span>
                <strong>Candidato</strong>
                <small>Enviar curriculo, ver vagas e acompanhar candidaturas.</small>
              </span>
            </button>

            <button className="role-card recruiter-card" type="button" onClick={() => setSelectedRole("recruiter")}>
              <span className="role-icon">R</span>
              <span>
                <strong>Recrutador</strong>
                <small>Cadastrar empresas, publicar vagas e analisar rankings.</small>
              </span>
            </button>
          </div>
        ) : (
          <AuthPanel
            loading={loading}
            mode={authMode}
            role={selectedRole}
            onBack={() => {
              setSelectedRole(null);
              setError("");
              setMessage("");
            }}
            onLogin={handleLogin}
            onModeChange={setAuthMode}
            onRegister={handleRegister}
          />
        )}
      </section>
    </main>
  );
}
