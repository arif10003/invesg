import test from "node:test";
import assert from "node:assert/strict";
import { resolveContactContext } from "../src/data/contactContext.js";

test("accepts valid Solutions Explorer identifiers", () => {
  const context = resolveContactContext(new URLSearchParams("source=solutions&challenge=climate-nature-risks&sector=Mining&service=CLM-02"));
  assert.equal(context.source, "solutions");
  assert.equal(context.values.challenge_id, "climate-nature-risks");
  assert.equal(context.values.sector, "Mining");
  assert.equal(context.values.service_id, "CLM-02");
});

test("drops unknown context values", () => {
  const context = resolveContactContext(new URLSearchParams("source=solutions&challenge=malicious&sector=Unknown&service=NONE"));
  assert.deepEqual(context.values, { challenge_id: null, service_id: null, sector: null });
});

test("does not trust unknown source or unpublished Insight slug", () => {
  assert.equal(resolveContactContext(new URLSearchParams("source=unexpected")).source, "contact");
  const insight = resolveContactContext(new URLSearchParams("source=insights&article=not-published"));
  assert.equal(insight.source, "insights");
  assert.equal(insight.values.article_slug, null);
});
