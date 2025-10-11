// "use client";
// import React from "react";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// const Hero = () => {
//   // Open Gmail OAuth in a new tab
//   const handleLogin = () => {
//     window.open(`${API_BASE}/auth/login`, "_blank");
//   };

//   return (
//     <section className="bg-gray-50 py-20 px-6 text-center">
//       <div className="max-w-4xl mx-auto">
//         <span><br /><br /></span>

//         {/* Heading */}
//         <h1 className="text-4xl md:text-6xl font-extrabold mt-6 text-gray-900 leading-tight">
//           Send Smarter Emails with{" "}
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             MailMorph
//           </span>
//         </h1>

//         {/* Subheading */}
//         <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//           Create, send, and manage professional emails using AI.  
//           Generate content instantly and track your email history like Gmail —  
//           but smarter.
//         </p>

//         {/* Buttons */}
//         <div className="mt-8 flex justify-center gap-4">
//           <button
//             onClick={handleLogin}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
//           >
//             Start for Free
//           </button>
//           <a
//             href="/componet/history"
//             className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
//           >
//             View History
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };
// export default Hero;


// "use client";
// import React from "react";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// const Hero = () => {
//   const handleLogin = () => {
//     window.open(`${API_BASE}/auth/login`, "_blank");
//   };

  

//   return (
//     <section className="relative h-screen w-full bg-black text-center overflow-hidden flex items-center">
//       {/* 🔹 Background Video */}
//       <video
//         className="absolute inset-0 w-full h-full object-cover"
//         autoPlay
//         loop
//         muted
//         playsInline
//       >
//         <source src="/video.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>


//       {/* 🔹 Content */}
//       <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full px-8 lg:px-20">
        
//         {/* Left Side Content */}
//         <div className="max-w-xl text-left">
//           {/* Tagline */}
//           {/* <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
//             AI Email Assistant 🚀
//           </span> */}

//           {/* Heading */}
//           <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-white leading-tight">
//             Send Smarter Emails with{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-300">
//               MailMorph
//             </span>
//           </h1>

//           {/* Subheading */}
//           <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
//             Create, send, and manage professional emails using AI.  
//             Generate content instantly and track your email history like Gmail —  
//             but smarter.
//           </p>

//           {/* Buttons */}
//           <div className="mt-10 flex flex-col md:flex-row gap-4">
//             <button
//               onClick={handleLogin}
//               className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition transform hover:-translate-y-1 hover:shadow-2xl"
//             >
//               Start for Free
//             </button>
//             <a
//               href="/componet/history"
//               className="px-8 py-4 border border-cyan-400 text-cyan-300 rounded-lg font-semibold shadow-lg hover:bg-cyan-900/30 transition transform hover:-translate-y-1 hover:shadow-2xl"
//             >
//               View History
//             </a>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default Hero;



"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const Hero = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // User fetch karenge backend se
  useEffect(() => {
    fetch(`${API_BASE}/auth/me`)
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogin = () => {
    window.open(`${API_BASE}/auth/login`, "_blank");
  };

  const handleViewHistory = () => {
    if (!user) {
      alert("Please login first to view your history!");
      return;
    }
    router.push("/componet/history");
  };

  return (
    <section className="relative h-screen w-full bg-black text-center overflow-hidden flex items-center">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full px-8 lg:px-20">
        <div className="max-w-xl text-left">
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Send Smarter Emails with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-300">
              MailMorph
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
  Effortlessly create, send, and follow up on professional emails with AI — generate content instantly, track your history, and stay ahead with smarter communication.
</p>


          <div className="mt-10 flex flex-col md:flex-row gap-4">
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition transform hover:-translate-y-1 hover:shadow-2xl"
            >
              Start for Free
            </button>
            <button
              onClick={handleViewHistory}
              className="px-8 py-4 border border-cyan-400 text-cyan-300 rounded-lg font-semibold shadow-lg hover:bg-cyan-900/30 transition transform hover:-translate-y-1 hover:shadow-2xl"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
