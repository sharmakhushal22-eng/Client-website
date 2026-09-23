import 'server-only'
import {
  deriveMeta,
  htmlToMarkup,
  markdownToMarkup,
  pdfTextToMarkup,
  type Converted,
} from './markup'

/* ============================================================================
 * An uploaded file → the title, excerpt and body of a draft post.
 *
 * WHAT THIS IS NOT. It does not save anything. Every path here ends at a
 * filled-in form the editor reads, edits and submits themselves. A file that
 * imported straight to a published row would put whatever a parser guessed on
 * the public site, and these parsers guess — a PDF has no headings, only
 * larger text, and "larger text" is not something the extracted text layer
 * records.
 *
 * WHAT IT ACCEPTS. .docx, .pdf, .md, .txt, .html and .rtf. The obvious
 * absentees are the legacy binary .doc and .odt, and they are refused BY NAME
 * with the fix in the message, because "unsupported file" next to a file the
 * person can plainly see is a Word document is a dead end. Word and Pages
 * both export .docx in two clicks.
 *
 * WHY NO OCR. A scanned PDF has no text layer at all — the page is a picture
 * of words. Every extractor returns an empty string, and the honest response
 * is to say so and name the workaround, not to ship an OCR engine into a
 * serverless function.
 * ========================================================================= */

/** Vercel's serverless request body cap is 4.5 MB, so a larger upload fails at
 *  the platform with an opaque 413 and no message of ours. Refuse it at 4 MB
 *  where we can still explain what happened. A document this size is almost
 *  always images anyway, and the images are not going to survive. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

export type Extracted = {
  title: string
  excerpt: string
  body: string
  warnings: string[]
  /** Echoed back so the editor can say what it read. */
  format: string
  filename: string
}

/** Thrown for anything the editor can act on: the wrong format, an empty
 *  file, a scan. The message goes straight to the screen, so it says what to
 *  do next rather than what went wrong internally. */
export class ImportError extends Error {}

const EXT = /\.([a-z0-9]+)$/i

function extensionOf(name: string): string {
  return (name.match(EXT)?.[1] ?? '').toLowerCase()
}

/** A filename is the last resort for a title, but a decent one: people name
 *  documents after what is in them. */
function titleFromFilename(name: string): string {
  return name
    .replace(EXT, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\d{4}[-\s]\d{2}[-\s]\d{2}\s*/, '')  // a date prefix is not a title
    .trim()
    .replace(/^./, (c) => c.toUpperCase())
}

export async function extractDocument(file: File): Promise<Extracted> {
  if (file.size === 0) throw new ImportError('That file is empty.')
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImportError(
      `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 4 MB — ` +
        'if it is mostly images, save a text-only copy, because images are not imported anyway.',
    )
  }

  const filename = file.name || 'document'
  const ext = extensionOf(filename)
  const buffer = Buffer.from(await file.arrayBuffer())

  let converted: Converted
  let format: string

  switch (ext) {
    case 'docx':
      format = 'Word document'
      converted = await fromDocx(buffer)
      break

    case 'pdf':
      format = 'PDF'
      converted = await fromPdf(buffer)
      break

    case 'html':
    case 'htm':
      format = 'HTML'
      converted = htmlToMarkup(buffer.toString('utf8'))
      break

    case 'rtf':
      format = 'RTF'
      converted = fromRtf(buffer.toString('utf8'))
      break

    case 'md':
    case 'markdown':
    case 'mdx':
      format = 'Markdown'
      converted = markdownToMarkup(buffer.toString('utf8'))
      break

    case 'txt':
    case 'text':
    case '':
      format = 'Plain text'
      converted = markdownToMarkup(buffer.toString('utf8'))
      break

    case 'doc':
      throw new ImportError(
        'The old .doc format cannot be read. Open it in Word and use File → Save As → .docx, then upload that.',
      )

    case 'odt':
      throw new ImportError(
        'OpenDocument (.odt) is not supported. In LibreOffice use File → Save As → Word (.docx), then upload that.',
      )

    case 'pages':
      throw new ImportError(
        'Apple Pages files are not supported. In Pages use File → Export To → Word, then upload that.',
      )

    default:
      throw new ImportError(
        `.${ext} files cannot be read. Upload a .docx, .pdf, .md, .txt, .html or .rtf — ` +
          'or paste the text straight into the body, which keeps headings and lists.',
      )
  }

  if (!converted.body.trim()) {
    throw new ImportError(
      ext === 'pdf'
        ? 'That PDF has no text in it — it looks like a scan or an export of images. ' +
          'Run it through OCR, or copy the text from the original document and paste it in.'
        : 'No text could be read from that file.',
    )
  }

  const meta = deriveMeta(converted.body, titleFromFilename(filename))

  return {
    title: meta.title,
    excerpt: meta.excerpt,
    body: meta.body,
    warnings: converted.warnings,
    format,
    filename,
  }
}

