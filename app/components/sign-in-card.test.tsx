import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { signIn } from "~/lib/auth-client";
import SignInCard from "./sign-in-card";

// Mock dependencies
vi.mock("~/lib/auth-client", () => ({
  signIn: {
    email: vi.fn().mockResolvedValue(undefined),
    passkey: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("SignInCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignInCard = () => {
    return render(
      <MemoryRouter>
        <SignInCard />
      </MemoryRouter>
    );
  };

  it("renders correctly", () => {
    renderSignInCard();

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("m~example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Remember me")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign-in with Passkey")).toBeInTheDocument();
  });

  it("updates email state when input changes", () => {
    renderSignInCard();
    const emailInput = screen.getByPlaceholderText("m~example.com");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");
  });

  it("updates password state when input changes", () => {
    renderSignInCard();
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput).toHaveValue("password123");
  });

  it("toggles remember me checkbox", () => {
    renderSignInCard();
    const checkbox = screen.getByRole("checkbox", { name: /remember me/i });

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("calls signIn.email with correct parameters", async () => {
    renderSignInCard();

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("m~example.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /remember me/i }));

    // Click login button
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(signIn.email).toHaveBeenCalledWith(
        {
          email: "test@example.com",
          password: "password123",
          callbackURL: "/dashboard",
          rememberMe: true,
        },
        expect.any(Object)
      );
    });
  });
});
