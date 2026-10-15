# Beyond the Title

> A personal project exploring multidirectional career discovery — helping professionals highlight transferable capabilities, project evidence, and adjacent directions beyond rigid job titles.

🚀 **Live App:** [https://shiwani-thakur-work.github.io/Beyond-the-Title/](https://shiwani-thakur-work.github.io/Beyond-the-Title/)  
📦 **Source Code:** [https://github.com/Shiwani-Thakur-Work/Beyond-the-Title](https://github.com/Shiwani-Thakur-Work/Beyond-the-Title)  
👩‍💻 **Author:** [Shiwani Thakur](https://github.com/Shiwani-Thakur-Work)  
🛠️ **Built with:** React 19, Vite 8, TypeScript, and Tailwind CSS v4  

---

## Why I Built This

Most modern job boards trap people behind a single historical job title. If your previous role was "Associate Product Manager", conventional search filters lock you into that one box—even if your demonstrated process documentation, sprint facilitation, and systems skills make you an exceptional fit for adjacent roles like **Product Operations** or **Business Systems Analysis**.

**Beyond the Title** is a personal product design and engineering project built to explore a better discovery model:
1. **Multidirectional Profile:** Allow professionals to define their primary career target alongside up to three adjacent roles.
2. **Evidence-Graded Capabilities:** Visually distinguish between skills proven in production work, skills demonstrated through side projects, active learning goals, and creative interests.
3. **Transparent Matching:** Provide clear, plain-language explanations of *why* an opportunity aligns and *what requirements are missing*, replacing opaque percentage scores.
4. **Zero-Tracking Privacy:** Run 100% in the user's browser via `localStorage` with full export/import control.

---

## Key Features

- **Multidirectional Profile Builder:** Choose a primary target role, select transferable adjacent directions, and organize capabilities with evidence classifications.
- **Explainable Matching Engine:** Deterministic matching logic that compares candidate evidence against opportunity requirements and surfaces transparent explanations without black-box scores.
- **Curated Industry Opportunities:** Explore 12 realistic roles across companies like Stripe, Linear, Notion, Figma, Spotify, Razorpay, Atlassian, Airbnb, Swiggy, Datadog, Duolingo, and Canva.
- **Relevance Feedback Loop:** Mark recommendations as Relevant, Unsure, or Not Relevant with structured reason tags to evaluate discovery accuracy.
- **Recruiter Perspective View:** A dedicated view showing how hiring managers and screeners can read multidirectional profiles to spot transferable talent quickly.
- **Client-Side Data Ownership:** All data stays in your browser. Export backup data as JSON, import anytime, or reset with one click.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS v4, Lucide React Icons
- **Persistence:** Browser `localStorage` (no server database or tracking needed)
- **Deployment:** GitHub Pages via GitHub Actions

---

## Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/Shiwani-Thakur-Work/Beyond-the-Title.git

# Navigate into the project directory
cd Beyond-the-Title

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build & Lint
```bash
# Production bundle
npm run build

# Code linting
npm run lint
```

---

## License

MIT License • Created by [Shiwani Thakur](https://github.com/Shiwani-Thakur-Work) as a personal product and engineering project.
