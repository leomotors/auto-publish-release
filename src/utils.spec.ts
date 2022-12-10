import { describe, expect, it } from "vitest";

import { isPrerelease } from "./utils";

describe("Utils", () => {
  it("isPrerelease", () => {
    it("Normal Case", () => {
      expect(isPrerelease("1.0.2", false)).toBe(false);
      expect(isPrerelease("6.9.420", false)).toBe(false);
      expect(isPrerelease("6.9.420.177013", false)).toBe(false);

      expect(isPrerelease("6.9.420.177013-beta", false)).toBe(true);
    });

    it("Leading Zero with option off", () => {
      expect(isPrerelease("0.9.420", false)).toBe(false);
      expect(isPrerelease("0.9.420.177013", false)).toBe(false);

      expect(isPrerelease("0.9.2-beta.4", false)).toBe(true);
    });

    it("Leading Zero with option on", () => {
      expect(isPrerelease("0.9.420", true)).toBe(true);
      expect(isPrerelease("0.9.420.177013", true)).toBe(true);

      expect(isPrerelease("0.9.2-beta.4", true)).toBe(true);
    });
  });
});
