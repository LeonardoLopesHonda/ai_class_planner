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

## Desafios Encontrados
