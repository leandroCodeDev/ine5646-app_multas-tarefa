### UFSC - CTC - INE - INE5646 Programação para Web

# Exercício App Multas
A aplicação permite que o usuário cadastre e pesquise: proprietários de veículos, seus veículos e multas para esses veículos.

## Objetivo do Exercício
No lado front-end, mostrar formas de uso da biblioteca [PrimeReact](https://www.primefaces.org/primereact/#/), especialmente seus componentes para entrada de dados. No lado back-end, mostrar o uso de [GraphQL](https://graphql.org/) por meio da biblioteca [Apollo](https://www.apollographql.com/). Os dados da aplicação são armazenados em uma base de dados MongoDB.

## Sua Tarefa
O código da aplicação está completo. Sua tarefa é compreender como a linguagem GraphQL é utilizada no lado cliente e no lado servidor. Verifique quais os benefícios de se implementar um webservice usando GraphQL.

## Instruções
Depois de baixar/clonar o repositório, entre no diretório **cliente** e digite

`npm install`

para instalar os pacotes JavaScript utilizados no lado cliente da aplicação.

Repita o comando no diretório **servidor** para instalar os pacotes JavaScript utilizados no lado servidor da aplicação.

No mesmo diretório **servidor**, crie o arquivo **.env** e adicione o seguinte conteúdo:

```
PORTA=3000

URL_MULTAS_DB=mongodb://....
```
Para a base de dados, como sugestão, acesse https://mlab.com/  e crie sua base de dados.

### Durante o Desenvolvimento
Durante o desenvolvimento da aplicação digite o comando

`npm start`

tanto no diretório **cliente** como no diretório **servidor**. Utilize a aplicação acessando https://localhost:3000

A biblioteca Apollo possui uma aplicação cliente para acessar a API definida para o servidor GraphQL. Acesse https://localhost:3000/graphql . Faça algumas consultas e inserções de dados.

### Em Produção
Quando a aplicação estiver pronta, digite o comando

`npm run build`

tanto no diretório **cliente** como no diretório **servidor**.

Em seguida, para colocar a aplicação no ar, entre no diretório **servidor** e digite

`node build\app.js`


