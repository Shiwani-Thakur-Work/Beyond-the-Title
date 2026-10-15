# Beyond the Title

> **A Multidirectional Opportunity Discovery Web MVP**  
> Helping job seekers represent multiple professional directions, transferable capabilities, and project evidence beyond rigid job titles.

Built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**.

---

## 1. Product Overview & Hypothesis

Job seekers frequently organize their job search around one or two rigid job titles, even when their demonstrated capabilities could directly transfer to adjacent roles (e.g., an Associate Product Manager transitioning into Product Operations or Business Systems Analysis). Conversely, hiring managers often overlook transferable talent when a candidate's background does not match the exact title on a job description.

**Core Product Hypothesis:**  
Can a structured profile distinguishing **Primary Roles**, **Adjacent Roles**, **Work Evidence**, **Project Evidence**, and **Learning Goals** combined with **deterministic, explainable matching** help candidates discover relevant opportunities that single-title searches miss, while maintaining recruiter trust?

### Product Principles
1. **Relevance over volume:** High-signal curated matches rather than noisy job board spam.
2. **Honest evidence labeling:** Clear visual differentiation between production work experience, project prototypes, active learning goals, and creative hobbies.
3. **Transparent matching:** Plain-language explanations of *why* an opportunity fits and *what requirements are missing*. **No opaque percentage match scores.**
4. **Candidate privacy & control:** 100% client-side `localStorage`. Private by default. Zero server uploads.
5. **No false pretenses:** All listings are clearly labelled as demonstration data. No job applications are submitted.

---

## 2. Technical Architecture & Constraints

- **Core Framework:** React 19, Vite 8, TypeScript (strict mode, `verbatimModuleSyntax`).
- **Styling:** Tailwind CSS v4 with custom badge tokens and responsive utility layouts.
- **Data Persistence:** Browser `localStorage` (Profile drafts, Saved opportunities, Relevance feedback).
- **Data Fixtures:** 10 curated demonstration opportunities in `src/data/opportunities.json` spanning the Product and Technology-adjacent family.
- **APIs & Cost:** **₹0 / $0 target.** Zero paid APIs, no API keys, no scraping, no external backend. Fully deployable as a static site to Cloudflare Pages, Vercel, or Netlify.

---

## 3. Getting Started Locally

### Prerequisites
- Node.js (v18+ recommended; verified on v26)
- npm (v9+)

### Installation & Execution
```bash
# Clone or navigate to the project directory
cd "Beyond the Title"

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Verification Commands
```bash
# Check TypeScript types and compile production bundle
npm run build

# Run Oxlint linter
npm run lint
```

---

## 4. Deterministic Matching Engine

The matching engine (`src/services/matchingEngine.ts`) implements pure, explainable matching logic:

1. **Role Alignment Analysis:**
   - **Primary Role Fit:** When the candidate's primary target role matches the opportunity's required roles.
   - **Adjacent Role Pivot:** When an opportunity connects with one of the candidate's selected adjacent roles (up to 3), surfacing transferable paths.
   - **Emerging Capability Match:** When strong capability overlap exists across functional responsibilities.
   - **Distinct Exploration:** General opportunities for exploratory review.

2. **Evidence-Graded Capabilities Overlap:**
   - **Work Experience (`work`):** Verified skills used in production/employment.
   - **Project Evidence (`project`):** Demonstrated through side projects or prototypes.
   - **Learning Goals (`learning`):** Explicitly flagged as *in progress*. The system **honestly acknowledges** these as gaps rather than treating them as completed qualifications.
   - **Missing Requirements:** Explicitly surfaced in warning callouts (e.g., *"Requests: Data Modeling & SQL Queries"*).

3. **Creative & Personal Interests (`interest`):**
   - Personal interests (e.g., voiceover, technical illustration, creative writing) are styled in distinct purple badges. They surface domain synergies (e.g., creator tools) but **never imply professional job qualification**.

4. **No Opaque Numeric Match Scores:**
   - Instead of an unexplainable "87% Match", the system provides a structured breakdown:
     - Exact work capabilities matched
     - Project evidence aligned
     - Active learning goals in progress
     - Missing requirements to consider
     - Plain-English justification sentence

---

## 5. Key Screens & Features

1. **Curated Opportunity Feed (`DiscoveryFeed.tsx`):**
   - Multi-criteria filtering: Search keywords, Role Family, Fit Alignment, Work Mode (Remote/Hybrid/In-Person).
   - Card summaries with fictional demo tags, seniority, match pill, and bookmark toggle.
2. **Opportunity Detail Modal (`OpportunityDetailModal.tsx`):**
   - Deep inspection of responsibilities and must-haves.
   - Detailed Explainable Matching breakdown with honest gap callouts.
   - **Relevance Feedback Widget:** Mark as *Relevant*, *Unsure*, or *Not Relevant*, select structured reason tags, and record notes.
3. **Profile Builder & Structured Preview (`ProfileBuilder.tsx`, `ProfilePreview.tsx`):**
   - Quick preset selector (Maya Chen - PM Pivot, Kiran Patel - ProdOps).
   - Add/remove primary role and up to 3 adjacent roles with taxonomy suggestions.
   - Add capabilities with evidence radio pills and optional context.
   - Manage creative interests and work mode preference.
   - Structured preview card showing candidate narrative and privacy status.
4. **Saved Opportunities (`SavedOpportunitiesView.tsx`):**
   - Review bookmarked opportunities with quick access to match breakdown.
5. **Recruiter Screening View (`RecruiterView.tsx`):**
   - Explains how hiring managers benefit from multidirectional profiles and evidence labels to discover transferable talent without false keyword screening.
6. **Methodology & Limitations (`MethodologyView.tsx`):**
   - Documents problem statement, the 6 research hypotheses (H1–H6), product metrics framework, and known limitations.
7. **Demo Data Management Modal (`DataResetModal.tsx`):**
   - One-click clear/reset of all local storage data.
   - Export backup as JSON.
   - Import previously saved JSON backup.

---

## 6. Step-by-Step Manual QA Script

To manually test the end-to-end user journeys:

### Journey 1: Profile Customization & Real-time Matching
1. Open the app in browser at `http://localhost:5173`.
2. Click the **Profile** tab in the top navigation.
3. Under **Presets**, click **"Maya Chen (PM Pivot)"**.
4. Scroll down to **Capabilities** and add a new capability:
   - Name: `SQL & Metric Analysis`
   - Evidence Classification: Select `Work Experience`
   - Context: `Wrote daily analytical queries for user funnel dashboards`
   - Click **Add Capability**.
