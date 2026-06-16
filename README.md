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

1. Click the **🎓 Hats** button in the status bar (or run `Hats: Open Menu`).
2. Pick an action:
   - *Switch profile…*
   - *New profile from template…*
   - *Set window color…* (choose a hat or enter a `#rrggbb` hex)
   - *Clear window color*

Colors are written to the workspace's `.vscode/settings.json`
(`workbench.colorCustomizations`) and re-applied on startup.

## Settings

| Setting | Description |
| --- | --- |
| `hats.elements` | Which elements to tint (`titleBar`, `activityBar`, `statusBar`). |
| `hats.palette` | Your named hats (`{ name, color }`). Falls back to a built-in palette. |
| `hats.statusBar.alignment` | `left` or `right` (default `right`). |
| `hats.statusBar.showWorkspaceName` | Show the workspace name on the button. |
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
