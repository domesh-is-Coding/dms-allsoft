import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import Topbar from "../Topbar";
import { useAuthStore } from "../../store/auth";

// Mock the auth store
vi.mock("../../store/auth", () => ({
  useAuthStore: vi.fn(() => ({
    setToken: vi.fn(),
  })),
}));

describe("Topbar", () => {
  afterEach(cleanup);

  const renderTopbar = (props = {}) => {
    const defaultProps = {
      title: "Dashboard",
      onToggleMobileSidebar: vi.fn(),
      ...props,
    };
    return render(<Topbar {...defaultProps} />);
  };

  it("renders title on desktop", () => {
    renderTopbar({ title: "Test Title" });

    // Title should be visible on desktop
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders mobile hamburger menu and DMS logo on small screens", () => {
    const mockToggle = vi.fn();
    renderTopbar({ onToggleMobileSidebar: mockToggle });

    // Hamburger menu should be present
    const hamburgerButton = screen.getByRole("button", { name: /toggle sidebar/i });
    expect(hamburgerButton).toBeInTheDocument();

    // DMS logo should be visible on mobile
    expect(screen.getByText("DMS")).toBeInTheDocument();

    // Clicking hamburger should call the toggle function
    fireEvent.click(hamburgerButton);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("renders notification bell with badge", () => {
    renderTopbar();

    // Badge with "2" should be present
    expect(screen.getByText("2")).toBeInTheDocument();

    // The bell icon should be present (it's an SVG, so we check for its container)
    const notificationContainer = screen.getByText("2").parentElement;
    expect(notificationContainer).toBeInTheDocument();
  });

  it("renders user profile section", () => {
    renderTopbar();

    // User avatar should be present
    const avatar = screen.getByAltText("User");
    expect(avatar).toBeInTheDocument();

    // User name should be visible on larger screens
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("toggles user profile dropdown", () => {
    renderTopbar();

    // Dropdown should not be visible initially
    expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();

    // Click user profile button to open dropdown
    const profileButton = screen.getByRole("button", { name: /john smith/i });
    fireEvent.click(profileButton);

    // Dropdown should now be visible
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("handles logout functionality", () => {
    const mockSetToken = vi.fn();
    useAuthStore.mockReturnValue({
      setToken: mockSetToken,
    });

    renderTopbar();

    // Open dropdown
    const profileButton = screen.getByRole("button", { name: /john smith/i });
    fireEvent.click(profileButton);

    // Click logout button
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    // setToken should be called with empty string
    expect(mockSetToken).toHaveBeenCalledWith("");
  });

  it("closes dropdown when clicking profile button again", () => {
    renderTopbar();

    // Open dropdown
    const profileButton = screen.getByRole("button", { name: /john smith/i });
    fireEvent.click(profileButton);

    // Dropdown should be visible
    expect(screen.getByText("john@example.com")).toBeInTheDocument();

    // Click profile button again to close
    fireEvent.click(profileButton);

    // Dropdown should be closed
    expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();
  });
});