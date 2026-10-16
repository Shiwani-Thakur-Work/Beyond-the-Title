/**
 * @file OpportunityCard.tsx
 * @description Compact discovery feed card presenting an opportunity alongside
 * transparent multidirectional match indicators.
 * 
 * Features:
 * - Dimensional Fit Indicator: Visually signals whether an opportunity matches primary,
 *   adjacent, or creative hobby pathways.
 * - Evidence & Gap Accounting: Explicitly displays the count of verified capabilities
 *   and unrepresented required qualifications.
 * - In-Feed Relevance Telemetry: Allows candidates to rate recommendation accuracy
 *   (Relevant / Unsure / Not Relevant) directly from the feed.
 * - Sovereign Bookmark Control: Direct toggle for saving items to localStorage.
 */

import React from 'react';
import type { Opportunity, MatchAnalysis, RelevanceFeedback } from '../types';
import {
  Bookmark,
  MapPin,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Palette,
  Compass,
} from 'lucide-react';

/**
 * Properties for OpportunityCard component.
 */
interface OpportunityCardProps {
  /** The curated demonstration opportunity record */
  opportunity: Opportunity;
  /** Deterministic match evaluation output for the active candidate profile */
  match: MatchAnalysis;
  /** Whether this opportunity is currently bookmarked in localStorage */
  isSaved: boolean;
  /** Bookmark toggle callback */
  onToggleSave: () => void;
  /** Modal detail view selection callback */
  onSelect: () => void;
  /** Existing candidate relevance feedback if previously recorded */
  feedback?: RelevanceFeedback;
  /** Inline one-click relevance rating dispatcher */
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
  // Determine Fit Pill styles and icon based on deterministic descriptor
  let fitPillColor = 'bg-slate-100 text-slate-700 border-slate-200';
  let fitIcon = <Sparkles className="w-3 h-3 text-slate-500" />;

  if (match.fitDescriptor === 'Primary Role Fit') {
    fitPillColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    fitIcon = <Compass className="w-3 h-3 text-indigo-600" />;
  } else if (match.fitDescriptor === 'Adjacent Role Pivot') {
    fitPillColor = 'bg-violet-50 text-violet-700 border-violet-200';
    fitIcon = <Sparkles className="w-3 h-3 text-violet-600" />;
  } else if (match.fitDescriptor === 'Hobby & Creative Exploration') {
    fitPillColor = 'bg-purple-50 text-purple-800 border-purple-200';
    fitIcon = <Palette className="w-3 h-3 text-purple-600" />;
  } else if (match.fitDescriptor === 'Emerging Capability Match') {
    fitPillColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    fitIcon = <CheckCircle2 className="w-3 h-3 text-emerald-600" />;
  }

  const demonstratedCount = match.matchedWorkCapabilities.length + match.matchedProjectCapabilities.length;
  const missingCount = match.missingRequiredCapabilities.length;

  return (
    <article
      className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-md ${
        match.fitDescriptor === 'Hobby & Creative Exploration'
          ? 'border-purple-200/90 hover:border-purple-400'
          : match.fitDescriptor === 'Adjacent Role Pivot'
          ? 'border-violet-200/90 hover:border-violet-400'
          : 'border-slate-200/90 hover:border-indigo-300'
      }`}
      id={`opp-card-${opportunity.id}`}
    >
      <div className="p-5 sm:p-6">
        {/* Top Badges & Pathway Indicator */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-slate-200">
              <Building2 className="w-3 h-3 text-slate-400" />
              {opportunity.organisationLabel}
            </span>

            {/* Pathway Tag */}
            {match.isHobbyFit ? (
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 flex items-center gap-1">
                <Palette className="w-2.5 h-2.5 text-purple-600" />
                Hobby Pathway
              </span>
            ) : match.isAdjacentFit ? (
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
                Adjacent Pivot
              </span>
            ) : match.isPrimaryFit ? (
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                Primary Target
              </span>
            ) : (
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                Exploration
              </span>
            )}
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

        {/* Title */}
        <h3
          onClick={onSelect}
          className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer tracking-tight mb-1"
        >
          {opportunity.title}
        </h3>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
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
        <div className={`p-3.5 rounded-xl border mb-4 space-y-2 ${
          match.fitDescriptor === 'Hobby & Creative Exploration'
            ? 'bg-purple-50/50 border-purple-100'
            : match.fitDescriptor === 'Adjacent Role Pivot'
            ? 'bg-violet-50/50 border-violet-100'
            : 'bg-slate-50/90 border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${fitPillColor} flex items-center gap-1`}>
              {fitIcon}
              {match.fitDescriptor}
            </span>

            <div className="text-[11px] font-semibold text-slate-500">
              {demonstratedCount} verified • {missingCount} missing
            </div>
          </div>

          <p className="text-xs text-slate-700 font-medium leading-normal">
            {match.explanationSummary}
          </p>

          {/* Overlap tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {match.isHobbyFit && match.matchedHobbyName && (
              <span className="text-[11px] font-medium bg-purple-100/80 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Palette className="w-3 h-3 text-purple-600" />
                Hobby: {match.matchedHobbyName}
              </span>
            )}

            {match.isAdjacentFit && match.matchedAdjacentRoleName && (
              <span className="text-[11px] font-medium bg-violet-100/80 text-violet-900 border border-violet-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                🔄 Pivot via: {match.matchedAdjacentRoleName}
              </span>
            )}

            {match.matchedWorkCapabilities.slice(0, 1).map((item, idx) => {
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
