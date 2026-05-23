---
title: "Como Instalar Games no Linux: Guia Completo 2025"
date: "2026-05-21"
excerpt: "Gaming no Linux nunca foi tão bom. Aprenda a instalar e rodar seus jogos favoritos usando Steam Proton, Lutris, Heroic Launcher e muito mais. Do básico ao avançado."
category: "Jogos"
tags: ["linux", "gaming", "steam", "proton", "jogos", "tutorial", "lutris", "heroic"]
coverImage: "/posts/games-linux.jpg"
readTime: "12 min"
featured: false
---

## O cenário de jogos no Linux em 2025

Se você ainda acha que Linux não serve pra jogos, está na hora de rever esse conceito. Em 2025, o ecossistema de gaming no Linux atingiu um nível de maturidade que poucos imaginavam há uma década. Graças ao esforço da Valve com o Steam Deck e ao projeto Proton, mais de **85% dos jogos no Top 1000 da Steam** funcionam perfeitamente no Linux, muitos com desempenho igual ou superior ao Windows.

O segredo por trás dessa revolução é simples: o Proton é uma camada de compatibilidade baseada no Wine que traduz chamadas DirectX e Windows API para Vulkan e APIs nativas do Linux. Na prática, isso significa que você instala um jogo Windows pelo Steam e ele simplesmente funciona, sem configurações complicadas na maioria dos casos.

Neste guia, vamos cobrir todos os métodos disponíveis para jogar no Linux, desde a solução mais simples (Steam) até alternativas avançadas para launchers como Epic Games, EA App e Ubisoft Connect.

---

## Steam + Proton — A forma mais fácil

A Steam é, sem dúvida, a melhor forma de jogar no Linux. A Valve investiu pesado na plataforma e o resultado é uma experiência que funciona de forma praticamente transparente para o usuário.

### Instalando a Steam

```bash
sudo apt install steam-installer

sudo dnf install steam

sudo pacman -S steam

flatpak install flathub com.valvesoftware.Steam
```

Depois de instalar, abra a Steam, faça login e acesse **Steam → Settings → Compatibility**. Marque a opção **"Enable Steam Play for supported titles"** e **"Enable Steam Play for all other titles"**. Isso permite rodar qualquer jogo Windows através do Proton.

### Escolhendo a versão do Proton

A Steam vem com o Proton padrão, mas você pode instalar versões experimentais que frequentemente trazem melhor performance e compatibilidade:

1. Vá em **Steam → Settings → Compatibility**
2. Clique em **"Proton version"** e escolha uma das opções:
   - **Proton 9.x (stable)** — recomendada para a maioria dos jogos
   - **Proton Experimental** — versão de desenvolvimento, pode ter melhor performance
   - **Proton GE (GE-Proton)** — versão da comunidade com patches extras, a melhor para jogos difíceis

### Instalando GE-Proton (recomendado)

O GE-Proton inclui correções e patches que o Proton oficial ainda não tem. Instalar é simples:

```bash
flatpak install flathub net.davidotek.pupgui2

sudo pacman -S protonup-qt
```

Abra o ProtonUp-Qt, selecione "Steam" como launcher, e clique em "Add Version" para instalar a versão mais recente do GE-Proton. Depois, volte na Steam e selecione essa versão nas configurações de compatibilidade.

### Verificando compatibilidade

