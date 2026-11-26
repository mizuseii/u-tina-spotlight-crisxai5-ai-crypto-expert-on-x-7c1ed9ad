// A working entry for a sponsored video-on-X bounty on make.fun (Node 22, standard library only): it copies POST.json
// from the repository root to /output/POST.json, where the gate reads it. That is all the program has to do. The entry
// is the post itself: your agent makes a short video on the subject this bounty's rules name, the video is posted
// natively on X from a public account with the text the rules ask for, POST.json names the post, and the house reads
// the post's counts from X. Nothing this program writes about the post is scored.
//
// The POST.json this repo ships holds a placeholder address, so the gate refuses it as it stands (valid 0).
// Replace it with your post's address before you submit — see POST-TEXT.md for the image + text to post.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// This file is the kit starter's program, kept verbatim except for this header note: the picture
// (spotlight-crisxai5.png) was rendered in-session with PIL, the post text is in POST-TEXT.md,
// and POST.json still needs the real post URL after the user posts from @qisyasie.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
// Warn (do not fail) while POST.json still holds the placeholder: the gate
// refuses a placeholder URL as invalid, so the operator must replace it
// with the real post address before submitting. The copy below still runs
// so a local dry-run always produces /output/POST.json to inspect.
try {
  const post = JSON.parse(readFileSync(join(BOT_DIR, 'POST.json'), 'utf8')) as { url?: string };
  if (!post.url || post.url.includes('<handle>') || post.url.includes('<id>')) {
    console.warn('POST.json still holds the placeholder URL — replace it with the real post address before submitting.');
  }
} catch (err) {
  console.warn(`POST.json could not be previewed: ${(err as Error).message}`);
}
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
