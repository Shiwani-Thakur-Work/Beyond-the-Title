import React, { useState, useMemo } from 'react';
import type { Opportunity, MatchAnalysis, SavedOpportunity, RelevanceFeedback, CandidateProfile, PathwayFilter } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import {
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  Compass,
  Palette,
  Briefcase,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

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
  onSelectPresetProfile: (profileId: string) => void;
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
  onSelectPresetProfile,
}) => {
  const [activePathway, setActivePathway] = useState<PathwayFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedSeniority, setSelectedSeniority] = useState('All');

  // Compute pathway counts based on active profile matches
  const pathwayCounts = useMemo(() => {
    let primaryCount = 0;
    let adjacentCount = 0;
    let hobbyCount = 0;
    let skillBridgeCount = 0;

    for (const opp of opportunities) {
      const match = matches[opp.id];
      if (!match) continue;
      if (match.isPrimaryFit) primaryCount++;
      if (match.isAdjacentFit) adjacentCount++;
      if (match.isHobbyFit) hobbyCount++;
      if (match.isSkillBridgeFit) skillBridgeCount++;
    }

    return {
      all: opportunities.length,
      primary: primaryCount,
      adjacent: adjacentCount,
      hobby: hobbyCount,
      'skill-bridge': skillBridgeCount,
    };
  }, [opportunities, matches]);

  // Available role families for filter
  const roleFamilies = useMemo(() => {
    const set = new Set(opportunities.map((o) => o.roleFamily));
    return ['All', ...Array.from(set)];
  }, [opportunities]);

  // Filtered opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const match = matches[opp.id];

      // 1. Pathway Filter
      if (activePathway === 'primary') {
        if (!match?.isPrimaryFit) return false;
      } else if (activePathway === 'adjacent') {
        if (!match?.isAdjacentFit) return false;
      } else if (activePathway === 'hobby') {
        if (!match?.isHobbyFit) return false;
      } else if (activePathway === 'skill-bridge') {
        if (!match?.isSkillBridgeFit) return false;
      }

      // 2. Text Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(query);
        const matchesOrg = opp.organisationLabel.toLowerCase().includes(query);
        const matchesSummary = opp.summary.toLowerCase().includes(query);
        const matchesSkill = opp.requiredSkillTags.some((s) => s.toLowerCase().includes(query));
        const matchesHobby = opp.hobbyInterests?.some((h) => h.toLowerCase().includes(query));
        if (!matchesTitle && !matchesOrg && !matchesSummary && !matchesSkill && !matchesHobby) {
          return false;
        }
      }

      // 3. Role Family
      if (selectedFamily !== 'All' && opp.roleFamily !== selectedFamily) {
        return false;
      }

      // 4. Work Mode
      if (selectedWorkMode !== 'All' && opp.workMode !== selectedWorkMode) {
        return false;
      }

      // 5. Seniority
      if (selectedSeniority !== 'All' && opp.seniorityLabel !== selectedSeniority) {
        return false;
      }

      return true;
    });
  }, [
    opportunities,
    matches,
    activePathway,
    searchQuery,
    selectedFamily,
    selectedWorkMode,
    selectedSeniority,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedFamily !== 'All' ||
    selectedWorkMode !== 'All' ||
    selectedSeniority !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFamily('All');
    setSelectedWorkMode('All');
    setSelectedSeniority('All');
  };

  // Find active preset if matches one of the sample profiles
  const activePreset = SAMPLE_PROFILES.find((p) => p.profile.name === profile.name);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Multidirectional Active Candidate Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 mb-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-slate-100">
          {/* Profile Identity & Multidirectional Tag Row */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-100 shrink-0">
                {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'BT'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {profile.name || 'Anonymous Candidate'}
                  </h2>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Active Match Profile
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {profile.titleHeadline || 'Multidirectional candidate discovering opportunities beyond a single title'}
                </p>
              </div>
            </div>

            {/* Multidirectional Components Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Primary Role */}
              <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 shadow-xs">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>Primary Target:</span>
                <strong className="font-bold">{profile.primaryRole || 'None'}</strong>
              </span>

              {/* Secondary / Adjacent Roles */}
              <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 flex items-center gap-1.5 shadow-xs">
                <Briefcase className="w-3.5 h-3.5 text-violet-600" />
                <span>Adjacent Pivots:</span>
                <strong className="font-bold">
                  {profile.adjacentRoles.length > 0 ? profile.adjacentRoles.join(' • ') : 'None'}
                </strong>
              </span>

              {/* Hobbies & Creative Passions */}
              <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5 shadow-xs">
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                <span>Hobbies & Creative:</span>
                <strong className="font-bold">
                  {profile.additionalInterests.length > 0 ? profile.additionalInterests.join(' • ') : 'None'}
                </strong>
              </span>
            </div>
          </div>

          {/* Quick Profile Switcher & Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="w-full sm:w-auto">
              <label htmlFor="quick-profile-switch" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Switch Candidate Profile:
              </label>
              <select
                id="quick-profile-switch"
                value={activePreset ? activePreset.id : 'custom'}
                onChange={(e) => {
                  if (e.target.value !== 'custom') {
                    onSelectPresetProfile(e.target.value);
                  }
                }}
                className="w-full sm:w-64 px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 shadow-xs text-slate-800"
              >
                {SAMPLE_PROFILES.map((sample) => (
                  <option key={sample.id} value={sample.id}>
                    {sample.shortName} ({sample.tagline.split('•')[0].trim()})
                  </option>
                ))}
                {!activePreset && <option value="custom">Custom Profile (Edited)</option>}
              </select>
            </div>

            <button
              onClick={onNavigateToProfile}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/80 px-3.5 py-2 rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5"
            >
              <span>Edit Custom Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Concept Explanation Strip */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Beyond the Title Principle:</strong> Opportunities below are dynamically evaluated across your <strong>primary career role</strong>, your <strong>secondary adjacent pivots</strong>, and your <strong>creative hobbies</strong>.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 shrink-0">
            Dynamically changes per profile
          </span>
        </div>
      </div>

      {/* Multidirectional Pathway Navigation Tabs */}
      <div className="space-y-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Curated Opportunities by Career Pathway
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Choose a discovery lens to inspect how your multidirectional profile unlocks distinct opportunity pathways.
          </p>
        </div>

        {/* Pathway Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* Tab 1: All */}
          <button
            type="button"
            id="pathway-tab-all"
            onClick={() => setActivePathway('all')}
            className={`p-3.5 rounded-2xl border text-left transition-all relative ${
              activePathway === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                All Listings
              </span>
              <span
                className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  activePathway === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'
                }`}
              >
                {pathwayCounts.all}
              </span>
            </div>
            <p className={`text-[11px] line-clamp-1 ${activePathway === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
              Complete curated catalog
            </p>
          </button>

          {/* Tab 2: Primary Direction */}
          <button
            type="button"
            id="pathway-tab-primary"
            onClick={() => setActivePathway('primary')}
            className={`p-3.5 rounded-2xl border text-left transition-all relative ${
              activePathway === 'primary'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Primary Role
              </span>
              <span
                className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  activePathway === 'primary' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-800'
                }`}
              >
                {pathwayCounts.primary}
              </span>
            </div>
            <p className={`text-[11px] line-clamp-1 ${activePathway === 'primary' ? 'text-indigo-100' : 'text-slate-500'}`}>
              {profile.primaryRole || 'Primary target'}
            </p>
          </button>

          {/* Tab 3: Secondary & Adjacent Roles */}
          <button
            type="button"
            id="pathway-tab-adjacent"
            onClick={() => setActivePathway('adjacent')}
            className={`p-3.5 rounded-2xl border text-left transition-all relative ${
              activePathway === 'adjacent'
                ? 'bg-violet-600 text-white border-violet-600 shadow-md ring-2 ring-violet-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:bg-violet-50/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Adjacent Pivots
              </span>
              <span
                className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  activePathway === 'adjacent' ? 'bg-violet-700 text-white' : 'bg-violet-50 text-violet-800'
                }`}
              >
                {pathwayCounts.adjacent}
              </span>
            </div>
            <p className={`text-[11px] line-clamp-1 ${activePathway === 'adjacent' ? 'text-violet-100' : 'text-slate-500'}`}>
              Transferable role fits
            </p>
          </button>

          {/* Tab 4: Hobby & Creative Passions */}
          <button
            type="button"
            id="pathway-tab-hobby"
            onClick={() => setActivePathway('hobby')}
            className={`p-3.5 rounded-2xl border text-left transition-all relative ${
              activePathway === 'hobby'
                ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                Hobby Pathways
              </span>
              <span
                className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  activePathway === 'hobby' ? 'bg-purple-700 text-white' : 'bg-purple-50 text-purple-800'
                }`}
              >
                {pathwayCounts.hobby}
              </span>
            </div>
            <p className={`text-[11px] line-clamp-1 ${activePathway === 'hobby' ? 'text-purple-100' : 'text-slate-500'}`}>
              Passions & creative synergies
            </p>
          </button>

          {/* Tab 5: Skill Bridge */}
          <button
            type="button"
            id="pathway-tab-skillbridge"
            onClick={() => setActivePathway('skill-bridge')}
            className={`p-3.5 rounded-2xl border text-left transition-all relative col-span-2 sm:col-span-1 ${
              activePathway === 'skill-bridge'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Skill Bridges
              </span>
              <span
                className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  activePathway === 'skill-bridge' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-800'
                }`}
              >
                {pathwayCounts['skill-bridge']}
              </span>
            </div>
            <p className={`text-[11px] line-clamp-1 ${activePathway === 'skill-bridge' ? 'text-emerald-100' : 'text-slate-500'}`}>
              Learning & projects
            </p>
          </button>
        </div>

        {/* Pathway Context Banner */}
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
          activePathway === 'hobby'
            ? 'bg-purple-50/80 border-purple-200 text-purple-950'
            : activePathway === 'adjacent'
            ? 'bg-violet-50/80 border-violet-200 text-violet-950'
            : activePathway === 'primary'
            ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
            : activePathway === 'skill-bridge'
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-slate-100/80 border-slate-200 text-slate-800'
        }`}>
          {activePathway === 'hobby' && <Palette className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />}
          {activePathway === 'adjacent' && <Briefcase className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />}
          {activePathway === 'primary' && <Compass className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />}
          {activePathway === 'skill-bridge' && <GraduationCap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
          {activePathway === 'all' && <Users className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />}

          <div>
            {activePathway === 'hobby' && (
              <>
                <strong className="font-bold">🎨 Creative & Hobby-Led Pathways:</strong> Showing opportunities tailored around your personal passions (<strong>{profile.additionalInterests.join(', ') || 'No creative hobbies selected'}</strong>). In Beyond the Title, creative interests open doors to creator-economy and specialized creative projects without claiming they are rigid corporate credentials.
              </>
            )}
            {activePathway === 'adjacent' && (
              <>
                <strong className="font-bold">🔄 Secondary & Adjacent Role Pivots:</strong> Showing opportunities matching your adjacent target roles (<strong>{profile.adjacentRoles.join(', ') || 'No adjacent roles selected'}</strong>). These jobs allow you to leverage transferable capabilities outside conventional single-title filters.
              </>
            )}
            {activePathway === 'primary' && (
              <>
                <strong className="font-bold">🎯 Primary Career Target:</strong> Showing opportunities directly targeting your primary objective as a <strong>{profile.primaryRole}</strong> with verified work or project evidence.
              </>
            )}
            {activePathway === 'skill-bridge' && (
              <>
                <strong className="font-bold">💡 Skill-Bridge & Learning Opportunities:</strong> Surfacing opportunities where your project evidence or active learning goals bridge into new functional domains.
              </>
            )}
            {activePathway === 'all' && (
              <>
                <strong className="font-bold">🌐 Complete Multidirectional Overview:</strong> Viewing all {opportunities.length} curated demonstration opportunities. Use the pathway buttons above or the filters below to refine your exploration.
              </>
            )}
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, skills (e.g. PRD, Voiceover, SQL)..."
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

            {/* Seniority Filter */}
            <div>
              <select
                id="filter-seniority"
                value={selectedSeniority}
                onChange={(e) => setSelectedSeniority(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
              >
                <option value="All">All Seniorities</option>
                <option value="Associate">Associate</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
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
                Clear Search & Filters
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
          <h2 className="text-base font-bold text-slate-900 mb-1">No Matching Opportunities Found</h2>
          <p className="text-xs text-slate-600 mb-4">
            No opportunities matched the selected pathway and filter criteria for profile &ldquo;{profile.name}&rdquo;. Try choosing &ldquo;All Listings&rdquo; or switching candidate profiles.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setActivePathway('all');
                resetFilters();
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters & View All
            </button>
          </div>
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
                isPrimaryFit: false,
                isAdjacentFit: false,
                isHobbyFit: false,
                isSkillBridgeFit: false,
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
