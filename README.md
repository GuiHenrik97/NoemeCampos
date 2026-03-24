# Sistema de Gestão Escolar – Noeme Campos

Sistema web completo para gestão escolar, com backend em ASP.NET e frontend moderno, focado em organização de dados, autenticação e geração de relatórios.

---

## Sobre o Projeto

Aplicação desenvolvida para gerenciar informações escolares, incluindo alunos, professores, turmas e usuários do sistema.

O projeto segue arquitetura em camadas, com separação clara entre controllers, services, repositories e models, além de uso de DTOs para padronização de dados.

---

## Funcionalidades

- Autenticação de usuários (login e registro)
- Cadastro e gerenciamento de alunos, professores e turmas
- Relatórios e dashboard com dados consolidados
- Operações CRUD completas
- API REST estruturada

---

## Tecnologias Utilizadas

### Backend
- ASP.NET Core
- Entity Framework Core
- SQLite

### Frontend
- React
- Vite
- Tailwind CSS

### Outros
- Docker / Docker Compose
- Arquitetura em camadas
- DTOs e padrão Repository

---

## Arquitetura

O backend segue uma arquitetura em camadas:

- Controllers → entrada das requisições HTTP
- Services → regras de negócio
- Repositories → acesso a dados
- Models → entidades do sistema
- DTOs → comunicação entre camadas
- Middleware → tratamento global de erros

---

## Estrutura do Projeto

backend/  
├── Controllers/  
├── Services/  
├── Repositories/  
├── Models/  
├── DTOs/  
├── Middleware/  
├── Data/

frontend/  
├── src/  
├── components/  
├── features/

docker-compose.yml

---

## Como executar o projeto

Pré-requisitos:
- Docker e Docker Compose instalados

Passos:

docker-compose up --build

Após isso, a aplicação estará disponível localmente.

---

## Rotas da API

/api/auth  
/api/aluno  
/api/professor  
/api/turma

---

## Objetivo

Este projeto foi desenvolvido para consolidar conhecimentos em desenvolvimento backend, arquitetura de sistemas e integração com frontend, simulando um sistema real de gestão.

---

## Autor

Guilherme Souza  
LinkedIn: https://www.linkedin.com/in/guilhermesouza97  
GitHub: https://github.com/GuiHenrik97  