5. Switch to **Structured Preview** tab to confirm the new capability is rendered with an emerald "Professional Work" badge.
6. Click **Opportunities** tab. Notice that roles requiring SQL (such as *Business Systems Analyst* or *Technical Business Analyst*) immediately update their match summary to reflect your new work capability!

### Journey 2: Inspecting an Opportunity & Providing Feedback
1. On the **Opportunities** feed, find **"Associate Product Manager - Core Experience"**.
2. Click **Examine Match** to open the modal.
3. Review the **Explainable Matching Breakdown**:
   - Verify that *Requirements Documentation* and *Stakeholder Management* appear under **Verified Work Experience**.
   - Verify any missing requirements (e.g. *Product Analytics*) appear under **Missing Requirements**.
4. In the **Relevance Feedback** section:
   - Click **Relevant** (turns green).
   - Select reason: *"Matches my transferable skills well"*.
   - In notes, type: *"Excellent alignment with PRD habits"*.
5. Click **Save for Later** (bookmark button).
6. Click **Done** or the **X** icon to close the modal.

### Journey 3: Reviewing Saved Opportunities
1. Click the **Saved** tab in the navigation header.
2. Verify that the badge counter displays `1` and the saved opportunity appears on the screen.
3. Click **Examine Match** to confirm your feedback and bookmark status persist.

### Journey 4: Recruiter & Methodology Views
1. Click the **Recruiter View** tab in the navbar.
2. Verify the candidate's three-tier capability breakdown (Work-Verified, Project-Demonstrated, In-Progress).
3. Click the **Methodology** tab.
4. Read through the 6 validated hypotheses, deterministic matching rationale, and metric definitions.

### Journey 5: Data Privacy & Reset
1. Click the **Refresh/Reset** icon in the top right header.
2. Click **Export JSON** to download a backup of your profile and feedback.
3. Click **Reset All Demo Data**. Confirm that local storage is reset.

---

## 7. Known Limitations & Next Steps

1. **Employer-Side Validation:** While candidate interviews validate the desire to represent adjacent directions, hiring manager willingness to accept multidirectional candidates in corporate ATS funnels remains an active hypothesis.
2. **Curated Demonstration Dataset:** Opportunities are seeded with 10 realistic fictional roles. Live scraping and external job boards were excluded by design for MVP scope.
3. **Browser Storage Scope:** Demo profiles exist locally on the current browser device. Multi-device sync will be explored in future milestones (e.g. Supabase free tier).

---

## 8. License & Credits

Created as a product discovery and management experiment for **Beyond the Title**.  
Open-source under the MIT License.