/* ── .docx ──────────────────────────────────────────────────────────────── */

async function fromDocx(buffer: Buffer): Promise<Converted> {
  /* Imported lazily, and so is the PDF reader below. Both are large, and the
     admin panel should not carry either into memory for the several hundred
     requests a day that are not an import. */
  const mammoth = (await import('mammoth')).default

  let html: string
  let messages: { type: string; message: string }[]
  try {
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        /* Word's own "Title" style is a paragraph style, not a heading, so
           without this the document's title arrives as a plain paragraph and
           deriveMeta has nothing to lift. */
        styleMap: [
          "p[style-name='Title'] => h1:fresh",
          "p[style-name='Subtitle'] => h2:fresh",
          "p[style-name='Quote'] => p:fresh",
          "p[style-name='Intense Quote'] => p:fresh",
        ],
        /* Images would otherwise arrive as base64 data URIs inside the HTML —
           megabytes of string for something the blog cannot render anyway. */
        convertImage: mammoth.images.imgElement(() => Promise.resolve({ src: '' })),
      },
    )
    html = result.value
    messages = result.messages
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    /* The common case by far: a .doc, or anything else, renamed to .docx. */
    if (/zip|end of central directory|not a valid/i.test(msg)) {
      throw new ImportError(
        'That file is not a real Word document — the name ends in .docx but the contents are something else. ' +
          'Open it in Word and save a fresh copy as .docx.',
      )
    }
    throw new ImportError(`That Word document could not be read: ${msg}`)
  }

  const converted = htmlToMarkup(html)
  const warnings = new Set(converted.warnings)

  /* Mammoth reports every style it did not recognise, once per occurrence —
     a document with forty paragraphs in one custom style produces forty
     identical warnings. Count the DISTINCT ones: "three styles came through
     flat" is information, "forty warnings" is noise. */
  const unrecognised = new Set(
    messages.filter((m) => m.type === 'warning').map((m) => m.message),
  ).size
  if (unrecognised > 2) {
    warnings.add(
      `${unrecognised} custom Word styles had no equivalent here, so those parts came through as plain paragraphs. ` +
        'Headings made with Word’s built-in Heading 1/2/3 styles always survive.',
    )
  }

  return { body: converted.body, warnings: [...warnings] }
}

/* ── .pdf ───────────────────────────────────────────────────────────────── */

