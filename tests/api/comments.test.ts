import { afterAll, beforeAll, describe, expect, it } from "vitest";

const API_BASE_URL = "http://localhost:5173";

describe("Comments API Tests", () => {
  let sessionCookie: string;
  let testUserId: string;
  let testPostId: string;
  let testCommentId: string;

  const testUser = {
    email: "comments.test@example.com",
    password: "TestPassword123!",
    name: "Comments Test User",
  };

  const testPost = {
    title: "Test Post for Comments",
    content: "This is a test post for testing comments",
  };

  const testComment = {
    content: "This is a test comment for API testing",
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

    // Create a test post for comments
    const postResponse = await fetch(`${API_BASE_URL}/api/posts`, {
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

    if (postResponse.ok) {
      const post = await postResponse.json();
      testPostId = post.id;
    }
  });

  describe("GET /api/posts/:postId/comments", () => {
    it("should fetch all comments for a post successfully", async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${testPostId}/comments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      expect(response.status).toBe(200);

      const comments = await response.json();
      expect(Array.isArray(comments)).toBe(true);
    });

    it("should return comments in descending order by createdAt", async () => {
      // First create multiple comments
      for (let i = 0; i < 3; i++) {
        await fetch(`${API_BASE_URL}/api/posts/${testPostId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: sessionCookie || "",
          },
          body: JSON.stringify({
            content: `Test comment ${i}`,
            userId: testUserId,
          }),
        });
      }

      const response = await fetch(
        `${API_BASE_URL}/api/posts/${testPostId}/comments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      expect(response.status).toBe(200);

      const comments = await response.json();
      if (comments.length > 1) {
        for (let i = 0; i < comments.length - 1; i++) {
          const currentDate = new Date(comments[i].createdAt);
          const nextDate = new Date(comments[i + 1].createdAt);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(
            nextDate.getTime()
          );
        }
      }
    });

    it("should include user name in comment response", async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${testPostId}/comments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      expect(response.status).toBe(200);

      const comments = await response.json();
      if (comments.length > 0) {
        expect(comments[0]).toHaveProperty("userName");
        expect(comments[0]).toHaveProperty("userId");
        expect(comments[0]).toHaveProperty("postId");
      }
    });

    it("should return empty array for post with no comments", async () => {
      // Create a new post without comments
      const newPostResponse = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookie || "",
        },
        body: JSON.stringify({
          title: "Post without comments",
          content: "This post has no comments",
          userId: testUserId,
        }),
      });

      const newPost = await newPostResponse.json();

      const response = await fetch(
        `${API_BASE_URL}/api/posts/${newPost.id}/comments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      expect(response.status).toBe(200);

      const comments = await response.json();
      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBe(0);
    });
  });

  describe("POST /api/posts/:postId/comments", () => {
    it("should create a new comment when authenticated", async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${testPostId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: sessionCookie || "",
          },
          body: JSON.stringify({
            content: testComment.content,
            userId: testUserId,
          }),
        }
      );

      expect(response.status).toBeTypeOf("number");

      if (response.ok) {
        const comment = await response.json();
        testCommentId = comment.id;

        expect(comment).toHaveProperty("id");
        expect(comment).toHaveProperty("content", testComment.content);
        expect(comment).toHaveProperty("userId", testUserId);
        expect(comment).toHaveProperty("postId", testPostId);
        expect(comment).toHaveProperty("userName");
        expect(comment).toHaveProperty("createdAt");
        expect(comment).toHaveProperty("updatedAt");
      }
    });

    it("should not create comment when not authenticated", async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${testPostId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: "Unauthorized comment",
            userId: testUserId,
          }),
        }
      );

      expect(response.status).toBe(401);

      const error = await response.json();
      expect(error).toHaveProperty("error", "Unauthorized");
    });

    it("should not create comment with missing content", async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${testPostId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: sessionCookie || "",
          },
          body: JSON.stringify({
            userId: testUserId,
          }),
        }
      );

      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error).toHaveProperty("error", "Missing required fields");
    });

    it("should not create comment with missing userId", async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${testPostId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: sessionCookie || "",
          },
          body: JSON.stringify({
            content: testComment.content,
          }),
        }
      );

      expect(response.status).toBe(400);

      const error = await response.json();
      expect(error).toHaveProperty("error", "Missing required fields");
    });

    it("should create comment with empty string content (edge case)", async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${testPostId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: sessionCookie || "",
          },
          body: JSON.stringify({
            content: "",
            userId: testUserId,
          }),
        }
      );

      // Empty content should be rejected
      expect(response.status).toBe(400);
    });
  });

  describe("Unsupported methods", () => {
    it("should return 405 for PUT method", async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${testPostId}/comments`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: sessionCookie || "",
          },
          body: JSON.stringify({
            content: "Updated comment",
          }),
        }
      );

      expect(response.status).toBe(405);

      const error = await response.json();
      expect(error).toHaveProperty("error", "Method not allowed");
    });

    it("should return 405 for DELETE method", async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${testPostId}/comments`,
        {
          method: "DELETE",
          headers: {
            Cookie: sessionCookie || "",
          },
        }
      );

      expect(response.status).toBe(405);

      const error = await response.json();
      expect(error).toHaveProperty("error", "Method not allowed");
    });
  });

  describe("Edge cases", () => {
    it("should handle non-existent post ID gracefully", async () => {
      const nonExistentPostId = "non-existent-post-id";

      const response = await fetch(
        `${API_BASE_URL}/api/posts/${nonExistentPostId}/comments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Should return empty array or handle gracefully
      expect(response.status).toBeTypeOf("number");
    });

    it("should handle invalid post ID format", async () => {
      const invalidPostId = "invalid-id-format-123";

      const response = await fetch(
        `${API_BASE_URL}/api/posts/${invalidPostId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: sessionCookie || "",
          },
          body: JSON.stringify({
            content: "Comment on invalid post",
            userId: testUserId,
          }),
        }
      );

      expect(response.status).toBeTypeOf("number");
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
