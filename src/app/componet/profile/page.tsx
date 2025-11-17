"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 🔹 Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setName(data.user.name || "");
          setBio(data.user.bio || "");

          if (data.user.profilePic) {
            // full image URL for backend-served image
            const imageUrl = data.user.profilePic.startsWith("http")
              ? data.user.profilePic
              : `${API_BASE}/${data.user.profilePic}`;
            setPreviewUrl(imageUrl);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Handle file input change
  const handleFileChange = (file: File | null) => {
    setProfilePic(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url); // local preview
    } else {
      setPreviewUrl(null);
    }
  };

  // 🔹 Save profile data
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      await fetch(`${API_BASE}/user/update`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      window.location.href = "/";
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-28 p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white rounded-2xl border border-gray-700 shadow-2xl">
      {/* 🔹 Profile header with avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-cyan-400 shadow-md">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile Preview"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <User className="w-14 h-14 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
        <h2 className="mt-4 text-xl font-semibold">{name || "Your Name"}</h2>
        <p className="text-sm text-gray-400">
          {bio || "Tell us something about yourself..."}
        </p>
      </div>

      {/* 🔹 Input fields */}
      <div className="space-y-5">
        <label className="block">
          <span className="text-gray-300">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </label>

        <label className="block">
          <span className="text-gray-300">Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </label>

        <label className="block">
          <span className="text-gray-300">Profile Picture</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="mt-2 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 
                       file:rounded-md file:border-0 file:text-sm file:font-semibold 
                       file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
          />
        </label>
      </div>

      {/* 🔹 Save button */}
      <button
        onClick={handleSave}
        className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-700 text-white font-semibold hover:opacity-90 transition"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
