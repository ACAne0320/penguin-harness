/** /company is the public design spec. The embedded app reuses the current company UI. */
import {
  ArrowRightIcon,
  SiteGlyph,
  SitePill,
  useSiteLocale,
  useSiteTheme,
} from "@prismshadow/penguin-ui/site";
import { useEffect, useRef, useState } from "react";
import { S } from "../lib/strings";
import { useDocumentMeta } from "../lib/document-meta";
import "./company.css";

export function CompanyPage({ frameDocument }: { frameDocument?: string } = {}) {
  const c = S.company;
  const { locale } = useSiteLocale();
  const { dark } = useSiteTheme();
  const frame = useRef<HTMLIFrameElement>(null);
  const [initialPrefs] = useState({ locale, dark });
  const syncPrefs = () =>
    frame.current?.contentWindow?.postMessage(
      { type: "company-prefs", lang: locale, mode: dark ? "dark" : "light" },
      "*",
    );
  useEffect(syncPrefs, [locale, dark]);
  useDocumentMeta(c.title, c.description);
  return (
    <div className="company-page">
      <section className="company-hero">
        <div>
          <div className="company-page-name">
            <span>{c.name}</span>
            <SitePill tone="neutral">{c.prototype}</SitePill>
          </div>
          <h1>{c.headline}</h1>
          <p className="company-intro">{c.intro}</p>
          <div className="company-actions">
            <a className="company-button company-button-primary" href="#company-workbench">
              {c.openDemo}
              <ArrowRightIcon />
            </a>
            <a className="company-text-link" href="#company-verification">
              {c.readRules}
            </a>
          </div>
        </div>
        <aside className="company-hero-rule">
          <SiteGlyph name="check" />
          <h2>{c.coreTitle}</h2>
          <p>{c.coreText}</p>
        </aside>
      </section>

      <ol className="company-flow" aria-label={c.title}>
        {c.steps.map((step, i) => (
          <li key={step}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
            {i < c.steps.length - 1 && <ArrowRightIcon />}
          </li>
        ))}
      </ol>

      <section
        id="company-workbench"
        className="company-workbench section-anchor"
        aria-labelledby="company-workbench-title"
      >
        <div className="company-workbench-heading">
          <div>
            <h2 id="company-workbench-title">{c.demoTitle}</h2>
            <p>{c.demoNote}</p>
          </div>
        </div>
        <iframe
          ref={frame}
          onLoad={syncPrefs}
          title={c.demoTitle}
          className="company-frame"
          src={
            frameDocument
              ? undefined
              : `${import.meta.env.BASE_URL}company-workbench.html?lang=${initialPrefs.locale}&mode=${initialPrefs.dark ? "dark" : "light"}`
          }
          srcDoc={frameDocument
            ?.replaceAll("__COMPANY_LANG__", initialPrefs.locale)
            .replaceAll("__COMPANY_MODE__", initialPrefs.dark ? "dark" : "light")}
        />
        <p className="company-baseline-note">{c.baselineNote}</p>
      </section>

      <section id="company-verification" className="company-rules section-anchor">
        <div>
          <h2>{c.rulesTitle}</h2>
          <p>{c.rulesIntro}</p>
        </div>
        <ol>
          {c.rules.map((rule, i) => (
            <li key={rule.title}>
              <span className="company-step-number">{String(i + 1).padStart(2, "0")}</span>
              <h3>{rule.title}</h3>
              <p>{rule.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="company-context">
        <h2>{c.contextTitle}</h2>
        <p>{c.contextText}</p>
      </section>
    </div>
  );
}
