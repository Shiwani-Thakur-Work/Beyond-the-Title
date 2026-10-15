import React from 'react';
import { BookOpen, Target, Sparkles, AlertCircle, BarChart3, HelpCircle, CheckCircle2 } from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero / Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          Product Discovery & Architecture Specification
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Methodology, Hypotheses & Limitations
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Beyond the Title is a focused product experiment designed to test whether multidirectional profiling and transparent, explainable matching can unlock non-obvious job opportunities.
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Core Problem Statement */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">1. Problem Statement & Scope</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
            Job seekers often organise their search around one or two rigid job titles, even when their demonstrated capabilities could transfer directly to adjacent roles (e.g., a Product Manager transitioning into Product Operations or Business Systems Analysis). Employers also miss out on capable candidates whose experience is masked by legacy titles.
          </p>
          <div className="p-4 bg-slate-50 border-l-4 border-indigo-600 rounded-r-xl text-xs sm:text-sm text-slate-800 font-medium italic">
            “How might we help candidates represent their primary career direction, adjacent capabilities, and additional interests in a structured and trustworthy way, while helping them discover relevant opportunities beyond exact job-title matches?”
          </div>
        </section>

        {/* 2. Key Hypotheses */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">2. Key Product Hypotheses</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-indigo-900 block mb-1">H1: Multidirectional Search</span>
              <p className="text-slate-600">Some job seekers want to explore adjacent roles without abandoning their primary career goal.</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-indigo-900 block mb-1">H2: Structured Communication</span>
              <p className="text-slate-600">A structured profile communicates adjacent capabilities more clearly than a single title.</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-indigo-900 block mb-1">H3: Evidence Differentiation</span>
              <p className="text-slate-600">Candidates can and will distinguish demonstrated work skills from learning goals and personal hobbies.</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-indigo-900 block mb-1">H4: Transparent Trust</span>
              <p className="text-slate-600">Transparent, explainable matching rules create higher trust than opaque percentage scores.</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-indigo-900 block mb-1">H5: Discovery Value</span>
              <p className="text-slate-600">Users find relevant opportunities they would have completely missed using single-title search.</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-indigo-900 block mb-1">H6: Recruiter Legibility</span>
              <p className="text-slate-600">Hiring managers can scan the richer profile quickly without being confused by irrelevant hobbies.</p>
            </div>
          </div>
        </section>

        {/* 3. Matching Logic & Why No Black-Box AI */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">3. Deterministic Matching vs Black-Box AI</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
            In Version 1.0, matching is 100% deterministic and transparent. We deliberately avoided opaque numeric scores (such as “87% Match”) and generative AI matching for three critical product reasons:
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Auditability:</strong> Every reason why an opportunity appears is directly traceable to tags in the candidate profile and opportunity schema.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Honest Gaps:</strong> When an opportunity requires SQL or BPMN, the system highlights that it is missing rather than smoothing over it with an arbitrary score.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Zero Hallucination:</strong> The system never invents candidate qualifications or assumes unrepresented skills exist.</span>
            </li>
          </ul>
        </section>

        {/* 4. Product Metrics Framework */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">4. Metrics & Evaluation Framework</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-900 block mb-1">
                Primary Product Metric
              </span>
              <p className="text-sm font-bold text-indigo-950">
                Percentage of reviewed opportunities that users explicitly mark as Relevant.
              </p>
              <p className="text-xs text-indigo-800 mt-1">
                Measured via the interactive feedback widget (Relevant / Unsure / Not Relevant) on each opportunity card and detail screen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block mb-1">Supporting Metrics</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Profile completion rate by section</li>
                  <li>Opportunity detail views & saves</li>
                  <li>Rate of adjacent role saves vs primary role saves</li>
                  <li>Relevance rating by reason category</li>
                </ul>
              </div>

              <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl">
                <span className="font-bold text-rose-900 block mb-1">Guardrail Metrics</span>
                <ul className="list-disc list-inside space-y-1 text-rose-800">
                  <li>Users confusing creative interests with qualifications</li>
                  <li>Users assuming real applications were submitted</li>
                  <li>Recommendations appearing relevant despite missing core hard requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Known Limitations & Out of Scope */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">5. Known Limitations & Boundary Decisions</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              <strong>Employer-side unvalidated:</strong> While candidate user interviews suggest strong appetite for showing adjacent directions, employer hiring manager willingness to accept non-linear titles remains an unvalidated hypothesis.
            </p>
            <p>
              <strong>Curated Industry Dataset:</strong> The project evaluates 12 curated industry opportunities across tier-one product organizations (Stripe, Linear, Notion, Figma, Spotify, Razorpay, Atlassian, Airbnb, Swiggy, Datadog, Duolingo, Canva) to demonstrate realistic capability matching.
            </p>
            <p>
              <strong>Local Browser Persistence:</strong> Data is saved in the browser’s `localStorage`. No server database or authentication is implemented in order to keep the project completely free, private, and deployable to static hosting tiers.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
