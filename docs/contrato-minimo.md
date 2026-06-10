# Contrato mínimo — HireFlow

Este documento descreve o contrato funcional mínimo entre o backend (Django REST) e o frontend (Next.js). O objetivo é deixar claros os pontos de integração, formatos de requisição/resposta, expectativas de UX e critérios de aceitação.

Índice
- Objetivo
- Ambiente local
- Autenticação
- Contas / Perfil
- Empresas e Vagas (Jobs)
- Currículos e Candidaturas
- Contratos de UI (frontend) — endpoints e comportamento esperado
- Regras de erro e validação
- Critérios de aceite

---

## Objetivo
Fornecer uma especificação curta, prática e verificável para que o frontend e backend se comuniquem sem ambiguidade.

## Ambiente local
1. Subir containers:

```bash
docker compose up --build
```

2. Aplicar migrations (quando necessário):

```bash
docker exec -it hireflow-backend python manage.py migrate
```

3. Carregar dados de demonstração (opcional):

```bash
docker exec -it hireflow-backend python manage.py loaddata data.json
```

Endereços úteis (padrão):
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Django: http://localhost:8000/admin

Nota: em desenvolvimento o Next pode rodar em outra porta se 3000 estiver ocupada. Verifique o log do `npm run dev`.

## Autenticação
Usamos JWT (access + refresh). Cabeçalho esperado para endpoints autenticados:

```
Authorization: Bearer <access>
```

Endpoints relevantes:
- POST `/api/token/` — body: `{ username, password }` → retorna `{ access, refresh }`.
- POST `/api/token/refresh/` — body: `{ refresh }` → retorna novo `access`.

Erros:
- 401 quando token inválido/expirado.

## Contas / Perfil
- POST `/api/accounts/register/` — cria usuário. Campos comuns: `username, email, password, role, first_name, last_name`.
- Para `role = candidate`, campos adicionais obrigatórios: `birth_date, university, course, desired_area`.
- GET `/api/accounts/me/` — retorna dados do usuário autenticado com seu `role` e perfil relacionado.

Exemplo de resposta de `GET /api/accounts/me/`:

```json
{
  "id": 5,
  "username": "ana",
  "email": "ana@example.com",
  "role": "candidate",
  "first_name": "Ana",
  "last_name": "Silva",
  "candidate_profile": {
    "birth_date": "2000-01-01",
    "university": "UFLA",
    "course": "Sistemas de Informação",
    "desired_area": "Frontend"
  }
}
```

## Empresas e Vagas (Jobs)
Endereços e comportamento:
- GET `/api/jobs/vagas/` — lista vagas públicas.
- GET `/api/jobs/vagas/<id>/` — detalhe público da vaga.
- GET `/api/jobs/minhas-empresas/` — (autenticado) empresas do recrutador.
- POST `/api/jobs/minhas-empresas/` — (autenticado) cria empresa. `multipart/form-data` quando enviar `logo`.
  - Campos: `name`, `logo`, `primary_color`, `description`.
- GET `/api/jobs/minhas-vagas/` — (autenticado) vagas das empresas do recrutador.
- POST `/api/jobs/minhas-vagas/` — (autenticado) cria vaga: `{ company_id, title, description, requirements }`.

Modelo simplificado de `Job` (esperado pelo frontend):

```json
{
  "id": 1,
  "company": { "id": 1, "name": "ACME", "logo_url": "/media/logo.png", "primary_color": "#123456" },
  "title": "Pessoa Desenvolvedora Frontend",
  "description": "Atuação em produto web.",
  "requirements": "React, TypeScript, CSS",
  "created_at": "2026-01-01T12:00:00Z"
}
```

Observações:
- `requirements` pode ser um string separada por vírgulas; o frontend normalmente a transforma em tags.

## Currículos e Candidaturas
- POST `/api/applications/upload-curriculo/` — `multipart/form-data` com `pdf_file`. Retorna `{ id, extracted_text, updated_applications }`.
- GET `/api/applications/meus-curriculos/` — lista currículos do candidato.
- POST `/api/applications/candidatar/` — body `{ job_id }` (autenticado) → cria candidatura e retorna score.
- GET `/api/applications/minhas-candidaturas/` — lista candidaturas do candidato.
- GET `/api/applications/ranking/<job_id>/` — lista candidatos ranqueados (acesso restrito ao recrutador dono da vaga ou staff).

Formato de `Application` esperado pelo frontend:

```json
{
  "id": 10,
  "candidate_username": "bruno",
  "candidate_email": "bruno@example.com",
  "job": { "id": 1, "title": "..." },
  "score": 78,
  "created_at": "2026-01-02T10:00:00Z"
}
```

## Contratos de UI — integrações e comportamento esperado
Estas são regras que o frontend assume ao consumir a API; ajustar no backend se necessário.

- Listagem de vagas (`GET /api/jobs/vagas/`)
  - Deve retornar um array de `Job` paginado ou completo. O frontend atualmente espera uma lista simples; se for paginado, inclua campos `results`/`next`/`previous` ou documente o formato.

- Detalhe da vaga (`GET /api/jobs/vagas/<id>/`)
  - Deve retornar o objeto `Job` com `company` embutido.

- Criação de empresa (`POST /api/jobs/minhas-empresas/`)
  - Aceitar `multipart/form-data` para `logo` e retornar a representação completa da `Company` criada.

- Upload de currículo (`POST /api/applications/upload-curriculo/`)
  - Deve processar PDF assíncronamente mas retornar rapidamente `{ id, extracted_text, updated_applications }`.

- Ranking (`GET /api/applications/ranking/<job_id>/`)
  - Retornar lista ordenada por `score` decrescente; cada item inclui `candidate_username` e `score`.

## Regras de erro e validação
- Para chamadas inválidas, usar códigos HTTP apropriados (400, 401, 403, 404, 500) e um JSON com `detail` ou `error` com mensagem legível.
- Exemplos:
  - 400: falta de campo obrigatório — `{ "detail": "Campo 'title' é obrigatório" }`.
  - 401: token inválido — `{ "detail": "Token inválido" }`.
  - 403: acesso não autorizado — `{ "detail": "Acesso negado" }`.

## Segurança e CORS
- O backend deve habilitar CORS para o frontend em desenvolvimento (`http://localhost:3000`) e para o domínio de produção do frontend.
- Nunca logar tokens completos em produção; trate informações sensíveis com cuidado.

## Critérios de aceite (mínimos)
1. Frontend consegue autenticar, persistir tokens e carregar `GET /api/accounts/me/` sem erros.
2. Listagem pública de vagas (`GET /api/jobs/vagas/`) retorna dados utilizáveis pelo `JobBoard`.
3. Candidato autenticado consegue enviar PDF e criar candidatura (`POST /api/applications/upload-curriculo/` e `POST /api/applications/candidatar/`).
4. Recrutador autenticado consegue criar empresa e vaga e consultar ranking (`POST /api/jobs/minhas-empresas/`, `POST /api/jobs/minhas-vagas/`, `GET /api/applications/ranking/<job_id>/`).
5. APIs retornam mensagens de erro claras e apropriadas para o caso.

## Notas e sugestões de UX (frontend)
- Exibir estados de carregamento e mensagens de erro claras para cada fluxo (login, upload de PDF, candidatura, criação de vaga).
- Nas páginas de detalhe de vaga, exibir botão claro para `Candidatar-se` e indicar se já foi aplicado.
- Para recrutadores, separar telas: (1) gerenciar empresas/vagas e (2) visualizar ranking/detalhes da vaga — o backend já tem endpoints compatíveis para separar essas views.
