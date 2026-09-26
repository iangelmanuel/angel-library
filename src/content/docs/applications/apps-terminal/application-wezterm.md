---
title: WezTerm — terminal y multiplexor configurable con Lua
description: Emulador de terminal multiplataforma acelerado por GPU, con pestañas, paneles, multiplexor propio, cliente SSH y configuración en Lua que se recarga en caliente.
tags: [wezterm, terminal, lua, multiplexor, ssh, gpu, windows, macos, linux]
sidebar:
  order: 2
draft: false
resourceCategory: Sitio oficial
website: https://wezterm.org/
github: https://github.com/wezterm/wezterm
technologies:
  - applications/apps-terminal/application-warp
  - applications/apps-orchestration/herdr
  - terminal/terminal/terminal-fundamentals-terminology
note: Proyecto de código abierto (licencia MIT) mantenido por Wez Furlong en su tiempo libre. Corre en Windows 10+, macOS, Linux, FreeBSD y NetBSD.
updatedAt: 2026-09-26
---

**WezTerm** es un emulador de terminal y multiplexor escrito en Rust. Dibuja con la GPU, trae pestañas, paneles y ventanas sin depender de tmux, y se configura con un archivo **Lua** que se recarga al guardarlo. La misma configuración funciona en los tres sistemas operativos.

Como con cualquier terminal, WezTerm solo muestra la sesión: los comandos los ejecuta el shell (PowerShell, bash, zsh, fish…).

## Qué trae

| Área | Detalle |
| --- | --- |
| Multiplexor | Pestañas, paneles divididos y ventanas con atajos configurables; sesiones locales y remotas con scroll y ratón nativos |
| Dominios | Conexión a multiplexores por socket Unix o SSH/TLS sobre TCP, además de dominios WSL en Windows |
| Cliente SSH | `wezterm ssh usuario@host` abre la sesión remota en pestañas nativas |
| Puerto serie | Conexión a placas embebidas o Arduino (`wezterm serial`) |
| Texto | Ligaduras, emoji a color, fuentes de respaldo, true color y esquemas de color dinámicos |
| Imágenes | Protocolo de imágenes de iTerm2, protocolo gráfico de Kitty y Sixel (experimental) |
| Búsqueda | Scrollback con búsqueda (`Ctrl+Shift+F`) y modo copia |
| Enlaces | Hipervínculos en la salida y reglas propias para convertir texto en enlaces |
| Configuración | Archivo Lua con recarga en caliente |

## Instalación

```powershell
# Windows
winget install wez.wezterm
# o: scoop bucket add extras; scoop install wezterm
# o: choco install wezterm -y
```

```bash
# macOS (Homebrew)
brew install --cask wezterm
# versión nightly
brew install --cask wezterm@nightly

# Linux: Flatpak
flatpak install flathub org.wezfurlong.wezterm

# Debian/Ubuntu: repositorio APT oficial
curl -fsSL https://apt.fury.io/wez/gpg.key | sudo gpg --yes --dearmor -o /usr/share/keyrings/wezterm-fury.gpg
echo 'deb [signed-by=/usr/share/keyrings/wezterm-fury.gpg] https://apt.fury.io/wez/ * *' | sudo tee /etc/apt/sources.list.d/wezterm.list
sudo chmod 644 /usr/share/keyrings/wezterm-fury.gpg
sudo apt update && sudo apt install wezterm
```

