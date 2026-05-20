---
title: "Segurança no Ubuntu: 10 Dicas Essenciais para Proteger seu Sistema"
date: "2025-04-22"
excerpt: "Linux é seguro por padrão, mas seguro não é sinônimo de inviolável. Confira as práticas essenciais para blindar seu Ubuntu contra ameaças reais."
category: "Segurança"
tags: ["segurança", "ubuntu", "linux", "firewall", "criptografia", "hardening"]
coverImage: "/posts/ubuntu-seguranca.jpg"
readTime: "6 min"
featured: false
---

## Linux é seguro, mas não inviolável

Existe um mito perigoso na comunidade Linux de que "o sistema é tão seguro que não precisa de proteção adicional". Embora a arquitetura Unix realmente ofereça uma base sólida de segurança, a realidade é que **configurações padrão**, **usuários descuidados** e **vulnerabilidades de software** podem comprometer até mesmo um sistema Linux.

Se você usa Ubuntu como seu sistema principal — seja para trabalho, desenvolvimento ou uso pessoal — seguir estas práticas de segurança não é opcional, é necessário.

---

## 1. Mantenha o sistema atualizado

Parece óbvio, mas a maioria dos incidentes de segurança em Linux explora **vulnerabilidades já corrigidas** em versões mais recentes. Configure atualizações automáticas:

```bash
# Instalar o pacote de atualizações automáticas
sudo apt install unattended-upgrades

# Configurar
sudo dpkg-reconfigure -plow unattended-upgrades
```

Isso habilita a instalação automática de atualizações de segurança. Para maior controle, edite `/etc/apt/apt.conf.d/50unattended-upgrades` e defina quais repositórios devem ser atualizados automaticamente.

Verifique manualmente regularmente:

```bash
# Atualizar lista de pacotes
sudo apt update

# Aplicar atualizações
sudo apt upgrade -y

# Verificar pacotes com atualizações de segurança pendentes
apt list --upgradable 2>/dev/null | grep -i security
```

---

## 2. Configure o UFW (Firewall)

O **UFW** (Uncomplicated Firewall) é uma interface simplificada para o `iptables` que vem pré-instalado no Ubuntu. Por padrão, ele vem **desabilitado** — o que significa que todas as portas de rede estão abertas.

```bash
# Habilitar UFW e bloquear tudo por padrão
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permitir SSH (importante antes de habilitar!)
sudo ufw allow ssh

# Permitir tráfego HTTP/HTTPS se for servidor web
sudo ufw allow http
sudo ufw allow https

# Habilitar o firewall
sudo ufw enable

# Verificar status e regras
sudo ufw status verbose
```

**Atenção:** Se você está conectado via SSH remoto, sempre permita SSH **antes** de habilitar o firewall, caso contrário será bloqueado.

---

## 3. Use autenticação de dois fatores (2FA)

Proteja seu login com **Google Authenticator** ou **LibreOTP**:

```bash
# Instalar o módulo PAM para Google Authenticator
sudo apt install libpam-google-authenticator

# Configurar para seu usuário
google-authenticator
```

Responda às perguntas (recomendamos `Yes` para todas). Depois, edite o arquivo PAM do SSH:

```bash
sudo nano /etc/pam.d/sshd
```

Adicione a linha:

```
auth required pam_google_authenticator.so nullok
```

E certifique-se de que o `/etc/ssh/sshd_config` tem:

```
ChallengeResponseAuthentication yes
```

Reinicie o SSH:

```bash
sudo systemctl restart sshd
```

Agora, além da senha, será necessário informar o código gerado no seu celular para fazer login.

---

## 4. Desabilite o login do root

O root nunca deve fazer login diretamente. Use `sudo` para comandos administrativos:

```bash
# Verificar se login do root está habilitado
sudo grep "^root:" /etc/passwd

# Bloquear a conta root
sudo passwd -l root

# Verificar se login SSH do root está desabilitado
sudo grep "PermitRootLogin" /etc/ssh/sshd_config
# Deve ser: PermitRootLogin no
```