Antes de comprar ou instalar um jogo, verifique a compatibilidade no **[ProtonDB](https://www.protondb.com/)**. O site classifica os jogos em:

| Rating | Significado |
|:-------|:-----------|
| **Platinum** | Funciona perfeitamente sem ajustes |
| **Gold** | Funciona com ajustes menores |
| **Silver** | Funciona com ajustes técnicos |
| **Bronze** | Funciona com problemas |
| **Borked** | Não funciona |

---

## Lutris — Jogos fora da Steam

Muitos jogos não estão disponíveis na Steam — títulos da GOG, Epic Games Store, Origin/EA App e até jogos standalone. É aí que o **Lutris** entra em ação.

### O que é o Lutris?

Lutris é um gerenciador de jogos open-source que automatiza a instalação e configuração de jogos no Linux. Ele usa scripts da comunidade que configuram tudo automaticamente: versão correta do Wine, dependências, DLLs e patches.

### Instalando o Lutris

```bash
sudo add-apt-repository ppa:lutris-team/lutris
sudo apt update
sudo apt install lutris

sudo dnf install lutris

sudo pacman -S lutris

flatpak install flathub net.lutris.Lutris
```

### Usando o Lutris

1. Crie uma conta no [lutris.net](https://lutris.net/)
2. Abra o Lutris e faça login
3. Pesquise o jogo desejado na barra de busca
4. Clique em **"Install"** e siga as instruções
5. O script da comunidade cuida de todo o resto

O Lutris suporta:
- **Jogos da GOG** (com integração automática)
- **Jogos da Epic Games Store** (via script)
- **Jogos standalone** (installers .exe)
- **Emuladores** (RetroArch, PCSX2, Dolphin, etc.)
- **Jogos nativos** do Linux

### Dica importante

Sempre que possível, prefira a versão **Flatpak** do Lutris. Ela já inclui versões otimizadas do Wine e dependências, evitando conflitos com o sistema.

---

## Heroic Games Launcher — Epic Games e GOG

O **Heroic Games Launcher** é uma alternativa open-source ao Epic Games Launcher e ao GOG Galaxy. Ele permite instalar e rodar jogos comprados nessas lojas diretamente no Linux.

### Recursos do Heroic

- Integração completa com **Epic Games Store**
- Integração completa com **GOG**
- Suporte a Wine/Proton para jogos Windows
- Download de saves na nuvem
- Importação de jogos do GOG (instaladores offline)
- Interface moderna e limpa

### Instalando o Heroic

```bash
flatpak install flathub com.heroicgameslauncher.hgl

npm install -g heroic

yay -S heroic-games-launcher-bin
```

### Configurando o Heroic

1. Abra o Heroic e faça login na sua conta Epic e/ou GOG
2. Vá em **Settings → Wine-Preferences**
3. Escolha o wine-ge-custom (recomendado) ou o Proton
4. Para jogos específicos, clique com o botão direito → **Wine-Preferences** e ajuste individualmente

> **Nota:** O Heroic pode importar jogos GOG que você já baixou offline. Basta apontar para o arquivo do instalador e ele configura tudo.

---

## Bottles — Aplicativos e jogos isolados

**Bottles** é uma ferramenta que cria ambientes virtuais isolados (chamados de "bottles") para rodar aplicativos e jogos Windows. É especialmente útil para jogos que precisam de configurações específicas.

### Por que usar Bottles?

- Ambientes **isolados** — cada jogo tem sua configuração separada
- Interface gráfica intuitiva
- Suporte a **dependências customizadas** (.NET, Visual C++, DirectX)
- Gerenciamento de versões do Wine por bottle
- Backup e restore fácil

### Instalando o Bottles

```bash
flatpak install flathide com.usebottles.bottles

sudo pacman -S bottles
```

### Criando uma Bottle para jogos

1. Abra o Bottles e clique em **"Create a new bottle"**
2. Selecione o tipo: **Gaming** (para jogos) ou **Application**
3. Escolha a versão do Wine (soda, caffe, proton-ge)
4. Nomeie sua bottle e crie

Depois, basta arrastar o instalador do jogo (.exe) para dentro da bottle e ele será instalado automaticamente.

---

## Launchers de outros serviços

### EA App (Origin)

Para jogar títulos da EA no Linux:

1. Instale o Lutris ou o Bottles
2. No Lutris, pesquise "EA App" e use o script oficial
3. Faça login e instale seus jogos normalmente

Jogos como **The Sims 4**, **FIFA/EA FC**, **Battlefield** e **Need for Speed** funcionam através dessa configuração.

### Ubisoft Connect

O processo é similar:

1. No Lutris, pesquise "Ubisoft Connect"
2. Instale usando o script da comunidade
3. Faça login e instale seus jogos

**Assassin's Creed**, **Far Cry**, **Watch Dogs** e outros títulos da Ubisoft funcionam, embora alguns possam precisar de ajustes na versão do Wine.

### Rockstar Games Launcher

Jogos como **GTA V** e **Red Dead Redemption 2** podem ser instalados via Lutris:

1. Pesquise "Rockstar Games Launcher" no Lutris
2. Use o script atualizado para instalar o launcher
3. Instale o jogo normalmente

> **Dica:** GTA V funciona muito bem no Linux via Proton. Se você tem o jogo na Steam, pode rodar direto sem necessidade de configurar o Rockstar Launcher separadamente.

---

## Jogos nativos do Linux

Muitos jogos populares têm versões nativas para Linux que não precisam de nenhuma camada de compatibilidade:

### Jogos AAA nativos

| Jogo | Nota |
|------|------|
| **Counter-Strike 2** | Nativo, roda perfeitamente |
| **Dota 2** | Nativo via Source 2 |
| **Team Fortress 2** | Nativo |
| **Minecraft (Bedrock)** | Nativo (exceto Java) |
| **Terraria** | Nativo |
| **Stardew Valley** | Nativo |
| **Hollow Knight** | Nativo |
| **Civilization VI** | Nativo |
| **Total War: WARHAMMER III** | Nativo |

### Jogos indie nativos

A maioria dos jogos indie no Steam tem versão Linux. Desenvolvedores como ConcernedApe (Stardew Valley), Team Cherry (Hollow Knight) e Eric Barone lançam nativamente no Linux.

Para verificar se um jogo tem versão nativa, procure pelo ícone do **penguin/Tux** na página da Steam ou use o filtro "Linux" na loja.

---

## Otimizando a performance

### Drivers de vídeo

Os drivers são a base de uma boa experiência de gaming no Linux. Sem drivers corretos, nenhum jogo vai rodar bem.

**NVIDIA (placas dedicadas):**
```bash
sudo apt install nvidia-driver-550

sudo dnf install akmod-nvidia

sudo pacman -S nvidia nvidia-utils
```

> **Importante:** Use SEMPRE o driver proprietário da NVIDIA para gaming. O driver open-source (Nouveau) não tem suporte adequado para jogos modernos.

**AMD (placas dedicadas e integradas):**
```bash
sudo apt install mesa-vulkan-drivers
sudo dnf install mesa-vulkan-drivers
```

O driver Mesa da AMD para Vulkan (RADV) tem performance excelente, muitas vezes superior ao driver proprietário no Windows.

**Intel (placas integradas):**
```bash
sudo apt install mesa-vulkan-drivers intel-media-driver
```

### Camada Vulkan

O Vulkan é a API gráfica que o Proton usa para renderizar jogos. Ter a camada Vulkan atualizada é essencial:

```bash
vulkaninfo --summary

sudo apt install vulkan-tools libvulkan1
sudo dnf install vulkan-loader
```

### Compatibilidade Anti-Cheat

Alguns jogos multiplayer usam sistemas anti-cheat que bloqueiam o Linux. A situação em 2025:

| Anti-Cheat | Status no Linux |
|------------|:-:|
| **BattlEye** | <span class="t-check"></span> Suportado |
| **Easy Anti-Cheat (EAC)** | <span class="t-check"></span> Suportado |
| **Vanguard (Valorant)** | <span class="t-cross"></span> Não funciona |
| **Ricochet (CoD)** | <span class="t-cross"></span> Não funciona |

Jogos como **Fortnite**, **Apex Legends**, **Destiny 2** e **Fall Guys** funcionam no Linux porque seus anti-cheats são compatíveis. Porém, **Valorant** e **Call of Duty** continuam bloqueados.

---

## Mesa de comandos rápida

Aqui estão os comandos mais úteis para gerenciar jogos no Linux:

```bash
vulkaninfo --summary

STEAM_COMPAT_DATA_PATH="~/.steam/compatibilitytools.d/GE-Proton" \
  protontricks launch <app-id> <comando>

wine --version

wineserver -k

rm -rf ~/.wine
rm -rf ~/.local/share/lutris/runtime/wine

protonup-qt --install GE-Proton
```

---

## Jogos recomendados para testar

Se você acabou de configurar seu Linux para gaming, aqui estão os jogos perfeitos para testar se tudo está funcionando:

### Para testar Proton (jogos Windows)
- **Cyberpunk 2077** — excelente benchmark, roda muito bem via Proton
- **Elden Ring** — funciona perfeitamente, ótimo para testar controladores
- **Baldur's Gate 3** — nativo, mas a versão Windows via Proton também funciona
- **Horizon Zero Dawn** — excelente conversão, ótimo desempenho

### Jogos leves (para hardware modesto)
- **Stardew Valley** — nativo, roda em qualquer coisa
- **Hollow Knight** — nativo, gráficos lindos
- **Celeste** — nativo, plataforma perfeita
- **Undertale** — nativo, funciona até em potatoes

### Multiplayer funcionando
- **Fortnite** (via Epic Games + Proton)
- **Apex Legends** (via Steam + Proton)
- **Counter-Strike 2** (nativo)
- **Rocket League** (via Steam + Proton)

---

## Conclusão

Gaming no Linux em 2025 é uma realidade acessível e prazerosa. O Steam com Proton resolve 85% dos casos, o Heroic Games Launcher cobre a Epic Games Store e a GOG, e o Lutris preenche as lacunas para launchers como EA e Ubisoft. Com drivers atualizados e a versão correta do GE-Proton, você vai conseguir rodar praticamente qualquer jogo que quiser.

O melhor de tudo é que a situação só melhora. A Valve continua investindo pesado no Proton e no Wine, e a cada mês mais jogos se tornam compatíveis. Se você está pensando em migrar para Linux mas tinha medo de perder seus jogos, saiba que esse medo já não é mais justificado. Configure sua distro, instale a Steam, ative o Proton, e aproveite.
