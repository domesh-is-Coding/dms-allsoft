import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AdminCreateUser from "../AdminCreateUser";

describe("AdminCreateUser", () => {
  it("renders the form with correct fields and disabled state", () => {
    render(<AdminCreateUser />);
    // Check heading
    expect(screen.getByText(/Create Admin User/i)).toBeInTheDocument();
    // Check username input
    const usernameInput = screen.getByPlaceholderText(/Enter username/i);
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toBeDisabled();
    // Check password input
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toBeDisabled();
    // Check create button
    const createButton = screen.getByRole("button", { name: /Create/i });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toBeDisabled();
  });
});
