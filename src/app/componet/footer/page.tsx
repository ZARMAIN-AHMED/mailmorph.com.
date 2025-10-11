"use client";
import React from "react";
import Image from "next/image";
import { Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-black text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* 🔹 Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            {/* ✅ Logo */}
            <Image
              src="/logo2.png"
              alt="MailMorph Logo"
              width={50}
              height={50}
              unoptimized
              className=" rounded-full"
            />
            
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              MailMorph
            </h1>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            AI-powered email assistant to write, send & manage your emails smarter.
          </p>
        </div>

        {/* 🔹 Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-cyan-400">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-cyan-300 transition">Home</a></li>
            <li><a href="/features" className="hover:text-cyan-300 transition">Features</a></li>
            <li><a href="/history" className="hover:text-cyan-300 transition">History</a></li>
            <li><a href="/pricing" className="hover:text-cyan-300 transition">Pricing</a></li>
            <li><a href="/contact" className="hover:text-cyan-300 transition">Contact</a></li>
          </ul>
        </div>

        {/* 🔹 Social Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-cyan-400">Follow Us</h2>
          <div className="flex gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition transform hover:scale-110"
            >
              <Twitter size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition transform hover:scale-110"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition transform hover:scale-110"
            >
              <Github size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* 🔹 Bottom Line */}
      <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} MailMorph. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
