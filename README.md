# 🌟 Bhavin Pathak | Professional Portfolio

> **"Crafting high-performance digital experiences with precision and purpose."**

A state-of-the-art personal portfolio website featuring a premium **Liquid Glass** aesthetic, custom mouse-tracking 3D interactive grids, a live activity timeline integration, and a dedicated AI assistant. Built to showcase technical architectural skills with a touch of modern design elegance.

🔗 **Live Site**: [bhaviinpathak.online](https://bhaviinpathak.online)

---

## ✨ Key Features

- **🌊 Liquid Glass Design**: Custom-built `LiquidContainer` and `LiquidButton` components with frosted glassmorphism, saturation boosts, and 3D lighting effects.
- **🧊 Interactive 3D Bento Grid**:
  - Home dashboard restructured into an asymmetric Bento layout.
  - Custom mouse-tracking `TiltCard` components utilizing 3D perspective rotation (`rotateX`/`rotateY`) and cursor-tracking glossy reflection overlays.
  - Vertically stacked headers on desktop/tablet views, and horizontal side-by-side structures on mobile views for maximum responsiveness.
- **📈 Live Dynamic Activity Timeline (`/timeline`)**:
  - Merges live GitHub event activity streams (commits, push logs, PR actions) and dynamic LeetCode solved statistics (solved counts categorized by difficulty) with your local static milestones.
  - Interactive filter pills (All, GitHub, LeetCode, Milestones) with conditional layout rows and centered metrics.
- **🤖 Bhavin's Neural Twin (AI Chatbot)**:
  - An intelligent AI assistant built directly into the site to answer recruiters' questions about Bhavin's skills, projects, and work history.
  - Uses the **Google Gemini REST API** (`generateContent` endpoint) for instant response times (<1s), completely bypassing proxy-buffering delays.
  - **Token Optimization**: Resume data sections are compressed and truncated inside the system instruction window, resulting in a **60% token footprint reduction** (~1,300 tokens instead of ~3,800 tokens per call).
  - **Status Indicator**: Features a dynamic color-coded dot showing state based on 10 RPM rate limits (Green/Online, Yellow/Busy, Red/Offline).
  - Includes typewriter greeting text, suggested follow-up chips, and custom 429 rate limit warning dialogs explaining resets and providing direct fallback contacts.
- **📱 Fully Responsive Grid Layouts**: Adapted across all views to present content cleanly across mobile, tablet, and desktop viewports.
- **🌑 Dark & Light Theme System**: Integrated React context mode provider with permanent dark mode aesthetic.
- **🔍 SEO Optimization**: Built-in `<Helmet>` metadata mapping per-page for search engine crawler efficiency and custom Open Graph previews.

---

## 🛠️ The Tech Stack

### **Core**
- **React 19**: Utilizing concurrent React features.
- **React Router DOM 7**: Client-side routing with route-aware page transitions.

### **Styling & UI**
- **Tailwind CSS**: Utility-first styling for layout structure.
- **Framer Motion**: Gesture-based animations and layout transitions (`AnimatePresence`).
- **Lucide React**: Clean, lightweight SVG icons.

### **Graphics & APIs**
- **Three.js & React Three Fiber**: WebGL particle starfield warp tunnel for entry flow.
- **Google Gemini API**: Live natural language processing engine.
- **GitHub & LeetCode APIs**: Live activity feed metrics.

---

## 🚀 How to Run Locally

To explore the codebase or run the project on your local machine:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Bhavin-Pathak/professional-portfolio.git
   cd professional-portfolio
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file in the project root to store your local secrets (already configured in `.gitignore` so they are never exposed to public Git commits):
   ```env
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```

   Commit default public APIs inside a `.env` file:
   ```env
   REACT_APP_GITHUB_REPOS_URL=https://api.github.com/users/Bhavin-Pathak/repos
   REACT_APP_GITHUB_PROFILE_URL=https://api.github.com/users/Bhavin-Pathak
   REACT_APP_LEETCODE_API_URL=https://leetcode-api-faisalshohag.vercel.app/bhavinpathak8729/
   ```

3. **Install Dependencies**
   ```bash
   pnpm install
   # Or using npm: npm install --legacy-peer-deps
   ```

4. **Start Development Server**
   ```bash
   pnpm start
   # Or using npm: npm start
   ```
   *Open [http://localhost:3000](http://localhost:3000) to view it in the browser.*

5. **Build for Production**
   ```bash
   pnpm build
   # Or using npm: npm run build
   ```

---

## 🛡️ License & Rights

**⚠️ PROPRIETARY LICENSE – ALL RIGHTS RESERVED**

This project is the intellectual property of **Bhavin Pathak**.

- **❌ You may NOT**: Copy, redistribute, sell, or use any code from this repository for commercial purposes.
- **❌ You may NOT**: Reverse engineer or use the design assets/identity without permission.
- **✅ You MAY**: View the code for educational purposes or to verify technical skills.

📄 **[Read the Full License Here](LICENSE)**

---

## 🤝 Let's Connect

- **Portfolio**: [bhaviinpathak.online](https://bhaviinpathak.online)
- **LinkedIn**: [linkedin.com/in/bhavin-pathak](https://linkedin.com/in/bhavin-pathak)
- **GitHub**: [github.com/Bhavin-Pathak](https://github.com/Bhavin-Pathak)
- **Email**: [bhavinpathak29@gmail.com](mailto:bhavinpathak29@gmail.com)

---
*© 2026 Bhavin Pathak.*
