import React, { useState, useMemo } from 'react';
import type { Opportunity, MatchAnalysis, SavedOpportunity, RelevanceFeedback, CandidateProfile } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { Search, Filter, RotateCcw, Sparkles } from 'lucide-react';

interface DiscoveryFeedProps {
  opportunities: Opportunity[];
  matches: Record<string, MatchAnalysis>;
  profile: CandidateProfile;
  savedItems: SavedOpportunity[];
  onToggleSave: (oppId: string) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  feedbackMap: Record<string, RelevanceFeedback>;
  onQuickFeedback: (oppId: string, rating: 'relevant' | 'not-relevant' | 'unsure') => void;
  onNavigateToProfile: () => void;
}

export const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({
  opportunities,
  matches,
  profile,
  savedItems,
  onToggleSave,
  onSelectOpportunity,
  feedbackMap,
  onQuickFeedback,
  onNavigateToProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [selectedFit, setSelectedFit] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedSeniority, setSelectedSeniority] = useState('All');

  // Available filter options
  const roleFamilies = useMemo(() => {
    const set = new Set(opportunities.map((o) => o.roleFamily));
    return ['All', ...Array.from(set)];
  }, [opportunities]);

  // Filtered opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const match = matches[opp.id];

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(query);
        const matchesOrg = opp.organisationLabel.toLowerCase().includes(query);
        const matchesSummary = opp.summary.toLowerCase().includes(query);
        const matchesSkill = opp.requiredSkillTags.some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesOrg && !matchesSummary && !matchesSkill) {
          return false;
        }
      }

      // Role Family
      if (selectedFamily !== 'All' && opp.roleFamily !== selectedFamily) {
        return false;
      }

      // Fit Alignment
      if (selectedFit !== 'All') {
        if (!match || match.fitDescriptor !== selectedFit) {
          return false;
        }
      }

      // Work Mode
      if (selectedWorkMode !== 'All' && opp.workMode !== selectedWorkMode) {
        return false;
      }

      // Seniority
      if (selectedSeniority !== 'All' && opp.seniorityLabel !== selectedSeniority) {
        return false;
      }

      return true;
    });
  }, [opportunities, matches, searchQuery, selectedFamily, selectedFit, selectedWorkMode, selectedSeniority]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedFamily !== 'All' ||
    selectedFit !== 'All' ||
    selectedWorkMode !== 'All' ||
    selectedSeniority !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFamily('All');
    setSelectedFit('All');
    setSelectedWorkMode('All');
    setSelectedSeniority('All');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Profile Summary Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Match Profile:</span>
              <span className="text-sm font-bold text-slate-900">{profile.name || 'Anonymous Candidate'}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                Primary: {profile.primaryRole || 'None'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjacent directions: {profile.adjacentRoles.length > 0 ? profile.adjacentRoles.join(', ') : 'None selected'} • {profile.capabilities.length} capabilities
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToProfile}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 hover:bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-100 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          Adjust Profile Directions
        </button>
      </div>

      {/* Discovery Feed Header & Filter Toolbar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Curated Opportunities Feed
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Explore curated industry opportunities matched against your primary direction and adjacent capabilities.
            </p>
          </div>

          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start md:self-auto border border-slate-200">
            Showing <strong className="text-slate-900">{filteredOpportunities.length}</strong> of {opportunities.length} opportunities
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, skills (e.g. PRD, SQL, Jira)..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
              />
            </div>

            {/* Role Family Filter */}
            <div>
              <select
                id="filter-family"
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
              >
                <option value="All">All Role Families</option>
                {roleFamilies.filter((f) => f !== 'All').map((fam) => (
                  <option key={fam} value={fam}>
                    {fam}
                  </option>
                ))}
              </select>
            </div>

            {/* Fit Descriptor Filter */}
            <div>
              <select
                id="filter-fit"
                value={selectedFit}
                onChange={(e) => setSelectedFit(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
              >
                <option value="All">All Fit Alignments</option>
                <option value="Primary Role Fit">Primary Role Fit</option>
                <option value="Adjacent Role Pivot">Adjacent Role Pivot</option>
                <option value="Emerging Capability Match">Emerging Capability Match</option>
                <option value="Distinct Exploration">Distinct Exploration</option>
              </select>
            </div>

            {/* Work Mode Filter */}
            <div>
              <select
                id="filter-workmode"
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
              >
                <option value="All">All Work Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Filtered view active</span>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Opportunity Cards */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">No Matching Demonstration Opportunities</h2>
          <p className="text-xs text-slate-600 mb-4">
            Try adjusting your search criteria or resetting filters to browse all 10 sample roles.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              match={matches[opp.id] || {
                roleMatch: 'unrelated',
                matchedRoleName: '',
                matchedWorkCapabilities: [],
                matchedProjectCapabilities: [],
                learningCapabilities: [],
                missingRequiredCapabilities: [],
                missingPreferredCapabilities: [],
                interestOverlaps: [],
                fitDescriptor: 'Distinct Exploration',
                explanationSummary: 'Surfaced as general exploration opportunity.',
                detailedCaveats: [],
              }}
              isSaved={savedItems.some((s) => s.opportunityId === opp.id)}
              onToggleSave={() => onToggleSave(opp.id)}
              onSelect={() => onSelectOpportunity(opp)}
              feedback={feedbackMap[opp.id]}
              onQuickFeedback={(rating) => onQuickFeedback(opp.id, rating)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
