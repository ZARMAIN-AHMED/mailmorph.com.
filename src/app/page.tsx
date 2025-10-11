"use client";

import React, { useState } from "react";
import Hero from "./componet/hero/page";
import About from "./componet/about/page";
import Pricing from "./componet/plans/page";


export default function Home() {
  const [refresh, setRefresh] = useState(false);
  const reloadLeads = () => setRefresh(!refresh);

  return (
    <div>
      <Hero />
      <About />
      <Pricing />
      {/* <ProfileMenu /> */}
      {/* <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">AI Cold Email Agent - Lead Management</h1>
         */}
        {/* <LeadList key={refresh ? "r" : "l"} />
         <PolarCheckout // 👤 Replace with logged-in user email
      /> */}
      {/* </div> */}
    </div>
  );
}
