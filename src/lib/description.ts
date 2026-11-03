/**
 * Listing descriptions are plain text with two light markers, so they stay
 * easy to write in the admin textarea:
 *
 *   ## Payment terms     → a section heading
 *   - Reservation fee…   → a bullet (consecutive lines form one list)
 *
 * Blank lines separate paragraphs; anything else renders as written, so older
 * descriptions without markers still show the same as before.
 */
export type DescriptionBlock =
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "paragraph"; text: string };

const BULLET = /^[-•]\s+/;

export function parseDescription(text: string | null | undefined): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ kind: "paragraph", text: paragraph.join("\n") });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push({ kind: "list", items: list });
    list = null;
  };

  for (const raw of (text ?? "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      flushList();
    } else if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "heading", text: line.slice(3).trim() });
    } else if (BULLET.test(line)) {
      flushParagraph();
      (list ??= []).push(line.replace(BULLET, ""));
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

/** The whole description as plain text, markers stripped (structured data). */
export function plainDescription(text: string | null | undefined): string {
  return parseDescription(text)
    .map((b) => (b.kind === "list" ? b.items.join("\n") : b.text))
    .join("\n\n");
}

/**
 * The opening paragraph — written as the listing's summary, so it's what
 * search results show. Falls back to the whole text when there isn't one.
 */
export function descriptionSummary(text: string | null | undefined): string {
  const first = parseDescription(text).find((b) => b.kind === "paragraph");
  return first ? first.text : plainDescription(text);
}
