"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Logout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Button disable logic

  const handleLogout = async () => {
    setLoading(true); // Disable button while logging out

    await fetch("/api/logout", { method: "POST" }); // Logout API call
    router.push("/login"); // Redirect to login page

    setLoading(false); // Re-enable button (not needed after redirect)
  };

  return (
    <div className="flex justify-center items-center mt-20 bg-gray-700 ">
      <div className="bg-gray-700 p-8 rounded-lg shadow-md">
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging Out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
