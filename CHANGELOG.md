# Change Log

All notable changes to the "Hats" extension are documented in this file.

This project adheres to [Keep a Changelog](http://keepachangelog.com/).

## [0.0.2] - 2026-06-17

### Changed

- Marketplace listing only: working badges (the shields.io Marketplace badges
  were retired, now via vsmarketplacebadges.dev), demo GIF, author info and
  publisher metadata. No functional changes.

## [0.0.1] - 2026-06-16

### Added

- Status bar button (🎓) showing the current workspace; click — or press
  `Ctrl+K Ctrl+H` (`Cmd+K Cmd+H` on macOS) — to switch profiles.
- Command Palette actions: create a profile from a native template, set and
  clear the per-workspace window color.
- Per-profile window tint (title bar, activity bar, status bar) using a named
  hat or a custom hex color, with per-element toggles. The color is stored in
  the active profile's settings, so it follows the profile when you switch.
- Re-apply of the stored color on startup.
- One-time tip on first run about applying Hats to all profiles.
- Settings: `hats.elements`, `hats.palette`, `hats.statusBar.alignment`,
  `hats.statusBar.showWorkspaceName`, `hats.statusBar.icon`, `hats.color`.
