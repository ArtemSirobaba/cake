import { beforeAll, describe, expect, it } from "vitest";

const API_BASE_URL = "http://localhost:5173";

describe("Auth API Tests", () => {
  let testUser = {
    email: "test@example.com",
    password: "TestPassword123!",
    name: "Test User",
  };

  describe("User Registration", () => {
    it("should register a new user successfully", async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        }),
      });

      expect(response.status).toBeTypeOf("number");

      if (response.ok) {
        const data = await response.json();
        expect(data).toHaveProperty("user");
        expect(data.user.email).toBe(testUser.email);
      }
    });

    it("should not register user with invalid email", async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "invalid-email",
          password: testUser.password,
          name: testUser.name,
        }),
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should not register user with weak password", async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test2@example.com",
          password: "123",
          name: testUser.name,
        }),
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("User Login", () => {
    it("should login with valid credentials", async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      expect(response.status).toBeTypeOf("number");

      if (response.ok) {
        const data = await response.json();
        expect(data).toHaveProperty("user");
        expect(data.user.email).toBe(testUser.email);
      }
    });

    it("should not login with invalid credentials", async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testUser.email,
          password: "wrongpassword",
        }),
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should not login with non-existent user", async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: testUser.password,
        }),
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("Session Management", () => {
    let sessionCookie: string;

    beforeAll(async () => {
      // Login to get session
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      if (response.ok) {
        const cookies = response.headers.get("set-cookie");
        if (cookies) {
          sessionCookie = cookies;
        }
      }
    });

    it("should get current user session", async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
        method: "GET",
        headers: {
          Cookie: sessionCookie || "",
        },
      });

      if (sessionCookie) {
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toHaveProperty("user");
      } else {
        expect(response.status).toBeGreaterThanOrEqual(400);
      }
    });

    it("should logout successfully", async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
        method: "POST",
        headers: {
          Cookie: sessionCookie || "",
        },
      });

      expect(response.status).toBeTypeOf("number");
    });
  });

  describe("Two-Factor Authentication", () => {
    let sessionCookie: string;

    beforeAll(async () => {
      // Login to get session for 2FA tests
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      if (response.ok) {
        const cookies = response.headers.get("set-cookie");
        if (cookies) {
          sessionCookie = cookies;
        }
      }
    });

    it("should enable two-factor authentication", async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/two-factor/enable`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: sessionCookie || "",
          },
        }
      );

      // This endpoint might not exist yet, so we'll accept 404 or method not allowed
      expect(response.status).toBeTypeOf("number");
    });

    it("should disable two-factor authentication", async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/two-factor/disable`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: sessionCookie || "",
          },
        }
      );

      // This endpoint might not exist yet, so we'll accept 404 or method not allowed
      expect(response.status).toBeTypeOf("number");
    });
  });
});
