import type { FormEvent } from "react";

/*
  AuthPanel
  - Componente responsável por renderizar formularios de login/cadastro
  - `mode`: escolhe entre `login` ou `register`
  - `role`: define o fluxo (candidate | recruiter)
  - Recebe callbacks para submit e navegação
*/

type AuthRole = "candidate" | "recruiter";
type AuthMode = "login" | "register";

type AuthPanelProps = {
  mode: AuthMode;
  role: AuthRole;
  loading: boolean;
  onBack: () => void;
  onModeChange: (mode: AuthMode) => void;
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
  onRegister: (event: FormEvent<HTMLFormElement>) => void;
};

const roleCopy = {
  candidate: {
    title: "Acesso do candidato",
    subtitle: "Entre para enviar curriculo, explorar vagas e acompanhar suas candidaturas.",
    registerLabel: "Criar conta de candidato",
  },
  recruiter: {
    title: "Acesso do recrutador",
    subtitle: "Entre para cadastrar empresas, publicar vagas e ver rankings de candidatos.",
    registerLabel: "Criar conta de recrutador",
  },
};

export function AuthPanel({ mode, role, loading, onBack, onModeChange, onLogin, onRegister }: AuthPanelProps) {
  const copy = roleCopy[role];

  return (
    <section className="auth-card">
      <button className="back-button" type="button" onClick={onBack}>
        Voltar
      </button>

      <div>
        <p className="section-kicker">{role === "candidate" ? "Candidato" : "Recrutador"}</p>
        <h2 className="auth-title">{copy.title}</h2>
        <p className="auth-subtitle">{copy.subtitle}</p>
      </div>

      <div className="auth-toggle" aria-label="Modo de acesso">
        <button
          className={mode === "login" ? "auth-toggle-active" : "auth-toggle-button"}
          type="button"
          onClick={() => onModeChange("login")}
        >
          Entrar
        </button>
        <button
          className={mode === "register" ? "auth-toggle-active" : "auth-toggle-button"}
          type="button"
          onClick={() => onModeChange("register")}
        >
          Criar conta
        </button>
      </div>

      {mode === "login" ? (
        <form className="grid gap-4" onSubmit={onLogin}>
          <input name="role" type="hidden" value={role} />
          <label className="sr-only" htmlFor="login-username">
            Nome de usuário
          </label>
          <input id="login-username" className="field" name="username" placeholder="Usuario" required />

          <label className="sr-only" htmlFor="login-password">
            Senha
          </label>
          <input id="login-password" className="field" name="password" placeholder="Senha" required type="password" />

          <button className="button-primary" disabled={loading} type="submit">
            Entrar
          </button>
        </form>
      ) : (
        <form className="grid gap-4" onSubmit={onRegister}>
          <input name="role" type="hidden" value={role} />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="sr-only" htmlFor="register-first_name">
              Nome
            </label>
            <input id="register-first_name" className="field" name="first_name" placeholder="Nome" />

            <label className="sr-only" htmlFor="register-last_name">
              Sobrenome
            </label>
            <input id="register-last_name" className="field" name="last_name" placeholder="Sobrenome" />
          </div>

          <label className="sr-only" htmlFor="register-username">
            Nome de usuário
          </label>
          <input id="register-username" className="field" name="username" placeholder="Usuario" required />

          <label className="sr-only" htmlFor="register-email">
            E-mail
          </label>
          <input id="register-email" className="field" name="email" placeholder="E-mail" type="email" />

          <label className="sr-only" htmlFor="register-password">
            Senha
          </label>
          <input id="register-password" className="field" name="password" minLength={6} placeholder="Senha" required type="password" />

          {role === "candidate" ? (
            <div className="form-group">
              <span className="form-group-title">Perfil academico</span>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="sr-only" htmlFor="register-birth_date">
                  Data de nascimento
                </label>
                <input id="register-birth_date" className="field" name="birth_date" required type="date" />

                <label className="sr-only" htmlFor="register-university">
                  Universidade
                </label>
                <input id="register-university" className="field" name="university" placeholder="Universidade" required />

                <label className="sr-only" htmlFor="register-course">
                  Curso
                </label>
                <input id="register-course" className="field" name="course" placeholder="Curso" required />

                <label className="sr-only" htmlFor="register-desired_area">
                  Area desejada
                </label>
                <input id="register-desired_area" className="field" name="desired_area" placeholder="Area desejada" required />
              </div>
            </div>
          ) : null}

          <button className="button-primary" disabled={loading} type="submit">
            {copy.registerLabel}
          </button>
        </form>
      )}
    </section>
  );
}
