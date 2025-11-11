import { FiBell } from "react-icons/fi";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button className="rounded-full bg-gray-100 p-2">
            <FiBell className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 p-2 rounded-full">
              <p className="text-sm font-medium text-gray-600">WT</p>
            </div>
            <span className="text-sm font-medium text-gray-700">Wahyu Tri</span>
          </div>
        </div>
      </div>
    </header>
  );
}