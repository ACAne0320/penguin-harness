/** The prototype's own document keeps the app theme separate from the public site's palette. */
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { CompanyWorkbench } from "./pages/company-workbench";
import { setActiveStrings, zh } from "./lib/strings";
import { en } from "./lib/strings-en";
import "./pages/company-workbench.css";

const params = new URLSearchParams(location.search);
// The offline HTML seeds these attributes; the website uses the frame URL.
const lang = document.documentElement.dataset.companyLang ?? params.get("lang") ?? "zh";
const mode = document.documentElement.dataset.companyMode ?? params.get("mode") ?? "light";
document.documentElement.lang = lang;
document.documentElement.classList.toggle("dark", mode === "dark");
setActiveStrings(lang === "en" ? en : zh);
function CompanyFrame() {
  const [, refresh] = useState(0);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      const data = event.data;
      if (event.source !== window.parent || data?.type !== "company-prefs") return;
      if (
        (data.lang !== "zh" && data.lang !== "en") ||
        (data.mode !== "light" && data.mode !== "dark")
      )
        return;
      document.documentElement.lang = data.lang;
      document.documentElement.classList.toggle("dark", data.mode === "dark");
      setActiveStrings(data.lang === "en" ? en : zh);
      refresh((n) => n + 1);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  return <CompanyWorkbench />;
}
createRoot(document.getElementById("root")!).render(<CompanyFrame />);
