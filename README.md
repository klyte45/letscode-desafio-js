# Desafio Técnico - Backend

## Execução

- `docker-compose up` irá subir o backend com o banco de dados. O front-end deve ser iniciado a parte.
- As portas 5000 (Backend) e 27017 (acesso ao MongoDB) serão expostas para o a máquina host
- É necessário adicionar um arquivo `.env` com as seguintes propriedades para a imagem funcionar:
> `DEFAULT_LOGIN`: Login padrão para gerar o token

> `DEFAULT_PASSWORD`: Senha padrão para gerar o token

> `TOKEN_SECRET`: Segredo a ser utilizado na geração dos tokens
- Além dessas três variáveis, a variável `DB_URL` serve para informar a string de conexão do banco. Como nesse caso o compose é justamente para subir junto com o banco, então a string de conexão está fixa apontando para a imagem do MongoDB na rede virtual do conteiner.

## Notas de desenvolvimento

- Foi utilizado o banco não-relacional MongoDB para guardar os dados dos cards.
- **Observação ao item #13:** Como a linha de log exigia dados do objeto que teriam de vir do banco (especialmente no caso de remoção), então o log foi inserido dentro do método no serviço da ação ao invés de um middleware.
- Internamente, o objeto Card guarda a informação do ID no campo `_id` por uma limitação do MongoDB. Porém, a interface de entrada e saída da aplicação é respeitada.

## Arquitetura

> Foi usada uma arquitetura que evita que as camadas conversem diretamente entre si: todas as classes usam as abstrações e interfaces dentro do caminho `/src/interfaces` para obter as fachadas de serviços.
- Essa visão evita as possíveis referências circulares entre os arquivos de classes além de facilitar os mocks nos testes.
- O apelido `#interfaces` foi criado para evitar o uso de caminhos relativos no import e foi declarado no tsconfig.
- As classes de interfaces não se importam entre si, com exceção da classe que contém conteúdo comum. Nesse projeto, apenas o banco de dados teve uma classe comum para as interfaces dela, que seria compartilhada com outras classes caso houvessem, e foi separado desta forma pois são campos de controle criados por padrão pelo Mongoose.

> Foi utilizado o `Mongoose` para abstração das classes de repositório, podendo carregar os Models para acesso pela classe principal do próprio framework via `mongoose.model()`.
- As implemetações dos Models (Repositories do Mongoose) são carregadas no `index.ts` assim que o banco é acessado, importando recursivamente todos os arquivos dentro do caminho `/src/db`.

> Foi utilizado o `Typescript-IoC` para abstração das classes de serviço
- As implementações são exportadas como default para serem carregadas na `index.ts`, requerindo recursivamente no caminho `/src/services`.
- No final do arquivo, as implementações se registram como implementação da respectiva abstração.

> Foi usado o framework `Typescript-Rest` para roteamento de URLs para os controllers.

> Foi utilizado `passport.js` junto com a implementação nativa do `Typescript-Rest` para gerenciamento dos tokens JWT.

> Foi omitida a classe de serviço de login, já que neste exercício ela só teria um método que seria praticamente estático pelos os parâmetros do desafio.

> Foram criados testes apenas para a classe de serviço de Cards, já que é o único lugar que há complexidade de regras nesse projeto.
- Como a carga das classes de serviço é dinâmica lendo todos os arquivos .ts das pastas, foi adicionada uma verificação de variável de ambiente para, caso não esteja em teste, as classes de teste sejam ignoradas.
- Na imagem docker, os testes são rodados antes do término da build.
- Os testes poderiam também ser extendidos a outros lugares, como a conversão toJSON do objeto de cards.