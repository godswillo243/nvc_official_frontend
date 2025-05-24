import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-300 via-green-400 to-green-500
                 flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <Outlet />
      </div>
    </div>
  );
}
