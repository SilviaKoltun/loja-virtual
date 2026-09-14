# loja-virtual
Aplicação para o Projeto final da disciplina Codificação para Backend, loja virtual.

# Rotas da API - Inova 3D

A API da Inova 3D foi desenvolvida utilizando Node.js, Express, Prisma e SQLite. Ela é responsável pelo gerenciamento dos produtos, categorias, usuários, autenticação e carrinho de compras da loja virtual.

## Autenticação (`/auth`)

### POST `/auth/register`

Realiza o cadastro de um novo usuário.

Função: Criar uma conta na plataforma armazenando nome, e-mail, telefone e senha criptografada.

### POST `/auth/login`

Realiza a autenticação do usuário.

Função: Validar e-mail e senha e retornar um token de acesso para utilização das rotas protegidas.

## Usuários (`/usuarios`)

### GET `/usuarios`

Lista todos os usuários cadastrados.

Função: Consultar os usuários sem expor informações sensíveis, como a senha.

### GET `/usuarios/:id`

Busca um usuário específico pelo ID.

Função: Retornar os dados de um usuário cadastrado.

### POST `/usuarios`

Cria um novo usuário.

Função: Inserir um novo registro de usuário no banco de dados.

### PUT `/usuarios/:id`

Atualiza os dados de um usuário.

Função: Alterar informações já cadastradas.

### DELETE `/usuarios/:id`

Remove um usuário.

Função:Excluir um usuário do sistema.

## Categorias (`/categorias`)

### GET `/categorias`

Lista todas as categorias.

Função: Retornar as categorias disponíveis para organização dos produtos.

### GET `/categorias/:id`

Busca uma categoria pelo ID.

Função: Exibir os dados de uma categoria específica.

### POST `/categorias`

Cria uma nova categoria.

Função: Cadastrar categorias para classificação dos produtos.

### PUT `/categorias/:id`

Atualiza uma categoria existente.

Função: Alterar informações de uma categoria.

### DELETE `/categorias/:id`

Remove uma categoria.

Função: Excluir uma categoria do sistema.


## Produtos (`/produtos`)

### GET `/produtos`

Lista todos os produtos.

Função: Exibir os produtos cadastrados na loja.

**Filtros disponíveis:**

* categoriaId
* disponivel
* busca

### GET `/produtos/:id`

Busca um produto pelo ID.

Função: Exibir os detalhes de um produto específico.

### POST `/produtos`

Cria um novo produto.

Função: Cadastrar produtos para venda.

### PUT `/produtos/:id`

Atualiza um produto.

Função: Alterar informações como nome, descrição, preço, disponibilidade ou categoria.

### PATCH `/produtos/:id`

Atualiza parcialmente um produto.

Função: Modificar apenas alguns campos sem enviar todos os dados.

### DELETE `/produtos/:id`

Remove um produto.

Função: Excluir um produto do catálogo.


## Carrinho (`/carrinho`)

### GET `/carrinho`

Lista os itens do carrinho do usuário.

Função: Exibir os produtos adicionados ao carrinho juntamente com suas quantidades.

### POST `/carrinho`

Adiciona um produto ao carrinho.

Função: Inserir um novo item ou aumentar a quantidade caso o produto já exista no carrinho.

### PUT `/carrinho/:id`

Atualiza a quantidade de um item.

Função: Alterar a quantidade desejada pelo usuário.

### DELETE `/carrinho/:id`

Remove um item do carrinho.

Função: Excluir um produto específico do carrinho.

### DELETE `/carrinho`

Limpa o carrinho.

Função: Remover todos os itens do carrinho do usuário.

## Respostas da API

### 200 - OK

A requisição foi executada com sucesso.

### 201 - Created

Um novo recurso foi criado com sucesso.

### 400 - Bad Request

Os dados enviados são inválidos ou estão incompletos.

### 401 - Unauthorized

O usuário não está autenticado.

### 404 - Not Found

O recurso solicitado não foi encontrado.

### 500 - Internal Server Error

Ocorreu um erro interno no servidor.

## Tecnologias Utilizadas

Node.js
Express
Prisma ORM
SQLite
Argon2
JWT (JSON Web Token)
Helmet
Nodemon

