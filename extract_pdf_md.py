#!/usr/bin/env python3
"""extract_pdf_md.py — Extração dos 3 livros OIKOS (PDF → Markdown).

Adaptação do pipeline guidorizzi (PyMuPDF) para a base de conhecimento do
curso de Python da OIKOS. Usa pymupdf4llm.to_markdown() capítulo a capítulo
(TOC do próprio PDF como fonte dos limites), com cropbox removendo running
headers/rodapés, checkpoint por capítulo (um .md por capítulo) e log JSON.

Uso (venv do guidorizzi_pipeline):
    .../guidorizzi_pipeline/.venv/bin/python extract_pdf_md.py --test
    .../guidorizzi_pipeline/.venv/bin/python extract_pdf_md.py --all
    .../guidorizzi_pipeline/.venv/bin/python extract_pdf_md.py --book 03_jansen_ml_for_algorithmic_trading
    .../guidorizzi_pipeline/.venv/bin/python extract_pdf_md.py --all --force

Python 3.9 compatível (sem match/case, sem `X | Y`).
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path

import pymupdf as fitz
import pymupdf4llm

BOOKS_DIR = Path("/Users/yurifloresalbuquerque/Documents/cursos_2s_2026/OIKOS/curso_de_python")
OUT_DIR = BOOKS_DIR / "kb"

# crop_top / crop_bottom: bandas (pt) removidas de cada página via cropbox.
# Medidas de auditoria (bbox y0 dos spans):
#   McKinney 2012 : rodapé "Título | N" em y0=609 (altura 662)  -> cortar >607
#   VanderPlas    : rodapé "Seção | N"   em y0=610 (altura 662)  -> cortar >607
#   Jansen 2e     : header capítulo y0=16 (tam 9), conteúdo começa y>=37;
#                   rodapé "[ N ]" em y0=635 (altura 666)        -> cortar [32, 630]
BOOKS = [
    {
        "key": "Wes McKinney",
        "slug": "01_mckinney_python_for_data_analysis",
        "title": "Python for Data Analysis (Wes McKinney, 2012)",
        "crop_top": 0.0,
        "crop_bottom": 55.0,
    },
    {
        "key": "Python Data Science Handbook",
        "slug": "02_vanderplas_python_data_science_handbook",
        "title": "Python Data Science Handbook (Jake VanderPlas)",
        "crop_top": 0.0,
        "crop_bottom": 55.0,
    },
    {
        "key": "Stefan Jansen",
        "slug": "03_jansen_ml_for_algorithmic_trading",
        "title": "Machine Learning for Algorithmic Trading (Stefan Jansen, 2nd ed.)",
        "crop_top": 32.0,
        "crop_bottom": 36.0,
    },
]

AUDIT_PAGES = [60, 120, 200, 300, 420, 520, 640]  # amostras p/ auditoria de bandas


# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------
def find_pdf(book: dict) -> Path:
    matches = sorted(p for p in BOOKS_DIR.glob("*.pdf") if book["key"].lower() in p.name.lower())
    if not matches:
        raise FileNotFoundError(f"PDF com chave '{book['key']}' não encontrado em {BOOKS_DIR}")
    return matches[0]


def slugify(text: str, idx: int) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:60].strip("-")
    return f"{idx:02d}_{s or 'section'}"


def clean_md(md: str) -> str:
    """Colapsa 3+ linhas em branco e espaços à direita."""
    md = re.sub(r"[ \t]+\n", "\n", md)
    md = re.sub(r"\n{3,}", "\n\n", md)
    return md.strip() + "\n"


def apply_crop(doc: "fitz.Document", crop_top: float, crop_bottom: float) -> int:
    """Aplica cropbox em todas as páginas. Retorna nº de páginas ajustadas."""
    if crop_top <= 0 and crop_bottom <= 0:
        return 0
    n = 0
    for page in doc:
        mb = page.mediabox
        rect = fitz.Rect(mb.x0, mb.y0 + crop_top, mb.x1, mb.y1 - crop_bottom)
        if rect.is_empty or rect == mb:
            continue
        page.set_cropbox(rect)
        n += 1
    return n


def get_chunks(doc: "fitz.Document") -> list:
    """Divide o livro em capítulos pelos entries L1 do TOC (1-based pages)."""
    toc = doc.get_toc(simple=True)
    l1 = [(title, p) for (lvl, title, p) in toc if lvl == 1 and p > 0]
    if not l1:
        # Fallback: livro inteiro em um chunk
        return [("00_full_book", "Livro completo", 0, doc.page_count - 1)]
    chunks = []
    first_start = l1[0][1] - 1  # 0-based
    if first_start > 0:
        chunks.append(("00_front_matter", "Front Matter", 0, first_start - 1))
    for i, (title, p1) in enumerate(l1):
        start = p1 - 1
        if i + 1 < len(l1):
            end = max(start, l1[i + 1][1] - 2)
        else:
            end = doc.page_count - 1
        chunks.append((slugify(title, i + 1), title, start, end))
    return chunks


def band_audit(doc_uncropped: "fitz.Document", book: dict) -> None:
    """Imprime spans nas bandas de corte p/ verificação manual."""
    ct, cb = book["crop_top"], book["crop_bottom"]
    h = doc_uncropped[0].rect.height
    print(f"\n--- AUDITORIA DE BANDAS: {book['slug']} (altura {h:.0f}, "
          f"crop_top={ct}, crop_bottom={cb}) ---")
    lo, hi = h - cb - 25, h  # banda inferior ampliada
    for p in AUDIT_PAGES:
        if p >= doc_uncropped.page_count:
            continue
        d = doc_uncropped[p].get_text("dict")
        for b in d["blocks"]:
            if b["type"] != 0:
                continue
            for l in b.get("lines", []):
                for s in l.get("spans", []):
                    t = s["text"].strip()
                    if not t:
                        continue
                    y = s["bbox"][1]
                    in_bottom = cb > 0 and y >= h - cb - 25
                    in_top = ct > 0 and y <= ct
                    if in_bottom or in_top:
                        print(f"  p{p} y={y:.0f} tam={s['size']:.1f}: {t[:60]!r}")


# ---------------------------------------------------------------------------
# Extração de um livro
# ---------------------------------------------------------------------------
def extract_book(book: dict, force: bool = False, test: bool = False) -> dict:
    pdf_path = find_pdf(book)
    book_dir = OUT_DIR / book["slug"]
    book_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n=== {book['slug']} ===")
    print(f"PDF: {pdf_path.name}")

    doc = fitz.open(str(pdf_path))
    print(f"páginas: {doc.page_count} | rotação p50: {doc[50].rotation} | "
          f"toc: {len(doc.get_toc(simple=True))} entries")

    if test:
        doc_uncropped = fitz.open(str(pdf_path))
        band_audit(doc_uncropped, book)
        doc_uncropped.close()

    apply_crop(doc, book["crop_top"], book["crop_bottom"])
    chunks = get_chunks(doc)
    print(f"chunks (L1 TOC): {len(chunks)}")
    for slug, title, s, e in chunks[:40]:
        print(f"  {slug}  p{s+1}-p{e+1}  {title[:70]}")

    if test:
        # Amostra: extrai 2 páginas de teste com o crop aplicado
        sample = [p for p in (60, 300) if p < doc.page_count]
        md = pymupdf4llm.to_markdown(
            doc, pages=sample, show_progress=False, page_chunks=False,
            ignore_images=True,
        )
        md = clean_md(md)
        print(f"\n--- AMOSTRA md (páginas {sample}), {len(md)} chars ---")
        print("HEAD:", md[:500].replace("\n", " ⏎ "))
        print("TAIL:", md[-400:].replace("\n", " ⏎ "))
        doc.close()
        return {"test": True}

    # ------- Extração completa, capítulo a capítulo (checkpoint = .md) -------
    log = {
        "book": book["title"],
        "pdf": str(pdf_path),
        "slug": book["slug"],
        "pages": doc.page_count,
        "crop": [book["crop_top"], book["crop_bottom"]],
        "started_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "chapters": [],
    }
    t0 = time.time()
    for slug, title, start, end in chunks:
        out_file = book_dir / f"{slug}.md"
        if out_file.exists() and not force and out_file.stat().st_size > 500:
            log["chapters"].append({
                "file": out_file.name, "title": title,
                "pages": [start + 1, end + 1], "chars": out_file.stat().st_size,
                "status": "skipped (checkpoint)",
            })
            print(f"  [skip] {slug} (checkpoint existe)")
            continue
        pages = list(range(start, end + 1))
        tc = time.time()
        try:
            md = pymupdf4llm.to_markdown(
                doc, pages=pages, show_progress=False, page_chunks=False,
                ignore_images=True,
            )
            md = clean_md(md)
            header = f"# {title}\n\n<!-- páginas {start + 1}–{end + 1} do PDF -->\n\n"
            out_file.write_text(header + md, encoding="utf-8")
            status = "ok"
        except Exception as exc:  # fallback: texto puro do PyMuPDF
            txt = "\n\n".join(doc[p].get_text("text") for p in pages)
            out_file.write_text(f"# {title}\n\n{txt}", encoding="utf-8")
            status = f"FALLBACK get_text: {type(exc).__name__}: {exc}"
        chars = out_file.stat().st_size
        dt = time.time() - tc
        log["chapters"].append({
            "file": out_file.name, "title": title,
            "pages": [start + 1, end + 1], "chars": chars,
            "seconds": round(dt, 1), "status": status,
        })
        print(f"  [ok] {slug}: {chars:>8,} chars, {len(pages):>3} págs, {dt:5.1f}s  {title[:60]}")

    # ------- Consolida book.md -------
    book_md = book_dir / "book.md"
    parts = [f"# {book['title']}\n"]
    for ch in log["chapters"]:
        f = book_dir / ch["file"]
        parts.append(f"\n\n---\n\n<!-- ===== {ch['title']} ===== -->\n\n" + f.read_text(encoding="utf-8"))
    book_md.write_text("".join(parts), encoding="utf-8")

    log["finished_at"] = time.strftime("%Y-%m-%d %H:%M:%S")
    log["total_chars"] = sum(c["chars"] for c in log["chapters"])
    log["total_seconds"] = round(time.time() - t0, 1)
    (book_dir / "extraction_log.json").write_text(
        json.dumps(log, indent=2, ensure_ascii=False), encoding="utf-8")

    n_fallback = sum(1 for c in log["chapters"] if "FALLBACK" in c["status"])
    print(f"→ {book_dir/'book.md'}: {book_md.stat().st_size:,} chars | "
          f"capítulos: {len(log['chapters'])} | fallbacks: {n_fallback} | "
          f"{log['total_seconds']}s")
    doc.close()
    return log


# ---------------------------------------------------------------------------
# Index mestre
# ---------------------------------------------------------------------------
def write_master_index() -> None:
    lines = ["# Base de Conhecimento — Curso de Python (OIKOS)", "",
             "Extração PDF → Markdown dos livros-base (pymupdf4llm, cropbox de headers/rodapés).", ""]
    for book in BOOKS:
        log_file = OUT_DIR / book["slug"] / "extraction_log.json"
        if not log_file.exists():
            continue
        log = json.loads(log_file.read_text(encoding="utf-8"))
        lines.append(f"## {log['book']}")
        lines.append("")
        lines.append(f"- Fonte: `{Path(log['pdf']).name}` ({log['pages']} páginas)")
        lines.append(f"- Consolidado: [`{book['slug']}/book.md`]({book['slug']}/book.md) "
                     f"({log['total_chars']:,} chars)")
        lines.append("- Capítulos:")
        for ch in log["chapters"]:
            lines.append(f"  - [`{ch['file']}`]({book['slug']}/{ch['file']}) — {ch['title']} "
                         f"(págs {ch['pages'][0]}–{ch['pages'][1]}, {ch['chars']:,} chars)")
        lines.append("")
    (OUT_DIR / "index.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"\n→ index mestre: {OUT_DIR / 'index.md'}")


# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description="Extração OIKOS PDF → Markdown")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--test", action="store_true", help="auditoria de bandas + amostra")
    g.add_argument("--all", action="store_true", help="extrai os 3 livros")
    g.add_argument("--book", metavar="SLUG", help="extrai um livro pelo slug")
    ap.add_argument("--force", action="store_true", help="reprocessa mesmo com checkpoint")
    args = ap.parse_args()

    if args.book:
        sel = [b for b in BOOKS if b["slug"] == args.book]
        if not sel:
            sys.exit(f"slug desconhecido: {args.book}. Opções: {[b['slug'] for b in BOOKS]}")
    elif args.all:
        sel = BOOKS
    else:
        sel = BOOKS  # --test roda em todos

    for book in sel:
        extract_book(book, force=args.force, test=args.test)

    if not args.test:
        write_master_index()


if __name__ == "__main__":
    main()