import Database from "better-sqlite3";
import { describe, expect, it, vi } from "vitest";
import { auth } from "./auth";

// Mock the database
vi.mock("better-sqlite3", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      prepare: vi.fn(),
      exec: vi.fn(),
      close: vi.fn(),
    })),
  };
});

// Mock better-auth and its plugins
vi.mock("better-auth", () => ({
  betterAuth: vi.fn().mockImplementation(() => ({
    // Mock auth methods
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
    verifyEmail: vi.fn(),
  })),
}));

vi.mock("better-auth/plugins", () => ({
  twoFactor: vi.fn().mockReturnValue({
    setup: vi.fn(),
    verify: vi.fn(),
  }),
}));

vi.mock("better-auth/plugins/passkey", () => ({
  passkey: vi.fn().mockReturnValue({
    register: vi.fn(),
    authenticate: vi.fn(),
  }),
}));

describe("DB Configuration", () => {
  it("should initialize auth with correct configuration", () => {
    expect(auth).toBeDefined();
    expect(Database).toHaveBeenCalledWith("./sqlite.db");
  });
});
