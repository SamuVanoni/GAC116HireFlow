export type UserRole = "candidate" | "recruiter" | "admin" | "user";

export type CandidateProfile = {
  birth_date: string;
  university: string;
  course: string;
  desired_area: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  candidate_profile: CandidateProfile | null;
};

export type Company = {
  id: number;
  name: string;
  logo: string;
  logo_url: string | null;
  primary_color: string;
  description: string;
};

export type Job = {
  id: number;
  company: Company;
  title: string;
  description: string;
  requirements: string;
  created_at: string;
};

export type Resume = {
  id: number;
  candidate: number;
  pdf_file: string;
  extracted_text: string;
};

export type Application = {
  id: number;
  candidate_username: string;
  job: Job;
  score: number;
  created_at: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  role: "candidate" | "recruiter";
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  university?: string;
  course?: string;
  desired_area?: string;
};

export type JobPayload = {
  company_id: number;
  title: string;
  description: string;
  requirements: string;
};

export type CompanyPayload = {
  name: string;
  logo: File;
  primary_color: string;
  description: string;
};
