#!/usr/bin/env node
/**
 * Auditoria de responsividade — celular e computador.
 *
 * Abre a build de produção num navegador headless em vários tamanhos de tela
 * e reporta, para cada rota:
 *   - rolagem horizontal indevida (o sintoma clássico de layout quebrado);
 *   - elementos que passam da borda da viewport;
 *   - alvos de toque menores que 44px (só nos perfis de toque);
 *   - erros de console / exceções de página.
 *
 * Uso:
 *   npm run build && npm run preview   (num terminal)
 *   npm run audit:responsive           (noutro terminal)
 *
 * Variáveis de ambiente:
 *   BASE_URL   padrão http://localhost:4173/curso_de_python
 *   CHROME     caminho do executável do Chrome/Chromium (opcional)
 *
 * Sai com código 1 se encontrar problema — serve em CI.
 */
import { chromium } from 'playwright-core';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const BASE = (process.env.BASE_URL ?? 'http://localhost:4173/curso_de_python').replace(/\/$/, '');

/** Perfis de tela cobrindo celular pequeno, celular grande, tablet e desktop. */
const PERFIS = [
  { nome: 'celular-pequeno', width: 360, height: 740, isMobile: true, hasTouch: true },
  { nome: 'celular',         width: 390, height: 844, isMobile: true, hasTouch: true },
  { nome: 'tablet',          width: 768, height: 1024, isMobile: true, hasTouch: true },
  { nome: 'notebook',        width: 1366, height: 768, isMobile: false, hasTouch: false },
  { nome: 'desktop',         width: 1920, height: 1080, isMobile: false, hasTouch: false },
];

/** Rotas representativas (uma de cada tipo de página). */
const ROTAS = [
  '/',
  '/trilhas',
  '/trilha/fundamentos',
  '/licao/fund-variaveis',
  '/progresso',
  '/login',
  '/rota-que-nao-existe',
];

/** Acha um Chrome/Chromium utilizável, sem exigir `playwright install`. */
function acharNavegador() {
  if (process.env.CHROME && existsSync(process.env.CHROME)) return process.env.CHROME;

  const cache = join(homedir(), 'Library/Caches/ms-playwright');
  if (existsSync(cache)) {
    for (const dir of readdirSync(cache).filter((d) => d.startsWith('chromium'))) {
      for (const rel of [
        'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium',
        'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
        'chrome-linux/chrome',
      ]) {
        const p = join(cache, dir, rel);
        if (existsSync(p)) return p;
      }
    }
  }

  for (const p of [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ]) {
    if (existsSync(p)) return p;
  }
  return null;
}

/** Coleta as métricas de layout de uma página já carregada. */
function medir() {
  const vw = window.innerWidth;
  const doc = document.documentElement;

  const rolavel = (el) => {
    const ov = getComputedStyle(el).overflowX;
    return ov === 'auto' || ov === 'scroll';
  };

  // Um elemento só "vaza" se ele passa da borda E nenhum ancestral tem
  // rolagem própria (tabelas e blocos de código roláveis são legítimos).
  const vazando = [...doc.querySelectorAll('*')]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.right <= vw + 1) return false;
      for (let a = el.parentElement; a; a = a.parentElement) {
        if (rolavel(a)) return false;
      }
      return true;
    })
    .slice(0, 8)
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cls = (el.className || '').toString().trim().split(/\s+/)[0] || '';
      return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''} right=${Math.round(r.right)}`;
    });

  const alvosPequenos = [...document.querySelectorAll('a,button,input,select,[role="button"]')]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      // 44px e o ideal; abaixo de 32px e desconforto real no toque.
      return r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 24);
    })
    .slice(0, 8)
    .map((el) => {
      const r = el.getBoundingClientRect();
      const t = (el.textContent || '').trim().slice(0, 18) || el.getAttribute('aria-label') || '';
      return `${el.tagName.toLowerCase()}"${t}" ${Math.round(r.width)}x${Math.round(r.height)}`;
    });

  return {
    rolagemH: doc.scrollWidth - doc.clientWidth,
    vazando,
    alvosPequenos,
    titulo: (document.querySelector('h1, h2')?.textContent ?? '').trim().slice(0, 40),
  };
}

const exe = acharNavegador();
if (!exe) {
  console.error(
    'Nenhum Chrome/Chromium encontrado.\n' +
      'Defina CHROME=/caminho/do/chrome ou rode: npx playwright install chromium',
  );
  process.exit(2);
}

const browser = await chromium.launch({ executablePath: exe });
let problemas = 0;
let avisos = 0;

for (const perfil of PERFIS) {
  const ctx = await browser.newContext({
    viewport: { width: perfil.width, height: perfil.height },
    isMobile: perfil.isMobile,
    hasTouch: perfil.hasTouch,
    deviceScaleFactor: perfil.isMobile ? 2 : 1,
  });
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', (m) => {
    if (m.type() === 'error') erros.push(m.text().slice(0, 160));
  });
  page.on('pageerror', (e) => erros.push('exceção: ' + e.message.slice(0, 160)));

  console.log(`\n=== ${perfil.nome} (${perfil.width}x${perfil.height}) ===`);

  for (const rota of ROTAS) {
    try {
      await page.goto(BASE + rota, { waitUntil: 'networkidle', timeout: 30_000 });
    } catch {
      console.log(`  ${rota.padEnd(26)} FALHA ao carregar`);
      problemas++;
      continue;
    }
    await page.waitForTimeout(700);
    const m = await page.evaluate(medir);

    const ruim = m.rolagemH > 1 || m.vazando.length > 0;
    if (ruim) problemas++;
    const marca = ruim ? 'PROBLEMA' : 'ok      ';
    console.log(
      `  ${marca} ${rota.padEnd(26)} rolagemH=${m.rolagemH > 1 ? m.rolagemH + 'px' : 'nao'} "${m.titulo}"`,
    );
    m.vazando.forEach((v) => console.log(`             vaza: ${v} (vw=${perfil.width})`));

    if (perfil.hasTouch && m.alvosPequenos.length) {
      avisos++;
      console.log(`             aviso: ${m.alvosPequenos.length} alvo(s) de toque < 32px`);
      m.alvosPequenos.slice(0, 3).forEach((a) => console.log(`                    ${a}`));
    }
  }

  if (erros.length) {
    problemas++;
    console.log('  erros de console:');
    [...new Set(erros)].slice(0, 5).forEach((e) => console.log('    ' + e));
  }

  await ctx.close();
}

await browser.close();

console.log(
  `\nRESUMO: ${problemas} problema(s) de layout/console, ${avisos} aviso(s) de ergonomia de toque.`,
);
process.exit(problemas > 0 ? 1 : 0);
