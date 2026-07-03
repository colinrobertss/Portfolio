// Regenerates src/lib/tracks.ts from the contents of public/audio/.
//
// For each audio file, reads embedded ID3 (or equivalent) metadata via
// music-metadata and uses common.title / common.artist when present.
// Falls back to a cleaned-up version of the filename when metadata is
// missing. Run directly with `npm run sync-tracks`, or let it run
// automatically via the predev/prebuild npm scripts.
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFile } from "music-metadata";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const AUDIO_DIR = path.join(ROOT_DIR, "public", "audio");
const OUTPUT_FILE = path.join(ROOT_DIR, "src", "lib", "tracks.ts");

const AUDIO_EXTENSIONS = new Set([".mp3", ".wav", ".flac", ".m4a", ".aac", ".ogg", ".opus", ".wma"]);

function stripExtension(filename) {
  return filename.replace(/\.[^.]+$/, "");
}

// "10 - DJBewser - SWV - I'm So Into You (Flip).mp3" -> "Djbewser SWV I'm So Into You (Flip)"
function fallbackTitle(filename) {
  let name = stripExtension(filename);
  name = name.replace(/^\d+\s*[-._]\s*/, ""); // strip a leading track-number prefix
  name = name.replace(/[-_]+/g, " ");
  name = name.replace(/\s+/g, " ").trim();
  return name.replace(/\w\S*/g, (word) => {
    if (word.length > 1 && word === word.toUpperCase()) return word; // preserve acronyms
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

function slugify(text) {
  const base = text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "track";
}

function uniqueId(candidate, used) {
  let id = candidate;
  let n = 2;
  while (used.has(id)) {
    id = `${candidate}-${n}`;
    n += 1;
  }
  used.add(id);
  return id;
}

async function readTracks() {
  let entries;
  try {
    entries = await readdir(AUDIO_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = entries
    .filter((e) => e.isFile() && !e.name.startsWith(".") && AUDIO_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const usedIds = new Set();
  const tracks = [];

  for (const filename of files) {
    let title;
    let artist;
    try {
      const metadata = await parseFile(path.join(AUDIO_DIR, filename));
      title = metadata.common.title?.trim() || fallbackTitle(filename);
      artist = metadata.common.artist?.trim() || "Unknown Artist";
    } catch (err) {
      console.warn(`[sync-tracks] Could not read metadata for "${filename}": ${err.message}`);
      title = fallbackTitle(filename);
      artist = "Unknown Artist";
    }

    tracks.push({
      id: uniqueId(slugify(title), usedIds),
      title,
      artist,
      src: `/audio/${filename}`,
    });
  }

  return tracks;
}

function renderTrack(track) {
  return [
    "  {",
    `    id: ${JSON.stringify(track.id)},`,
    `    title: ${JSON.stringify(track.title)},`,
    `    artist: ${JSON.stringify(track.artist)},`,
    `    src: ${JSON.stringify(track.src)},`,
    "  },",
  ].join("\n");
}

function renderFile(tracks) {
  const body = tracks.length > 0 ? tracks.map(renderTrack).join("\n") + "\n" : "";
  return `// AUTO-GENERATED — do not edit by hand.
//
// Regenerated from public/audio/ by scripts/sync-tracks.mjs, which runs
// automatically via the predev/prebuild npm scripts. Title/artist come from
// each file's embedded metadata when present, otherwise from a cleaned-up
// version of the filename. Re-run \`npm run sync-tracks\` after adding,
// removing, or replacing files in public/audio/.
export interface Track {
  id: string;
  title: string;
  artist: string;
  /** Path under /public. */
  src: string;
}

export const TRACKS: Track[] = [
${body}];
`;
}

async function main() {
  const tracks = await readTracks();
  await writeFile(OUTPUT_FILE, renderFile(tracks));
  console.log(`[sync-tracks] Wrote ${tracks.length} track(s) to ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
}

main().catch((err) => {
  console.error("[sync-tracks] Failed:", err);
  process.exitCode = 1;
});
