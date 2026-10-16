"use client";

import { useMemo } from "react";
import { CheckCircle2, AlertTriangle, Box, Maximize2 } from "lucide-react";

interface PrinterBedVisualizerProps {
  x: number;
  y: number;
  z: number;
  limitX?: number;
  limitY?: number;
  limitZ?: number;
}

export function PrinterBedVisualizer({
  x,
  y,
  z,
  limitX = 220,
  limitY = 220,
  limitZ = 250,
}: PrinterBedVisualizerProps) {
  const safeX = Math.max(0, Number(x) || 0);
  const safeY = Math.max(0, Number(y) || 0);
  const safeZ = Math.max(0, Number(z) || 0);

  const fitsX = safeX <= limitX;
  const fitsY = safeY <= limitY;
  const fitsZ = safeZ <= limitZ;
  const fitsAll = fitsX && fitsY && fitsZ;

  // Escala para caber no SVG (viewport 300x240)
  // Origem isométrica centralizada
  const scale = 0.55;
  const originX = 150;
  const originY = 190;

  // Projeção isométrica:
  // x vai para inferior-direito (30 deg)
  // y vai para inferior-esquerdo (150 deg)
  // z vai para cima (90 deg)
  const iso = (ix: number, iy: number, iz: number) => {
    const rad30 = Math.PI / 6;
    const px = originX + (ix - iy) * Math.cos(rad30) * scale;
    const py = originY + (ix + iy) * Math.sin(rad30) * scale * 0.6 - iz * scale;
    return [px, py];
  };

  // Coordenadas da Mesa de Impressão (Fundo)
  const bedCorners = [
    iso(0, 0, 0),
    iso(limitX, 0, 0),
    iso(limitX, limitY, 0),
    iso(0, limitY, 0),
  ];

  // Coordenadas do Teto do Envelope Máximo (Wireframe)
  const bedTopCorners = [
    iso(0, 0, limitZ),
    iso(limitX, 0, limitZ),
    iso(limitX, limitY, limitZ),
    iso(0, limitY, limitZ),
  ];

  // Peça do Usuário (Centralizada ou alinhada)
  const pieceCornersBottom = [
    iso(0, 0, 0),
    iso(safeX, 0, 0),
    iso(safeX, safeY, 0),
    iso(0, safeY, 0),
  ];

  const pieceCornersTop = [
    iso(0, 0, safeZ),
    iso(safeX, 0, safeZ),
    iso(safeX, safeY, safeZ),
    iso(0, safeY, safeZ),
  ];

  const formatPoints = (pts: number[][]) => pts.map((p) => p.join(",")).join(" ");

  const colorPiece = fitsAll ? "#10B981" : "#EF4444";
  const fillPiece = fitsAll ? "rgba(16, 185, 129, 0.35)" : "rgba(239, 68, 68, 0.4)";

  return (
    <div className="w-full max-w-full min-w-0 bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-3 sm:p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-[var(--borda)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--marca)]/10 text-[var(--marca)] flex items-center justify-center">
            <Box size={18} />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--marca)] block">
              Simulador da Mesa 3D
            </span>
            <span className="text-xs text-[var(--fg-2)] font-mono">
              Volume Máx: {limitX} × {limitY} × {limitZ} mm
            </span>
          </div>
        </div>

        <div className="text-right">
          {fitsAll ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <CheckCircle2 size={13} />
              <span>Cabe na mesa</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <AlertTriangle size={13} />
              <span>Excede volume</span>
            </span>
          )}
        </div>
      </div>

      {/* Renderizador Isométrico SVG */}
      <div className="relative w-full aspect-16/10 sm:aspect-2/1 bg-[var(--surf-2)]/60 rounded-xl overflow-hidden flex items-center justify-center border border-[var(--borda)]/60">
        <svg
          viewBox="0 0 300 240"
          className="w-full h-full max-h-56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grade da Mesa (Base) */}
          <polygon
            points={formatPoints(bedCorners)}
            fill="var(--surf)"
            stroke="var(--borda)"
            strokeWidth="1.5"
          />

          {/* Linhas de Grade Internas da Mesa */}
          {[0.25, 0.5, 0.75].map((factor) => {
            const p1 = iso(limitX * factor, 0, 0);
            const p2 = iso(limitX * factor, limitY, 0);
            const p3 = iso(0, limitY * factor, 0);
            const p4 = iso(limitX, limitY * factor, 0);
            return (
              <g key={factor} stroke="var(--borda)" strokeWidth="0.7" strokeDasharray="3,3">
                <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />
                <line x1={p3[0]} y1={p3[1]} x2={p4[0]} y2={p4[1]} />
              </g>
            );
          })}

          {/* Wireframe do Envelope Máximo (Coluna vertical e teto) */}
          <line
            x1={bedCorners[0][0]}
            y1={bedCorners[0][1]}
            x2={bedTopCorners[0][0]}
            y2={bedTopCorners[0][1]}
            stroke="var(--borda)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <line
            x1={bedCorners[1][0]}
            y1={bedCorners[1][1]}
            x2={bedTopCorners[1][0]}
            y2={bedTopCorners[1][1]}
            stroke="var(--borda)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <line
            x1={bedCorners[2][0]}
            y1={bedCorners[2][1]}
            x2={bedTopCorners[2][0]}
            y2={bedTopCorners[2][1]}
            stroke="var(--borda)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <line
            x1={bedCorners[3][0]}
            y1={bedCorners[3][1]}
            x2={bedTopCorners[3][0]}
            y2={bedTopCorners[3][1]}
            stroke="var(--borda)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <polygon
            points={formatPoints(bedTopCorners)}
            fill="none"
            stroke="var(--borda)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />

          {/* Se X, Y ou Z forem maiores que 0, renderiza a peça */}
          {safeX > 0 && safeY > 0 && safeZ > 0 && (
            <g>
              {/* Lado Esquerdo da Peça */}
              <polygon
                points={`${pieceCornersBottom[0].join(",")} ${pieceCornersTop[0].join(
                  ","
                )} ${pieceCornersTop[3].join(",")} ${pieceCornersBottom[3].join(",")}`}
                fill={fillPiece}
                stroke={colorPiece}
                strokeWidth="1.5"
                opacity="0.85"
              />

              {/* Lado Direito da Peça */}
              <polygon
                points={`${pieceCornersBottom[1].join(",")} ${pieceCornersTop[1].join(
                  ","
                )} ${pieceCornersTop[2].join(",")} ${pieceCornersBottom[2].join(",")}`}
                fill={fillPiece}
                stroke={colorPiece}
                strokeWidth="1.5"
                opacity="0.95"
              />

              {/* Topo da Peça */}
              <polygon
                points={formatPoints(pieceCornersTop)}
                fill={colorPiece}
                fillOpacity="0.45"
                stroke={colorPiece}
                strokeWidth="1.8"
              />
            </g>
          )}

          {/* Rótulos dos Eixos X, Y, Z */}
          <text
            x={bedCorners[1][0] + 6}
            y={bedCorners[1][1] + 8}
            fill="var(--fg-2)"
            fontSize="9"
            fontFamily="monospace"
          >
            X: {limitX}mm
          </text>
          <text
            x={bedCorners[3][0] - 38}
            y={bedCorners[3][1] + 8}
            fill="var(--fg-2)"
            fontSize="9"
            fontFamily="monospace"
          >
            Y: {limitY}mm
          </text>
          <text
            x={bedTopCorners[0][0] - 28}
            y={bedTopCorners[0][1] - 4}
            fill="var(--fg-2)"
            fontSize="9"
            fontFamily="monospace"
          >
            Z: {limitZ}mm
          </text>
        </svg>

        {/* Overlay informativo flutuante */}
        <div className="absolute bottom-2 left-3 text-[11px] font-mono bg-[var(--surf)]/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[var(--borda)] text-[var(--fg-2)]">
          Dimensões: <span className="font-bold text-[var(--fg)]">{safeX} × {safeY} × {safeZ} mm</span>
        </div>
      </div>

      {!fitsAll && (
        <div className="p-3 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl text-xs text-[var(--fg)] space-y-0.5">
          <p className="font-bold text-amber-700 dark:text-amber-400">
            Peça excede as dimensões padrão do laboratório:
          </p>
          <p className="text-[var(--fg-2)]">
            {!fitsX && `Comprimento (${safeX}mm > ${limitX}mm). `}
            {!fitsY && `Largura (${safeY}mm > ${limitY}mm). `}
            {!fitsZ && `Altura (${safeZ}mm > ${limitZ}mm). `}
            Não impede a inscrição; a proposta será encaminhada para alinhamento técnico com os mentores do makerspace.
          </p>
        </div>
      )}
    </div>
  );
}
