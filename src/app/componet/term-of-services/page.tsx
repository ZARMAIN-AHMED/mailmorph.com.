import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-gray-100 flex flex-col items-center px-6 pt-40 pb-16">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 tracking-wide drop-shadow-lg">
        Terms of Service
      </h1>

      <div className="max-w-4xl w-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] p-10 md:p-14">
        <p className="text-gray-300 leading-relaxed text-lg mb-8">
          Welcome to <span className="text-indigo-400 font-semibold">MailMorph</span>.  
          By using our platform, you agree to follow the terms mentioned below.  
          Please read them carefully.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">
              1. Use of Service
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              MailMorph allows you to automate and manage your email communication securely.  
              You must not use this service for spam, phishing, or any unauthorized activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">
              2. User Responsibilities
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              You are responsible for maintaining the confidentiality of your Google account and actions taken under it.  
              Any misuse may result in suspension of access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">
              3. Limitation of Liability
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              We do not guarantee uninterrupted service and are not liable for any indirect damages arising from use of MailMorph.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">
              4. Changes to Terms
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              We may update these Terms from time to time. Any updates will be posted on this page with a new revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">
              5. Contact Us
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              For any questions about these Terms, please email us at{" "}
              <a
                href="mailto:support@mailmorph.com"
                className="text-indigo-400 underline hover:text-indigo-300"
              >
                support@mailmorph.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center border-t border-zinc-800 pt-6 text-gray-500 text-sm">
          © {new Date().getFullYear()} MailMorph — All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
