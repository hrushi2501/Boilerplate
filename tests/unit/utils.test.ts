import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
  });

  it("handles conditional classes", () => {
    const isHidden = false;
    const isPrimary = true;
    expect(cn("base", isHidden && "hidden", isPrimary && "text-primary")).toBe(
      "base text-primary",
    );
  });
});
