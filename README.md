# 💌 MailMorph — The AI-Powered Email Automation Platform

MailMorph is an **AI-driven email automation platform** that connects directly with Gmail to help users **write, send, optimize, and track emails** intelligently.  
It combines **AI personalization**, **Google OAuth authentication**, **lead scoring**, and **smart follow-ups** — all inside one simple and secure web app.

---

## 🚀 Features

### 🔐 Google Authentication
- Secure login using **Google OAuth 2.0**.  
- Access Gmail safely without storing user credentials.  
- Only the minimal scope (`gmail.send`) is requested for sending emails.

---

### ✉️ AI Email Generator
- Instantly generate **professional, personalized emails** using built-in AI.  
- Support for different **tones** — formal, friendly, persuasive, or neutral.  
- Smart suggestions for subject lines and CTAs.  
- Users can **edit and save multiple versions** of generated emails.

---

### 🧠 Tone Optimizer
- Automatically adjusts the **tone, clarity, and intent** of your email.  
- Ensures your message fits the target audience — from cold leads to clients.  
- Includes sentiment analysis and style enhancement.

---

### 📬 Follow-Up Email Generator
- Automatically create **AI-generated follow-ups** triggered by lead behavior or time delay.  
- “Smart Follow-Ups” detect if an email was opened or ignored and craft the next message accordingly.  
- Supports both **manual** and **auto-triggered** sequences.

---

### 📊 Lead Scoring System
- Classifies leads into **Hot**, **Warm**, and **Cold** based on engagement.  
- Uses an **AI prediction model** to analyze email replies and open rates.  
- Generates a **score** for each lead and triggers personalized follow-ups.

---

### 📥 AI Inbox Predictor (Upcoming)
- Predicts the **type of response** or **engagement probability** for each outgoing email.  
- Helps users focus on high-value conversations first.

---

### 📂 Bulk Email Sending
- Send personalized bulk campaigns using Gmail API.  
- Each message is customized using dynamic placeholders (like `{name}` or `{company}`).  
- Automatically spaces out sends to comply with Gmail limits.

---

### 📜 Email History & Tracking
- View all sent and scheduled emails inside the dashboard.  
- Track status: sent, opened, replied, or follow-up pending.  
- View **AI-generated suggestions** for improving open and reply rates.

---

### 💾 Email Version Management
- Save, edit, and compare multiple email drafts.  
- Easily switch between past versions or restore old templates.

---

### 💳 Stripe Integration
- Secure payment system powered by **Stripe Checkout**.  
- Enables users to upgrade to premium AI tools and bulk email limits.  
- Supports multiple plans and subscription tiers.

---

### 🧩 Upcoming Features
-📬 **Multi-Outreach Campaigns** — plan and execute multi-channel email outreach
- 📈 **Campaign Analytics Dashboard** — visualize open, click, and conversion metrics.  
- 🤖 **AI Voice Email Generator** — generate and send personalized voice notes.  
- 🧠 **Gemini Integration** — enhanced AI reasoning for smarter predictions.  
- 🌍 **Multi-language Support** — create and send emails in multiple languages.  
- 🧾 **Team Collaboration** — manage contacts, assign tasks, and share templates.

---

## 🏗️ Tech Stack

**Frontend:**  
- Next.js (TypeScript + Tailwind CSS)  
- Secure Google OAuth (via NextAuth / custom implementation)  

**Backend:**  
- FastAPI (Python)  
- Object-Oriented Email, User, and Lead Models  
- Stripe API for payments  
- Gmail API integration
- google auth

**AI Layer:**  
- OPENAI agentt sdk 
- Custom prompt engineering for tone, style, and lead response prediction  

---

