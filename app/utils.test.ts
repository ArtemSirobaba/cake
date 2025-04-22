import { describe, expect, it } from "vitest";
import { cn } from "./lib/utils";

describe("Utility Functions", () => {
  describe("cn function", () => {
    it("should merge class names correctly", () => {
      const result = cn("class1", "class2");
      expect(result).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      const result = cn("base", { active: true, disabled: false });
      expect(result).toBe("base active");
    });

    it("should handle multiple conditional classes", () => {
      const result = cn(
        "base",
        { active: true },
        { disabled: false },
        "additional"
      );
      expect(result).toBe("base active additional");
    });

    it("should handle empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle undefined and null values", () => {
      const result = cn("base", undefined, null);
      expect(result).toBe("base");
    });
  });
});
