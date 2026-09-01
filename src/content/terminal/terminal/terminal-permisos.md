---
title: Permisos de archivos
description: chmod, chown y sudo en macOS/Linux vs el modelo de ACLs de Windows — dos formas distintas de pensar quién puede hacer qué.
type: guides
order: 7
tags: [terminal, permisos, seguridad, cli]
scope: chmod / chown / sudo
related: [terminal/terminal/terminal-archivos-carpetas]
updatedAt: 2026-08-17
---

Windows y el mundo Unix (macOS/Linux) no solo tienen comandos distintos para permisos — parten de **modelos de permisos distintos**. No es una traducción 1 a 1, así que vale la pena entender cada uno por separado antes de buscar el "equivalente".

## El modelo Unix: dueño, grupo, otros

En macOS y Linux, cada archivo tiene tres niveles de permiso (lectura `r`, escritura `w`, ejecución `x`) para tres categorías: el dueño del archivo, el grupo asignado, y todos los demás (`others`). Se representan como texto (`rwxr-xr--`) o como número octal.

```bash title="macOS / Linux"
ls -l archivo.sh
# -rwxr-xr-- 1 angel staff 220 ago 17 10:00 archivo.sh
```

Cada trío de letras es un nivel: `rwx` (dueño) `r-x` (grupo) `r--` (otros).

### `chmod`: cambiar permisos

La notación octal suma los valores de cada permiso: lectura = 4, escritura = 2, ejecución = 1.

| Notación | Significado |
| --- | --- |
| `755` | dueño: rwx (7), grupo: r-x (5), otros: r-x (5) — típico para scripts/ejecutables |
| `644` | dueño: rw- (6), grupo: r-- (4), otros: r-- (4) — típico para archivos normales |

```bash title="macOS / Linux"
chmod 755 script.sh        # hacerlo ejecutable para todos, editable solo por el dueño
chmod 644 archivo.txt      # lectura para todos, escritura solo para el dueño
chmod +x script.sh         # forma relativa: agregar ejecución sin tocar el resto
```

### `chown`: cambiar el dueño

```bash title="macOS / Linux"
sudo chown angel archivo.txt          # cambiar el dueño
sudo chown angel:staff archivo.txt    # cambiar dueño y grupo
```

### `sudo`: elevar privilegios

`sudo` ejecuta un comando puntual como superusuario (`root`), pidiendo la contraseña del usuario actual (si tiene permisos de administrador). Es elevación **por comando**, no por sesión completa.

```bash title="macOS / Linux"
sudo apt install zip
sudo chown root archivo-del-sistema
```

## El modelo Windows: ACLs

Windows no tiene "dueño/grupo/otros" con lectura-escritura-ejecución como bits simples. Usa **listas de control de acceso (ACL)**: cada archivo o carpeta tiene una lista de usuarios/grupos, y a cada uno se le puede conceder o negar permisos específicos (leer, escribir, modificar, control total, ejecutar) de forma independiente. Es un modelo más granular pero también más verboso.

### Ver y modificar permisos: `icacls`

```powershell title="PowerShell"
icacls archivo.txt                              # ver permisos actuales
icacls archivo.txt /grant angel:F               # dar control total (F) a un usuario
icacls archivo.txt /grant angel:RX              # dar lectura + ejecución
icacls archivo.txt /remove angel                # quitar los permisos explícitos de un usuario
```

No hay un `chown` directo tampoco — cambiar el dueño de un archivo se hace con `takeown` o con el mismo `icacls`:

```powershell title="PowerShell"
takeown /f archivo.txt        # tomar posesión (volverse dueño)
```

### Elevar privilegios: administrador, no `sudo`

Windows no tiene un equivalente de `sudo` por comando (hasta versiones recientes, donde existe un `sudo` experimental opcional). La forma tradicional es **elevar toda la sesión**: abrir la terminal completa "Como administrador", o relanzar un proceso puntual elevado.

```powershell title="PowerShell"
# Relanzar el proceso actual con privilegios elevados
Start-Process powershell -Verb RunAs

# Relanzar un comando específico elevado
Start-Process -FilePath "instalador.exe" -Verb RunAs
```

En la práctica, para tareas administrativas cotidianas se suele abrir directamente "Windows Terminal (Administrador)" o "PowerShell (Administrador)" desde el menú de inicio, en vez de elevar comando por comando.

## La diferencia de fondo

| | macOS / Linux | Windows |
| --- | --- | --- |
| Unidad de permiso | dueño / grupo / otros × (r, w, x) | ACL por usuario o grupo, permisos granulares |
| Cambiar permisos | `chmod` | `icacls` |
| Cambiar dueño | `chown` | `takeown` / `icacls` |
| Elevar privilegios | `sudo` (por comando) | Ejecutar como administrador (por sesión o proceso) |

## Consideraciones

- No existe una tabla de conversión exacta entre `chmod 755` y una ACL de Windows — son modelos distintos, no la misma idea con otro nombre. Al portar scripts entre sistemas, los permisos hay que replantearlos, no traducirlos línea por línea.
- WSL (Windows Subsystem for Linux) sí expone `chmod`/`chown`/`sudo` reales dentro de su filesystem Linux — pero esos permisos son internos a WSL y no siempre se reflejan igual si se accede al mismo archivo desde el lado Windows (`\\wsl$\...`).
- En macOS/Linux, sin permiso de ejecución (`x`) un script no corre aunque tenga permiso de lectura — es el error clásico `Permission denied` después de `./script.sh`, que se arregla con `chmod +x script.sh`.
- `sudo` eleva solo el comando que sigue; para varios comandos seguidos con privilegios hay que anteponer `sudo` a cada uno, o usar `sudo -i` para abrir un shell con privilegios (usarlo con cuidado, es fácil de olvidar que sigue activo).
