"use client";
import React, { useState } from "react";

type Item = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<Item[]>([
    { id: 1, title: "AI Email Generator", price: 20, quantity: 1 },
    { id: 2, title: "Smart Proposal Tool", price: 35, quantity: 2 },
  ]);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleCheckout = async () => {
    try {
      const res = await fetch("https://mailmorph-back-xyz-production.up.railway.app/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userInfo,
          items: cartItems,
        }),
      });

      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url; // redirect to Stripe
      } else {
        console.error("Checkout error:", data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>

      {/* Cart items */}
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b border-gray-700 pb-2"
          >
            <span>{item.title}</span>
            <span>
              {item.quantity} × ${item.price} = $
              {(item.quantity * item.price).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* User info */}
      <div className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={userInfo.name}
          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />
        <input
          type="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          placeholder="Address"
          value={userInfo.address}
          onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />
      </div>

      {/* Checkout button */}
      <button
        onClick={handleCheckout}
        className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:opacity-90"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
