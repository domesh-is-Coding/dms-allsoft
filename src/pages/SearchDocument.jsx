import React, { useEffect, useState } from "react";
import { Download, Eye } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const initialFilters = {
  major_head: "",
  minor_head: "",
  from_date: "",
  to_date: "",
  tags: [{ tag_name: "" }, { tag_name: "" }],
  uploaded_by: "",
  start: 0,
  length: 10,
  filterId: "",
  search: { value: "" },
};

export default function SearchDocument() {
  const [filters, setFilters] = useState(initialFilters);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  // Remove unused searchValue state

  const token = useAuthStore((state) => state.token);
  useEffect(() => {
    console.log({ token });
    if (token) {
      fetchDocuments();
    }
    // eslint-disable-next-line
  }, [filters.start, filters.length, token]);

  // Pagination logic
  const paginatedDocuments = documents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(documents.length / pageSize);

  // Search handler
  const handleSearch = () => {
    setPage(1);
  };

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
        // setTotal(data.recordsTotal || data.data[0]?.total_count || 0); // not used
      }
    } catch (err) {
      console.error("API error:", err);
    }
    setLoading(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, start: 0 }));
  };

  const handleTagChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      tags: [{ tag_name: value }, { tag_name: "" }],
    }));
  };

  // Remove unused handleSearch

  const handleDateChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDownloadAll = () => {
    // Download all as ZIP (API not provided)
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Search Documents
          </h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-none text-base font-medium"
            onClick={handleDownloadAll}
          >
            <Download size={18} /> Download All (ZIP)
          </Button>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-200 mx-8">
          <div className="font-semibold text-lg mb-6">Filters</div>
          <div className="grid grid-cols-6 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={filters.major_head}
                onChange={(e) =>
                  handleFilterChange("major_head", e.target.value)
                }
                className="h-12 text-sm border-gray-300"
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
                className="h-12 text-sm border-gray-300"
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
                className="h-12 text-sm border-gray-300 rounded-2xl"
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
                className="h-12 text-sm border-gray-300"
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
                className="h-12 text-sm border-gray-300"
                placeholder="To"
              />
            </div>
            <div></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-0 border border-gray-200 mx-8">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="py-4 px-6 text-left font-semibold text-gray-500 uppercase tracking-wide">
                  FILE NAME
                </th>
                <th className="py-4 px-6 text-left font-semibold text-gray-500 uppercase tracking-wide">
                  TYPE
                </th>
                <th className="py-4 px-6 text-left font-semibold text-gray-500 uppercase tracking-wide">
                  REMARKS
                </th>
                <th className="py-4 px-6 text-left font-semibold text-gray-500 uppercase tracking-wide">
                  UPLOADER
                </th>
                <th className="py-4 px-6 text-left font-semibold text-gray-500 uppercase tracking-wide">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500 text-lg"
                  >
                    Loading...
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500 text-lg"
                  >
                    No documents found.
                  </td>
                </tr>
              ) : (
                paginatedDocuments.map((doc) => (
                  <tr
                    key={doc.document_id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {doc.major_head + " " + doc.minor_head}
                    </td>
                    <td className="py-4 px-6">
                      {doc.file_url.endsWith(".pdf")
                        ? "PDF"
                        : doc.file_url.endsWith(".docx")
                        ? "DOCX"
                        : doc.file_url.endsWith(".pptx")
                        ? "PPTX"
                        : "File"}
                    </td>
                    <td className="py-4 px-6">{doc.document_remarks}</td>
                    <td className="py-4 px-6">{doc.uploaded_by}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-6">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline text-base"
                        >
                          <Eye size={18} /> Preview
                        </a>
                        <a
                          href={doc.file_url}
                          download
                          className="flex items-center gap-1 text-blue-600 hover:underline text-base"
                        >
                          <Download size={18} /> Download
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination below table */}
        {documents.length > pageSize && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    disabled={page === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
                    disabled={page === totalPages}
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
