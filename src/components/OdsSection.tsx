import { edicao, ods } from "@/lib/config";

/** Seção com as ODS da ONU que o evento envolve (edicao.json > ods.evento) */
export function OdsSection() {
  const doEvento = ods.lista.filter((o) => edicao.ods.evento.includes(o.numero));

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="space-y-2">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--marca)] font-bold">
          Agenda 2030 · ONU
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--fg)]">{ods.titulo_secao}</h2>
        <p className="text-sm sm:text-base text-[var(--fg-2)] max-w-2xl leading-relaxed">{ods.texto_secao}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {doEvento.map((o) => (
          <div key={o.numero} className="rounded-2xl overflow-hidden border border-[var(--borda)] bg-[var(--surf)] flex flex-col">
            <div className="p-5 text-white flex items-end gap-3 min-h-[120px]" style={{ background: o.cor }}>
              <span className="text-5xl font-black leading-none">{o.numero}</span>
              <span className="text-sm font-bold uppercase leading-tight">{o.nome}</span>
            </div>
            {o.porque && <p className="p-4 text-sm text-[var(--fg-2)] leading-relaxed">{o.porque}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
