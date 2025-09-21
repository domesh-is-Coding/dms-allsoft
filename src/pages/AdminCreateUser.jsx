import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
export default function AdminCreateUser() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center mb-2">
              Create Admin User
            </h2>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="border rounded-md px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="border rounded-md px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              <button
                type="button"
                className="bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700 transition cursor-not-allowed"
                disabled
              >
                Create
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
