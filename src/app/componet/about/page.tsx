

"use client";
import React from "react";
import {
  Sparkles,
  Mail,
  History,
  Send,
  Users,
  Clock,
  BarChart3,
  ShieldCheck,
  FileText,
  Database,
  BellRing,
} from "lucide-react";

const About = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* 🔹 Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover bg-black"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src=".mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Gradient Orbs */}
      <div className="absolute top-20 left-10 w-[350px] h-[350px] bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* 🔹 Content */}
      <div className="relative max-w-6xl mx-auto text-center z-10">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-white animate-fadeIn">
          About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
            MailMorph
          </span>
        </h2>

        {/* Subheading */}
        <p className="mt-4 text-gray-300 text-lg md:text-xl max-w-3xl mx-auto animate-fadeIn delay-200">
          MailMorph is your all-in-one AI email automation platform designed for
          freelancers, founders, and teams. It helps you generate leads, follow up
          smartly, and send bulk personalized emails — all powered by intelligent automation.
        </p>

        {/* 🔹 Active Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-cyan-500/40 transition transform hover:-translate-y-2 animate-fadeIn delay-300">
            <div className="flex justify-center mb-4">
              <Sparkles className="text-cyan-400 drop-shadow-glow" size={42} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              AI-Powered Writing
            </h3>
            <p className="text-gray-300 text-sm">
              Craft professional, engaging, and context-aware emails instantly with the power of AI.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-purple-500/40 transition transform hover:-translate-y-2 animate-fadeIn delay-400">
            <div className="flex justify-center mb-4">
              <Mail className="text-purple-400 drop-shadow-glow" size={42} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Smart Email Sending
            </h3>
            <p className="text-gray-300 text-sm">
              Send your AI-generated emails directly from MailMorph with real-time delivery tracking.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-pink-500/40 transition transform hover:-translate-y-2 animate-fadeIn delay-500">
            <div className="flex justify-center mb-4">
              <Users className="text-pink-400 drop-shadow-glow" size={42} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Lead Management
            </h3>
            <p className="text-gray-300 text-sm">
              Collect, organize, and manage leads seamlessly — all within your MailMorph dashboard.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-green-500/40 transition transform hover:-translate-y-2 animate-fadeIn delay-600">
            <div className="flex justify-center mb-4">
              <Clock className="text-green-400 drop-shadow-glow" size={42} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Smart Follow-ups
            </h3>
            <p className="text-gray-300 text-sm">
              Automatically follow up with prospects based on responses, time delays, or workflow rules.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-blue-500/40 transition transform hover:-translate-y-2 animate-fadeIn delay-700">
            <div className="flex justify-center mb-4">
              <Send className="text-blue-400 drop-shadow-glow" size={42} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Bulk Email Campaigns
            </h3>
            <p className="text-gray-300 text-sm">
              Send bulk personalized emails to your contact lists with one click — perfect for outreach.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-amber-500/40 transition transform hover:-translate-y-2 animate-fadeIn delay-800">
            <div className="flex justify-center mb-4">
              <History className="text-amber-400 drop-shadow-glow" size={42} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Email History
            </h3>
            <p className="text-gray-300 text-sm">
              View and search your entire email history with timestamps, subjects, and response logs.
            </p>
          </div>
        </div>

        {/* 🔹 Coming Soon Features */}
        <h3 className="text-2xl font-bold text-white mt-20 mb-6 animate-fadeIn">
          🚀 Coming Soon in MailMorph
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Email Analytics */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-yellow-500/40 transition transform hover:-translate-y-2 animate-fadeIn delay-900">
            <div className="flex justify-center mb-4">
              <BarChart3 className="text-yellow-400 drop-shadow-glow" size={42} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Email Analytics
            </h3>
            <p className="text-gray-300 text-sm">
              Track open rates, click metrics, and engagement data to measure your campaign success.
            </p>
          </div>

          {/* Smart Scope Guard */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-cyan-500/40 transition transform hover:-translate-y-2 animate-fadeIn delay-1000">
            <div className="flex justify-center mb-4">
              <ShieldCheck className="text-cyan-400 drop-shadow-glow" size={42} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Smart Scope Guard
            </h3>
            <p className="text-gray-300 text-sm">
              Automatically flag extra work or unpaid scope creep in client communications.
            </p>
          </div>

          {/* Contract Addendums Generator */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-purple-500/40 transition transform hover:-translate-y-2 animate-fadeIn delay-1100">
            <div className="flex justify-center mb-4">
              <FileText className="text-purple-400 drop-shadow-glow" size={42} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Contract Addendums Generator
            </h3>
            <p className="text-gray-300 text-sm">
              Quickly create and attach contract updates or addendums from client messages.
            </p>
          </div>

          {/* Context Vault */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-pink-500/40 transition transform hover:-translate-y-2 animate-fadeIn delay-1200">
            <div className="flex justify-center mb-4">
              <Database className="text-pink-400 drop-shadow-glow" size={42} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Context Vault
            </h3>
            <p className="text-gray-300 text-sm">
              Store and recall client messages across multiple channels for deeper context and insights.
            </p>
          </div>

          {/* Payment Reminder Automation */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-green-500/40 transition transform hover:-translate-y-2 animate-fadeIn delay-1300">
            <div className="flex justify-center mb-4">
              <BellRing className="text-green-400 drop-shadow-glow" size={42} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Payment Reminder Automation
            </h3>
            <p className="text-gray-300 text-sm">
              Automate polite, branded payment reminders to clients before and after due dates.
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-10 text-gray-400 italic text-sm animate-fadeIn delay-1400">
          ✨ MailMorph — built for smart professionals who value time, clarity, and automation.
        </p>
      </div>
    </section>
  );
};

export default About;
