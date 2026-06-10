import type {
  Application,
  AuthTokens,
  Company,
  CompanyPayload,
  Job,
  JobPayload,
  RegisterPayload,
  Resume,
  User,
} from "@/types/hireflow";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type RequestOptions = {
  token?: string;
  body?: BodyInit | object;
  method?: "GET" | "POST";
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers();

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const isFormData = options.body instanceof FormData;
  if (options.body && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const body: BodyInit | undefined = isFormData
    ? (options.body as FormData)
    : options.body
      ? JSON.stringify(options.body)
      : undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.detail ?? data?.error ?? JSON.stringify(data);
    throw new Error(message || "Nao foi possivel concluir a requisicao.");
  }

  return data as T;
}

export const api = {
  baseUrl: API_BASE_URL,

  login(username: string, password: string) {
    return request<AuthTokens>("/api/token/", {
      method: "POST",
      body: { username, password },
    });
  },

  register(payload: RegisterPayload) {
    return request<User>("/api/accounts/register/", {
      method: "POST",
      body: payload,
    });
  },

  me(token: string) {
    return request<User>("/api/accounts/me/", { token });
  },

  jobs() {
    return request<Job[]>("/api/jobs/vagas/");
  },

  companies(token: string) {
    return request<Company[]>("/api/jobs/minhas-empresas/", { token });
  },

  recruiterJobs(token: string) {
    return request<Job[]>("/api/jobs/minhas-vagas/", { token });
  },

  createCompany(token: string, payload: CompanyPayload) {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("logo", payload.logo);
    formData.append("primary_color", payload.primary_color);
    formData.append("description", payload.description);

    return request<Company>("/api/jobs/minhas-empresas/", {
      method: "POST",
      token,
      body: formData,
    });
  },

  createJob(token: string, payload: JobPayload) {
    return request<Job>("/api/jobs/minhas-vagas/", {
      method: "POST",
      token,
      body: payload,
    });
  },

  uploadResume(token: string, file: File) {
    const formData = new FormData();
    formData.append("pdf_file", file);

    return request<{ message: string; id: number; extracted_text: string; updated_applications: number[] }>(
      "/api/applications/upload-curriculo/",
      {
        method: "POST",
        token,
        body: formData,
      },
    );
  },

  resumes(token: string) {
    return request<Resume[]>("/api/applications/meus-curriculos/", { token });
  },

  apply(token: string, jobId: number) {
    return request<{ id: number; score: number; created_at: string }>("/api/applications/candidatar/", {
      method: "POST",
      token,
      body: { job_id: jobId },
    });
  },

  applications(token: string) {
    return request<Application[]>("/api/applications/minhas-candidaturas/", { token });
  },

  ranking(token: string, jobId: number) {
    return request<Application[]>(`/api/applications/ranking/${jobId}/`, { token });
  },
};
