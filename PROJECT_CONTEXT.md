# 📁 PROJECT CONTEXT — Bhavin Pathak Professional Portfolio

> **Last Scanned:** June 16, 2026
> **Version:** `1.3.0`
> **Live URL:** [https://bhaviinpathak.online](https://bhaviinpathak.online)
> **Repo:** [github.com/Bhavin-Pathak/bhavin-pathak.github.io](https://github.com/Bhavin-Pathak/bhavin-pathak.github.io)
> **Local Path:** `/Users/bhavinpathak/Documents/BHAVIIN/professional-portfolio`

---

## 👤 Owner / Author

| Field | Value |
|---|---|
| **Name** | Bhavin Pathak |
| **Email** | bhavinpathak29@gmail.com |
| **Phone** | +91 9428455515 |
| **GitHub** | [Bhavin-Pathak](https://github.com/Bhavin-Pathak) |
| **LinkedIn** | [bhavin-pathak](https://www.linkedin.com/in/bhavin-pathak/) |
| **LeetCode** | [bhavinpathak8729](https://leetcode.com/u/bhavinpathak8729/) |
| **Current Role** | SDE-1 @ Meril Life Sciences Pvt. Ltd (NuvoAI Dept), Vapi |
| **Career Start** | June 2022 (RnD Technosoft) |

---

## 🛠️ Tech Stack

### Core Framework
| Layer | Technology |
|---|---|
| **UI Library** | React `^19.1.1` |
| **Routing** | React Router DOM `^7.8.1` |
| **Animations** | Framer Motion `^12.23.12` |
| **3D Graphics** | @react-three/fiber `^9.4.2` + Three.js `^0.182.0` |
| **Icons** | Lucide React `^0.539.0` |
| **SEO** | React Helmet Async `^2.0.5` |
| **PropTypes** | prop-types `^15.8.1` |
| **Web Vitals** | web-vitals `^2.1.4` |
| **Build Tool** | react-scripts `5.0.1` (CRA) |
| **Package Manager** | **pnpm** (but `npm` used in CI/CD) |

### Styling
| Layer | Technology |
|---|---|
| **CSS Framework** | TailwindCSS `^3.4.17` |
| **CSS Mode** | Dark mode forced (`class` strategy, always `dark`) |
| **Global CSS** | `src/style/globals.css` |
| **PostCSS** | autoprefixer + postcss |
| **Primary Color** | `#2563EB` (blue-600) |
| **Background** | Pure black `#000000` |

### DevOps / Deployment
| Layer | Technology |
|---|---|
| **Hosting** | GitHub Pages |
| **CI/CD** | GitHub Actions (`deploy.yml`) |
| **Deploy Trigger** | Push to `main` branch |
| **Deploy Tool** | `gh-pages` v6.3.0 → `JamesIves/github-pages-deploy-action@v4` |
| **Build Command** | `npm run build` (CI=false, ESLint disabled) |
| **Custom Domain** | `bhaviinpathak.online` (via `public/CNAME`) |

---

## 📂 Full Project Structure

```
professional-portfolio/
├── .eslintrc.json              # ESLint config
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: build + deploy to gh-pages
├── LICENSE                     # MIT
├── README.md
├── PROJECT_CONTEXT.md          # This file
├── package.json                # v1.3.0, all deps listed here
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.js          # Dark mode: class, primary: #2563EB
│
├── public/
│   ├── index.html              # Root HTML, meta tags, OG tags
│   ├── 404.html                # Custom 404 for GitHub Pages SPA routing
│   ├── manifest.json           # PWA manifest
│   ├── robots.txt
│   ├── CNAME                   # bhaviinpathak.online
│   ├── favicon.ico
│   ├── images/
│   │   ├── me.png              # Profile photo (231 KB)
│   │   └── og-image.png        # Open Graph image (71 KB)
│   ├── companies/
│   │   ├── MERIL.jpg           # Meril Life Sciences logo
│   │   ├── UB.jpg              # UB Softec logo
│   │   ├── RND.jpg             # RnD Technosoft logo
│   │   └── E-I.jpg             # Earth Infotech logo
│   └── cv/
│       └── resume_bhavin.pdf   # Downloadable resume (157 KB)
│
└── src/
    ├── index.js                # React entry point — providers chain
    ├── app/
    │   └── app.js              # Root App component — routing + loading flow
    ├── views/                  # Page-level components (11 files)
    │   ├── LoadingView.js
    │   ├── IntroView.js
    │   ├── HomeView.js
    │   ├── AboutView.js
    │   ├── SkillsView.js
    │   ├── ExperienceView.js
    │   ├── ProjectsView.js
    │   ├── BlogView.js
    │   ├── BlogDetailView.js
    │   ├── ContactView.js
    │   └── NotFoundView.js
    ├── components/             # Reusable components (9 files)
    │   ├── Header.js
    │   ├── Footer.js
    │   ├── BackButton.js
    │   ├── LiquidContainer.js
    │   ├── LiquidButton.js
    │   ├── VisitorCounter.js
    │   ├── DigitalWarp.js
    │   ├── SplashCursor.js     # Largest file: 39 KB — WebGL fluid sim
    │   └── FollowCursor.js
    ├── static/                 # All content/data as JSON (7 files)
    │   ├── initial-home.json
    │   ├── about-me.json
    │   ├── technical-skills.json
    │   ├── work-experience.json
    │   ├── my-projects.json
    │   ├── blog-posts.json
    │   └── contact-me.json
    ├── style/
    │   └── globals.css         # Tailwind directives + base styles + animations
    ├── theme/
    │   └── theme-provider.js   # Dark-mode forced context provider
    └── utils/
        ├── animations.js       # Shared Framer Motion page variants
        ├── experience-calculate.js  # Dynamic experience years calculator
        └── reportWebVitals.js  # CWV reporting
```

---

## 🔄 Application Flow (Boot Sequence)

When the user visits the site for the first time on `/` (root):

```
1. LoadingView (1.5 sec)
      ↓ progress bar fills (0→100)
2. IntroView (Splash screen)
      ↓ user clicks "Explore Space"
3. DigitalWarp transition effect
      ↓ warp animation completes
4. HomeView (main navigation grid)
```

**Key Logic in `app.js`:**
- `isLoading` → `showIntro` → `isTransitioning` → main content
- If user lands on a **subpage directly** (e.g. `/about`), the entire intro sequence is **skipped**
- `isMobile` detected via `window.innerWidth < 1024` OR `ontouchstart` OR `maxTouchPoints > 0`
- On mobile/tablet: cursor effects (`SplashCursor`, `FollowCursor`) are **disabled** for performance

---

## 🗺️ Routing Map

| Route | Component | Description |
|---|---|---|
| `/` | `HomeView` | Navigation grid (6 cards) |
| `/about` | `AboutView` | Profile, bio, social links, expertise pillars |
| `/skills` | `SkillsView` | Animated skill bars by category |
| `/experience` | `ExperienceView` | Timeline of 4 jobs with responsibilities |
| `/projects` | `ProjectsView` | 15 project cards with GitHub/Demo links |
| `/blog` | `BlogView` | 7 blog post cards |
| `/blog/:id` | `BlogDetailView` | Full article with markdown-like rendering |
| `/contact` | `ContactView` | Contact cards with copy & external links |
| `*` | `NotFoundView` | 404 page with "Lost in Space?" message |

> **SPA Note:** GitHub Pages doesn't support client-side routing natively.
> `public/404.html` handles this by redirecting back to `index.html` with the path preserved.

---

## 🧩 Components — Detailed Reference

### `Header.js`
- **Props:** `title` (required), `subtitle`, `backTo`, `tag` (default: `"h1"`)
- Fixed at top, transparent → `bg-black/50 backdrop-blur-md` on scroll >50px
- Contains `BackButton` on the left
- Title + subtitle centered with Framer Motion entrance animation
- **Back button hidden on `/`** (home page)

### `BackButton.js`
- **Props:** `to` (optional path), `className`
- Navigates to `to` or defaults to `'/'`
- Glassmorphism style with `ArrowLeft` icon from lucide-react
- Hidden on `/` via `useLocation()` check

### `LiquidContainer.js`
- **Props:** `children` (required), `className`, `delay` (default: `0`)
- iOS-style glassmorphism card
- `backdrop-blur-xl`, `saturate-150`, `bg-black/40` (dark mode)
- `border border-white/10`, `shadow` with `rgba(0,0,0,0.36)`
- `rounded-[2rem]`, Framer Motion entrance: `opacity:0 → 1`, `y:30 → 0`, `scale:0.95 → 1`
- Glossy gradient overlay inside: `from-white/10 via-transparent to-black/5`

### `LiquidButton.js`
- **Props:** `children` (required), `onClick`, `className`
- Glassmorphism button: `bg-white/10`, `border border-white/20`, `backdrop-blur-xl`
- Hover: scale `1.02`, shimmer animation across button
- WhileTap: scale `0.96`

### `Footer.js`
- Global footer rendered outside the `<Routes>` — always visible
- Shows `VisitorCounter` + copyright `© {year} Bhavin Pathak`
- Framer Motion fade-in with `y: 10 → 0`

### `VisitorCounter.js`
- **API:** `https://api.counterapi.dev/v1/bhaviinpathak_portfolio/total_visits/up`
- Uses `sessionStorage` to only count once per browser session (not every page load)
- Shows pulsing blue dot + `Total Visitors: {count}`
- Namespace: `bhaviinpathak_portfolio`, Key: `total_visits`

### `DigitalWarp.js`
- Three.js WebGL starfield tunnel animation (uses `@react-three/fiber`)
- 2000 particles in cyan/purple/white, rotating vortex with forward motion
- Runs for 2.5 seconds then calls `onComplete()`
- Active only during transition between IntroView and HomeView

### `SplashCursor.js` *(39 KB)*
- Complex WebGL-based fluid simulation cursor effect
- Active only during `IntroView` (`showIntro === true`)
- Disabled on mobile/tablet

### `FollowCursor.js`
- Simpler cursor follow effect
- Active after loading/intro completes on desktop only

---

## 📄 Views — Detailed Reference

### `LoadingView.js`
- **Props:** `onComplete` (required callback)
- Bot detection: Lighthouse, Googlebot, HeadlessChrome, etc. → skips loading entirely (better LCP)
- Progress increments by 2 every 15ms → ~1.5 seconds total
- SVG circular progress ring + center percentage counter
- Shows app version from `package.json` (`v1.3.0`)
- Exit: `opacity:0, scale:1.05, filter:blur(40px)`

### `IntroView.js`
- **Props:** `onEnter` (required callback)
- Fullscreen splash with animated purple/blue background orbs
- Shows `greeting`, `name`, `role`, `tagline` from `initial-home.json`
- `LiquidButton` → `"Explore Space"` → triggers `onEnter()`
- Name has gradient animation: `from-blue-400 via-purple-500 to-pink-500`

### `HomeView.js`
- 6-card navigation grid using `LiquidContainer`
- Responsive: `1 col (mobile) → 2 (tablet) → 3 (laptop) → 6 (large desktop)`
- Each card: Icon + Label, hover gradient bg, `whileHover: scale:1.05, y:-5`
- Cards: Identity (`/about`), The Stack (`/skills`), Experience (`/experience`), Works (`/projects`), Insights (`/blog`), Connect (`/contact`)
- Title from `initial-home.json` → `"Bhavin Pathak | Full Stack Developer"`

### `AboutView.js`
- 2-column layout: Profile image (left) + Bio/Social (right)
- Social links: LinkedIn, GitHub, LeetCode, Resume (download)
- "Technical Pillars" section: 4 expertise cards with `whileInView` trigger
- All data from `about-me.json`
- SEO: Helmet tag with page-specific title and description

### `SkillsView.js`
- `SkillBar` sub-component: custom animated bar with random number scramble effect during load
- 2-second `requestAnimationFrame` animation with `ease = 1 - (1-progress)^4`
- Icon map: `{ Globe, Database, Code, Server, Layers, Smartphone, GitBranch, Cloud, Cpu }` (from JSON string → component)
- 2 categories: "Technologies and Frameworks" + "Database | DevOps"
- 20 skills total

### `ExperienceView.js`
- 4 jobs in vertical card stack
- Each card: Company logo + name + position + period + description + responsibilities + tech tags
- `getTotalExperience()` utility used in subtitle (e.g. `"4.0+ Years of Expertise"`)
- `whileHover: scale:1.02` spring animation on cards
- Logos loaded from `/companies/` public folder

### `ProjectsView.js`
- Grid: `1 col → 2 (md) → 3 (lg)`
- 15 projects total, each card has: Name, Language badge, Description, Topics (max 4), GitHub + Demo links
- `whileHover: scale:1.05, y:-10` spring animation
- Data from `my-projects.json`

### `BlogView.js`
- Same 3-column grid layout as Projects
- 7 blog posts total
- Each card: Title (truncated), Category badge, Date, "Read Article" button
- Navigates to `/blog/:id` on click

### `BlogDetailView.js`
- Fetches post by `id` param from `blog-posts.json`
- If post not found → redirects to `/blog`
- Custom markdown-like rendering:
  - `###` → styled `<h2>` with blue vertical bar
  - Lines starting with `1.` → numbered list block with left border
  - Everything else → `<p>` with `first-letter` drop-cap styling
- Share button: uses native `navigator.share()` or clipboard fallback
- `backTo="/blog"` passed to Header

### `ContactView.js`
- 4 contact cards: LinkedIn, Email, GitHub, Phone
- Copyable items: Email + Phone (clipboard copy with ✓ check animation)
- Interactive green pulsing status dot → hover shows typing bubble (availability message)
- Typing bubble hidden on mobile, visible on `md+`

### `NotFoundView.js`
- Giant `"404"` text in background (text-white/10)
- "Lost in Space?" heading
- "Ground Control" button — navigates to `/`

---

## 📦 Static Data Layer (`src/static/`)

All content is managed via JSON files — **no CMS, no API calls for content**.

### `initial-home.json`
```json
{
  "greeting": "Hello, I'm",
  "name": "Bhavin Pathak",
  "role": "SDE-1 @Meril Life Sciences Pvt. Ltd Vapi @Dept Nuvoai",
  "tagline": "Crafting high-performance digital experiences with precision and purpose.",
  "enterText": "Explore Space",
  "homeTitle": "Bhavin Pathak | Full Stack Developer"
}
```

### `about-me.json`
- Name, subtitle, bio (2 paragraphs), profile image path, social links
- 4 expertise items: Scalable Architecture, AI & ML, Mobile Engineering, Full Stack Mastery

### `technical-skills.json`
- 2 categories with proficiency percentages (0–100):
  - **Technologies & Frameworks** (10 skills): Swift(75), Dart(70), JS(80), Python(60), Figma(65), SwiftUI(70), Flutter(75), React Native(60), NodeJS(70), Express(75)
  - **Database | DevOps** (10 skills): SQL(70), PostgreSQL(70), MongoDB(65), Cassandra(50), Firebase(75), Supabase(60), Docker(55), CI/CD(60), GitHub Actions(65), Jenkins(50)

### `work-experience.json`
| Company | Role | Period | Stack |
|---|---|---|---|
| **Meril** (NuvoAI) | SDE-1 | Dec 2024 – Present | Node.js, React.js, AI/LLMs, Express.js, PostgreSQL |
| **UB Softec** | Mobile App Developer | Apr 2024 – Oct 2024 | Flutter, Node.js, Firebase, MongoDB |
| **RnD Technosoft** | iOS App Developer | Jun 2022 – Mar 2024 | Swift, iOS SDK, Xcode, App Store Connect |
| **Earth Infotech** | Computer Technical Specialist | Apr 2020 – May 2022 | Windows, Linux, Hardware, Networking |

### `my-projects.json`
15 projects total:

| ID | Name | Language | Has Demo |
|---|---|---|---|
| 1 | YT AI Q&A | Python | ✗ |
| 2 | Clario | JavaScript | ✓ |
| 3 | Fullstack Linux Setup | Shell | ✗ |
| 4 | Authentication Kit | iOS | ✗ |
| 5 | Evernotes | JavaScript | ✓ |
| 6 | Personal Portfolio | JavaScript | ✓ |
| 7 | Digital Resume | HTML | ✓ |
| 8 | Split-Digits | iOS | ✗ |
| 9 | Leet Code Solutions | JS+Dart | ✗ |
| 10 | Atmos-alert | JavaScript | ✓ |
| 11 | Inspirebox | JavaScript | ✓ |
| 12 | BMIwise | JavaScript | ✓ |
| 13 | Users from JSONPlaceholder | iOS | ✗ |
| 14 | Hamburger Kit | iOS | ✗ |
| 15 | Flutter Projects | Flutter | ✗ |

### `blog-posts.json`
7 articles (all authored by Bhavin Pathak):

| ID | Title | Category | Date | Read Time |
|---|---|---|---|---|
| `journey-sagwara-to-sde1` | From Sagwara to SDE-1 | Career | Jan 18, 2026 | 8 min |
| `ai-in-healthcare-2026` | AI and LLMs in Healthcare | AI | Jan 17, 2026 | 10 min |
| `modern-web-stack-2026` | React & Node.js Gold Standard | Development | Jan 16, 2026 | 7 min |
| `scaling-backends-postgresql` | Scaling Backends with PostgreSQL | Engineering | Jan 13, 2026 | 8 min |
| `securing-enterprise-apis` | Secure API Design for Finance | Engineering | Jan 08, 2026 | 9 min |
| `microservices-kubernetes-2026` | Microservices with Kubernetes | Cloud | Jan 07, 2026 | 10 min |
| `mastering-typescript-enterprise` | TypeScript for Enterprise | Development | Jan 01, 2026 | 10 min |

### `contact-me.json`
```json
{
  "title": "Connect",
  "subtitle": "Let's build something.",
  "availability": "Open to impactful engineering projects and full-time opportunities !!"
}
```

---

## 🎨 Design System

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `primary` | `#2563EB` | Blue accent, progress rings, borders |
| Background | `#000000` | Full black base |
| Text | `gray-100` | Default body text |
| Muted | `gray-400` | Subtitles, captions |
| Accent Blue | `blue-400 / cyan-500` | Orbs, highlights |
| Accent Purple | `purple-500` | Background orbs, gradients |

### Global Background (app.js)
Two animated floating orbs (always visible, not on loading/intro/warp):
- **Purple orb**: `top-[10%] left-[10%]`, 40rem circle, `bg-purple-500/40`, `blur-[100px]`
  - Animates: `x: 0→20vw`, `y: 0→30vh`, 4s loop
- **Cyan orb**: `bottom-[10%] right-[10%]`, 35rem circle, `bg-cyan-500/40`, `blur-[100px]`
  - Animates: `x: 0→-20vw`, `y: 0→-30vh`, 4s loop

### Typography
- No custom Google Font imported (uses system default)
- `font-sans` used across body text
- Loading screen uses `font-mono` for status text

### Tailwind Dark Mode
- Strategy: `"class"` in `tailwind.config.js`
- `ThemeProvider` forcibly adds `"dark"` class to `document.documentElement` on mount
- Toggle is stubbed out (`toggleTheme: () => {}`) — **dark mode is permanent**

### Custom CSS (globals.css)
- `scroll-behavior: smooth`, `scroll-padding-top: 100px`
- `body`: `background-color: #000000`, `color: white`, font-smoothing
- `@keyframes gradient-x`: animates `background-position: 0%→100%→0%` over 4s
- `.animate-gradient`: uses `background-size: 300%` + above keyframe

---

## ⚙️ Key Utilities

### `animations.js` — Shared Page Variants
```js
pageVariants = {
  initial:  { opacity: 0, scale: 0.95, y: 20 },
  animate:  { opacity: 1, scale: 1, y: 0, duration: 0.5 },
  exit:     { opacity: 0, scale: 1.05, y: -20, duration: 0.3 }
}
```
Used by: AboutView, SkillsView, ExperienceView, ProjectsView, BlogView, BlogDetailView, ContactView

### `experience-calculate.js`
- Career start date hardcoded: `2022-06-01` (RnD Technosoft)
- Returns: `"4.0+ Years of Expertise"` (dynamic, updates monthly)
- Used in `ExperienceView` header subtitle

### `theme-provider.js`
- Creates `ThemeContext` with `{ isDark: true, toggleTheme: () => {} }`
- Adds `"dark"` class to `<html>` element on mount
- `useTheme()` hook exported (toggleTheme is a no-op — dark mode is intentionally permanent)

---

## 🔗 Provider Wrapping Order (`index.js`)

```
React.StrictMode
  └── HelmetProvider          (react-helmet-async — SEO)
        └── BrowserRouter     (react-router-dom v7)
              └── ThemeProvider   (forces dark mode)
                    └── App
```

---

## 🚀 Deployment Pipeline

```yaml
Trigger: push to main branch
  → Checkout code
  → npm install --legacy-peer-deps
  → npm run build (CI=false, DISABLE_ESLINT_PLUGIN=true)
  → Deploy /build to gh-pages branch
  → GitHub Pages serves from gh-pages
  → Custom domain: bhaviinpathak.online
```

> **Note:** `pnpm` is used locally but `npm` is used in CI for compatibility.
> `CI=false` prevents build failures from warnings being treated as errors.

---

## 🐛 Issues Fixed (Branch: `fix/issues-and-improvements`)

| # | Issue | File | Fix Applied |
|---|---|---|---|
| 1 | Typo `"Gound Control"` | `NotFoundView.js:28` | Fixed to `"Ground Control"` |
| 2 | VisitorCounter fires on every page load | `VisitorCounter.js` | Added `sessionStorage` guard — counts only once per session |
| 3 | No per-page SEO meta tags | All views | Added `<Helmet>` tags with title + description per page |

---

## 📋 npm Scripts

| Command | Description |
|---|---|
| `pnpm start` / `npm start` | Dev server (react-scripts) |
| `npm run build` | Production build to `/build` |
| `npm run predeploy` | Runs build before deploy |
| `npm run deploy` | gh-pages deploy (local) |
| `npm run eject` | Eject from CRA (do not use) |

---

## 🧠 Architecture Notes

1. **Data-Driven UI**: All page content lives in `/src/static/*.json`. To update any content (bio, projects, experience, blog posts), only the JSON files need to change — no component code touches.

2. **Lazy Loading**: All views except `HomeView` and `Footer` are lazy-loaded with `React.lazy()`. Cursor effects are also lazy-loaded.

3. **Mobile Performance**: Cursor effects (WebGL SplashCursor + FollowCursor) are completely skipped on mobile/tablet using a device detection hook. Breakpoint: `width < 1024` OR touch support detected.

4. **Bot/SEO Optimization**: `LoadingView` detects bots (Lighthouse, Googlebot, etc.) and skips the loading animation entirely for better Core Web Vitals scores.

5. **GitHub Pages SPA Workaround**: `public/404.html` contains a redirect script that re-routes 404s back to `index.html` preserving the path — standard trick for SPAs on GitHub Pages.

6. **Glassmorphism Design Language**: `LiquidContainer` and `LiquidButton` are the two core design primitives. Everything is built on top of these two components.

7. **Animation System**: All page transitions use the shared `pageVariants` object. Route changes are wrapped in `<AnimatePresence mode="wait">` with `key={location.pathname}` for clean exit/enter animations.

8. **DigitalWarp**: Uses `@react-three/fiber` + `Three.js` to render a WebGL starfield tunnel (2000 particles) as the transition between IntroView and main content. Runs for exactly 2.5 seconds.
