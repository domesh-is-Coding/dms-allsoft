import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  CalendarDays,
  Tag,
  FileText,
  MessageSquare,
  Upload,
  Folder,
  Plus,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

const CATEGORY_OPTIONS = [
  { label: "Personal", value: "Personal" },
  { label: "Professional", value: "Professional" },
];

const PERSONAL_NAMES = ["John", "Tom", "Emily"];
const PROFESSIONAL_DEPARTMENTS = ["Accounts", "HR", "IT", "Finance"];

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "application/pdf",
];

const UploadDocument = () => {
  const [date, setDate] = useState(null);
  const token = useAuthStore((state) => state.token);
  const [category, setCategory] = useState("");
  const [minorOptions, setMinorOptions] = useState([]);
  const [minorHead, setMinorHead] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  // Removed existingTags, now using tagSuggestions only
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const tagInputRef = useRef(null);
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Removed initial fetch for all tags, suggestions are fetched as user types
  // Fetch tag suggestions as user types
  useEffect(() => {
    if (!tagInput) {
      setTagSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    fetch("https://apis.allsoft.co/api/documentManagement/documentTags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ term: tagInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          // Filter out already added tags
          const filtered = data.data.filter(
            (t) => !tags.some((tag) => tag.tag_name === t.label)
          );
          setTagSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        } else {
          setTagSuggestions([]);
          setShowSuggestions(false);
        }
      })
      .catch(() => {
        setTagSuggestions([]);
        setShowSuggestions(false);
      });
  }, [tagInput, tags]);

  useEffect(() => {
    if (category === "Personal") {
      setMinorOptions(PERSONAL_NAMES);
    } else if (category === "Professional") {
      setMinorOptions(PROFESSIONAL_DEPARTMENTS);
    } else {
      setMinorOptions([]);
    }
    setMinorHead("");
  }, [category]);

  const handleTagAdd = (tagLabel) => {
    const trimmed = (tagLabel ?? tagInput).trim();
    if (trimmed && !tags.some((t) => t.tag_name === trimmed)) {
      setTags([...tags, { tag_name: trimmed }]);
      setTagInput("");
      setShowSuggestions(false);
      setTagSuggestions([]);
    }
  };

  const handleTagRemove = (tagName) => {
    setTags(tags.filter((t) => t.tag_name !== tagName));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setError("Only PDF and image files are allowed.");
      setFile(null);
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      setFile(null);
      return;
    }
    setError("");
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !category || !minorHead || !file) {
      setError("Please fill all required fields and select a file.");
      return;
    }
    setError("");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("major_head", category || "");
    formData.append("minor_head", minorHead || "");
    formData.append("document_date", date ? date.toString() : "");
    formData.append("document_remarks", remarks || "");
    formData.append("tags", Array.isArray(tags) ? JSON.stringify(tags) : "[]");
    formData.append("user_id", "test_domeshwar  ");

    try {
      const res = await fetch(
        "https://apis.allsoft.co/api/documentManagement/saveDocumentEntry",
        {
          method: "POST",
          headers: {
            token: token ? `${token}` : undefined,
          },
          body: formData,
        }
      );
      const data = await res.json();
      if (data.status) {
        setSuccess("Success. Document Saved.");
        setError("");
      } else {
        setError(data.message || "Upload failed.");
        setSuccess("");
      }
    } catch {
      setError("Upload failed.");
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-100 w-full">
      <h2 className="font-bold text-xl mb-1 text-gray-800">Upload Document</h2>
      <p className="text-gray-500 mb-8 text-sm">
        Fill in the details below to upload your new document.
      </p>
      <form onSubmit={handleSubmit} className="w-full">
        {/* Date & Category Row */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 w-full">
          <div className="flex-1 flex flex-col text-sm">
            <label className="font-medium mb-2 flex items-center">
              <CalendarDays className="w-4 h-4 mr-2" />
              Date
            </label>
            <DatePicker date={date} setDate={setDate} />
          </div>
          <div className="flex-1 flex flex-col text-sm">
            <label className="font-medium mb-2 flex items-center">
              <Folder className="w-4 h-4 mr-2" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="border rounded-lg px-3 py-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Sub-category & Tags Row */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 w-full">
          <div className="flex-1 flex flex-col text-sm">
            <label className="font-medium mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Sub-category
            </label>
            <select
              value={minorHead}
              onChange={(e) => setMinorHead(e.target.value)}
              required
              className="border rounded-lg px-3 py-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Sub-category</option>
              {minorOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex flex-col text-sm">
            <label className="font-medium mb-2 flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Tags
            </label>
            <div className="relative flex gap-2 items-center">
              <Input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleTagAdd();
                  }
                }}
                placeholder="Add tags..."
                className="flex-1"
                autoComplete="off"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleTagAdd()}
                className="px-4 cursor-pointer hover:bg-gray-200 border-gray-200 flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </Button>
              {/* Suggestions dropdown */}
              {showSuggestions && tagSuggestions.length > 0 && (
                <div className="absolute left-0 top-full z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                  {tagSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id || suggestion.label}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-700"
                      onClick={() => handleTagAdd(suggestion.label)}
                    >
                      {suggestion.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag.tag_name}
                  className="bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-sm inline-flex items-center mb-1"
                >
                  {tag.tag_name}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTagRemove(tag.tag_name)}
                    className="ml-2 text-blue-600"
                  >
                    ×
                  </Button>
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Remarks */}
        <div className="mb-6 text-sm w-full">
          <label className="font-medium mb-2 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Remarks
          </label>
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add any relevant remarks..."
            className="w-full min-h-[80px] text-sm"
          />
        </div>
        {/* File Upload */}
        <div className="mb-8 text-sm w-full">
          <label className="font-medium mb-2 flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            File Upload
          </label>
          <div
            className={`border border-dashed rounded-xl p-8 text-center min-h-[120px] flex flex-col items-center justify-center transition-colors ${
              isDragOver
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                handleFileChange({ target: { files } });
              }
            }}
          >
            <Input
              type="file"
              accept=".pdf,image/png,image/jpeg,image/jpg,image/gif"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-600 font-medium text-base"
            >
              <div className="mb-2 flex justify-center">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              {file ? file.name : "Upload a file or drag and drop"}
            </label>
            <div className="text-xs text-gray-500 mt-2">
              PDF, PNG, JPG, GIF up to 10MB
            </div>
          </div>
        </div>
        {/* Error/Success Messages */}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}
        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-0 w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
            className="flex-1 py-4 cursor-pointer hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadDocument;
