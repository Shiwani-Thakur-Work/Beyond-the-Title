import React, { useState } from 'react';
import type { Opportunity, MatchAnalysis, RelevanceFeedback, RelevanceRating } from '../types';
import {
  X,
  Building2,
  MapPin,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Heart,
  FolderGit2,
  Briefcase,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity;
  match: MatchAnalysis;
  isSaved: boolean;
  onToggleSave: () => void;
  feedback?: RelevanceFeedback;
  onSaveFeedback: (feedback: RelevanceFeedback) => void;
  onClose: () => void;
}

const RELEVANCE_REASONS = [
  'Matches my transferable skills well',
  'Connects nicely with my adjacent career direction',
  'Requires skills I do not wish to use',
  'Missing key technical depth in my profile',
  'Seniority level is not a good fit',
  'Work arrangement or location does not suit me',
  'Not interested in this specific product domain',
];

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  match,
  isSaved,
  onToggleSave,
  feedback,
  onSaveFeedback,
  onClose,
}) => {
  const [selectedRating, setSelectedRating] = useState<RelevanceRating | undefined>(feedback?.rating);
  const [selectedReason, setSelectedReason] = useState<string>(feedback?.reasonTag || '');
  const [feedbackNotes, setFeedbackNotes] = useState<string>(feedback?.notes || '');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSubmitFeedback = (rating: RelevanceRating) => {
    setSelectedRating(rating);
    const newFeedback: RelevanceFeedback = {
      opportunityId: opportunity.id,
      rating,
      reasonTag: selectedReason || undefined,
      notes: feedbackNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    onSaveFeedback(newFeedback);
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-opp-title"
      >
        {/* Top Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold bg-white text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {opportunity.organisationLabel}
              </span>
              <span className="text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                Curated Industry Opportunity
              </span>
            </div>

            <h2 id="modal-opp-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {opportunity.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-2">
              <span className="font-semibold text-slate-700">{opportunity.roleFamily}</span>
              <span>•</span>
              <span>{opportunity.seniorityLabel}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {opportunity.workMode} — {opportunity.location}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* Honest Transparent Matching Breakdown */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                Explainable Matching Breakdown
              </span>
              <span className="text-xs font-bold bg-white text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200">
                {match.fitDescriptor}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {match.explanationSummary}
            </p>

            {/* Overlaps breakdown */}
            <div className="space-y-3 pt-2">
              {/* Work Evidence */}
              {match.matchedWorkCapabilities.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-emerald-600" />
                    Verified Work Experience Overlap ({match.matchedWorkCapabilities.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchedWorkCapabilities.map((item, i) => (
                      <span key={i} className="text-xs bg-white text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Evidence */}
              {match.matchedProjectCapabilities.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <FolderGit2 className="w-3 h-3 text-blue-600" />
                    Project Evidence Overlap ({match.matchedProjectCapabilities.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchedProjectCapabilities.map((item, i) => (
                      <span key={i} className="text-xs bg-white text-blue-900 border border-blue-200 px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Goals */}
              {match.learningCapabilities.length > 0 && (
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/90">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                    Learning in Progress (Not Yet Demonstrated Work Experience)
                  </span>
                  <p className="text-xs text-amber-800 mb-2">
                    These capabilities are needed or preferred by the role, but your profile honestly designates them as active learning goals:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.learningCapabilities.map((item, i) => (
                      <span key={i} className="text-xs bg-white text-amber-900 border border-amber-300 px-2.5 py-1 rounded-md font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Requirements Callout */}
              {match.missingRequiredCapabilities.length > 0 && (
                <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200/90">
                  <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Missing Requirements ({match.missingRequiredCapabilities.length})
                  </span>
                  <p className="text-xs text-rose-800 mb-2">
                    The following requirements are requested for this role but are not listed in your demonstrated profile:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.missingRequiredCapabilities.map((item, i) => (
                      <span key={i} className="text-xs bg-white text-rose-800 border border-rose-300 px-2.5 py-1 rounded-md font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Creative Interest Alignments */}
              {match.interestOverlaps.length > 0 && (
                <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-200/90">
                  <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-purple-600" />
                    Creative Interest Synergy ({match.interestOverlaps.join(', ')})
                  </span>
                  <p className="text-xs text-purple-800">
                    Synergy noted: This role intersects with your creative interests. Note that creative interests do not substitute for formal professional qualifications.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Role Summary & Responsibilities */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Role Overview & Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {opportunity.summary}
            </p>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Core Responsibilities
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {opportunity.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Must-Have Non-Negotiables
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {opportunity.mustHaves.map((must, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                    <span>{must}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Relevance Feedback Section */}
          <section className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Relevance Feedback
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Is this recommendation relevant to your multidirectional exploration? (Helps measure product accuracy).
                </p>
              </div>

              {feedbackSubmitted && (
                <span className="text-xs text-emerald-600 font-bold animate-pulse">
                  Feedback recorded!
                </span>
              )}
            </div>

            {/* Rating Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSubmitFeedback('relevant')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  selectedRating === 'relevant'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Relevant
              </button>

              <button
                type="button"
                onClick={() => handleSubmitFeedback('unsure')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  selectedRating === 'unsure'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Unsure
              </button>

              <button
                type="button"
                onClick={() => handleSubmitFeedback('not-relevant')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  selectedRating === 'not-relevant'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                Not Relevant
              </button>
            </div>

            {/* Optional Reason Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Reason for rating
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => {
                    setSelectedReason(e.target.value);
                    if (selectedRating) {
                      onSaveFeedback({
                        opportunityId: opportunity.id,
                        rating: selectedRating,
                        reasonTag: e.target.value,
                        notes: feedbackNotes || undefined,
                        createdAt: new Date().toISOString(),
                      });
                    }
                  }}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="">-- Choose reason --</option>
                  {RELEVANCE_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Optional notes
                </label>
                <input
                  type="text"
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  onBlur={() => {
                    if (selectedRating) {
                      onSaveFeedback({
                        opportunityId: opportunity.id,
                        rating: selectedRating,
                        reasonTag: selectedReason || undefined,
                        notes: feedbackNotes || undefined,
                        createdAt: new Date().toISOString(),
                      });
                    }
                  }}
                  placeholder="e.g. Great match on PRDs, but I want pure remote"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* Discovery Transparency Notice */}
          <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Discovery Engine Note:</span> This curated opportunity reflects actual industry requirements from {opportunity.organisationLabel}. Beyond the Title is an independent matching engine designed to help you discover transferable fits; apply directly via the company's official career portal.
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onToggleSave}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isSaved
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            {isSaved ? 'Saved in Opportunities' : 'Save for Later'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
