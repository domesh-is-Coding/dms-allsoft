import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { expect as vitestExpect } from "vitest";
import UploadDocument from "../UploadDocument";
import * as authModule from "../../store/auth";

globalThis.expect = vitestExpect;
import "@testing-library/jest-dom";

// Mock useAuthStore
vi.mock("../../store/auth", () => ({
  useAuthStore: vi.fn(),
}));

// Mock DatePicker component
vi.mock("../../components/ui/date-picker", () => ({
  DatePicker: ({ date, setDate }) => (
    <input
      type="date"
      value={date ? date.toISOString().split("T")[0] : ""}
      onChange={(e) =>
        setDate(e.target.value ? new Date(e.target.value) : null)
      }
      aria-label="Date picker"
    />
  ),
}));

beforeAll(() => {
  globalThis.fetch = vi.fn();
});

afterAll(() => {
  if (globalThis.fetch && globalThis.fetch.mockRestore) {
    globalThis.fetch.mockRestore();
  }
});

afterEach(() => {
  cleanup();
});

describe("UploadDocument", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authModule.useAuthStore.mockReturnValue("mock-token");
    // Mock tag suggestions API
    globalThis.fetch.mockImplementation((url) => {
      if (url.includes("documentTags")) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: [{ id: 1, label: "test tag" }] }),
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve({}),
      });
    });
  });

  it("renders the upload form with all required fields", () => {
    render(<UploadDocument />);

    // Check main heading
    expect(screen.getByText("Upload Document")).toBeInTheDocument();

    // Check form labels
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Sub-category")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Remarks")).toBeInTheDocument();
    expect(screen.getByText("File Upload")).toBeInTheDocument();

    // Check form inputs
    expect(screen.getAllByLabelText("Date picker").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(screen.getByPlaceholderText("Add tags...")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Add any relevant remarks...")
    ).toBeInTheDocument();

    // Check buttons
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("updates sub-category options when category is selected", () => {
    render(<UploadDocument />);

    const categorySelect = screen.getAllByRole("combobox")[0];
    const subCategorySelect = screen.getAllByRole("combobox")[1];

    // Initially no options
    expect(subCategorySelect).toHaveValue("");

    // Select Personal category
    fireEvent.change(categorySelect, { target: { value: "Personal" } });

    // Should show personal names
    expect(screen.getByRole("option", { name: "John" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Tom" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Emily" })).toBeInTheDocument();

    // Select Professional category
    fireEvent.change(categorySelect, { target: { value: "Professional" } });

    // Should show professional departments
    expect(
      screen.getByRole("option", { name: "Accounts" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "HR" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "IT" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Finance" })).toBeInTheDocument();
  });

  it("allows adding and removing tags", () => {
    render(<UploadDocument />);

    const tagInput = screen.getByPlaceholderText("Add tags...");
    const addButton = screen.getAllByRole("button")[0];

    // Add a tag
    fireEvent.change(tagInput, { target: { value: "Test Tag" } });
    fireEvent.click(addButton);

    // Tag should appear
    expect(screen.getByText("Test Tag")).toBeInTheDocument();

    // Remove the tag
    const removeButton = screen.getByRole("button", { name: "×" });
    fireEvent.click(removeButton);

    // Tag should be removed
    expect(screen.queryByText("Test Tag")).not.toBeInTheDocument();
  });

  it("shows tag suggestions when typing", async () => {
    const mockSuggestions = [
      { id: 1, label: "Tag1" },
      { id: 2, label: "Tag2" },
    ];

    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ data: mockSuggestions }),
    });

    render(<UploadDocument />);

    const tagInput = screen.getByPlaceholderText("Add tags...");

    // Type in tag input
    fireEvent.change(tagInput, { target: { value: "Tag" } });

    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText("Tag1")).toBeInTheDocument();
      expect(screen.getByText("Tag2")).toBeInTheDocument();
    });

    // Click on suggestion
    fireEvent.click(screen.getByText("Tag1"));

    // Tag should be added
    expect(screen.getByText("Tag1")).toBeInTheDocument();
  });

  it("validates file upload - accepts valid files", () => {
    render(<UploadDocument />);

    const fileInput = screen.getByLabelText(/Upload a file or drag and drop/i);
    const validFile = new File(["test"], "test.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Should not show error
    expect(
      screen.queryByText(/Only PDF and image files are allowed/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/File size must be less than 10MB/i)
    ).not.toBeInTheDocument();
  });

  it("validates file upload - rejects invalid file types", () => {
    render(<UploadDocument />);

    const fileInput = screen.getByLabelText(/Upload a file or drag and drop/i);
    const invalidFile = new File(["test"], "test.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    // Should show error
    expect(
      screen.getByText("Only PDF and image files are allowed.")
    ).toBeInTheDocument();
  });

  it("validates file upload - rejects files too large", () => {
    render(<UploadDocument />);

    const fileInput = screen.getByLabelText(/Upload a file or drag and drop/i);
    const largeFile = new File(["x".repeat(11 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    // Should show error
    expect(
      screen.getByText("File size must be less than 10MB.")
    ).toBeInTheDocument();
  });

  it("shows error when form is submitted with missing required fields", async () => {
    render(<UploadDocument />);

    const form = document.querySelector("form");
    fireEvent.submit(form);

    // Should show error
    expect(
      screen.getByText("Please fill all required fields and select a file.")
    ).toBeInTheDocument();
  });

  it("submits form successfully with valid data", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ status: true }),
    });

    render(<UploadDocument />);

    // Fill required fields
    const datePicker = screen.getAllByLabelText("Date picker")[0];
    fireEvent.change(datePicker, { target: { value: "2025-09-22" } });

    const categorySelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(categorySelect, { target: { value: "Personal" } });

    const subCategorySelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(subCategorySelect, { target: { value: "John" } });

    const fileInput = screen.getByLabelText(/Upload a file or drag and drop/i);
    const validFile = new File(["test"], "test.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    const submitButton = screen.getAllByRole("button")[2];
    fireEvent.click(submitButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText("Success. Document Saved.")).toBeInTheDocument();
    });
  });

  it("shows error when upload fails", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ status: false, message: "Upload failed" }),
    });

    render(<UploadDocument />);

    // Fill required fields
    const datePicker = screen.getAllByLabelText("Date picker")[0];
    fireEvent.change(datePicker, { target: { value: "2025-09-22" } });

    const categorySelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(categorySelect, { target: { value: "Personal" } });

    const subCategorySelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(subCategorySelect, { target: { value: "John" } });

    const fileInput = screen.getByLabelText(/Upload a file or drag and drop/i);
    const validFile = new File(["test"], "test.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    const submitButton = screen.getAllByRole("button")[2];
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Upload failed")).toBeInTheDocument();
    });
  });

  it("handles drag and drop file upload", () => {
    render(<UploadDocument />);

    const dropZone = screen.getAllByText("Upload a file or drag and drop")[0]
      .parentElement;

    // Simulate drag over
    fireEvent.dragOver(dropZone);
    expect(dropZone).toHaveClass("border-blue-400");

    // Simulate drag leave
    fireEvent.dragLeave(dropZone);
    expect(dropZone).not.toHaveClass("border-blue-400");

    // Simulate drop with file
    const validFile = new File(["test"], "test.pdf", {
      type: "application/pdf",
    });
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [validFile],
      },
    });

    // File should be set
    expect(screen.getByText("test.pdf")).toBeInTheDocument();
  });
});
