import { beforeEach, vi } from "vitest";
import React from "react";
import { beforeAll, afterEach, describe, test, expect } from "vitest";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Login from "../Login";

beforeAll(() => {
  window.fetch = vi.fn();
});
afterEach(() => {
  vi.clearAllMocks();
});

describe("Login page", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  beforeEach(() => {
    vi.resetAllMocks();
    window.fetch = vi.fn();
  });
  beforeEach(() => {
    vi.resetAllMocks();
  });
  // Tests for Login page. Make sure login works as expected.
  test("renders phone input and sends OTP", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ status: true, data: "OTP sent!" }),
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText(/Verify Your Phone Number/i)).toBeInTheDocument();
    fireEvent.change(screen.getAllByPlaceholderText(/Mobile number/i)[0], {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getAllByText(/Send Code/i)[0]);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("generateOTP"),
        expect.objectContaining({ method: "POST" })
      );
      expect(screen.getByText(/OTP sent!/i)).toBeInTheDocument();
      expect(
        screen.getAllByPlaceholderText(/Verification code/i)[0]
      ).toBeInTheDocument();
    });
  });

  test("shows error if OTP send fails", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ status: false }),
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getAllByPlaceholderText(/Mobile number/i)[0], {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getAllByText(/Send Code/i)[0]);
    await waitFor(() => {
      expect(screen.getByText(/Failed to send OTP/i)).toBeInTheDocument();
    });
  });

  test("verifies OTP and navigates", async () => {
    // First call: send OTP (mocked response)
    fetch.mockResolvedValueOnce({
      json: async () => ({
        status: true,
        data: "OTP Sent on SMS and WhatsApp",
      }),
    });
    // Second call: validate OTP (mocked response)
    fetch.mockResolvedValueOnce({
      json: async () => ({
        status: true,
        data: {
          token: "mocked_token",
          user_id: "test_joe",
          user_name: "Joe",
          roles: [
            {
              id: 1,
              role: "User",
              role_slug: "USER",
              home: "document-management",
            },
          ],
        },
      }),
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    await fireEvent.change(
      screen.getAllByPlaceholderText(/Mobile number/i)[0],
      {
        target: { value: "1234567890" },
      }
    );
    await fireEvent.click(screen.getAllByText(/Send Code/i)[0]);
    // Wait for OTP input array to appear
    await waitFor(() => {
      expect(
        screen.getAllByPlaceholderText(/Verification code/i).length
      ).toBeGreaterThan(0);
    });
    const otpInputs = screen.getAllByPlaceholderText(/Verification code/i);
    const otpInput = otpInputs[otpInputs.length - 1];
    await fireEvent.change(otpInput, {
      target: { value: "123456" },
    });
    await waitFor(() => {
      expect(otpInput.value).toBe("123456");
    });
    // Fire submit event on the OTP form
    const otpForm = otpInput.closest("form");
    await fireEvent.submit(otpForm);
    // Wait for success message
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("validateOTP"),
        expect.objectContaining({ method: "POST" })
      );
      expect(screen.getByText(/Verified! Welcome Joe/i)).toBeInTheDocument();
    });
  });

  test("shows error if OTP is invalid", async () => {
    // First call: send OTP (mocked response)
    fetch.mockResolvedValueOnce({
      json: async () => ({
        status: true,
        data: "OTP Sent on SMS and WhatsApp",
      }),
    });
    // Second call: verify OTP fails
    fetch.mockResolvedValueOnce({
      json: async () => ({ status: false }),
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    await fireEvent.change(
      screen.getAllByPlaceholderText(/Mobile number/i)[0],
      {
        target: { value: "1234567890" },
      }
    );
    await fireEvent.click(screen.getAllByText(/Send Code/i)[0]);
    // Wait for OTP input array to appear
    await waitFor(() => {
      expect(
        screen.getAllByPlaceholderText(/Verification code/i).length
      ).toBeGreaterThan(0);
    });
    const otpInputs = screen.getAllByPlaceholderText(/Verification code/i);
    const otpInput = otpInputs[otpInputs.length - 1];
    await fireEvent.change(otpInput, {
      target: { value: "000000" },
    });
    await waitFor(() => {
      expect(otpInput.value).toBe("000000");
    });
    // Fire submit event on the OTP form
    const otpForm = otpInput.closest("form");
    await fireEvent.submit(otpForm);
    // Wait for error message
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("validateOTP"),
        expect.objectContaining({ method: "POST" })
      );
      const errorDivs = screen.getAllByTestId("login-error");
      expect(
        errorDivs.some((div) => div.textContent.includes("Invalid OTP"))
      ).toBe(true);
    });
  });

  test("shows network error on fetch failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getAllByPlaceholderText(/Mobile number/i)[0], {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getAllByText(/Send Code/i)[0]);
    await waitFor(() => {
      const errorDivs = screen.getAllByTestId("login-error");
      expect(
        errorDivs.some((div) => div.textContent.includes("Network error"))
      ).toBe(true);
    });
  });
});
