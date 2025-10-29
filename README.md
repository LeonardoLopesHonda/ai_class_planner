# PlanEdu

> Este projeto utiliza [node.js](https://nodejs.org/pt/download) e [pnpm](https://pnpm.io/pt/installation#usando-npm)

## Clonando o projeto

Vamos assumir que já tenha instalado o node.js e o [git](https://git-scm.com/install).

Abra um terminal e rode o seguinte comando:

```bash
git clone https://github.com/LeonardoLopesHonda/ai_class_planner.git
```

Agora entre no diretório do projeto:

```bash
cd ai_class_planner
```

## Instalando as dependências do projeto

Como estamos utilizando o `pnpm` para gerenciar os pacotes, iremos mostrar como instalar:

```bash
npm install -g pnpm@latest
```

> Assumindo que tenha instalado o `npm`

Estando no diretório do projeto, digite no terminal:

```bash
pnpm install
```

E aguarde o `pnpm` terminar de instalar as dependências.

## Configurando as variáveis de ambiente

Tendo acesso às variáveis de ambiente configure no arquivo `.env`

```env
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
```

Coloque os valores de cada item. Caso queira gerar suas chaves utilize o [Google AI Studio](https://aistudio.google.com/welcome) e [Supabase](https://supabase.com)

> > No Google AI Studio, após fazer o login, vá em `Get API key`. Em seguida `Criar chave de API`, selecione um projet e caso não tenha crie um. Depois dê nome para essa chave. Seu projeto será criado e assim poderá copiar o valor da chave e a colar no `.env`

> >

> Por questões de segurança de uso de chaves, para este desafio técnico disponibilizarei separadamente os valores dessas chaves.

## Rodando localmente

Dentro do diretório do projeto, rode:

```bash
pnpm dev
```

Abra no navegador [http://localhost:3000](http://localhost:3000) e comece a gerar seus planos de aula.

> Alternativamente temos já disponilizado o site rodando hospedado na vercel. Acesse agora o [PlanEdu](https://ai-class-planner-nine.vercel.app/)

## Decisões Técnicas

Foi decidido utilizar a stack `Next.Js` e `React.Js` com `TailwindCSS` com `Shadcn` para o frontend devido a popularidade dessas ferramentas e a facilidade de enviar para produção com a `Vercel`. 

O banco de dados `Supabase` foi adotado por integrar armazenamento, regras de segurança e API pronta sobre `PostgreSQL`, simplificando a persistência dos planos de aula sem necessidade de um backend para o aplicativo.

O modelo `Gemini 2.5-Flash` foi escolhido por oferecer respostas rápidas, custo reduzido e boa consistência em formato JSON, atendendo bem ao foco do projeto: gerar planos de aula estruturados e prontos para armazenamento.

A persistência dos dados segue uma estrutura simplificada com uma única tabela `PlanoDeAula`, priorizando clareza e baixo acoplamento. Essa decisão reduz a complexidade de manutenção durante o desenvolvimento inicial e facilita a integração direta com o `Supabase`.

> Foi optado por não implementar autenticação nesta etapa, considerando o escopo experimental do projeto.

## Desafios Encontrados

Alguns dos desafios evidenciados durante o desenvolvimento foram na parte de tratamento de dados, ajuste do modelo de IA e consumo das APIs utilizadas. 

Houve um momento em que os dados precisaram ser tratados para envio ao banco de dados, foi complicado lidar com o formato que estava sendo retornado devido aos parâmetros definidos na chamada do modelo de IA, foi utilizado uma solução no lado do cliente para pegar os dados e pouco a pouco os tratar para realizar o envio para o supabase, ao mesmo tempo em que era organizado para ser persistido ele era tratado uma segunda vez para aprensentação visual da resposta da IA.

Padronizar a saída que a IA gera é algo desafiador, pois existem várias formas de se tratar, por exemplo, seria possível fazer as configurações de forma estática (como foi feito) ou de forma dinâmica (uma breve apresentação no primeiro prompt ou fazer com que a IA decida o que retornar) que são situações mais complexas e foi julgado ser desnecessário considerando prazos e, portanto, foi assumido débito técnico de ter uma resposta mais engessada e menos customizável para que fosse entregue o aplicativo.

Durante o consumo das APIs foi desafiador e interessante ler e rever as documentações das ferramentas, um desafio bem simples que tive foi importar as variáveis de ambiente para o código, pois a ferramenta `Next.JS` trabalha de 2 modos, usando o `server side` e usando o `client side`, foi utilizado a `client side` e nela temos que variáveis de ambiente não consumidas da maneira convencional por ser carregada no navegador, com isso o Next exige uma nomenclatura específica para fazer o carregamento prévio dessas variáveis no navegador.

Ainda falando de APIs houve o problema na hora de persistir os dados da IA, foi descoberto que o `supabase`, ao ter o `Row-Level Security (RLS)` ativado, trata as requisições de maneira estrita e bloqueia requisições como a que a aplicação estava fazendo, nem mesmo criando políticas permissivas fazia com que o supabase aceitasse as requisições, para solucionar esse problema foi assumido novamente um débito técnico de utilizar a chave de `service role` para ignorar as regras impostas pelo `RLS`.