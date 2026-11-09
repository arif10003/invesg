import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");

test("specific Insights routes precede the dynamic article route", () => {
  const dynamic = app.indexOf('path="/insights/:slug"');
  for (const route of ["/insights/media", "/insights/topics/:slug", "/insights/sectors/:slug", "/insights/authors/:slug"]) {
    assert.ok(app.indexOf(`path="${route}"`) > -1 && app.indexOf(`path="${route}"`) < dynamic);
  }
});

test("preview and duplicate routes resolve to canonical paths", () => {
  assert.match(app, /path="\/sustainability" element={<IntelligencePreviewPage/);
  assert.match(app, /path="\/opportunity" element={<IntelligencePreviewPage/);
  assert.match(app, /path="\/decision-navigator" element={<Navigate to="\/solutions" replace/);
  assert.match(app, /path="\/opportunities" element={<Navigate to="\/opportunity" replace/);
});

test("application has a catch-all not-found route", () => {
  assert.match(app, /path="\*" element={<NotFoundPage/);
});

test("robots references the sitemap and sitemap excludes hidden routes", () => {
  assert.match(robots, /Sitemap: https:\/\/invesg\.co\/sitemap\.xml/);
  assert.doesNotMatch(sitemap, /decision-navigator|opportunities\//);
  for (const path of ["solutions", "insights", "about", "contact", "sustainability", "opportunity"]) assert.match(sitemap, new RegExp(`https://invesg\\.co/${path}`));
});
