# Company workflow design prototype

Date: 2026-11-12
Type: added
Scope: landing

[中文](./2026-11-12-company-workflow-prototype.zh.md)

The website has a Company page at `/company/`, linked from its navigation. It is an interactive design prototype with sample data, available in English and Chinese with light and dark themes.

The prototype builds on the current company interface: the organization sidebar, overview inbox, five-column ticket board and in-place ticket dialog. It reuses the application's shell, navigation, controls and Frost theme. The overview puts human review first; the personal agent and long-term goal have their own entries. Channels and desks keep their positions and start folded. Muted management entries are outside this prototype's scope.

After building the landing package, `node packages/landing/scripts/company-preview.mjs` exports the same page to `packages/landing/dist/company-preview.html` for offline review. The HTML includes its scripts, styles and logo, including the embedded application. The app theme is isolated from the website's styles. Theme changes preserve the demo's state; refreshing or changing language resets it.

## Workflow

Explore a long-term goal through its task inbox, personal agent and independent task sessions. Record a task, add discussion notes, and mark notices as read, later or archived.

Simulated verification demonstrates automatic merge after a pass, repair after failure, and human review when a concern is raised. A later automated pass keeps the human-review requirement. All actions remain within the prototype; no agent runs or real merges occur.
