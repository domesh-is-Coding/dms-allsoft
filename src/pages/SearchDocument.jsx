import React, { useEffect, useState } from "react";
import { Download, Eye } from "lucide-react";
import { Select } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../store/auth";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../components/ui/pagination";

const initialFilters = {
  major_head: "",
  minor_head: "",
  from_date: "",
  to_date: "",
  tags: [{ tag_name: "" }, { tag_name: "" }],
  uploaded_by: "",
  start: 0,
  length: 5,
  filterId: "",
  search: { value: "" },
};

export default function SearchDocument() {
  const [filters, setFilters] = useState(initialFilters);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [setRecordsFiltered] = useState(0);
  const pageSize = 5;
  const totalPages = Math.ceil(recordsTotal / pageSize);
  // Remove unused searchValue state

  const token = useAuthStore((state) => state.token);
  useEffect(() => {
    console.log({ token });
    if (token) {
      fetchDocuments();
    }
    // eslint-disable-next-line
  }, [filters.start, filters.length, token]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      console.log("Request body:", filters);
      const res = await fetch(
        "https://apis.allsoft.co/api/documentManagement//searchDocumentEntry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
          body: JSON.stringify(filters),
        }
      );
      const data = await res.json();
      console.log("API response:", data);
      if (data.status) {
        setDocuments(data.data);
        setRecordsTotal(data.recordsTotal || 0);
        setRecordsFiltered(data.recordsFiltered || 0);
      }
    } catch (err) {
      console.error("API error:", err);
    }
    setLoading(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, start: 0 }));
    setPage(1);
  };

  const handleTagChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      tags: [{ tag_name: value }, { tag_name: "" }],
      start: 0,
    }));
    setPage(1);
  };

  // Remove unused handleSearch

  const handleDateChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, start: 0 }));
    setPage(1);
  };

  const handleDownloadAll = () => {
    // Download all as ZIP (API not provided)
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, start: (newPage - 1) * pageSize }));
  };

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex justify-center p-2 sm:p-4">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8 gap-4">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
            Search Documents
          </h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-none text-sm sm:text-base font-medium w-full sm:w-auto justify-center"
            onClick={handleDownloadAll}
          >
            <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Download All (ZIP)</span>
            <span className="sm:hidden">Download ZIP</span>
          </Button>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-6 sm:mb-8 border border-gray-200 mx-2 sm:mx-8">
          <div className="font-semibold text-base sm:text-lg mb-4 sm:mb-6">
            Filters
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={filters.major_head}
                onChange={(e) =>
                  handleFilterChange("major_head", e.target.value)
                }
                className="h-8 sm:h-10 text-sm border-gray-300"
              >
                <option value="">All Categories</option>
                <option value="Professional">Professional</option>
                <option value="Company">Company</option>
                <option value="Personal">Personal</option>
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Sub-category
              </label>
              <Select
                value={filters.minor_head}
                onChange={(e) =>
                  handleFilterChange("minor_head", e.target.value)
                }
                className="h-8 sm:h-10 text-sm border-gray-300"
              >
                <option value="">All Sub-category</option>
                <option value="IT">IT</option>
                <option value="Work Order">Work Order</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <Select
                value={filters.tags[0]?.tag_name || ""}
                onChange={(e) => handleTagChange(e.target.value)}
                className="h-8 sm:h-10 text-sm border-gray-300 rounded-2xl"
              >
                <option value="">All Tags</option>
                <option value="Signed">Signed</option>
                <option value="Draft">Draft</option>
                <option value="Paid">Paid</option>
                <option value="Approved">Approved</option>
                <option value="Final">Final</option>
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <Input
                type="date"
                value={filters.from_date}
                onChange={(e) => handleDateChange("from_date", e.target.value)}
                className="h-8 sm:h-10 text-sm border-gray-300"
                placeholder="From"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <Input
                type="date"
                value={filters.to_date}
                onChange={(e) => handleDateChange("to_date", e.target.value)}
                className="h-8 sm:h-10 text-sm border-gray-300"
                placeholder="To"
              />
            </div>
            <div className="hidden xl:block"></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-2 sm:mx-8 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-semibold text-gray-500 uppercase tracking-wide">
                    FILE NAME
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-semibold text-gray-500 uppercase tracking-wide">
                    TYPE
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-semibold text-gray-500 uppercase tracking-wide">
                    REMARKS
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-semibold text-gray-500 uppercase tracking-wide">
                    UPLOADER
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-semibold text-gray-500 uppercase tracking-wide">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 sm:py-12 text-center text-gray-500 text-base sm:text-lg"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : documents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 sm:py-12 text-center text-gray-500 text-base sm:text-lg"
                    >
                      No documents found.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr
                      key={doc.document_id}
                      className="border-b border-b-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm text-gray-700">
                        {doc.major_head + " " + doc.minor_head}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-600">
                        {doc.file_url.endsWith(".pdf")
                          ? "PDF"
                          : doc.file_url.endsWith(".docx")
                          ? "DOCX"
                          : doc.file_url.endsWith(".pptx")
                          ? "PPTX"
                          : "File"}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-600">
                        {doc.document_remarks}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-600">
                        {doc.uploaded_by}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6">
                        <div className="flex flex-row gap-3 sm:gap-6">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline text-xs sm:text-sm"
                          >
                            <Eye
                              size={16}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                            <span className="hidden sm:inline">Preview</span>
                          </a>
                          <a
                            href={doc.file_url}
                            download
                            className="flex items-center gap-1 text-blue-600 hover:underline text-xs sm:text-sm"
                          >
                            <Download
                              size={16}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                            <span className="hidden sm:inline">Download</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden">
            {loading ? (
              <div className="py-8 text-center text-gray-500 text-base">
                Loading...
              </div>
            ) : documents.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-base">
                No documents found.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.document_id}
                  className="border-b border-gray-200 p-4 last:border-b-0"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900 mb-1">
                          {doc.major_head + " " + doc.minor_head}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {doc.file_url.endsWith(".pdf")
                            ? "PDF"
                            : doc.file_url.endsWith(".docx")
                            ? "DOCX"
                            : doc.file_url.endsWith(".pptx")
                            ? "PPTX"
                            : "File"}
                        </div>
                      </div>
                      <div className="flex gap-3 ml-4">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-8 h-8 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </a>
                        <a
                          href={doc.file_url}
                          download
                          className="flex items-center justify-center w-8 h-8 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Remarks:</span>
                        <span className="text-gray-700 text-right">
                          {doc.document_remarks}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Uploader:</span>
                        <span className="text-gray-700">{doc.uploaded_by}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Pagination below table */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-3 sm:mt-4 px-2 sm:px-0">
            <Pagination>
              <PaginationContent className="flex-wrap gap-1 sm:gap-0">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      const newPage = Math.max(1, page - 1);
                      handlePageChange(newPage);
                    }}
                    disabled={page === 1}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  />
                </PaginationItem>
                <div className="hidden sm:flex">
                  {getVisiblePages().map((pageNum, index) =>
                    pageNum === "..." ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          isActive={page === pageNum}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                          className="text-xs sm:text-sm px-2 sm:px-3"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                </div>
                <div className="flex sm:hidden">
                  <PaginationItem>
                    <span className="text-xs text-gray-600 px-2">
                      {page} of {totalPages}
                    </span>
                  </PaginationItem>
                </div>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      const newPage = Math.min(totalPages, page + 1);
                      handlePageChange(newPage);
                    }}
                    disabled={page === totalPages}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
