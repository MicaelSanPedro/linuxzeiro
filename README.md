# TechMate

**Seu parceiro em tech.** Blog brasileiro com tutoriais, dicas e guias sobre Linux, Windows, desenvolvimento, seguranca e gaming. Conteudo honesto e pratico, sem fluff.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## Visao geral

TechMate e um blog estatico construido com Next.js App Router, featuring um sistema de design **Liquid Glass** inspirado no iOS 26. O site combina performance de geracao estatica com uma experiencia visual cinematografica.

### Destaques

- **Liquid Glass UI** — Sistema de design proprio com efeitos de vidro liquido, blur, refração e highlights espectrais
- **Modo Escuro / Claro** — Troca de tema completa com persistencia via `localStorage`
- **Tela de boas-vindas** — Primeira visita com prompt de nome, personalizacao da experiencia
- **Busca integrada** — Busca em tempo real por titulos e conteudo dos artigos
- **100% estatico** — Build estatico via SSG, deploy instantaneo no Vercel
- **Markdown puro** — Artigos escritos em `.md` com suporte a GFM (tabelas, checklist, etc.)
- **Categorias** — Linux, Windows, Desenvolvimento, Seguranca, Hardware, Dicas, Jogos
- **Responsivo** — Otimizado para mobile, tablet e desktop com menu adaptativo

## Tech Stack

| Camada | Tecnologia |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Estilizacao | [Tailwind CSS 4](https://tailwindcss.com/) |
| Tipagem | [TypeScript 5](https://www.typescriptlang.org/) |
| Icones | [Lucide React](https://lucide.dev/) |
| Animacoes | [Framer Motion](https://www.framer.com/motion/) |
| Markdown | [Remark](https://github.com/remarkjs/remark) + Remark HTML + GFM |
| Frontmatter | [gray-matter](https://github.com/jonschlinkert/gray-matter) |
| Deploy | [Vercel](https://vercel.com/) |

## Estrutura do projeto

```
techmate/
├── public/
│   ├── favicon.ico / favicon.png
│   ├── apple-touch-icon.png
│   └── logo.png / logo.svg / logo.webp
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout raiz (backdrop, overlays, navbar, footer)
│   │   ├── page.tsx            # Home page (hero, featured, categorias, posts)
│   │   ├── globals.css         # Design system completo (liquid glass, animacoes, tema)
│   │   ├── blog/
│   │   │   ├── page.tsx        # Listagem de posts com filtros
│   │   │   └── [slug]/page.tsx # Pagina individual do post
│   │   └── search/page.tsx     # Pagina de busca
│   ├── components/
│   │   ├── Navbar.tsx          # Navegacao responsiva + menu mobile
│   │   ├── SettingsPanel.tsx   # Painel de configuracoes (nome, tema, limpar dados)
│   │   ├── WelcomeScreen.tsx   # Tela de boas-vindas para novos usuarios
│   │   ├── CategoryCard.tsx    # Cards de categoria com spotlight interativo
│   │   ├── FeaturedPost.tsx    # Post em destaque (hero + compact)
│   │   ├── PostCard.tsx        # Card de post na listagem
│   │   ├── SearchBar.tsx       # Barra de busca com dropdown de resultados
│   │   ├── Footer.tsx          # Rodape com links e branding
│   │   ├── Logo.tsx            # Componente do logo com glow
│   │   ├── BokehParticles.tsx  # Particulas bokeh cinematograficas (canvas)
│   │   ├── ScrollToTop.tsx     # Botao de scroll para o topo
│   │   ├── ScrollRevealInit.tsx # Inicializacao de animacoes on-scroll
│   │   ├── PageTransition.tsx  # Transicao de pagina suave
│   │   └── ...
│   ├── content/
│   │   └── posts/              # Artigos em Markdown (.md)
│   └── lib/
│       └── posts.ts            # Funcoes de leitura/parsing dos posts
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

## Começando

### Pré-requisitos

- Node.js 18.17+
- npm, yarn ou pnpm

### Instalacao

```bash
# Clone o repositorio
git clone https://github.com/MicaelSanPedro/techmate.git
cd techmate

# Instale as dependencias
npm install

# Rode em modo de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Build de producao

```bash
npm run build
npm start
```

## Escrevendo um novo post

Crie um arquivo `.md` em `src/content/posts/`:

```markdown
---
title: "Titulo do Artigo"
excerpt: "Um resumo curto do artigo."
date: "2026-05-24"
category: "Linux"
tags: ["linux", "tutorial", "dica"]
featured: false
image: "/images/thumb.png"
---

Conteudo do artigo em Markdown...
```

**Campos disponiveis no frontmatter:**

| Campo | Tipo | Descricao |
|---|---|---|
| `title` | `string` | Titulo do artigo |
| `excerpt` | `string` | Resumo curto (usado nos cards) |
| `date` | `string` | Data no formato `YYYY-MM-DD` |
| `category` | `string` | Categoria (Linux, Windows, Desenvolvimento, Seguranca, Hardware, Dicas, Jogos) |
| `tags` | `string[]` | Array de tags |
| `featured` | `boolean` | Se deve aparecer como post em destaque |
| `image` | `string` | Caminho da imagem de destaque (opcional) |

## Sistema de Design

O **Liquid Glass** e o sistema visual do TechMate, inspirado na estetica glassmorphism do iOS 26. Os principios principais sao:

- **Superficies translucidas** com `backdrop-filter: blur()` e gradientes sutis
- **Highlights espectrais** — linhas brilhantes no topo simulando reflexo de luz
- **Refração interna** — gradientes radiais simulando distorcao de luz
- **Sombras ambientais** — sombras suaves que criam profundidade
- **Cores amber** — paleta baseada em ambar/dourado para acentos

O sistema suporta **dark mode** e **light mode** completos, com override automatico de todas as superficies, textos, sombras e efeitos.

## Licenca

Este projeto e privado e de uso pessoal.
