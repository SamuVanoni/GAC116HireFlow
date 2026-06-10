"use client";

import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";
import { clearTokens, getStoredTokens } from "@/services/auth";
import type { AuthTokens, User, UserRole } from "@/types/hireflow";

/*
  PrivateRoute
  - Valida tokens JWT e busca `/api/accounts/me/` antes de renderizar áreas protegidas
  - Redireciona para `/login` quando não autenticado
*/

type PrivateRouteProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
};

const SessionContext = createContext<{ tokens: AuthTokens; user: User } | null>(null);

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within PrivateRoute");
  return ctx;
}

function homeForRole(role: UserRole) {
  return role === "candidate" ? "/candidate" : "/recruiter";
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const router = useRouter();
  const [session, setSession] = useState<{ tokens: AuthTokens; user: User } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function validateSession() {
      const tokens = getStoredTokens();
      if (!tokens) {
        router.replace("/login");
        return;
      }

      try {
        const user = await api.me(tokens.access);

        if (!allowedRoles.includes(user.role)) {
          router.replace(homeForRole(user.role));
          return;
        }

        if (!ignore) {
          setSession({ tokens, user });
          setChecking(false);
        }
      } catch {
        clearTokens();
        router.replace("/login");
      }
    }

    void validateSession();

    return () => {
      ignore = true;
    };
  }, [allowedRoles, router]);

  if (checking || !session) {
    return (
      <main className="screen-center">
        <div className="loading-card">
          <p className="section-kicker">HireFlow</p>
          <h1 className="section-title">Validando acesso</h1>
        </div>
      </main>
    );
  }

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
