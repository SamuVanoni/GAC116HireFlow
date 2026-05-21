# GAC116HireFlow

HireFlow e uma aplicacao para gerenciamento de vagas, empresas, candidatos e candidaturas.

## Estrutura

- `backend/`: API Django com Django REST Framework.
- `frontend/`: aplicacao Next.js.
- `docs/`: arquivos de documentacao do projeto.

## Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Por padrao, o backend usa PostgreSQL no host `postgres`, banco `hireflow_db`, usuario `hireflow_user` e senha `admin`.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicacao fica disponivel em `http://localhost:3000`.

## Docker

Backend:

```bash
cd backend
docker build -t hireflow-backend .
docker run --rm -p 8000:8000 hireflow-backend
```

Frontend:

```bash
cd frontend
docker build -t hireflow-frontend .
docker run --rm -p 3000:3000 hireflow-frontend
```

O frontend usa a porta `3000` e o backend usa a porta `8000`.
