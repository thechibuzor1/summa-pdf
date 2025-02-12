import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state

  /* // Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      navigate("/auth"); // Redirect to Auth page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }; */

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 p-6 border-b bg-white w-full">
      {/* Brand Section */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-[#008585] leading-none">SummaPDF</h1>
        <h4 className="text-gray-600 text-sm leading-none">
        AI-Powered Study Guide
        </h4>
      </div>

      {/* Account Menu if Logged In */}
      {isLoggedIn ? (
        <Menu as="div" className="relative">
          <MenuButton>
            <HiOutlineUserCircle size={35} className="cursor-pointer" />
          </MenuButton>

          {/* Dropdown Menu */}
          <MenuItems className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md overflow-hidden">
            <MenuItem>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100`}
                >
                  Logout
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      ) : (
        /* Redirect to Auth page when clicking Sign In */
        <button
          onClick={() => navigate("/auth")}
          className="bg-[#008585] hover:bg-[#006060] transition rounded-xl text-white text-[14px] px-4 py-2 font-semibold shadow-md cursor-pointer"
        >
          Sign In
        </button>
      )}
    </header>
  );
}

export default Header;
