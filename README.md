# 📄 Back-end para Gerenciamento de Documentos
<br>

Este repositório contém a API para gerenciamento de documentos. A aplicação foi desenvolvida com **NestJS** e **TypeScript**, utilizando o **Drizzle ORM** para comunicação com o banco de dados PostgreSQL, e o **MinIO** para armazenamento seguro de arquivos. A API permite realizar operações CRUD completas, incluindo upload e manipulação de arquivos.

###
<br>

## 🛠 Tecnologias Utilizadas

- **NestJS** com **TypeScript** para construção do back-end.
- **Drizzle ORM** para interação com o banco de dados PostgreSQL.
- **MinIO** para armazenamento de documentos, com integração usando AWS SDK.
- **Docker** e **Docker Compose** para orquestração de contêineres.
- **GitHub Actions** para CI/CD e automação de testes.
- **Jest** para testes unitários e de integração.
- **Helmet** para reforço de segurança em cabeçalhos HTTP.
- **Swagger** para documentação interativa da API.

<br>

## ⚙️ Funcionalidades

### Gerenciamento de Documentos
- Criar, listar, buscar por filtros, atualizar e excluir documentos.
- Upload seguro de arquivos para o servidor MinIO.
- Conversão e validação automática de valores numéricos e strings.

<br>

## 🚀 Instruções de Configuração

### Pré-requisitos
- **Node.js** (v16 ou superior);
- **Docker** e **Docker Compose**;
- Configuração do ambiente no arquivo `.env` (com base no `.env.example`).

## Passo-a-passo para Iniciar a Aplicação

1. Clone o repositório:

  ```bash
   git clone https://github.com/rafittu/back-e-paper.git
   cd back-e-paper
  ```
2. Configure as variáveis de ambiente:

    Crie um arquivo .env baseado no .env.example e insira suas credenciais do banco de dados e do MinIO.

3. Suba o ambiente de desenvolvimento:

```bash
docker-compose up --build
```

4. Acesse a documentação da API no Swagger:

  URL: http://localhost:3000/api-docs.

<br>

## 🔍 Endpoints Principais

  ### 📂 Documentos:
  - `POST /documents/create`: Upload e criação de documento.
  - `GET /documents/all`: Listar todos os documentos.
  - `GET /documents/search`: Buscar documentos por filtros.
  - `GET /documents/:id`: Buscar documento por ID.
  - `PUT /documents/update/:id`: Atualizar um documento existente.
  - `DELETE /documents/delete/:id`: Excluir um documento.

<br>

## 🧪 Testes Automatizados

Os testes verificam todas as funcionalidades principais, incluindo upload, manipulação de arquivos e interações com o banco de dados.

Executar os Testes:
```bash
npm run test
```

Cobertura de Testes:
```bash
npm run test:cov
```

<br>

## 📖 Documentação da API

A documentação completa da API está disponível através do Swagger. Para acessá-la, siga as etapas abaixo:

- Certifique-se de ter a API em execução localmente ou em um ambiente acessível;
- Abra um navegador da web e acesse a seguinte URL: `http://localhost:3000/v1/api-doc` (substitua `3000` pelo número da porta inserida no arquivo `.env`);
- A documentação interativa da API será exibida no Swagger UI, onde você poderá explorar todos os endpoints, seus parâmetros e exemplos de solicitação/resposta.

<br>

## 🛳 Deploy

A aplicação está configurada para CI/CD utilizando GitHub Actions. Cada alteração no código é automaticamente testada e, após aprovação, pode ser enviada para o ambiente de produção.

<br>

##

<p align="right">
  <a href="https://www.linkedin.com/in/rafittu/">Rafael Ribeiro 🚀</a>
</p>
