# 🚀 HireFlow

## 📌 Sobre o Projeto

O **HireFlow** é uma plataforma web de recrutamento e gerenciamento de processos seletivos desenvolvida para a disciplina de **Programação Web (GAC116)** da Universidade Federal de Lavras (UFLA).

A proposta do sistema é modernizar e simplificar o fluxo de contratação de empresas através de uma aplicação SaaS (*Software as a Service*), permitindo que recrutadores criem vagas, gerenciem candidatos e utilizem um sistema inteligente de ranqueamento baseado na compatibilidade entre currículo e requisitos da vaga.

O projeto foi idealizado não apenas como um trabalho acadêmico, mas também como um possível produto real com potencial de evolução comercial.

---

# ✨ Funcionalidades

## 👨‍💼 Recrutadores
* Cadastro e autenticação de empresas/recrutadores.
* Criação e gerenciamento de vagas.
* Dashboard administrativo protegido.
* Visualização de candidatos aplicados.
* Ranking automático de candidatos baseado em compatibilidade.

---

## 👨‍🎓 Candidatos
* Cadastro e autenticação de usuários.
* Upload de currículo em PDF.
* Aplicação para vagas.
* Gerenciamento de candidaturas realizadas.

---

## 🧠 Inteligência de Matching
* Extração automática de texto de currículos PDF.
* Sistema de compatibilidade utilizando:
  * TF-IDF
  * Similaridade de Cosseno
* Geração de score de compatibilidade entre candidato e vaga.

---

# 🛠️ Tecnologias Utilizadas

## 🎨 Frontend
* Next.js
* React
* Tailwind CSS
* TypeScript

---

## ⚙️ Backend
* Django
* Django REST Framework
* JWT Authentication

---

## 🗄️ Banco de Dados
* PostgreSQL

---

## 🐳 DevOps
* Docker
* Docker Compose

---

# 📂 Estrutura do Projeto

```plaintext
hireflow/
│
├── backend/
│   ├── accounts/
│   ├── jobs/
│   ├── applications/
│   ├── config/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── services/
│   └── app/
│
├── docker-compose.yml
│
└── README.md
```

---

# 🧱 Modelagem do Sistema

O sistema foi modelado utilizando banco de dados relacional com entidades principais responsáveis pelo gerenciamento de empresas, vagas, candidatos e aplicações.

## Principais Entidades
* User
* CandidateProfile
* Company
* Job
* Resume
* Application

---

# 🗺️ Diagrama ER

![Diagrama ER](./docs/diagrama-er.png)

---

# 🔄 Abordagem de Desenvolvimento

O projeto está sendo desenvolvido de forma incremental utilizando conceitos de desenvolvimento ágil e arquitetura escalável.

## Etapas planejadas

### ✅ Checkpoint 1
* Estrutura inicial do projeto.
* Modelagem do banco de dados.
* Ambiente administrativo Django.
* Configuração do PostgreSQL.
* Configuração do Docker.

---

### 🚧 Checkpoint 2
* API REST completa.
* Sistema de autenticação JWT.
* Frontend em Next.js.
* CRUD de vagas.
* Aplicação de candidatos.
* Sistema de ranking inteligente.

---

### 🔮 Futuras Melhorias
* Sistema multi-tenant.
* IA com embeddings semânticos.
* Dashboard analítico.
* Sistema de notificações.
* Deploy em cloud AWS.

---

# 💻 Como Executar o Projeto

## 🐳 Docker Compose

```bash
docker compose up --build
```

Serviços disponíveis:

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:8000`
* PostgreSQL: `localhost:5432`

Para parar os containers:

```bash
docker compose down
```

## 🔹 Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

---

## 🔹 Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 👤 Autores

| [<img src="https://avatars.githubusercontent.com/u/123120658?v=4" width="100px"><br><sub>@SamuVanoni</sub>](https://github.com/SamuVanoni) |
| :---: |

---

# 📄 Licença

Este projeto está sob a licença **MIT**.

O sistema foi desenvolvido para fins acadêmicos, pesquisa e aprimoramento prático em desenvolvimento web full stack utilizando Django, Next.js e arquitetura SaaS.
