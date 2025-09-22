import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { MemoryRouter } from "react-router";
import Sidebar from "../Sidebar";
import "@testing-library/jest-dom";

// Mock react-router
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    NavLink: ({ to, children, className }) => (
      <a
        href={to}
        className={
          typeof className === "function"
            ? className({ isActive: false })
            : className
        }
        onClick={(e) => e.preventDefault()}
      >
        {children}
      </a>
    ),
  };
});

describe("Sidebar", () => {
  afterEach(cleanup);
  const renderSidebar = (props = {}) => {
    return render(
      <MemoryRouter>
        <Sidebar {...props} />
      </MemoryRouter>
    );
  };

  it("renders desktop sidebar by default", () => {
    renderSidebar();

    // Should be hidden on mobile, visible on desktop
    const aside = screen.getByRole("complementary");
    expect(aside).toHaveClass("hidden", "md:block");

    // Should have proper desktop styling
    expect(aside).toHaveClass(
      "p-2",
      "sticky",
      "left-0",
      "top-0",
      "pr-0",
      "h-screen"
    );

    // Check logo
    expect(screen.getByText("DMS")).toBeInTheDocument();

    // Check navigation links
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Search Document")).toBeInTheDocument();
    expect(screen.getByText("Upload Document")).toBeInTheDocument();

    // Should not have close button
    expect(screen.queryByLabelText("Close sidebar")).not.toBeInTheDocument();
  });

  it("renders mobile sidebar", () => {
    renderSidebar({ mobile: true });

    const aside = screen.getByRole("complementary");
    expect(aside).toHaveClass("block", "md:hidden");

    // Check horizontal layout
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("flex", "flex-row");
  });

  it("renders overlay sidebar", () => {
    const mockOnClose = vi.fn();
    renderSidebar({ overlay: true, onClose: mockOnClose });

    const aside = screen.getByRole("complementary");
    expect(aside).toHaveClass("block", "md:block");

    // Check overlay styling
    const container = aside.firstChild;
    expect(container).toHaveClass(
      "w-full",
      "bg-white",
      "flex",
      "flex-col",
      "p-4",
      "gap-6",
      "h-full"
    );

    // Check close button
    const closeButton = screen.getByLabelText("Close sidebar");
    expect(closeButton).toBeInTheDocument();

    // Test close button functionality
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders navigation links with correct routes", () => {
    renderSidebar();

    const adminLink = screen.getByText("Admin User");
    const searchLink = screen.getByText("Search Document");
    const uploadLink = screen.getByText("Upload Document");

    expect(adminLink.closest("a")).toHaveAttribute("href", "/admin-user");
    expect(searchLink.closest("a")).toHaveAttribute("href", "/search-document");
    expect(uploadLink.closest("a")).toHaveAttribute("href", "/upload-document");
  });

  it("applies hover styling to inactive links", () => {
    renderSidebar();

    const adminLink = screen.getByText("Admin User").closest("a");
    expect(adminLink).toHaveClass("hover:bg-blue-100", "hover:text-blue-600");
  });
});
