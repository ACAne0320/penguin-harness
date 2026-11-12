/**
 * Export the actual /company page as a self-contained HTML prototype for design review.
 * Run after the landing build: node packages/landing/scripts/company-preview.mjs.
 * The source remains pages/company.tsx; this output is generated, never edited by hand.
 */
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "dist/.vite/manifest.json"), "utf8"));
function stylesFor(...entries) {
  const files = new Set();
  const visited = new Set();
  function visit(key) {
    if (visited.has(key)) return;
    visited.add(key);
    const entry = manifest[key];
    if (!entry) throw new Error(`Missing built entry: ${key}`);
    for (const dependency of entry.imports ?? []) visit(dependency);
    for (const css of entry.css ?? []) files.add(css);
  }
  entries.forEach(visit);
  return [...files].map((file) => readFileSync(join(root, "dist", file), "utf8")).join("\n");
}
const css = stylesFor("index.html", "src/pages/company.tsx");
const frameResult = await build({
  entryPoints: [join(root, "src/company-frame.tsx")],
  bundle: true,
  write: false,
  minify: true,
  format: "iife",
  platform: "browser",
  jsx: "automatic",
  loader: { ".css": "empty" },
  define: { "process.env.NODE_ENV": '"production"' },
});
const frameJs = frameResult.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const frameDocument = `<!doctype html><html lang="__COMPANY_LANG__" data-theme="modern" data-theme-base="modern" data-company-lang="__COMPANY_LANG__" data-company-mode="__COMPANY_MODE__"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PenguinHarness</title><style>${stylesFor("company-workbench.html")}</style></head><body><div id="root"></div><script>${frameJs}</script></body></html>`;
const logo = `data:image/svg+xml;base64,${readFileSync(join(root, "public", "penguin-logo.svg")).toString("base64")}`;
const entry = `
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { SiteLocaleProvider, SiteLocaleScope, SiteThemeProvider, SiteHeader, SiteFooter,
  SiteLanguageMenu, SiteThemeToggle, SiteNavLinks, siteNavLinks, useSiteLocale,
  useSiteTheme, useEscapeToClose, Fold } from "@prismshadow/penguin-ui/site";
import { S, zh, setActiveStrings } from "./src/lib/strings";
import { en } from "./src/lib/strings-en";
import { CompanyPage } from "./src/pages/company";
const FRAME_DOCUMENT = ${JSON.stringify(frameDocument)};
function Preview() {
  const {lang, locale, setLang} = useSiteLocale();
  const {mode, setMode} = useSiteTheme();
  const [open, setOpen] = useState(false);
  useEscapeToClose(open, () => setOpen(false));
  const links = siteNavLinks({siteRoot: "https://penguin.ooo/", labels: S.nav, current: null});
  links.splice(1, 0, {id: "company", href: "#", label: S.company.name, active: true});
  return <><SiteHeader name={S.siteName} logo="penguin-logo.svg" home={links[0]} links={links}
    actions={<><SiteLanguageMenu value={lang} onChange={setLang} labels={S.lang}/><SiteThemeToggle mode={mode} onChange={setMode} labels={S.theme}/></>}
    menu={{open, onToggle: () => setOpen(!open), label: open ? S.nav.closeMenu : S.nav.openMenu, hiddenClass: "lg:hidden"}}>
      <Fold open={open} className="site-ui-fold lg:hidden"><SiteNavLinks links={links} mobile onNavigate={() => setOpen(false)}/></Fold>
    </SiteHeader><main><CompanyPage frameDocument={FRAME_DOCUMENT}/></main><SiteFooter
      brand={{name: S.siteName, logo: "penguin-logo.svg", tagline: S.footer.tagline}}
      columns={[{title: S.footer.product, links: links.map(({render, ...link}) => link)}]}
      copyright={S.footer.copyright}/></>;
}
createRoot(document.getElementById("root")).render(
  <SiteLocaleProvider onLocale={locale => setActiveStrings(locale === "en" ? en : zh)}>
    <SiteThemeProvider><SiteLocaleScope><Preview/></SiteLocaleScope></SiteThemeProvider>
  </SiteLocaleProvider>);
`;
const result = await build({
  stdin: { contents: entry, resolveDir: root, sourcefile: "company-preview.tsx", loader: "tsx" },
  bundle: true,
  write: false,
  minify: true,
  format: "iife",
  platform: "browser",
  jsx: "automatic",
  loader: { ".css": "empty" },
  define: { "import.meta.env.BASE_URL": '""', "process.env.NODE_ENV": '"production"' },
});
const js = result.outputFiles[0].text
  .replaceAll("penguin-logo.svg", logo)
  .replace(/<\/script/gi, "<\\/script");
const html = `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PenguinHarness</title><meta name="description" content="PenguinHarness"><style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`;
const out = join(root, "dist", "company-preview.html");
writeFileSync(out, html);
console.log(out);
