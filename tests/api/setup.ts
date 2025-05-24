import { afterAll, beforeAll } from "vitest";

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || "http://localhost:5173",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Test Data
export const TEST_DATA = {
  AUTH: {
    VALID_USER: {
      email: "api.test@example.com",
      password: "ApiTest123!",
      name: "API Test User",
    },
    INVALID_USER: {
      email: "invalid-email",
      password: "123",
      name: "Invalid User",
    },
  },
  POSTS: {
    VALID_POST: {
      title: "API Test Post",
      content: "This is a test post for API testing",
    },
    INVALID_POST: {
      title: "",
      content: "",
    },
  },
  COMMENTS: {
    VALID_COMMENT: {
      content: "This is a test comment for API testing",
    },
    INVALID_COMMENT: {
      content: "",
    },
  },
};

// Helper Functions
export class ApiTestHelper {
  static async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async retryRequest(
    requestFn: () => Promise<Response>,
    maxAttempts: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<Response> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await requestFn();
        return response;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxAttempts) {
          await this.delay(1000 * attempt); // Exponential backoff
        }
      }
    }

    throw lastError!;
  }

  static extractSessionCookie(response: Response): string | null {
    const cookieHeader = response.headers.get("set-cookie");
    if (!cookieHeader) return null;

    // Extract session cookie from Set-Cookie header
    const sessionMatch = cookieHeader.match(/session=([^;]+)/);
    return sessionMatch ? sessionMatch[0] : cookieHeader;
  }

  static createAuthenticatedHeaders(sessionCookie?: string): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (sessionCookie) {
      headers["Cookie"] = sessionCookie;
    }

    return headers;
  }

  static async makeRequest(
    url: string,
    options: RequestInit = {},
    useRetry: boolean = false
  ): Promise<Response> {
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const requestFn = () => fetch(url, requestOptions);

    if (useRetry) {
      return this.retryRequest(requestFn);
    }

    return requestFn();
  }

  static async waitForServer(
    maxAttempts: number = 10,
    interval: number = 1000
  ): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/posts`, {
          method: "GET",
        });

        if (response.status < 500) {
          return true;
        }
      } catch (error) {
        // Server not ready yet
      }

      if (attempt < maxAttempts) {
        await this.delay(interval);
      }
    }

    return false;
  }

  static validateResponseStructure(
    data: any,
    expectedProps: string[],
    optionalProps: string[] = []
  ): boolean {
    for (const prop of expectedProps) {
      if (!(prop in data)) {
        throw new Error(`Missing required property: ${prop}`);
      }
    }

    return true;
  }

  static generateUniqueEmail(prefix: string = "test"): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}.${timestamp}.${random}@example.com`;
  }

  static generateTestData(overrides: any = {}): any {
    return {
      email: this.generateUniqueEmail(),
      password: "TestPass123!",
      name: "Test User",
      ...overrides,
    };
  }
}

// Global test setup
beforeAll(async () => {
  console.log("🚀 Starting API tests...");
  console.log(`📍 API Base URL: ${API_CONFIG.BASE_URL}`);

  // Wait for server to be ready
  const serverReady = await ApiTestHelper.waitForServer();
  if (!serverReady) {
    throw new Error(
      "Server is not responding. Please ensure the application is running."
    );
  }

  console.log("✅ Server is ready");
}, 30000);

afterAll(async () => {
  console.log("🏁 API tests completed");
});

// Custom matchers for vitest
export const customMatchers = {
  toBeOneOf: (received: any, expected: any[]) => {
    const pass = expected.includes(received);
    return {
      pass,
      message: () => `Expected ${received} to be one of ${expected.join(", ")}`,
    };
  },

  toHaveValidTimestamp: (received: string) => {
    const date = new Date(received);
    const pass = !isNaN(date.getTime());
    return {
      pass,
      message: () => `Expected ${received} to be a valid timestamp`,
    };
  },

  toHaveValidUUID: (received: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    return {
      pass,
      message: () => `Expected ${received} to be a valid UUID`,
    };
  },
};
