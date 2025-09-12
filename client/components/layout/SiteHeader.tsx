import { Link, NavLink } from "react-router-dom";
import useInstallPrompt from "@/hooks/useInstallPrompt";
import { useEffect, useState } from "react";
import { loadPlan } from "@/lib/planner";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-foreground/80 hover:text-foreground hover:bg-secondary"
  }`;

export function SiteHeader() {
  const { canInstall, showPrompt } = useInstallPrompt();
  const [hasPlan, setHasPlan] = useState<boolean>(() => !!loadPlan());

  useEffect(() => {
    const onStorage = () => setHasPlan(!!loadPlan());
    window.addEventListener("storage", onStorage);
    try {
      const v = localStorage.getItem("smartmeal.pref.high_contrast");
      if (v === "1") document.body.classList.add("hc");
    } catch {}
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const prefetch = (path: string) => {
    if (path === "/planner") import("@/pages/Planner");
    if (path === "/grocery") import("@/pages/Grocery");
    if (path === "/progress") import("@/pages/Progress");
    if (path === "/recipes") import("@/pages/Recipes");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/smartmeal.png"
            alt=""
            className="size-10 rounded-md bg-gradient-to-br from-primary to-accent animate-glow"
          />
          <span className="text-lg font-extrabold tracking-tight">
            SmartMeal
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink
            to="/planner"
            className={navLinkClass}
            onMouseEnter={() => prefetch("/planner")}
          >
            Planner
          </NavLink>
          <NavLink
            to="/recipes"
            className={navLinkClass}
            onMouseEnter={() => prefetch("/recipes")}
          >
            Recipes
          </NavLink>
          <NavLink
            to="/grocery"
            className={navLinkClass}
            onMouseEnter={() => prefetch("/grocery")}
          >
            Grocery
          </NavLink>
          <NavLink
            to="/progress"
            className={navLinkClass}
            onMouseEnter={() => prefetch("/progress")}
          >
            Progress
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const b = document.body.classList;
              if (b.contains("hc")) b.remove("hc");
              else b.add("hc");
              try {
                localStorage.setItem(
                  "smartmeal.pref.high_contrast",
                  b.contains("hc") ? "1" : "0",
                );
              } catch {}
            }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-sm font-medium hover:bg-secondary"
            title="Toggle high-contrast"
          >
            HC
          </button>
          {canInstall && (
            <button
              onClick={showPrompt}
              className="hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              Install App
            </button>
          )}
          {!hasPlan && (
            <Link
              to="/planner"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
              onMouseEnter={() => prefetch("/planner")}
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
