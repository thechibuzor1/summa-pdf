import React from "react";

function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between p-6 border-b bg-white w-full">
      {/* Brand Section */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-[#008585]">SummaPDF</h1>
        <h4 className="text-gray-600 text-sm">
          AI-Powered PDF Summarization – Fast & Accurate
        </h4>
      </div>

      {/* Sign-In Button */}
      <button
        className="bg-[#74a892] hover:bg-[#5d8c76] transition rounded-xl text-white text-sm px-5 py-2 font-semibold shadow-md cursor-pointer"
        title="auth"
      >
        Sign In
      </button>
    </header>
  );
}

export default Header;
