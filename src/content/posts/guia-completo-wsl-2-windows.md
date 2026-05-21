---
title: "Guia Completo do WSL 2 no Windows para Desenvolvedores"
date: "2025-02-03"
excerpt: "Aprenda a configurar e dominar o WSL 2 no Windows 11. Do básico ao avançado: integração com VS Code, Docker, CUDA e muito mais."
category: "Windows"
tags: ["wsl", "windows", "linux", "desenvolvimento", "terminal", "docker"]
coverImage: "/posts/wsl-2-windows.jpg"
readTime: "9 min"
featured: true
---

## O que é WSL 2 e por que você deveria usar?

O **Windows Subsystem for Linux 2** (WSL 2) é uma camada de compatibilidade oficial da Microsoft que permite executar um ambiente Linux completo diretamente no Windows — sem máquina virtual separada, sem dual-boot, sem dor de cabeça.

Diferente da primeira versão, o WSL 2 utiliza um **kernel Linux real** compilado pela Microsoft, oferecendo compatibilidade de sistema de arquivos e desempenho muito superiores. Para desenvolvedores que precisam do Windows (por trabalho, jogos ou preferência) mas querem as ferramentas Unix, o WSL 2 é a solução definitiva.

---

## Instalação

A instalação nunca foi tão simples. Abra o **PowerShell como Administrador** e execute:

```powershell
wsl --install
```

Esse único comando instala o WSL 2, o Ubuntu como distribuição padrão e habilita todos os recursos necessários. Após a instalação, reinicie o computador e configure seu usuário e senha no Ubuntu.

### Instalando uma distribuição específica

Se preferir outra distro:

```powershell
# Listar distribuições disponíveis
wsl --list --online

# Instalar Fedora, por exemplo
wsl --install -d Fedora
```

### Verificando a instalação

```bash
# Dentro do WSL
uname -r
# Saída: 5.15.x-microsoft-standard-WSL2 (kernel Linux real)

cat /etc/os-release
# Mostra informações da distribuição instalada
```

---

## Configurações essenciais

### Arquivo `.wslconfig`

Crie o arquivo `%USERPROFILE%\.wslconfig` para configurar o comportamento global do WSL:

```ini
[wsl2]
memory=8GB          # Limite de RAM (padrão: 50% da memória)
processors=4        # Número de CPUs virtuais
swap=2GB            # Tamanho do swap
localhostForwarding=true  # Encaminhar localhost automaticamente
```

### Performance do sistema de arquivos

O WSL 2 tem uma diferença crucial de performance entre acessar arquivos **dentro** do sistema de arquivos Linux (`/home/`) versus arquivos no sistema de arquivos Windows (`/mnt/c/`). **Sempre trabalhe dentro do diretório home do WSL** para melhor performance:

```bash
# ✅ Rápido — sistema de arquivos Linux nativo
cd ~/projetos/meu-app
npm install

# ❌ Lento — sistema de arquivos Windows via 9P
cd /mnt/c/Users/voce/projetos/meu-app
npm install
```

A diferença pode ser de **5x a 20x** em operações com muitos arquivos pequenos (como `node_modules`).

---

## Integração com VS Code

A integração entre VS Code e WSL 2 é uma das melhores experiências de desenvolvimento disponíveis. O VS Code roda na interface do Windows, mas o servidor de linguagem, terminal e extensões executam **dentro do WSL**, oferecendo performance nativa de Linux.

### Configuração

1. Instale a extensão **"WSL"** no VS Code
2. No terminal WSL, navegue até seu projeto e execute:

```bash
code .
```

O VS Code abrirá com a integração WSL ativa automaticamente. Você pode verificar no canto inferior esquerdo: deve aparecer "WSL: Ubuntu" (ou sua distribuição).

### Extensões no WSL

As extensões são instaladas separadamente para o WSL. Quando uma extensão precisa de acesso ao filesystem Linux (como ESLint, Prettier, Python, C++), instale-a na seção "WSL: Ubuntu" da aba de extensões.

---

## Docker no WSL 2

A melhor experiência Docker no Windows é executar o **Docker Engine diretamente dentro do WSL**, sem necessidade do Docker Desktop:

```bash
# Instalar Docker no WSL
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Iniciar o serviço Docker
sudo service docker start

# Testar
docker run hello-world
```

Para que o Docker inicie automaticamente, adicione ao seu `~/.bashrc` ou `~/.zshrc`:

```bash
sudo service docker start 2>/dev/null
```

---

## CUDA e desenvolvimento GPU

O WSL 2 suporta **CUDA** nativamente, permitindo treinamento de modelos de machine learning e computação GPU sem dual-boot:

```bash
# Verificar suporte a CUDA
nvidia-smi

# Instalar PyTorch com CUDA
pip install torch torchvision torchaudio --index-url \
  https://download.pytorch.org/whl/cu121
```

A GPU é compartilhada diretamente com o WSL 2, sem a sobrecarga de virtualização tradicional.

---

## Rede e portas

O WSL 2 possui seu próprio endereço IP, mas o **localhost forwarding** (habilitado por padrão) redireciona automaticamente portas do WSL para o Windows. Ou seja, se você rodar um servidor na porta 3000 dentro do WSL, ele estará acessível em `http://localhost:3000` no navegador do Windows.

### Acessar serviços WSL da rede local

Para expor um serviço WSL para outros dispositivos na rede:

```powershell
# No PowerShell (como Administrador)
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$(wsl hostname -I)
```

---

## Dicas avançadas

### Atualizar o kernel WSL

```powershell
wsl --update --pre-release
```

### Gerenciar múltiplas distribuições

```powershell
# Listar instaladas
wsl --list --verbose

# Definir padrão
wsl --set-default Ubuntu

# Desligar todas as instâncias
wsl --shutdown
```

### Backup e exportação

```powershell
# Exportar uma distribuição
wsl --export Ubuntu backup-ubuntu.tar

# Importar em outro computador
wsl --import Ubuntu D:\wsl\Ubuntu backup-ubuntu.tar
```

---

## Conclusão

O WSL 2 preencheu a lacuna entre o Windows e o Linux de forma elegante. Para desenvolvedores que precisam das duas plataformas, ele oferece o melhor dos dois mundos: a compatibilidade de software e gaming do Windows, com o poder das ferramentas Unix e do ecossistema Linux. Se você ainda não configurou seu WSL, reserve 15 minutos e faça isso hoje — sua produtividade vai agradecer.
