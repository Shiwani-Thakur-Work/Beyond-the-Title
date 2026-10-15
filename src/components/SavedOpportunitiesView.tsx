import React from 'react';
import type { Opportunity, MatchAnalysis, SavedOpportunity, RelevanceFeedback } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { Bookmark, Compass, ArrowRight } from 'lucide-react';

interface SavedOpportunitiesViewProps {
  opportunities: Opportunity[];
  matches: Record<string, MatchAnalysis>;
  savedItems: SavedOpportunity[];
  onToggleSave: (oppId: string) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  feedbackMap: Record<string, RelevanceFeedback>;
  onExploreFeed: () => void;
}

export const SavedOpportunitiesView: React.FC<SavedOpportunitiesViewProps> = ({
  opportunities,
  matches,
  savedItems,
  onToggleSave,
  onSelectOpportunity,
  feedbackMap,
  onExploreFeed,
}) => {
  const savedOpportunities = opportunities.filter((opp) =>
    savedItems.some((s) => s.opportunityId === opp.id)
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Saved Opportunities ({savedOpportunities.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Keep track of multidirectional roles and inspect your transferable skills alignment before diving deeper.
          </p>
        </div>

        {savedOpportunities.length > 0 && (
          <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Stored locally in browser • No applications sent
          </div>
        )}
      </div>

      {/* Content */}
      {savedOpportunities.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-xl mx-auto">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-7 h-7 text-indigo-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">No Saved Opportunities Yet</h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
            As you explore recommendations in the feed, click the bookmark icon on any role to pin it here for review.
          </p>
          <button
            onClick={onExploreFeed}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm inline-flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Discovery Feed</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              match={matches[opp.id]}
              isSaved={true}
              onToggleSave={() => onToggleSave(opp.id)}
              onSelect={() => onSelectOpportunity(opp)}
              feedback={feedbackMap[opp.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
};
