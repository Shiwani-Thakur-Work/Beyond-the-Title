import React from 'react';
import type { Opportunity, MatchAnalysis, RelevanceFeedback } from '../types';
import { Bookmark, MapPin, ChevronRight, CheckCircle2, AlertCircle, Sparkles, Building2, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  match: MatchAnalysis;
  isSaved: boolean;
  onToggleSave: () => void;
  onSelect: () => void;
  feedback?: RelevanceFeedback;
  onQuickFeedback?: (rating: 'relevant' | 'not-relevant' | 'unsure') => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  match,
  isSaved,
  onToggleSave,
  onSelect,
  feedback,
  onQuickFeedback,
}) => {
  // Determine Fit Pill styles
  let fitPillColor = 'bg-slate-100 text-slate-700 border-slate-200';
  if (match.fitDescriptor === 'Primary Role Fit') {
    fitPillColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (match.fitDescriptor === 'Adjacent Role Pivot') {
    fitPillColor = 'bg-violet-50 text-violet-700 border-violet-200';
  } else if (match.fitDescriptor === 'Emerging Capability Match') {
    fitPillColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }

  const demonstratedCount = match.matchedWorkCapabilities.length + match.matchedProjectCapabilities.length;
  const missingCount = match.missingRequiredCapabilities.length;

  return (
    <article
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
      id={`opp-card-${opportunity.id}`}
    >
      <div className="p-5 sm:p-6">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-slate-200">
              <Building2 className="w-3 h-3 text-slate-400" />
              {opportunity.organisationLabel}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              Curated Role
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:border-slate-300'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            aria-label={isSaved ? 'Saved' : 'Save'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Title & Category */}
        <h3
          onClick={onSelect}
          className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer tracking-tight mb-1"
        >
          {opportunity.title}
        </h3>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-4">
          <span className="font-semibold text-slate-700">{opportunity.roleFamily}</span>
          <span>•</span>
          <span>{opportunity.seniorityLabel}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {opportunity.workMode} ({opportunity.location.split('(')[0].trim()})
          </span>
        </div>

        {/* Summary */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {opportunity.summary}
        </p>

        {/* Deterministic Match Box */}
        <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${fitPillColor} flex items-center gap-1`}>
              <Sparkles className="w-3 h-3" />
              {match.fitDescriptor}
            </span>

            <div className="text-[11px] font-semibold text-slate-500">
              {demonstratedCount} aligned • {missingCount} missing
            </div>
          </div>

          <p className="text-xs text-slate-700 font-medium leading-normal">
            {match.explanationSummary}
          </p>

          {/* Quick pills for demonstrated vs missing */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {match.matchedWorkCapabilities.slice(0, 2).map((item, idx) => {
              const label = item.split('(')[0].trim();
              return (
                <span
                  key={idx}
                  className="text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {label}
                </span>
              );
            })}

            {match.missingRequiredCapabilities.length > 0 && (
              <span className="text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-500" />
                Requests: {match.missingRequiredCapabilities[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Details & Feedback */}
      <div className="px-5 sm:px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Quick Relevance Feedback indicator */}
        <div className="flex items-center gap-1">
          {feedback ? (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                feedback.rating === 'relevant'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : feedback.rating === 'not-relevant'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {feedback.rating === 'relevant' && <ThumbsUp className="w-3 h-3 text-emerald-600" />}
              {feedback.rating === 'not-relevant' && <ThumbsDown className="w-3 h-3 text-rose-500" />}
              {feedback.rating === 'unsure' && <HelpCircle className="w-3 h-3 text-amber-600" />}
              Marked: {feedback.rating === 'relevant' ? 'Relevant' : feedback.rating === 'not-relevant' ? 'Not Relevant' : 'Unsure'}
            </span>
          ) : (
            onQuickFeedback && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span className="hidden sm:inline">Relevant?</span>
                <button
                  type="button"
                  onClick={() => onQuickFeedback('relevant')}
                  className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                  title="Mark as Relevant"
                  aria-label="Mark as Relevant"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onQuickFeedback('not-relevant')}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  title="Mark as Not Relevant"
                  aria-label="Mark as Not Relevant"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          )}
        </div>

        {/* View Details Button */}
        <button
          type="button"
          onClick={onSelect}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
        >
          <span>Examine Match</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
