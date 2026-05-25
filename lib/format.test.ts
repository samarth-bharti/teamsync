import { describe, it, expect } from "vitest";
import { formatDate } from "./format";

describe("formatDate", () => {
  it("formats a local-time ISO datetime as 'Mon D, YYYY'", () => {
    // No timezone offset → the date is parsed AND formatted in the same local
    // zone, so the calendar date is stable no matter where the test runs.
    expect(formatDate("2026-03-14T12:00:00")).toBe("Mar 14, 2026");
  });

  it("does not zero-pad single-digit days", () => {
    expect(formatDate("2026-01-09T08:30:00")).toBe("Jan 9, 2026");
    expect(formatDate("2026-12-01T23:15:00")).toBe("Dec 1, 2026");
  });

  it("returns an empty string for invalid input", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate("not-a-date")).toBe("");
    expect(formatDate("2026-13-40T00:00:00")).toBe("");
  });

  it("renders the 'Mon D, YYYY' shape for a UTC ('Z') timestamp", () => {
    // For an absolute (UTC) instant the displayed day can shift by the runner's
    // timezone, so assert the shape + the stable month/year, not an exact day.
    const out = formatDate("2026-07-04T12:00:00Z");
    expect(out).toMatch(/^[A-Z][a-z]{2} \d{1,2}, 2026$/);
    expect(out).toContain("Jul");
  });
});
