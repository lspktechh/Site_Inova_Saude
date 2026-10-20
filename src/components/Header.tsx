"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { asset } from "@/lib/config";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Inscrição", href: "/inscricao" },
    { label: "Banco de Talentos", href: "/banco-de-talentos" },
    { label: "Desafios", href: "/desafios" },
    { label: "Programação", href: "/programacao" },
    { label: "Regulamento", href: "/regulamento" },
    { label: "Edital", href: "/edital" },
    { label: "Envio", href: "/envio" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--surf)] border-b border-[var(--borda)] shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Marcas Oficiais */}
        <Link href="/" className="flex items-center gap-2 sm:gap-6 min-w-0">
          <img
            src={asset("/logos/up_pos.png")}
            alt="Universidade Positivo"
            className="h-6 sm:h-9 w-auto max-w-[75px] sm:max-w-none object-contain shrink-0 dark:hidden"
          />
          <img
            src={asset("/logos/up_neg.png")}
            alt="Universidade Positivo"
            className="h-6 sm:h-9 w-auto max-w-[75px] sm:max-w-none object-contain shrink-0 hidden dark:block"
          />

          <img
            src={asset("/logos/eco_cor.png")}
            alt="ecohub ecossistema de inovação"
            className="h-5 sm:h-8 w-auto max-w-[70px] sm:max-w-none object-contain shrink-0 dark:hidden"
          />
          <img
            src={asset("/logos/eco_branco.png")}
            alt="ecohub ecossistema de inovação"
            className="h-5 sm:h-8 w-auto max-w-[70px] sm:max-w-none object-contain shrink-0 hidden dark:block"
          />

          <img
            src={asset("/logos/ics_pos.png")}
            alt="Instituto Cruzeiro do Sul"
            className="h-5 sm:h-8 w-auto max-w-[70px] sm:max-w-none object-contain shrink-0 dark:hidden"
          />
          <img
            src={asset("/logos/ics_neg.png")}
            alt="Instituto Cruzeiro do Sul"
            className="h-5 sm:h-8 w-auto max-w-[70px] sm:max-w-none object-contain shrink-0 hidden dark:block"
          />
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.includes(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`py-1 transition-colors ${
                  isActive
                    ? "text-[var(--marca)] font-bold border-b-2 border-[var(--acao)]"
                    : "text-[var(--fg-2)] hover:text-[var(--fg)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Botão Menu Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[var(--fg-2)] hover:text-[var(--fg)]"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--surf)] border-b border-[var(--borda)] px-4 py-4 space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium ${
                  isActive
                    ? "text-[var(--marca)] font-bold pl-2 border-l-4 border-[var(--acao)]"
                    : "text-[var(--fg-2)] hover:text-[var(--fg)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Faixa Espectro ecohub (6 cores oficiais) */}
      <div className="espectro-band">
        <i style={{ background: "var(--e1)" }} />
        <i style={{ background: "var(--e2)" }} />
        <i style={{ background: "var(--e3)" }} />
        <i style={{ background: "var(--e4)" }} />
        <i style={{ background: "var(--e5)" }} />
        <i style={{ background: "var(--e6)" }} />
      </div>
    </header>
  );
}