---

## 5. Configure o fail2ban

O **fail2ban** monitora logs de autenticação e bloqueia automaticamente IPs que tentam múltiplos logins falhados — essencial contra ataques de força bruta:

```bash
# Instalar
sudo apt install fail2ban

# Criar configuração local (não edite o arquivo padrão)
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Editar configuração
sudo nano /etc/fail2ban/jail.local
```

Configure as proteções:

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
```

Habilite e inicie:

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Verificar status
sudo fail2ban-client status sshd
```

---

## 6. Criptografe seus dados sensíveis

Use **LUKS** para criptografar partições e pendrives:

```bash
# Criptografar um pendrive (SUBSTITUA sdb pelo dispositivo correto!)
sudo cryptsetup luksFormat /dev/sdb
sudo cryptsetup open /dev/sdb pendrive_seguro
sudo mkfs.ext4 /dev/mapper/pendrive_seguro
sudo mount /dev/mapper/pendrive_seguro /mnt/pendrive

# Para desmontar e fechar
sudo umount /mnt/pendrive
sudo cryptsetup close pendrive_seguro
```

Para diretórios individuais, use **GPG** para criptografar arquivos:

```bash
# Criptografar um arquivo
gpg -c arquivo_sensivel.txt

# Descriptografar
gpg -d arquivo_sensivel.txt.gpg > arquivo_sensivel.txt
```

---

## 7. Audite serviços e portas abertas

Saiba exatamente o que está rodando e escutando no seu sistema:

```bash
# Ver todas as portas abertas
sudo ss -tulnp

# Ver serviços ativos
systemctl list-units --type=service --state=running

# Listar todos os serviços habilitados na inicialização
systemctl list-unit-files --state=enabled
```

Desabilite serviços que não usa:

```bash
sudo systemctl disable --now nomedoservico
```

---

## 8. Use senhas fortes e um gerenciador

Senhas como `123456` ou `admin` ainda são surpreendentemente comuns. Use um gerenciador de senhas como **Bitwarden** (open-source) ou **KeePassXC**:

```bash
# Instalar Bitwarden CLI
sudo snap install bw

# Ou instalar KeePassXC
sudo apt install keepassxc
```

Além disso, certifique-se de ter uma senha forte para seu usuário:

```bash
# Alterar senha com verificação de força
passwd
```

---

## 9. Habilite AppArmor

O **AppArmor** é um sistema de controle de acesso baseado em perfis que restringe o que cada aplicativo pode fazer:

```bash
# Verificar status
sudo aa-status

# Verificar perfis ativos
sudo apparmor_status

# Listar perfis disponíveis
ls /etc/apparmor.d/
```

O Ubuntu vem com perfis pré-configurados para vários serviços. Mantenha o AppArmor habilitado — ele adiciona uma camada extra de proteção sem impacto perceptível no uso diário.

---

## 10. Faça backups regulares

Segurança não é apenas sobre prevenir ataques — é sobre se recuperar deles. Configure backups automatizados com **Timeshift** para snapshots do sistema e **BorgBackup** para dados:

```bash
# Timeshift (snapshots do sistema)
sudo apt install timeshift

# BorgBackup (backup incremental e criptografado)
sudo apt install borgbackup
```

A regra **3-2-1** continua válida: mantenha **3** cópias dos seus dados, em **2** tipos de mídia diferentes, com **1** cópia fora do local.

---

## Conclusão

Segurança é um processo contínuo, não um estado. Estas 10 dicas cobrem o essencial, mas a prática mais importante é o **senso de vigilância** — não instale pacotes de repositórios desconhecidos, não execute scripts aleatórios da internet com `sudo`, e mantenha-se informado sobre vulnerabilidades que afetam o software que você usa. Um sistema Linux bem configurado é uma fortaleza digital.
