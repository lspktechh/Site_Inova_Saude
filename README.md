# INOVA SAÚDE 2026 · Portal de Inscrições & Credenciamento

Plataforma oficial de inscrições, pareamento no Banco de Talentos e credenciamento digital do **INOVA SAÚDE 2026** (2ª edição · Londrina), realizada pelo **Instituto Cruzeiro do Sul**, **ecohub** e **Universidade Positivo**, com apoio da **Fundação Araucária** e da **Secretaria de Ciência, Tecnologia e Ensino Superior do Paraná (SETI)**.

---

## 🎯 Objetivo & Metodologia

O site foi desenvolvido com foco no usuário real, mobile-first e guiado por metodologias ativas:
1. **Design Thinking** (Empatizar e Definir): Guia os participantes a identificar quem realmente sofre a dor e como ela é resolvida hoje.
2. **Lean Inception** (Visão do Produto e É / Não é / Faz / Não faz): Delimita escopo e funcionalidades essenciais.
3. **Formas de Protótipo Parametrizadas**:
   - **Forma A (Software)**: Telas essenciais, entrada/saída de dados e integrações.
   - **Forma B (Impressão 3D)**: Verificação reativa do envelope contra a mesa ($220 \times 220 \times 250\text{ mm}$), sugestão automática de materiais (PETG, PLA, TPU) e medidas de encaixe.
   - **Formas C & D (Dispositivo & Serviço)**: Fila de alinhamento com a comissão.
   - **Trava Sanitária**: Detecção de contato com ferida, mucosa ou corrente sanguínea sem bloquear a inscrição (encaminha para triagem amigável).
   - **Regra de Honestidade sobre IA**: Identificação clara de protótipos gerados por IA como rascunhos conceituais.
4. **Banco de Talentos Público**: Pareamento dinâmico entre candidatos disponíveis e equipes com vagas abertas, calculando automaticamente as competências faltantes (`falta_na_equipe`).

---

## 🔗 Integração com o Sistema de Credenciamento (`event-checkin`)

O site conecta-se nativamente com a API do sistema de credenciamento do ecossistema:
- **Evento**: `inova-saude-2026`
- **Fluxo de Inscrição Gratuita**:
  - Endpoint: `POST /events/:eventId/inscriptions`
  - Inscrições gratuitas recebem confirmação imediata (`status: "CONFIRMED"`).
  - Cada participante (líder e membros adicionais da equipe) recebe automaticamente um registro de `Participant` com seu respectivo token de alta entropia (`qrToken`).
  - Geração de voucher com QR Code oficial exibido na tela de conclusão e salvo para credenciamento nos dias da **Oficina Presencial (31/10)** e do **Pitch Final (05/11)** nos terminais e app mobile de check-in.
  - A **Ficha de Protótipo** estruturada em JSON é salva junto aos metadados da inscrição para uso direto da banca examinadora e dos operadores da oficina.

---

## ⚙️ Regra de Ouro (Zero Hardcoding)

Nenhum texto, peso da rúbrica, prazo, critério ou microcopy de campo é fixado em código. Toda a configuração é carregada dinamicamente a partir dos arquivos em `src/config/`:
- `edicao.json`: Datas, eixos temáticos, limites de equipe e parâmetros de fabricação 3D.
- `formulario.json`: Trilhas, etapas, microcopy e exemplos de "Assim funciona" / "Assim não".
- `competencias.json`: Matriz de competências e cálculo de lacunas.
- `formas-prototipo.json`: Especificações das Formas A, B, C, D e trava sanitária.
- `avaliacao.json`: Rúbrica de 3 lentes da inovação (50 pontos), escala com descritores, TRL (1 a 9) e 7 requisitos de idoneidade.
- `banco-desafios.json`: Banco de desafios da página `/desafios` (problemas reais da saúde e soluções que viraram empresa, com fonte e curso). O site é estático e tudo que entra aqui vai para o JavaScript público: não colocar conteúdo ainda não confirmado, como os desafios dos apoiadores.
- `ficha-prototipo.schema.json`: Contrato JSON da ficha estruturada.

---

## 🎨 Identidade Visual & Conformidade Legal (Art. 11)

- **Cores Oficiais**:
  - Azul Institucional Cruzeiro do Sul: `#0B4279` (Pantone 541 C)
  - Azul Universidade Positivo: `#316195` (Pantone 653 C)
  - Fundo Hero/Rodapé: `#072F56`
  - Espectro ecohub: `#F8C412`, `#B9CC0D`, `#259E38`, `#33A2A4`, `#0B8161`, `#5A3088`
  - Ação / Botões: `#0B8161` (Contraste 4,9:1 AA)
- **Tipografia**: Mulish (títulos), IBM Plex Sans (corpo), IBM Plex Mono (código e metadados).
- **Art. 11 & 12 do Edital nº 4/2026**: Rodapé institucional obrigatório em todas as páginas com as marcas do Instituto Cruzeiro do Sul, Fundação Araucária e SETI (Governo do Paraná), acompanhado da frase de apoio oficial.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm

### Instalação
```bash
npm install
```

### Variáveis de Ambiente (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```
*(Caso a API de credenciamento não esteja em execução, o portal opera com fallback local resiliente com geração de voucher e armazenamento em localStorage).*

### Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3003`.

### Build & Exportação Estática
```bash
npm run build
```
O build estático otimizado é gerado pronto para deploy em Vercel, Netlify, GitHub Pages ou VPS.

---

## 📁 Estrutura de Pastas

```
Site_Inova_Saude/
├── public/
│   └── logos/               # Logomarcas oficiais (UP, ICS, ecohub, FA, SETI)
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home institucional
│   │   ├── inscricao/        # Formulário guiado em 9 etapas e voucher
│   │   ├── banco-de-talentos/# Pareamento de participantes e equipes
│   │   ├── desafios/         # Os 5 eixos temáticos do edital
│   │   ├── programacao/      # Cronograma da maratona
│   │   ├── regulamento/      # Rúbrica, 7 regras de idoneidade e FAQ
│   │   ├── layout.tsx        # Layout com Header, Footer (Art. 11) e fontes
│   │   └── not-found.tsx     # Página 404 personalizada
│   ├── components/
│   │   ├── Header.tsx        # Topo institucional com marcas e espectro
│   │   └── Footer.tsx        # Rodapé oficial Art. 11 Edital 4/2026
│   ├── config/               # Arquivos JSON de configuração (edicao, formulario...)
│   ├── lib/
│   │   ├── api.ts            # Integração com API event-checkin
│   │   └── config.ts         # Regras de negócio e cálculo de falta_na_equipe
│   └── styles/
│       ├── globals.css       # Estilos globais e tokens
│       └── tokens.css        # Tokens originais de design
├── next.config.mjs
├── package.json
└── tsconfig.json
```
