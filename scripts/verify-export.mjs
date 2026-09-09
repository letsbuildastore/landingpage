import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const output = resolve('dist/client');
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const html = readFileSync(resolve(output, 'index.html'), 'utf8');

function verifyAsset(reference) {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) return;
  const pathname = reference.split(/[?#]/)[0];
  if (!pathname) return;
  assert.ok(
    pathname.startsWith(`${basePath}/`),
    `Asset escapes base path: ${reference}`,
  );
  const file = resolve(output, pathname.slice(basePath.length + 1));
  assert.ok(
    file.startsWith(`${output}/`),
    `Asset escapes export: ${reference}`,
  );
  assert.ok(existsSync(file), `Missing exported asset: ${reference}`);
  if (file.endsWith('.css')) {
    const css = readFileSync(file, 'utf8');
    for (const [, url] of css.matchAll(/url\(["']?([^\s)"']+)["']?\)/g)) {
      if (url.startsWith('/')) verifyAsset(url);
    }
  }
}

for (const [, reference] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  verifyAsset(reference.replaceAll('&amp;', '&'));
}
for (const [, candidates] of html.matchAll(/(?:srcSet|srcset)="([^"]+)"/g)) {
  for (const candidate of candidates.split(',')) {
    verifyAsset(candidate.trim().split(/\s+/)[0]);
  }
}
for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(html.includes(`id="${anchor}"`), `Missing anchor: ${anchor}`);
}
assert.match(html, /<link[^>]+rel="icon"[^>]*>/);
assert.ok(html.includes(`${basePath}/favicon.svg`));
assert.ok(
  !html.includes('cobalt-speaker.png'),
  'Unoptimized hero image is referenced',
);
for (const width of [480, 960, 1448]) {
  const name = `cobalt-speaker-${width}.webp`;
  assert.ok(
    html.includes(`${basePath}/${name}`),
    `Missing image candidate: ${name}`,
  );
  assert.ok(
    statSync(resolve(output, name)).size < 150_000,
    `Image budget exceeded: ${name}`,
  );
}
assert.ok(existsSync(resolve(output, '.nojekyll')));
assert.ok(existsSync(resolve(output, '404.html')));
console.log(
  `Static export verified for ${basePath || '/'}: assets, anchors, favicon, responsive images, and 404 page.`,
);
