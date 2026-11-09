import { expect, it } from "vitest";
import { findRawHex } from "../../scripts/check-design.mjs";
it("detects hex colors in CSS and JSX while allowing token references", () => {
  expect(
    findRawHex("color: #fff; background: #12345678; tint='#007AFF'"),
  ).toEqual(["#fff", "#12345678", "#007AFF"]);
  expect(findRawHex("color: var(--blue); href='#gallery'")).toEqual([]);
});
