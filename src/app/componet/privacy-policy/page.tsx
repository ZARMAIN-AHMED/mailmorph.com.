import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-gray-100 flex flex-col items-center px-6 pt-40 pb-16">
      {/* Header */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 tracking-wide drop-shadow-lg">
        Privacy Policy
      </h1>

      {/* Card */}
      <div className="max-w-4xl w-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] p-10 md:p-14 transition-all hover:shadow-[0_0_50px_-5px_rgba(99,102,241,0.5)] duration-500">
        <p className="text-gray-300 leading-relaxed text-lg mb-8">
          Welcome to <span className="text-indigo-400 font-semibold">MailMorph</span>.  
          Your privacy matters to us. This policy explains how we collect, use, and protect your information when you use our services.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">
              1. Data Access
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              MailMorph only accesses your Google account for sending and managing emails that you authorize.
              We <span className="text-white font-medium">do not</span> store, share, or sell any personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">
              2. Data Usage
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Your email data is used only for providing the features you request — such as automation, scheduling, or template management.
              We never use your data for advertising or third-party analytics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">
              3. Security
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              All communications with Google’s APIs are secured using industry-grade encryption.
              Access tokens are stored safely and never exposed publicly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">
              4. Contact Us
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              For any questions regarding this Privacy Policy, feel free to reach us at{" "}
              <a
                href="mailto:support@mailmorph.com"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                support@mailmorph.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center border-t border-zinc-800 pt-6 text-gray-500 text-sm">
          © {new Date().getFullYear()} <span className="text-indigo-400 font-semibold">MailMorph</span> — All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
