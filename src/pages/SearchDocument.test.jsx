import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SearchDocument from "./SearchDocument";
import * as authModule from "../store/auth";

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from "vitest";
import { expect as vitestExpect } from "vitest";
globalThis.expect = vitestExpect;
import "@testing-library/jest-dom";

// Mock useAuthStore
vi.mock("../store/auth", () => ({
  useAuthStore: vi.fn(),
}));

beforeAll(() => {
  globalThis.fetch = vi.fn();
});

afterAll(() => {
  if (globalThis.fetch && globalThis.fetch.mockRestore) {
    globalThis.fetch.mockRestore();
  }
});

describe("SearchDocument", () => {
  it("renders the filter UI section", () => {
    render(<SearchDocument />);
    // Check filter section title
    expect(screen.getByText("Filters")).toBeInTheDocument();
    // Check for all filter labels
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Sub-category")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("To")).toBeInTheDocument();
    // Check for selects and date inputs
    expect(screen.getAllByRole("combobox").length).toBe(3);
    expect(screen.getByPlaceholderText("From")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("To")).toBeInTheDocument();
  });
  beforeEach(() => {
    vi.clearAllMocks();
    authModule.useAuthStore.mockReturnValue("mock-token");
  });

  it("renders filters and table headers", () => {
    render(<SearchDocument />);
    expect(screen.getAllByText(/Search Documents/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Category")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Sub-category")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Tags")[0]).toBeInTheDocument();
    expect(screen.getAllByText(/FILE NAME/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TYPE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/REMARKS/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/UPLOADER/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ACTIONS/i).length).toBeGreaterThan(0);
    // Check for filter controls
    expect(screen.getAllByRole("combobox").length).toBeGreaterThanOrEqual(3); // at least 3 selects
    // Check for date inputs by placeholder
    expect(
      screen.getAllByPlaceholderText("From").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByPlaceholderText("To").length).toBeGreaterThanOrEqual(
      1
    );
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0); // at least one button
  });

  it("shows loading state and then documents", async () => {
    const mockDocs = [
      {
        document_id: "1",
        major_head: "Professional",
        minor_head: "IT",
        file_url: "file1.pdf",
        document_remarks: "Test remarks",
        uploaded_by: "User1",
      },
    ];
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ status: true, data: mockDocs }),
    });
    render(<SearchDocument />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText(/Professional IT/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Test remarks/i)).toBeInTheDocument();
    expect(screen.getByText(/User1/i)).toBeInTheDocument();
    expect(screen.getByText(/Preview/i)).toBeInTheDocument();
    // There are multiple Download buttons/links, so use getAllByText
    expect(screen.getAllByText(/Download/i).length).toBeGreaterThan(0);
  });

  it("shows no documents found if API returns empty", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ status: true, data: [] }),
    });
    render(<SearchDocument />);
    await waitFor(() =>
      expect(screen.getAllByText(/No documents found/i).length).toBeGreaterThan(
        0
      )
    );
  });

  it("renders pagination controls and table UI", async () => {
    const mockDocs = Array.from({ length: 6 }, (_, i) => ({
      document_id: String(i),
      major_head: `Cat${i}`,
      minor_head: `Sub${i}`,
      file_url: `file${i}.pdf`,
      document_remarks: `Remarks${i}`,
      uploaded_by: `Uploader${i}`,
    }));
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ status: true, data: mockDocs }),
    });
    render(<SearchDocument />);
    // Check for table headers
    expect(screen.getAllByText(/FILE NAME/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TYPE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/REMARKS/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/UPLOADER/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ACTIONS/i).length).toBeGreaterThan(0);
    // Check for pagination controls
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /next/i })).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getAllByRole("link", { name: "2" }).length).toBeGreaterThan(
        0
      )
    );
  });
});
