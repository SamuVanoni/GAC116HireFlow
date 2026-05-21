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
* Gerenciamento administrativo utilizando Django Admin customizado.

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

> ⚠️ O sistema de matching inteligente encontra-se em fase de planejamento e será implementado nas próximas etapas do projeto.

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
* Django Jazzmin

---

## 🗄️ Banco de Dados

* PostgreSQL

---

## 🐳 DevOps

* Docker
* Docker Compose
* WSL2

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
│   ├── Dockerfile
│   ├── data.json
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── app/
│   ├── components/
│   ├── services/
│   └── Dockerfile
│
├── docs/
│   └── diagrama-er.png
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

# ⚙️ Ambiente Administrativo

O projeto utiliza o Django Admin customizado com o tema **Jazzmin**, proporcionando uma interface moderna e mais amigável para gerenciamento do sistema.

## Funcionalidades implementadas no Admin

* `search_fields`
* `list_display`
* `list_filter`
* `inline`
* `clean()` para validações customizadas

---

## 🔍 search_fields

Permite realizar buscas diretamente no painel administrativo.

Exemplo:

```python
search_fields = ('title', 'requirements')
```

---

## 📋 list_display

Define quais colunas serão exibidas na listagem administrativa.

Exemplo:

```python
list_display = ('id', 'title', 'company', 'created_at')
```

---

## 🎛️ list_filter

Adiciona filtros laterais no Django Admin.

Exemplo:

```python
list_filter = ('company', 'created_at')
```

---

## 🔥 inline

Permite editar entidades relacionadas diretamente dentro de outra entidade.

Exemplo:

* Company → Jobs

---

## 🧠 clean()

Implementa validações customizadas nos modelos.

Exemplo:

```python
from django.core.exceptions import ValidationError


def clean(self):
    if self.score < 0 or self.score > 100:
        raise ValidationError(
            'Score must be between 0 and 100.'
        )
```

---

# 🔄 Abordagem de Desenvolvimento

O projeto está sendo desenvolvido de forma incremental utilizando conceitos de desenvolvimento ágil e arquitetura escalável.

## Etapas planejadas

### ✅ Checkpoint 1

* Estrutura inicial do projeto.
* Modelagem do banco de dados.
* Ambiente administrativo Django.
* Customização do Django Admin.
* Configuração do PostgreSQL.
* Configuração do Docker.
* Persistência de dados com PostgreSQL.
* Estrutura containerizada.

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
* Pipeline CI/CD.
* Deploy automatizado.

---

# 💻 Como Executar o Projeto

## ✅ Pré-requisitos

Instalar:

* Docker Desktop
* WSL2
* Git (opcional)

---

## 🚀 Executando com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

---

## 🗄️ Rodar migrations

Abra outro terminal:

```bash
docker exec -it hireflow_backend bash
```

Depois:

```bash
python manage.py migrate
```

---

## 👤 Criar superusuário

Dentro do container:

```bash
python manage.py createsuperuser
```

---

## 📦 Restaurar dados de exemplo

Dentro do container:

```bash
python manage.py loaddata data.json
```

---

# 🌐 Acessos do Sistema

## 🎨 Frontend

```plaintext
http://localhost:3000
```

---

## ⚙️ Backend

```plaintext
http://localhost:8000
```

---

## 🔐 Django Admin

```plaintext
http://localhost:8000/admin
```

---

# 🧪 Dados de Demonstração

O projeto possui dados de exemplo para facilitar testes e apresentações.

## Empresas

* Compass UOL
* Levty

## Recrutadores

* samu
* lara

## Candidatos

* joao
* daniel

---

# 👤 Autores

| [<img src="https://avatars.githubusercontent.com/u/185520073?v=4" width="100px"><br><sub>@danieLx77</sub>](https://github.com/DPontello) | [<img src="https://avatars.githubusercontent.com/u/78040348?v=4" width="100px"><br><sub>@jpedroreiss</sub>](https://github.com/luapxb) | [<img src="https://avatars.githubusercontent.com/u/123120658?v=4" width="100px"><br><sub>@SamuVanoni</sub>](https://github.com/SamuVanoni) |
| :---: | :---: | :---: |

---

# 📄 Licença

Este projeto está sob a licença **MIT**.

O sistema foi desenvolvido para fins acadêmicos, pesquisa e aprimoramento prático em desenvolvimento web full stack utilizando Django, Next.js, PostgreSQL e arquitetura SaaS moderna.