async function fromPdf(buffer: Buffer): Promise<Converted> {
  const { extractText, getDocumentProxy, getMeta } = await import('unpdf')

  let text: string[]
  let metaTitle = ''
  try {
    /* A copy, not a view: pdf.js transfers and detaches the buffer it is
       handed, and a detached Buffer is an unhelpful crash two lines later. */
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    /* Page by page, NOT merged. The page breaks are how running headers and
       footers are identified — merged into one string they are just lines
       that happen to repeat, and a two-page document does not repeat them
       often enough to be sure. */
    const result = await extractText(pdf, { mergePages: false })
    text = result.text

    try {
      const meta = await getMeta(pdf)
      const raw = String((meta.info as Record<string, unknown> | undefined)?.Title ?? '').trim()
      /* Word and Chrome stamp a filename in there; that is not a title. */
      if (raw && !/^(untitled|microsoft word|document\d*)/i.test(raw) && !/\.(docx?|pdf)$/i.test(raw)) {
        metaTitle = raw
      }
    } catch {
      /* Metadata is a nicety. A PDF without it still imports. */
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (/password|encrypt/i.test(msg)) {
      throw new ImportError('That PDF is password protected. Remove the password and upload it again.')
    }
    if (/invalid pdf|structure/i.test(msg)) {
      throw new ImportError('That file is not a readable PDF — it may be damaged or only part of a download.')
    }
    throw new ImportError(`That PDF could not be read: ${msg}`)
  }

  const converted = pdfTextToMarkup(text)
  /* A title from the file's own metadata beats one guessed from the first
     line, so put it where deriveMeta will lift it. */
  const body = metaTitle ? `## ${metaTitle}\n\n${converted.body}` : converted.body
  return { body, warnings: converted.warnings }
}

/* ── .rtf ───────────────────────────────────────────────────────────────── */

/** Groups whose contents are structure, not text: the font table, the colour
 *  table, the stylesheet, embedded pictures and objects. */
const RTF_DESTINATION =
  /^\{(?:\\\*)?\\(fonttbl|colortbl|stylesheet|listtable|listoverridetable|info|pict|object|themedata|colorschememapping|latentstyles|datastore|generator|xmlnstbl|rsidtbl|filetbl|upr|header[lrf]?|footer[lrf]?|footnote)\b/i

/** Remove those groups, braces and all.
 *
 *  A regex cannot do this. `{\fonttbl{\f0 Calibri;}}` nests, and a non-greedy
 *  match stops at the first `}` — which is why the font name used to end up
 *  in the post. So the braces are counted, escaped ones (`\{`) skipped, and
 *  the whole group dropped at its real end. */
function dropRtfDestinations(input: string): string {
  let out = ''
  for (let i = 0; i < input.length; i += 1) {
    if (input[i] !== '{' || !RTF_DESTINATION.test(input.slice(i, i + 40))) {
      out += input[i]
      continue
    }
    let depth = 0
    for (; i < input.length; i += 1) {
      const c = input[i]
      if (c === '\\') { i += 1; continue }   // an escaped brace is not a brace
      if (c === '{') depth += 1
      else if (c === '}') {
        depth -= 1
        if (depth === 0) break
      }
    }
  }
  return out
}

/** RTF is a control-word format, not a markup one, and a full reader is a
 *  project. This strips it down to text and line breaks, which is all the
 *  blog can show anyway — and says so, because an RTF with a real table will
 *  come through as loose lines. */
function fromRtf(input: string): Converted {
  const text = dropRtfDestinations(input)
    .replace(/\\'([0-9a-f]{2})/gi, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\u(-?\d+)\??/g, (_, code: string) => {
      const n = Number(code)
      return String.fromCharCode(n < 0 ? n + 65536 : n)
    })
    .replace(/\\(par|line|pard)\b\s?/g, '\n')
    .replace(/\\tab\b\s?/g, ' ')
    .replace(/\\bullet\b\s?/g, '• ')
    .replace(/\\emdash\b\s?/g, '—')
    .replace(/\\endash\b\s?/g, '–')
    .replace(/\\[a-z]+-?\d*\s?/gi, '')   // every other control word
    .replace(/[{}]/g, '')
    .replace(/\n{3,}/g, '\n\n')

  const converted = markdownToMarkup(text)
  return {
    body: converted.body,
    warnings: [
      ...converted.warnings,
      'RTF keeps no structure this site can read, so everything came through as paragraphs and bullets. Add the headings yourself.',
    ],
  }
}