También hay AppImage, paquetes `.deb`/`.rpm`, MacPorts y compilación desde código. La [página de instalación](https://wezterm.org/installation.html) enlaza cada sistema. Flatpak corre en un sandbox, así que algunas funciones (acceso a binarios del sistema, por ejemplo) pueden comportarse distinto.

## Configuración con Lua

WezTerm busca `~/.wezterm.lua` (o `$XDG_CONFIG_HOME/wezterm/wezterm.lua`). El archivo devuelve una tabla de configuración:

```lua
-- ~/.wezterm.lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.font = wezterm.font 'JetBrains Mono'
config.font_size = 13
config.color_scheme = 'Tokyo Night'
config.hide_tab_bar_if_only_one_tab = true
config.window_decorations = 'RESIZE'

-- En Windows, abrir PowerShell 7 por defecto
if wezterm.target_triple:find('windows') then
  config.default_prog = { 'pwsh.exe', '-NoLogo' }
end

-- Tecla líder al estilo tmux: Ctrl+A y luego otra tecla
config.leader = { key = 'a', mods = 'CTRL', timeout_milliseconds = 1000 }
config.keys = {
  { key = '|', mods = 'LEADER|SHIFT', action = wezterm.action.SplitHorizontal { domain = 'CurrentPaneDomain' } },
  { key = '-', mods = 'LEADER', action = wezterm.action.SplitVertical { domain = 'CurrentPaneDomain' } },
  { key = 'h', mods = 'LEADER', action = wezterm.action.ActivatePaneDirection 'Left' },
  { key = 'l', mods = 'LEADER', action = wezterm.action.ActivatePaneDirection 'Right' },
}

return config
```

- `config_builder()` avisa de claves mal escritas en lugar de ignorarlas.
- Al guardar, WezTerm recarga la configuración; si hay un error de Lua lo muestra en una ventana sin cerrar la sesión.
- `wezterm.on(...)` permite reaccionar a eventos (formatear el título de la pestaña, la barra de estado, etc.).

## Multiplexor y dominios

Un **dominio** es un lugar donde viven pestañas y paneles. El local es el predeterminado; se pueden declarar otros:

```lua
config.unix_domains = { { name = 'unix' } }
config.ssh_domains = {
  { name = 'servidor', remote_address = 'mi-servidor.example.com', username = 'deploy' },
}
```

```bash
wezterm connect unix       # se conecta al multiplexor local; las pestañas sobreviven al cerrar la GUI
wezterm connect servidor   # abre un multiplexor en el host remoto por SSH
```

Con un dominio de multiplexor, cerrar la ventana no mata los procesos: vuelves a conectar y siguen ahí, parecido a tmux pero con la interfaz de WezTerm.

## CLI útil

```bash
wezterm ls-fonts --list-system   # fuentes que ve WezTerm
wezterm show-keys --lua          # atajos activos, en formato Lua
wezterm cli split-pane --right   # dividir el panel actual desde un script
wezterm cli list                 # listar ventanas, pestañas y paneles
wezterm imgcat foto.png          # mostrar una imagen en la terminal
```

`wezterm cli` habla con la instancia en ejecución, así que un script (o un agente) puede abrir paneles y enviarles texto con `wezterm cli send-text`.

## Cuándo elegirlo

- quieres **la misma terminal y los mismos atajos** en Windows, macOS y Linux;
- prefieres configurar con código versionable en lugar de menús;
- necesitas paneles y sesiones persistentes sin instalar tmux (especialmente en Windows);
- trabajas con imágenes en terminal o con agentes que se benefician de `Shift+Enter` distinto de `Enter`.

Si buscas ayudas de IA integradas y bloques de comandos, [Warp](/applications/apps-terminal/application-warp) va en esa dirección. Si lo que necesitas es vigilar muchos agentes a la vez, [Herdr](/applications/apps-orchestration/herdr) funciona dentro de WezTerm.

## Fuentes

- [Documentación oficial](https://wezterm.org/) · [Funcionalidades](https://wezterm.org/features.html)
- [Instalación](https://wezterm.org/installation.html) — [Windows](https://wezterm.org/install/windows.html), [macOS](https://wezterm.org/install/macos.html), [Linux](https://wezterm.org/install/linux.html)
- [Referencia de configuración](https://wezterm.org/config/files.html) · [Multiplexado](https://wezterm.org/multiplexing.html)
- [Repositorio](https://github.com/wezterm/wezterm)
