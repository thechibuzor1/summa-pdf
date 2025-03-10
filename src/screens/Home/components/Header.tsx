import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { AuthContext } from "../../../context/AuthContext";

function Header() {
  const { isLoggedIn, logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  return (
    <header className="flex flex-wrap items-center justify-between p-6 md:px-12 py-3 border-b bg-white w-full">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-primary">Study Guide Support System</h1>
        <h4 className="text-base">AI-Powered Study Guide</h4>
      </div>

      {isLoggedIn ? (
        <Menu as="div" className="relative">
          <MenuButton>
            <HiOutlineUserCircle size={35} className="cursor-pointer" />
          </MenuButton>

          <MenuItems className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md overflow-hidden">
            <MenuItem>
              {({ active }) => (
                <button onClick={() => { logout(); navigate("/auth"); }} className={`w-full text-left px-4 py-2 text-red-600 ${active ? "bg-gray-100" : ""}`}>
                  Logout
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      ) : (
        <button onClick={() => navigate("/auth")} className="bg-primary text-white px-6 py-2 rounded-lg">Sign In</button>
      )}
    </header>
  );
}

export default Header;
