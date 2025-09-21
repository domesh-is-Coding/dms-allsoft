import React from "react";

export default function AdminCreateUser() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Admin User
        </h2>
        <form className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700 text-sm">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700 text-sm">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="border rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled
            />
          </div>
          <button
            type="button"
            className="bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700 transition cursor-not-allowed text-sm"
            disabled
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
