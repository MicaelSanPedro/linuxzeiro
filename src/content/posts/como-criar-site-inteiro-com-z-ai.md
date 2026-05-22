---
title: "Como Criar um Site Inteiro com a Z.ai: Do Zero ao Deploy"
date: "2025-05-22"
excerpt: "Quer ter seu próprio site mas não sabe programar? Aprenda a criar um site completo do zero usando GitHub, Vercel e o modo agente da Z.ai — sem digitar uma linha de código."
category: "Desenvolvimento"
tags: ["z.ai", "github", "vercel", "ia", "desenvolvimento", "deploy", "next.js", "tutorial"]
coverImage: "/posts/z-ai-site-cover.jpg"
readTime: "12 min"
featured: false
---

## Criar um site sem saber programar não é mais ficção

Se você chegou até aqui, provavelmente já pensou em ter seu próprio site — um blog, portfólio, landing page ou projeto pessoal — mas esbarrou na barreira do "não sei programar". A boa notícia é que em 2025 isso deixou de ser um problema.

A **Z.ai** é uma plataforma de IA que vai além de chatbot. Ela tem um **modo agente** capaz de criar, modificar e fazer deploy de sites completos. Você descreve o que quer em linguagem natural, e ela escreve o código, configura o projeto, faz commit no GitHub e publica na Vercel. Sério.

Neste tutorial, vou te guiar **passo a passo** — desde criar as contas até ter seu site no ar, e depois como usar a Z.ai para fazer alterações a qualquer momento.

---

## Passo 1: Criar sua conta no GitHub

O **GitHub** é onde o código do seu site vai morar. É como um Google Drive para programadores, mas com controle de versão — ou seja, se você fizer cagada, pode voltar no tempo.

### Criando a conta

