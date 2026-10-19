import assert from "node:assert/strict";
import { projectReferralUrl } from "../libs/projectReferral.mjs";

const original = "https://onenil.org/groups?plan=free#invite";
const url = new URL(projectReferralUrl(original, "onenil", "projects-card"));
assert.equal(url.origin + url.pathname, "https://onenil.org/groups");
assert.equal(url.searchParams.get("plan"), "free");
assert.equal(url.hash, "#invite");
for (const [key, value] of Object.entries({
  ref: "ozzo.blog",
  utm_source: "ozzo.blog",
  utm_medium: "referral",
  utm_campaign: "onenil",
  utm_content: "projects-card",
}))
  assert.equal(url.searchParams.get(key), value);
assert.equal(
  new URL(
    projectReferralUrl(url.href, "onenil", "project-player"),
  ).searchParams.get("utm_content"),
  "project-player",
);
assert.equal(
  new URL(
    projectReferralUrl(url.href, "onenil", "project-player"),
  ).searchParams.getAll("ref").length,
  1,
);
for (const href of [
  undefined,
  null,
  "",
  "/projects/onenil",
  "#notes",
  "mailto:hello@onenil.org",
  "https://ozzo.blog/projects",
  "https://www.ozzo.blog/",
])
  assert.equal(projectReferralUrl(href, "onenil", "projects-card"), href);
console.log(
  "PASS project referral attribution, existing queries/fragments, private projects and canonical/internal URLs",
);
