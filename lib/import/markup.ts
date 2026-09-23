/* ============================================================================
 * Rich content → the body syntax the blog already understands.
 *
 * ONE implementation, deliberately, used by three callers:
 *
 *   - the .docx importer (mammoth hands us HTML),
 *   - the .html / .md / .txt importers,
 *   - the paste handler in the editor, which runs in the BROWSER.
 *
 * That last one is why this file imports nothing and touches no DOM. A
 * converter that used DOMParser could not run on the server; one written
 * twice would drift, and the drift would show up as "the same document
 * imports differently depending on whether I pasted it or uploaded it".
 *
 * The target syntax is the one lib/blog.ts parseBody reads, and nothing else:
 *
 *   ## heading      ### sub-heading      - bullet      1. numbered
 *   | a | b |       pipe table, header row marked by a | --- | line
 *   anything else   paragraph
 *
 * Everything outside that vocabulary is FLATTENED TO TEXT rather than
 * dropped silently or passed through as markup. Bold, colours, fonts and
 * inline styles do not survive — the blog renders every post in one visual
 * language (§8.2), and an import that smuggled in <span style> would break
 * that as well as the CSP posture. What we cannot represent, we say so in a
 * warning the editor sees, because content that vanishes without a word is
 * how a published post ends up missing a table nobody noticed.
 * ========================================================================= */

export type Converted = {
  body: string
  /** Shown to the editor above the form. Not errors — things they should look
   *  at before publishing. */
  warnings: string[]
}

/* ── Entities ───────────────────────────────────────────────────────────── */

const NAMED: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', bull: '•', middot: '·',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  laquo: '«', raquo: '»', times: '×', divide: '÷', deg: '°',
  eacute: 'é', egrave: 'è', copy: '©', reg: '®', trade: '™',
  euro: '€', pound: '£', cent: '¢',
  larr: '←', rarr: '→', harr: '↔', ge: '≥', le: '≤',
}

export function decodeEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]{1,31});/g, (whole, body: string) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10)
      /* Out-of-range values and control codes would throw or poison the text;
         leave those alone rather than crash an import on one bad character. */
      if (!Number.isFinite(code) || code < 0x20 || code > 0x10ffff) return whole
      try { return String.fromCodePoint(code) } catch { return whole }
    }
    return NAMED[body.toLowerCase()] ?? whole
  })
}

/* ── Shared text tidying ────────────────────────────────────────────────── */

/** A hard break carried through whitespace collapsing. `<br>` becomes this,
 *  and only at the end does it become a real newline — otherwise the collapse
 *  below would eat it. */
const BREAK = ''

/** Collapse runs of whitespace, remove the invisible characters Word and PDF
 *  exports are full of, and keep explicit breaks. */
function squash(text: string): string {
  return text
    .replace(/[   ]/g, ' ')      // non-breaking spaces
    .replace(/[​‌‍﻿]/g, '') // zero-width junk
    .replace(/[ \t\r\n]+/g, ' ')
    .split(BREAK)
    .map((s) => s.trim())
    .filter(Boolean)
    .join('\n')
    .trim()
}

/** Anything that must not swallow the line structure of the output. A cell or
 *  a list item is one line by definition. */
function oneLine(text: string): string {
  return text.replace(/\s*\n\s*/g, ' ').trim()
}

/* ── Pipe tables ────────────────────────────────────────────────────────── */

/** Rows → the pipe syntax parseBody reads back. Only the FIRST row can be a
 *  header, because that is all the renderer draws. */
export function tableToMarkup(rows: string[][], headerFirstRow: boolean): string[] {
  const width = Math.max(...rows.map((r) => r.length))
  const line = (cells: string[]) => {
    const padded = [...cells, ...Array(Math.max(0, width - cells.length)).fill('')]
    /* A pipe inside a cell would split it in two on the way back in. */
    return `| ${padded.map((c) => oneLine(c).replace(/\|/g, '/') || ' ').join(' | ')} |`
  }
  const out = [line(rows[0])]
  if (headerFirstRow) out.push(`| ${Array(width).fill('---').join(' | ')} |`)
  for (const r of rows.slice(1)) out.push(line(r))
  return out
}

/** Labels, not values: short, none of them a bare number or an amount, and
 *  no cell left empty. "Slab | Rate" passes; "₹3,00,000 | 5%" does not. */
