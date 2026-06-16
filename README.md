# Hats

Wear the right hat for each project. **Hats** puts a button in your status bar
to switch VSCode profiles and tint the window per workspace — so a Java project
looks (and loads) different from a Python one.

VSCode profiles already keep each context lightweight by loading only the
extensions you need. Hats makes them faster to reach and gives every workspace
its own color.

## Features

- **Status bar button** (bottom-right by default) showing the current workspace,
  one click away from everything below.
- **Switch profile** — opens the native profile switcher.
- **New profile from template** — jump straight into VSCode's built-in
  templates (Python, Java General, Java Spring, Node.js, Angular, …).
- **Window color per workspace** — tint the title bar, activity bar and status
  bar with a named hat or a custom hex color. Each element can be toggled.

## Usage

- **Click the 🎓 button** in the status bar → switch profile right away (native
  picker).
- Everything else lives in the **Command Palette** (`Ctrl/Cmd+Shift+P`) under
  `Hats:`
  - *Hats: New Profile from Template* (Python, Java General, Java Spring, …)
  - *Hats: Set Window Color* (choose a hat or enter a `#rrggbb` hex)
  - *Hats: Clear Window Color*

Colors are written to the workspace's `.vscode/settings.json`
(`workbench.colorCustomizations`) and re-applied on startup.

## Notes about profiles

- **Keep Hats in every profile.** Profiles each have their own extensions, so a
  new profile will not include Hats until you run **Apply Extension to all
  Profiles** from the Extensions view gear menu. There is no API to do this
  automatically; Hats shows a one-time tip on first run.
- **Reload after switching.** When you switch profiles, VSCode reassociates the
  workspace and asks you to reload so the new profile's extensions load. This is
  native VSCode behavior and cannot be suppressed by an extension.

## Settings

| Setting | Description |
| --- | --- |
| `hats.elements` | Which elements to tint (`titleBar`, `activityBar`, `statusBar`). |
| `hats.palette` | Your named hats (`{ name, color }`). Falls back to a built-in palette. |
| `hats.statusBar.alignment` | `left` or `right` (default `right`). |
| `hats.statusBar.showWorkspaceName` | Show the workspace name on the button. |
| `hats.statusBar.icon` | Codicon name for the button (e.g. `mortar-board`, `briefcase`, `versions`). Empty for none. |
| `hats.color` | The applied color (managed by Hats). |

## Design notes

Hats deliberately leaves the **theme** to the profile and only manages the
window **accent color**, so the two never fight.

The button shows the **workspace name** rather than the active profile name
because VSCode does not yet expose a public API to read or change the active
profile. Track these upstream requests:
[microsoft/vscode#226355](https://github.com/microsoft/vscode/issues/226355)
and [#192852](https://github.com/microsoft/vscode/issues/192852). Once that API
ships, Hats can show the real profile name.
