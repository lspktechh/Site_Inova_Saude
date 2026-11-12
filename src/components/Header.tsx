"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShieldCheck, Sparkles, UploadCloud, Award } from "lucide-react";
import { asset } from "@/lib/config";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Páginas institucionais organizadas por relevância na reta final do evento
  const navItems = [
    { label: "Avaliação & Certificado", href: "/avaliacao", icon: Award },
    { label: "Programação", href: "/programacao" },
    { label: "Desafios", href: "/desafios" },
    { label: "Banco de Talentos", href: "/banco-de-talentos" },
    { label: "Regulamento", href: "/regulamento" },
    { label: "Edital", href: "/edital" },
    { label: "Envio", href: "/envio", icon: UploadCloud },
  ];

  const isTeamAreaActive = pathname === "/editar-inscricao";

  return (
    <header className="sticky top-0 z-40 bg-[var(--surf)] border-b border-[var(--borda)] shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Marcas Oficiais */}
        <Link href="/" className="flex items-center gap-2 sm:gap-5 min-w-0 shrink-0">
          <img
            src={asset("/logos/up_pos.png")}
            alt="Universidade Positivo"
            className="h-6 sm:h-8 w-auto max-w-[75px] sm:max-w-none object-contain shrink-0 dark:hidden"
          />
          <img
            src={asset("/logos/up_neg.png")}
            alt="Universidade Positivo"
            className="h-6 sm:h-8 w-auto max-w-[75px] sm:max-w-none object-contain shrink-0 hidden dark:block"
          />

          <img
            src={asset("/logos/eco_cor.png")}
            alt="ecohub ecossistema de inovação"
            className="h-5 sm:h-7 w-auto max-w-[70px] sm:max-w-none object-contain shrink-0 dark:hidden"
          />
          <img
            src={asset("/logos/eco_branco.png")}
            alt="ecohub ecossistema de inovação"
            className="h-5 sm:h-7 w-auto max-w-[70px] sm:max-w-none object-contain shrink-0 hidden dark:block"
          />

          <img
            src={asset("/logos/ics_pos.png")}
            alt="Instituto Cruzeiro do Sul"
            className="h-5 sm:h-7 w-auto max-w-[70px] sm:max-w-none object-contain shrink-0 dark:hidden"
          />
          <img
            src={asset("/logos/ics_neg.png")}
            alt="Instituto Cruzeiro do Sul"
            className="h-5 sm:h-7 w-auto max-w-[70px] sm:max-w-none object-contain shrink-0 hidden dark:block"
          />
        </Link>

        {/* Navegação Desktop Central */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`py-1 inline-flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? "text-[var(--marca)] font-bold border-b-2 border-[var(--acao)]"
                    : "text-[var(--fg-2)] hover:text-[var(--fg)]"
                }`}
              >
                {Icon && <Icon size={14} className="opacity-70" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Ações da Direita no Desktop: Botão em Destaque "Área da Equipe" */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/editar-inscricao"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 ${
              isTeamAreaActive
                ? "bg-[var(--marca)] text-white ring-2 ring-[var(--acento)] shadow-md"
                : "bg-gradient-to-r from-[var(--marca)] to-[var(--marca-2)] text-white hover:brightness-110 hover:shadow-md"
            }`}
          >
            <ShieldCheck size={16} className="text-[var(--acento)] shrink-0" />
            <span>Área da Equipe</span>
          </Link>
        </div>

        {/* Botão Menu Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[var(--fg-2)] hover:text-[var(--fg)] focus:outline-hidden"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--surf)] border-b border-[var(--borda)] px-4 py-4 space-y-3 shadow-lg">
          {/* Botão Em Destaque no Topo do Menu Mobile */}
          <Link
            href="/editar-inscricao"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-[var(--marca)] to-[var(--marca-2)] text-white shadow-md active:scale-98 transition-all"
          >
            <ShieldCheck size={18} className="text-[var(--acento)]" />
            <span>Área da Equipe · Gerenciar Projeto</span>
          </Link>

          <div className="pt-2 border-t border-[var(--borda)] space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--bg)] text-[var(--marca)] font-bold border-l-4 border-[var(--acao)]"
                      : "text-[var(--fg-2)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
                  }`}
                >
                  {Icon && <Icon size={16} className="opacity-70" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
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
