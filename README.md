O Mercado Místico é uma aplicação desenvolvida como tarefa estudantil da temática de loja, na qual utilizamos API's para gerenciar produtos, compras e usuários.
 
## Instruções de Instalação e Execução
1 - Abra o repositório do github
2 - Baixe e extraia o arquivo mercado.zip
3 - Entre na pasta back-end dentro da pasta mercado pelo explorador de arquivo
4 - Clique com o botão direito do mouse na tela e selecione "Open Git Bash Here" ou "abrir no terminal"
5 - Digite cd ..
6 - Digite npm start
 
(Caso não funcione, volte para a pasta back-end usando o comando "cd ." e digite os seguintes comandos de instalação: npm i express nodemon dotenv mysql2 cors)
 
Volte para a pasta mercado e repita o passo 6

# API do Mercado

Esta é uma API desenvolvida com Node.js e Express para gerenciar usuários, produtos e um carrinho de compras.

## Dependências

- *express*: Framework para desenvolvimento de aplicações web.
- *cors*: Permite solicitações de origens diferentes.
- *mysql2*: Cliente MySQL para Node.js.
- *jsonwebtoken*: Manipulação de tokens JSON Web.
- *dotenv*: Carrega variáveis de ambiente.
- *express-session*: Gerencia sessões de usuários.

## Configuração do Servidor

Inicializa o servidor Express e define a porta (3333).

## Middlewares

Configuração do CORS, JSON e sessões.

## Conexão com o Banco de Dados

Estabelece conexão com o MySQL usando variáveis de ambiente.

## Endpoints

### Gerenciamento de Usuários
- Cadastro: POST /usuario/cadastrar
- Login: POST /usuario/login
- Verificar Admin: GET /usuario/info
- Listar Usuários: GET /usuario/listar
- Editar Usuário: PUT /usuario/editar/:id
- Deletar Usuário: DELETE /usuario/deletar/:id

### Gerenciamento de Produtos
- Obter Produtos: GET /produtos
- Adicionar Produto: POST /produtos/adicionar
- Editar Produto: PUT /produtos/editar/:id
- Deletar Produto: DELETE /produtos/deletar/:id

### Gerenciamento do Carrinho
- Listar Itens: GET /cart/list/:userId
- Adicionar Item: POST /cart/add/:userId/:productId
- Deletar item: DELETE /cart/remove/:user
- Apagar carrinho: DELETE /cart/clear/:userId

## Execução

Inicie o servidor com "npm start" após configurar as variáveis de ambiente e o banco de dados. (No terminal, na pasta "back-end")
