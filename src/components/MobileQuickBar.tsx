"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export function MobileQuickBar() {
  const pathname = usePathname();

  // Não exibe a barra se o usuário já estiver na tela do formulário de inscrição
  if (pathname === "/inscricao") return null;

  return (
    <aside
      aria-label="Ação rápida de inscrição"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-[var(--surf)]/90 backdrop-blur-md border-t border-[var(--borda)] shadow-[0_-8px_25px_rgba(0,0,0,0.12)] transition-transform duration-300"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--acao)] animate-ping" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--acao)]">
              Inscrições Abertas
            </span>
          </div>
          <span className="text-xs font-bold text-[var(--fg)]">
            Encerram em 23/10
          </span>
        </div>

        <Link
          href="/inscricao"
          className="inline-flex items-center gap-2 bg-[var(--acao)] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md active:scale-95 transition-all"
        >
          <span>Inscrever Agora</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </aside>
  );
}