function looksLikeHeaderRow(cells: string[]): boolean {
  if (cells.length < 2) return false
  return cells.every(
    (c) => c !== '' && c.length <= 40 && !/^[₹$€£]?[\d.,%()\s-]+$/.test(c),
  )
}

/* ── HTML → markup ──────────────────────────────────────────────────────── */

type Token =
  | { type: 'text'; value: string }
  | { type: 'open' | 'close'; name: string }

function* tokenize(html: string): Generator<Token> {
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    if (m.index > last) yield { type: 'text', value: html.slice(last, m.index) }
    yield { type: m[0][1] === '/' ? 'close' : 'open', name: m[1].toLowerCase() }
    last = re.lastIndex
  }
  if (last < html.length) yield { type: 'text', value: html.slice(last) }
}

/** Tags that end whatever block was open. Everything else is inline and its
 *  text simply flows into the current block. */
const BLOCK = new Set([
  'p', 'div', 'section', 'article', 'main', 'header', 'footer', 'aside',
  'blockquote', 'pre', 'figure', 'figcaption', 'hr', 'dl', 'dt', 'dd',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
])

export function htmlToMarkup(html: string): Converted {
  const warnings = new Set<string>()
  const lines: string[] = []

  /* Comments, scripts and styles carry text that is not content. Word's HTML
     export in particular ships a stylesheet the size of the document. */
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\?[\s\S]*?\?>/g, ' ')
    .replace(/<(script|style|head|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')

  let buf = ''
  let heading: 'h2' | 'h3' | null = null
  let inItem: 'ul' | 'ol' | null = null
  const listStack: ('ul' | 'ol')[] = []
  const olCounters: number[] = []

  /* Table state. A nested table is flattened into the outer one; a layout
     table inside a data table is not worth a tree. */
  let table: string[][] | null = null
  let row: string[] | null = null
  let headerFirstRow = false
  let cellIsHeader = false
  let tableDepth = 0

  const emit = () => {
    const text = squash(buf)
    buf = ''
    if (!text) { heading = null; inItem = null; return }

    if (heading) {
      lines.push(`${heading === 'h2' ? '##' : '###'} ${oneLine(text)}`)
      heading = null
      inItem = null
      return
    }
    if (inItem) {
      const marker = inItem === 'ol' ? `${olCounters[olCounters.length - 1] ?? 1}.` : '-'
      /* One level is all the renderer draws, so a nested item joins the same
         list rather than disappearing. */
      lines.push(`${marker} ${oneLine(text)}`)
      inItem = null
      return
    }
    /* A <br>-separated block becomes separate paragraphs, which is what the
       author meant by pressing enter. */
    for (const para of text.split('\n')) lines.push(para)
  }

  const closeCell = () => {
    if (!row) { buf = ''; cellIsHeader = false; return }
    row.push(squash(buf))
    buf = ''
    if (cellIsHeader && table?.length === 0) headerFirstRow = true
    cellIsHeader = false
  }

  for (const token of tokenize(cleaned)) {
    if (token.type === 'text') {
      buf += decodeEntities(token.value)
      continue
    }

    const { name } = token

    if (token.type === 'open') {
      if (name === 'br') { buf += BREAK; continue }
      if (name === 'img') {
        warnings.add('Images were left out — the blog renders text blocks only.')
        continue
      }
      if (!BLOCK.has(name)) continue

      /* Inside a table, a block flush belongs to the cell, not the page. */
      if (tableDepth > 0 && name !== 'table') {
        if (name === 'tr') { row = []; continue }
        if (name === 'td' || name === 'th') { buf = ''; cellIsHeader = name === 'th'; continue }
        /* A <p> or <li> inside a cell keeps its text in the cell. */
        if (buf.trim()) buf += BREAK
        continue
      }

      emit()

      switch (name) {
        case 'h1':
        case 'h2':
          heading = 'h2'
          break
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          heading = 'h3'
          break
        case 'ul':
        case 'ol':
          listStack.push(name)
          olCounters.push(0)
          break
        case 'li': {
          const kind = listStack[listStack.length - 1] ?? 'ul'
          inItem = kind
          if (kind === 'ol') {
            olCounters[olCounters.length - 1] = (olCounters[olCounters.length - 1] ?? 0) + 1
          }
          break
        }
        case 'table':
          tableDepth += 1
          if (tableDepth === 1) { table = []; row = null; headerFirstRow = false }
          break
      }
      continue
    }

    /* Closing tag. */
    if (!BLOCK.has(name)) continue

    if (tableDepth > 0) {
      if (name === 'td' || name === 'th') { closeCell(); continue }
      if (name === 'tr') {
        if (row && row.length && row.some((c) => c !== '')) table?.push(row)
        row = null
        continue
      }
      if (name === 'table') {
        tableDepth -= 1
        if (tableDepth === 0 && table) {
          if (table.length) {
            /* Word marks a header row only when the author ticked "repeat as
               header row", which almost nobody does — so a straight reading
               gives a table with no header and the renderer draws a grid of
               undifferentiated cells. The first row of a business table is a
               header often enough to assume it, unless it reads like data. */
            const assumed = !headerFirstRow && table.length > 1 && looksLikeHeaderRow(table[0])
            if (assumed) {
              warnings.add(
                'The first row of each table was treated as a header. If that is wrong, delete the | --- | line under it.',
              )
            }
            lines.push(...tableToMarkup(table, headerFirstRow || assumed))
          }
          table = null
        }
        continue
      }
      continue
    }

    if (name === 'ul' || name === 'ol') {
      emit()
      listStack.pop()
      olCounters.pop()
      continue
    }
    emit()
  }
  emit()

  return { body: tidyBlockSpacing(lines), warnings: [...warnings] }
}

/* ── Markdown / plain text → markup ─────────────────────────────────────── */

/** Strip the inline syntax the renderer cannot express, keeping the words. */
function stripInline(line: string): string {
  return line
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')            // images — gone
    .replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g, '$1')  // links → their text
    .replace(/<((?:https?|mailto):[^>\s]+)>/g, '$1')   // autolinks
    .replace(/(\*\*\*|___)(.+?)\1/g, '$2')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|[\s(])[*_](?=\S)(.+?)(?<=\S)[*_](?=[\s).,;:!?]|$)/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
}

