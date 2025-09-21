export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow rounded-b-xl">
      <div className="text-lg font-semibold">Admin User</div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            2
          </span>
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <img
            src="/avatar.jpg"
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-medium">John Smith</span>
        </div>
      </div>
    </header>
  );
}