1. Acesse [github.com](https://github.com)
2. Clique em **Sign up**
3. Preencha com seu e-mail, crie uma senha e um username
4. Verifique o e-mail
5. Escolha o plano gratuito (**Free**) — não precisa pagar nada

### Configuração essencial

Depois de logado, faça duas coisas importantes:

**Ative a autenticação de dois fatores (2FA):**

1. Vá em **Settings** (canto superior direito) → **Password and authentication**
2. Em "Two-factor authentication", clique em **Enable 2FA**
3. Use um app autenticador (Google Authenticator, Authy, ou o app nativo do celular)
4. Salve os **recovery codes** em lugar seguro

**Crie um Personal Access Token (PAT):**

O token é uma senha especial que permite que a Z.ai faça alterações no seu repositório sem precisar da sua senha do GitHub.

1. Vá em **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Clique em **Generate new token** → **Generate new token (classic)**
3. Dê um nome, tipo `techmate-z-ai`
4. Marque as permissões necessárias:
   - `repo` (acesso total aos repositórios)
   - `workflow` (para acionar deploys na Vercel)
5. Clique em **Generate token**
6. **Copie o token agora** — ele não vai aparecer de novo

> **Importante:** Guarde esse token. Você vai precisar dele na Z.ai para que ela possa fazer commit e push no seu repositório.

---

## Passo 2: Criar sua conta na Vercel

A **Vercel** é a plataforma que vai transformar seu código em um site acessível na internet. É onde seu site vai ficar hospedado — de graça, com HTTPS e domínio personalizado.

### Criando a conta

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Sign up**
3. Escolha **Continue with GitHub** (mais fácil)
4. Autorize a Vercel a acessar seu GitHub
5. Pronto, conta criada

### Entendendo o que a Vercel faz

A Vercel funciona assim: toda vez que você faz um **push** (envio de código) para o GitHub, ela detecta automaticamente, constrói o site e publica. Esse processo se chama **CI/CD** (Continuous Integration / Continuous Deployment), e a Vercel faz tudo sozinha.

Isso significa que quando a Z.ai fizer uma alteração no seu código e enviar pro GitHub, seu site vai **atualizar automaticamente** em segundos.

---

## Passo 3: Inicializando o projeto com a Z.ai

Aqui é onde a mágica acontece. Você vai pedir para a Z.ai criar o site do zero.

### Acessando a Z.ai

1. Acesse [z.ai](https://z.ai) e entre na sua conta
2. Abra um chat com o assistente
3. No modo agente, você pode pedir para ele criar projetos completos

### Pedindo a criação do site

Digite algo assim para a Z.ai:

```
Crie um site de blog tech usando Next.js com as seguintes características:
- Tema escuro com cores em amber/dourado
- Homepage com hero section e cards de categorias
- Página de blog com filtro por categoria
- Posts escritos em Markdown
- Navbar com navegação e busca
- Footer com links úteis
- Design responsivo e moderno
```

Quanto mais detalhes você der, melhor o resultado. A Z.ai vai:
1. Escrever todo o código do projeto (Next.js, React, Tailwind CSS)
2. Estruturar as pastas e arquivos
3. Criar componentes, páginas e estilos
4. Configurar o `next.config.ts`, `tsconfig.json`, `package.json`

### Como o modo agente funciona

O **modo agente** da Z.ai não é um chat simples. Ele:
- **Lê e escreve arquivos** no servidor
- **Executa comandos** (instala dependências, roda build)
- **Acessa ferramentas** como terminal, editor de código e navegador
- **Trabalha em etapas** — ele planeja, executa e verifica cada passo
- **Pede confirmação** antes de ações importantes

Você pode acompanhar o progresso em tempo real e intervir a qualquer momento dizendo "muda a cor do botão para azul" ou "adiciona uma nova seção".

---

## Passo 4: Conectando o GitHub à Z.ai

Depois que a Z.ai criar o projeto, você precisa conectar ao seu GitHub para versionar o código.

### Fazendo o clone e configuração

A Z.ai pode fazer tudo isso sozinha. Basta pedir:

```
Clone meu repositório techmate do GitHub para eu poder fazer alterações.
O token é: ghp_SEU_TOKEN_AQUI
```

A Z.ai vai:
1. Clonar o repositório para o servidor
2. Configurar o remote com autenticação
3. Verificar que tudo está funcionando

### Fazendo o primeiro commit

Depois que a Z.ai terminar de criar ou modificar o site, ela pode fazer commit e push diretamente:

```
Faça commit e push de todas as alterações
```

Ela vai executar os comandos `git add`, `git commit` e `git push` automaticamente, e em segundos seu código estará no GitHub.

---

## Passo 5: Conectando o GitHub à Vercel

Agora vamos ligar tudo para que seu site vá para a internet.

### Importando o repositório

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **Add new** → **Project**
3. Na seção "Import Git Repository", você verá seu repositório
4. Clique em **Import** ao lado do repositório

### Configurando o projeto

Na tela de configuração:

| Configuração | Valor recomendado |
|-------------|-------------------|
| **Framework Preset** | Next.js (detectado automaticamente) |
| **Root Directory** | `.` (raiz do projeto) |
| **Build Command** | `next build` (padrão) |
| **Output Directory** | Deixe padrão |
| **Install Command** | `npm install` (padrão) |

Clique em **Deploy** e aguarde. Em 1-2 minutos, seu site estará no ar.

### Domínio personalizado

A Vercel dá um domínio automático tipo `seu-projeto.vercel.app`. Mas você pode usar um domínio próprio:

1. Nas configurações do projeto na Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `meusite.com`)
3. Configure o DNS no seu registrador de domínins apontando para a Vercel

---

## Passo 6: Administrando e fazendo alterações

Aqui é onde o poder real da Z.ai brilha. Seu site está no ar, mas você quer mudar algo. Sem problema.

### Fluxo de trabalho diário

O ciclo completo de alteração funciona assim:

```
Você pede alteração → Z.ai modifica o código → Faz commit no GitHub
→ GitHub envia pra Vercel → Vercel faz rebuild → Site atualizado
```

Tudo isso em **menos de 2 minutos**.

### Exemplos de alterações que você pode pedir

**Design:**
```
Troca a cor do destaque de azul pra verde esmeralda
```

```
Adiciona uma animação suave de scroll nas seções do site
```

```
Muda a fonte do heading para uma mais moderna
```

**Funcionalidades:**
```
Adiciona um botão de compartilhar nas redes sociais nos posts
```

```
Cria uma página de busca que filtra posts por título e tag
```

```
Adiciona modo escuro/claro com toggle no navbar
```

**Conteúdo:**
```
Cria um novo post sobre como configurar Docker no WSL
```

```
Corrige o texto do about, adiciona mais detalhes sobre mim
```

```
Adiciona uma seção de newsletter na homepage
```

### A Z.ai escreve os posts também

Sim, ela pode escrever conteúdo de blog. Peça algo como:

```
Escreve um post completo sobre como usar Neovim como IDE
em 2025, com exemplos de código e dicas práticas.
```

Ela vai gerar um arquivo Markdown com frontmatter (título, data, categoria, tags) e conteúdo formatado, salvar no diretório de posts e fazer o commit.

---

## Passo 7: Boas práticas e dicas avançadas

### Sempre revise antes de publicar

A Z.ai é poderosa, mas nem sempre acerta 100%. Antes de fazer alterações críticas:

- Peça para ela **explicar** o que vai mudar: "O que essa alteração afeta?"
- Use a **versão de preview** da Vercel para testar antes de ir pro ar
- Se algo quebrar, peça para ela **reverter o commit**: "Reverte o último commit"

### Mantenha um backup

O GitHub já é um backup natural com controle de versão, mas é bom ter cuidado:

- Nunca peça para deletar arquivos sem saber o que são
- Use branches: "Cria uma branch chamada nova-feature antes de alterar"
- Faça push regularmente para não perder progresso

### Token de segurança

Sobre o token do GitHub que você usa na Z.ai:
- Ele dá acesso total ao seus repositórios
- Se vazar, qualquer pessoa pode alterar seus projetos
- Se isso acontecer, vá em **Developer settings** → **Personal access tokens** e **revogue** o token imediatamente, depois crie um novo
- Considere criar tokens com permissões mínimas (só `repo` para um repositório específico)

### Performance

Peça para a Z.ai otimizar o site:

```
Otimiza o site para Lighthouse: melhora o score de performance,
accessibilidade e SEO
```

Ela pode configurar lazy loading de imagens, otimizar fontes, adicionar metadata para SEO e muito mais.

---

## Passo 8: Expandindo o projeto

Depois que o site estiver no ar e funcionando, você pode expandir:

### Adicionando um backend

A Z.ai pode criar API routes no Next.js para funcionalidades como:

- Sistema de comentários
- Newsletter com e-mail
- Analytics customizado
- Formulário de contato

### Integrando serviços

```
Adiciona Google Analytics ao site
```

```
Configura o Commento como sistema de comentários nos posts
```

```
Integra o Discord webhook para notificar novos posts
```

### Deploy em produção vs preview

A Vercel cria automaticamente:
- **Deploy de produção**: a cada push na branch `main`
- **Deploy de preview**: para cada pull request ou branch diferente

Isso significa que você pode testar alterações em uma URL de preview antes de mesclar na main.

---

## Resumo do fluxo completo

Para não se perder, aqui está o fluxo inteiro de uma vez:

| Passo | Ação | Ferramenta |
|-------|------|------------|
| 1 | Criar conta no GitHub | github.com |
| 2 | Gerar Personal Access Token | GitHub Settings |
| 3 | Criar conta na Vercel | vercel.com |
| 4 | Pedir para a Z.ai criar o site | z.ai (modo agente) |
| 5 | Z.ai faz commit e push | GitHub |
| 6 | Importar repositório na Vercel | vercel.com |
| 7 | Site vai pro ar automaticamente | Vercel Deploy |
| 8 | Pedir alterações pela Z.ai | z.ai (modo agente) |
| 9 | Tudo se atualiza sozinho | GitHub → Vercel |

O mais importante: **você não precisa escrever código**. Todo o ciclo de desenvolvimento — criação, alteração, deploy e manutenção — pode ser feito pedindo em linguagem natural para a Z.ai. Ela escreve, testa e publica. Você orienta.

Se tem uma ideia de site, agora não tem desculpa. Mão na massa.
