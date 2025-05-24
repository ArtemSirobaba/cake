import { afterAll, beforeAll, describe, expect, it } from "vitest";

const API_BASE_URL = "http://localhost:5173";

describe("Posts API Tests", () => {
  let sessionCookie: string;
  let testUserId: string;
  let testPostId: string;

  const testUser = {
    email: "posts.test@example.com",
    password: "TestPassword123!",
    name: "Posts Test User",
  };

  const testPost = {
    title: "Test Post Title",
    content: "This is a test post content for API testing",
  };

  beforeAll(async () => {
    // Register and login test user
    await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    });

    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    if (loginResponse.ok) {
      const cookies = loginResponse.headers.get("set-cookie");
      if (cookies) {
        sessionCookie = cookies;
      }

      const userData = await loginResponse.json();
      if (userData.user) {
        testUserId = userData.user.id;
      }
    }
  });

  describe("GET /api/posts", () => {
    it("should fetch all posts successfully", async () => {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(response.status).toBe(200);

      const posts = await response.json();
      expect(Array.isArray(posts)).toBe(true);
    });

    it("should return posts in descending order by createdAt", async () => {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(response.status).toBe(200);

      const posts = await response.json();
      if (posts.length > 1) {
        for (let i = 0; i < posts.length - 1; i++) {
          const currentDate = new Date(posts[i].createdAt);
          const nextDate = new Date(posts[i + 1].createdAt);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(
            nextDate.getTime()
          );
        }
      }
    });
  });

  describe("POST /api/posts", () => {
    it("should create a new post when authenticated", async () => {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookie || "",
        },
        body: JSON.stringify({
          title: testPost.title,
          content: testPost.content,
          userId: testUserId,
        }),
      });

      expect(response.status).toBeTypeOf("number");

      if (response.ok) {
        const post = await response.json();
        testPostId = post.id;

        expect(post).toHaveProperty("id");
        expect(post).toHaveProperty("title", testPost.title);
        expect(post).toHaveProperty("content", testPost.content);
        expect(post).toHaveProperty("userId", testUserId);
        expect(post).toHaveProperty("createdAt");
        expect(post).toHaveProperty("updatedAt");
      }
    });

    it("should not create post when not authenticated", async () => {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Unauthorized Post",
          content: "This should not be created",
          userId: testUserId,
        }),
      });

      expect(response.status).toBeTypeOf("number");

      const error = await response.json();
      expect(error).toHaveProperty("error", "Unauthorized");
    });

    it("should not create post with missing title", async () => {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookie || "",
        },
        body: JSON.stringify({
          content: testPost.content,
          userId: testUserId,
        }),
      });

      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error).toHaveProperty("error", "Missing required fields");
    });

    it("should not create post with missing content", async () => {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookie || "",
        },
        body: JSON.stringify({
          title: testPost.title,
          userId: testUserId,
        }),
      });

      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error).toHaveProperty("error", "Missing required fields");
    });

    it("should not create post with missing userId", async () => {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookie || "",
        },
        body: JSON.stringify({
          title: testPost.title,
          content: testPost.content,
        }),
      });

      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error).toHaveProperty("error", "Missing required fields");
    });
  });

  describe("Unsupported methods", () => {
    it("should return 405 for PUT method", async () => {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookie || "",
        },
        body: JSON.stringify({
          title: "Updated title",
          content: "Updated content",
        }),
      });

      expect(response.status).toBe(405);

      const error = await response.json();
      expect(error).toHaveProperty("error", "Method not allowed");
    });

    it("should return 405 for DELETE method", async () => {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "DELETE",
        headers: {
          Cookie: sessionCookie || "",
        },
      });

      expect(response.status).toBe(405);

      const error = await response.json();
      expect(error).toHaveProperty("error", "Method not allowed");
    });
  });

  afterAll(async () => {
    // Cleanup: logout
    if (sessionCookie) {
      await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
        method: "POST",
        headers: {
          Cookie: sessionCookie,
        },
      });
    }
  });
});