export function markdownToMarkup(input: string): Converted {
  const warnings = new Set<string>()
  const text = input.replace(/\r\n?/g, '\n')

  /* YAML front matter, as written by every static-site generator. The title
     is worth keeping; the rest is not ours to interpret. */
  let frontTitle = ''
  let body = text
  const front = text.match(/^---\n([\s\S]*?)\n---\n?/)
  if (front) {
    const t = front[1].match(/^title:\s*["']?(.+?)["']?\s*$/m)
    if (t) frontTitle = t[1].trim()
    body = text.slice(front[0].length)
  }

  if (/!\[[^\]]*\]\(/.test(body)) {
    warnings.add('Images were left out — the blog renders text blocks only.')
  }

  const out: string[] = []
  if (frontTitle) out.push(`## ${frontTitle}`)

  const src = body.split('\n')
  let inFence = false

  for (let i = 0; i < src.length; i += 1) {
    const line = src[i].trim()

    if (/^(```|~~~)/.test(line)) {
      if (!inFence) {
        warnings.add('Code blocks were kept as plain paragraphs — the blog has no code styling.')
      }
      inFence = !inFence
      continue
    }
    if (inFence) { if (line) out.push(line); continue }

    if (!line) { out.push(''); continue }

    /* A pipe table is already the target syntax, separator row and all. */
    if (line.startsWith('|') && line.endsWith('|') && line.length > 2) {
      out.push(line)
      continue
    }

    if (/^([-*_])\s*(\1\s*){2,}$/.test(line)) continue  // horizontal rule

    /* Setext headings: the underline decides, so look ahead. */
    const next = (src[i + 1] ?? '').trim()
    if (next && /^=+$/.test(next)) { out.push(`## ${stripInline(line)}`); i += 1; continue }
    if (next && /^-{2,}$/.test(next) && !/^[-*+]\s/.test(line)) {
      out.push(`### ${stripInline(line)}`)
      i += 1
      continue
    }

    const atx = line.match(/^(#{1,6})\s+(.*?)\s*#*$/)
    if (atx) {
      /* # and ## both become ##: the post's own <h1> is the title field, and
         a second h1 in the body would break one-h1-per-page (§8.5). */
      out.push(`${atx[1].length <= 2 ? '##' : '###'} ${stripInline(atx[2])}`)
      continue
    }

    const quote = line.match(/^>\s?(.*)$/)
    if (quote) { if (quote[1].trim()) out.push(stripInline(quote[1])); continue }

    const bullet = line.match(/^[-*+•▪‣◦·]\s+(.*)$/)
    if (bullet) { out.push(`- ${stripInline(bullet[1])}`); continue }

    const numbered = line.match(/^(\d+)[.)]\s+(.*)$/)
    if (numbered) { out.push(`${numbered[1]}. ${stripInline(numbered[2])}`); continue }

    out.push(stripInline(line))
  }

  return { body: tidyBlockSpacing(out), warnings: [...warnings] }
}

/* ── Extracted PDF text → markup ────────────────────────────────────────── */

const BULLET_GLYPH = /^[•▪‣◦·●○*]\s+/
const PAGE_NUMBER = /^(page\s+)?\d+(\s*(of|\/)\s*\d+)?$/i

/** PDF text extraction returns VISUAL lines, not paragraphs: a wrapped
 *  sentence arrives as three lines, and pasting that straight into the body
 *  would render three paragraphs mid-sentence. So lines are re-joined, and
 *  the only question is where a paragraph really ends.
 *
 *  Two documents, two answers. If the extract has blank lines doing that job,
 *  trust them. If it has none — common, and the reason a naive import looks
 *  shredded — fall back to punctuation: a line that ends a sentence, followed
 *  by one that starts a new one, is a break.
 *
 *  Both are guesses, which is why the editor reviews the result in the
 *  textarea before anything is saved, and why the warning below says so. */
export function pdfTextToMarkup(input: string | string[]): Converted {
  const warnings = new Set<string>()

  const normalise = (page: string) =>
    page
      .replace(/\r\n?/g, '\n')
      .replace(/[   ]/g, ' ')
      .replace(/[​‌‍﻿]/g, '')
      .split('\n')
      .map((l) => l.replace(/[ \t]+/g, ' ').trim())

  const pages = (Array.isArray(input) ? input : [input]).map(normalise)

  /* Running headers and footers are found BY POSITION, not by frequency.
     Frequency alone needs a line to appear three or four times before it is
     safe to delete, which misses every two- and three-page document — and a
     two-page handbook with the company name at the top of both pages is the
     ordinary case here. Position is the stronger signal: content does not
     land at the top or bottom edge of page after page. */
  /* "Policy Handbook | Page 4" is the same furniture as "Policy Handbook |
     Page 5", and comparing the lines verbatim would never notice. Numbers are
     blanked before counting, and the blanked form is what gets matched on the
     way out. */
  const shape = (line: string) => line.replace(/\d+/g, '#')

  const repeated = new Set<string>()
  if (pages.length > 1) {
    const edges = new Map<string, number>()
    for (const page of pages) {
      const real = page.filter(Boolean)
      const seen = new Set([...real.slice(0, 2), ...real.slice(-2)].map(shape))
      for (const line of seen) {
        if (line.length > 2 && line.length < 90 && !PAGE_NUMBER.test(line)) {
          edges.set(line, (edges.get(line) ?? 0) + 1)
        }
      }
    }
    const threshold = Math.max(2, Math.ceil(pages.length * 0.5))
    for (const [line, n] of edges) if (n >= threshold) repeated.add(line)
  } else {
    /* One merged blob — the editor's tidy button, or an extractor that gave
       us no page breaks. Nothing to go on but frequency, so the bar is high
       enough that a line has to look like furniture. */
    const counts = new Map<string, number>()
    for (const l of pages[0]) {
      if (l.length > 2 && l.length < 90) counts.set(shape(l), (counts.get(shape(l)) ?? 0) + 1)
    }
    for (const [line, n] of counts) if (n >= 3) repeated.add(line)
  }

  const kept: string[] = []
  for (const l of pages.flat()) {
    if (PAGE_NUMBER.test(l)) continue
    if (repeated.has(shape(l))) continue
    /* A header that the extractor glued to the first line of body text —
       "Policy Handbook | Page 2 Employee Referral Policy" — is not caught by
       a whole-line match, so strip it from the front and keep the rest. */
    const withoutHeader = stripLeadingFurniture(l, repeated, shape)
    if (!withoutHeader) continue
    kept.push(withoutHeader)
  }
  if (repeated.size) warnings.add('Repeated page headers or footers were removed.')

  const blanks = kept.filter((l) => !l).length
  const useBlankLines = blanks >= kept.length * 0.08

  const out: string[] = []
  let para = ''

  const flush = () => {
    const text = para.trim()
    para = ''
    if (text) out.push(text)
  }

  const numberedLine = (l: string | undefined) => Boolean(l && /^\d+[.)]\s+\S/.test(l))

  for (let i = 0; i < kept.length; i += 1) {
    const line = kept[i]
    if (!line) { flush(); continue }

    /* Lines already in the target syntax pass straight through. This matters
       for the editor's "tidy up line breaks" button, which runs this same
       pass over a body that may already have headings and tables in it:
       without the guard, a "## Heading" would be re-wrapped into the
       paragraph above it. PDF text almost never starts a line with ## or |,
       so nothing real is lost by trusting them. */
    if (/^#{2,3}\s+\S/.test(line) || /^\|.*\|$/.test(line)) {
      flush()
      out.push(line)
      continue
    }

    const bullet = BULLET_GLYPH.test(line)
    const dashBullet = /^[-–—]\s+\S/.test(line)
    const numbered = line.match(/^(\d+)[.)]\s+(.+)$/)

    /* A numbered heading ("3.2 Leave encashment") versus a numbered list item
       is decided by what follows: a section number heads a short line with no
       closing punctuation. */
    const sectionHeading = line.match(/^(\d+(?:\.\d+)+)\s+([A-Z].{2,70})$/)

    if (bullet || dashBullet) {
      flush()
      out.push(`- ${line.replace(BULLET_GLYPH, '').replace(/^[-–—]\s+/, '')}`)
      continue
    }
    if (sectionHeading && !/[.!?,;:]$/.test(line)) {
      flush()
      out.push(`### ${line}`)
      continue
    }
    if (numbered) {
      /* "1. Employment & General Workplace Policies" is a section heading.
         "1. Gather the documents" is a list item. They are the same shape, so
         the neighbours decide: a list item has other numbered lines around
         it, a heading stands alone between paragraphs. Compliance PDFs are
         full of the second kind, and rendering a document's section headings
         as a run of one-item lists loses its whole structure. */
      const hasSibling =
        numberedLine(neighbour(kept, i, 1)) || numberedLine(neighbour(kept, i, -1))
      const headingish = !/[.!?,;:]$/.test(line) && line.length <= 90 && /^\d+[.)]\s+[A-Z]/.test(line)

      flush()
      out.push(!hasSibling && headingish ? `## ${line}` : `${numbered[1]}. ${numbered[2]}`)
      continue
    }

    /* ALL CAPS on its own line is a heading in almost every business document
       ever exported to PDF. Letters are required, so "GST RETURNS" counts and
       "1,00,000" does not. */
    const letters = line.replace(/[^A-Za-z]/g, '')
    if (
      letters.length >= 3 &&
      line.length <= 80 &&
      line === line.toUpperCase() &&
      !/[.!?]$/.test(line)
    ) {
      flush()
      out.push(`## ${sentenceCase(line)}`)
      continue
    }

    /* De-hyphenate a word split across the line break. */
    if (para.endsWith('-') && /^[a-z]/.test(line)) {
      para = para.slice(0, -1) + line
      continue
    }

    if (!para) { para = line; continue }

    if (!useBlankLines && /[.!?:]["')\]]?$/.test(para) && /^["'([]?[A-Z0-9]/.test(line)) {
      flush()
      para = line
      continue
    }

    para += ` ${line}`
  }
  flush()

  if (!out.length) warnings.add('No text could be read from that file.')
  else {
    warnings.add(
      'Headings and paragraph breaks in a PDF are a best guess — read through the body before publishing.',
    )
  }

  return { body: tidyBlockSpacing(out), warnings: [...warnings] }
}

/** The nearest non-blank line in either direction. Blank lines are layout,
 *  not separation, when deciding whether two numbered lines are siblings. */
function neighbour(lines: string[], from: number, step: 1 | -1): string | undefined {
  for (let i = from + step; i >= 0 && i < lines.length; i += step) {
    if (lines[i]) return lines[i]
  }
  return undefined
}

/** A running header can arrive fused to the text that followed it on the
 *  page. Trim the longest known piece of furniture off the front, and keep
 *  whatever real content was behind it. */
function stripLeadingFurniture(
  line: string,
  repeated: Set<string>,
  shape: (s: string) => string,
): string {
  if (!repeated.size) return line
  for (const furniture of repeated) {
    /* Compare on the blanked-number form, so "| Page 2" matches "| Page #". */
    const head = shape(line.slice(0, furniture.length))
    if (head === furniture && line.length > furniture.length) {
      return line.slice(furniture.length).trim()
    }
  }
  return line
}

/** SHOUTED HEADINGS read badly at h2 size. Title case, leaving the short
 *  joining words alone. */
function sentenceCase(line: string): string {
  const small = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'vs'])
  return line
    .toLowerCase()
    .split(' ')
    .map((word, i) => {
      const bare = word.replace(/[^a-z]/g, '')
      if (i > 0 && small.has(bare)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/* ── Final tidy ─────────────────────────────────────────────────────────── */

/** One blank line between blocks, none inside a list or a table, none at the
 *  ends. parseBody treats a blank line as "close the open list", so this
 *  spacing is structural, not cosmetic. */
export function tidyBlockSpacing(lines: string[]): string {
  const isList = (l: string) => /^(-\s|\d+[.)]\s)/.test(l)
  const isTable = (l: string) => l.startsWith('|')

  const out: string[] = []
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line) continue

    const prev = out[out.length - 1]
    if (prev !== undefined) {
      const sameRun =
        (isList(prev) && isList(line) && prev.startsWith('-') === line.startsWith('-')) ||
        (isTable(prev) && isTable(line))
      if (!sameRun) out.push('')
    }
    out.push(line)
  }
  return out.join('\n').trim()
}

/* ── Title and excerpt ──────────────────────────────────────────────────── */

const MAX_EXCERPT = 280   // the form rejects over 300 — leave room to edit

/** Pull a title and an excerpt out of a converted body.
 *
 *  A document almost always opens with its own title, and leaving it as the
 *  first heading would print it twice: once as the post's <h1>, once as an h2
 *  immediately underneath. So a leading heading is LIFTED into the title
 *  field and removed from the body. */
export function deriveMeta(body: string, fallbackTitle = ''): {
  title: string
  excerpt: string
  body: string
} {
  const lines = body.split('\n')
  let title = ''

  const firstIndex = lines.findIndex((l) => l.trim() !== '')
  const first = (lines[firstIndex] ?? '').trim()

  if (/^#{2,3}\s+/.test(first)) {
    title = first.replace(/^#{2,3}\s+/, '').trim()
    lines.splice(firstIndex, 1)
  } else if (
    first &&
    first.length <= 120 &&
    !/^[-|]/.test(first) &&
    !/^\d+[.)]\s/.test(first) &&
    !/[.!?]$/.test(first)
  ) {
    /* An untitled first line that reads like a title — short, no full stop —
       is one, and taking it leaves the body starting at the actual prose. */
    title = first
    lines.splice(firstIndex, 1)
  }

  const rest = tidyBlockSpacing(lines)

  /* The excerpt is the first real paragraph: not a heading, not a list item,
     not a table row. */
  const paragraph = rest
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && !/^#{2,3}\s/.test(l) && !/^[-|]/.test(l) && !/^\d+[.)]\s/.test(l))

  return {
    title: (title || fallbackTitle).slice(0, 140).trim(),
    excerpt: paragraph ? trimToWord(paragraph, MAX_EXCERPT) : '',
    body: rest,
  }
}

/** Cut at a sentence end if there is one past halfway, otherwise at a word.
 *  Never mid-word, and no ellipsis on a sentence that already ended. */
export function trimToWord(text: string, max: number): string {
  if (text.length <= max) return text
  const window = text.slice(0, max)
  const sentence = window.lastIndexOf('. ')
  if (sentence > max * 0.5) return window.slice(0, sentence + 1).trim()
  const space = window.lastIndexOf(' ')
  return `${window.slice(0, space > 0 ? space : max).trim()}…`
}
