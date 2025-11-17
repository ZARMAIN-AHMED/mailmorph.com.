

"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  PlusCircle,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";

const API_BASE =   process.env.NEXT_PUBLIC_API_URL;

interface UserType {
  id: number;
  name: string;
  email: string;
  bio?: string;
  profilePic?: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [tempPic, setTempPic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const baseMenuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/componet/about" },
    { name: "Email", href: "/componet/emailmanager" },
  ];

  const menuItems = user
    ? [
        ...baseMenuItems,
        { name: "History", href: "/componet/history" },
        { name: "Dashboard", href: "/componet/dasboard" },
      ]
    : baseMenuItems;

  const fetchUser = async () => {
    try {
      const res = await fetch(`https://mailmorph-back-xyz-production.up.railway.app/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("User fetch failed:", err);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [dropdownOpen]);

  const handleLogin = () => {
    const loginWindow = window.open(`https://mailmorph-back-xyz-production.up.railway.app/auth/login`, "_blank");
    const checkLogin = setInterval(() => {
      if (loginWindow?.closed) {
        clearInterval(checkLogin);
        fetchUser();
      }
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`https://mailmorph-back-xyz-production.up.railway.app/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handlePicUpload = (file: File | null) => {
    setTempPic(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const formData = new FormData();
    formData.append("id", String(user.id));
    formData.append("name", tempName);
    formData.append("bio", tempBio);
    if (tempPic) {
      formData.append("profilePic", tempPic);
    }
    try {
      const res = await fetch(`https://mailmorph-back-xyz-production.up.railway.app/user/update`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Profile update failed");
        return;
      }
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setEditMode(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo2.png"
            alt="MailMorph Logo"
            width={55}
            height={55}
            priority
            className="transition-transform group-hover:scale-110 group-hover:rotate-6 rounded-full"
            unoptimized
          />
          <span className="text-2xl font-extrabold text-white transition-all duration-500 group-hover:text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
            MailMorph
          </span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="relative text-gray-200 hover:text-white font-medium transition 
                  after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 
                  after:bg-gradient-to-r after:from-cyan-400 after:to-purple-500 
                  hover:after:w-full after:transition-all"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {/* User Actions (Desktop) */}
        <div className="hidden md:flex gap-4 items-center relative" ref={dropdownRef}>
          {user ? (
            <>
              {/* Avatar */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400 hover:scale-105 transition"
              >
                {user.profilePic ? (
                  <Image
                    src={user.profilePic}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="w-6 h-6 text-cyan-300 mx-auto my-auto" />
                )}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-64 bg-black/90 border border-gray-700 rounded-lg shadow-lg p-3 animate-fadeIn">
                  {!editMode ? (
                    <>
                      <div className="px-3 py-2 border-b border-gray-700 text-sm text-gray-300">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>

                      <a
                        href="/componet/dasboard"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-md text-gray-200"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </a>

                      <button
                        onClick={() => {
                          setEditMode(true);
                          setTempName(user.name);
                          setTempBio(user.bio || "");
                          setPreviewUrl(user.profilePic || null);
                        }}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-md text-gray-200 w-full text-left"
                      >
                        ✏️ Edit Profile
                      </button>

                      {/* ✅ Fixed Add Another Account Link */}
                      <a
                        href="https://accounts.google.com/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-md text-gray-200 w-full text-left"
                      >
                        <PlusCircle size={16} /> Add Another Account
                      </a>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/20 rounded-md text-red-400 w-full"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full px-2 py-1 rounded bg-gray-800 text-white text-sm"
                        placeholder="Enter name"
                      />
                      <textarea
                        value={tempBio}
                        onChange={(e) => setTempBio(e.target.value)}
                        className="w-full px-2 py-1 rounded bg-gray-800 text-white text-sm"
                        placeholder="Enter bio"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handlePicUpload(e.target.files?.[0] || null)
                        }
                        className="text-xs text-gray-400"
                      />
                      {previewUrl && (
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={60}
                          height={60}
                          className="rounded-full mx-auto"
                          unoptimized
                        />
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProfile}
                          className="flex-1 px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          className="flex-1 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="px-4 py-2 rounded-lg border border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 transition"
              >
                Login with Gmail
              </button>
              <a
                href="https://accounts.google.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-700 text-white hover:opacity-90 transition"
              >
                Sign Up
              </a>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10 px-6 py-4 space-y-4 animate-slideDown">
          <ul className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-200 hover:text-cyan-400 transition font-medium"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-gray-700">
            {user ? (
              <>
                <p className="text-gray-300 text-sm mb-2">
                  {user.name} <br />
                  <span className="text-xs text-gray-400">{user.email}</span>
                </p>
                <a
                  href="/componet/dasboard"
                  className="block py-2 text-cyan-300 hover:text-cyan-400"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-2 rounded-lg border border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 transition"
                >
                  Login with Gmail
                </button>
                <a
                  href="https://accounts.google.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-700 text-white hover:opacity-90 transition"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

