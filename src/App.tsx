import { useState, useMemo } from 'react';
import type { CandidateProfile, Opportunity, SavedOpportunity, RelevanceFeedback, MatchAnalysis } from './types';
import opportunitiesData from './data/opportunities.json';
import { storageService } from './services/storageService';
import { analyzeOpportunityMatch } from './services/matchingEngine';
import { Navbar } from './components/Navbar';
import { DiscoveryFeed } from './components/DiscoveryFeed';
import { ProfileBuilder } from './components/ProfileBuilder';
import { ProfilePreview } from './components/ProfilePreview';
import { SavedOpportunitiesView } from './components/SavedOpportunitiesView';
import { MethodologyView } from './components/MethodologyView';
import { RecruiterView } from './components/RecruiterView';
import { AdminOpportunitiesView } from './components/AdminOpportunitiesView';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { DataResetModal } from './components/DataResetModal';
import { Compass, ShieldCheck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'saved' | 'profile' | 'methodology' | 'recruiter' | 'admin'>('feed');
  const [profileViewMode, setProfileViewMode] = useState<'builder' | 'preview'>('builder');

  // Owner Authentication State
  const [isOwnerAuth, setIsOwnerAuth] = useState<boolean>(() => storageService.isOwnerAuthenticated());
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState(false);

  // Core Opportunities State (Effective merged catalogue: base static + owner live additions/edits)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() =>
    storageService.getEffectiveOpportunities(opportunitiesData as Opportunity[])
  );

  // Core Data State
  const [profile, setProfile] = useState<CandidateProfile>(() => storageService.getProfile());
  const [savedItems, setSavedItems] = useState<SavedOpportunity[]>(() => storageService.getSavedOpportunities());
  const [feedbackMap, setFeedbackMap] = useState<Record<string, RelevanceFeedback>>(() => storageService.getAllFeedback());
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleRefreshOpportunities = () => {
    setOpportunities(storageService.getEffectiveOpportunities(opportunitiesData as Opportunity[]));
  };

  const handleExitOwnerMode = () => {
    storageService.logoutOwner();
    setIsOwnerAuth(false);
    setActiveTab('feed');
  };

  // Deterministic matching computed across all opportunities whenever profile changes
  const matchesMap = useMemo(() => {
    const map: Record<string, MatchAnalysis> = {};
    for (const opp of opportunities) {
      map[opp.id] = analyzeOpportunityMatch(profile, opp);
    }
    return map;
  }, [profile, opportunities]);

  // Handle Profile Update
  const handleUpdateProfile = (updated: CandidateProfile) => {
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const handleSelectPresetProfile = (profileId: string) => {
    const updated = storageService.loadProfileById(profileId);
    setProfile(updated);
  };

  const handleResetToBlank = () => {
    const blank = storageService.resetProfileToBlank();
    setProfile(blank);
  };

  // Toggle Save Opportunity
  const handleToggleSave = (oppId: string) => {
    storageService.toggleSaveOpportunity(oppId);
    setSavedItems(storageService.getSavedOpportunities());
  };

  // Save Feedback
  const handleSaveFeedback = (feedback: RelevanceFeedback) => {
    storageService.saveFeedback(feedback);
    setFeedbackMap(storageService.getAllFeedback());
  };

  const handleQuickFeedback = (oppId: string, rating: 'relevant' | 'not-relevant' | 'unsure') => {
    const current = feedbackMap[oppId];
    const newFeedback: RelevanceFeedback = {
      opportunityId: oppId,
      rating,
      reasonTag: current?.reasonTag,
      notes: current?.notes,
      createdAt: new Date().toISOString(),
    };
    handleSaveFeedback(newFeedback);
  };

  // Reset all demo data
  const handleConfirmResetAll = () => {
    storageService.clearAllData();
    const freshProfile = storageService.getProfile();
    setProfile(freshProfile);
    setSavedItems([]);
    setFeedbackMap({});
  };

  const handleDataImported = () => {
    setProfile(storageService.getProfile());
    setSavedItems(storageService.getSavedOpportunities());
    setFeedbackMap(storageService.getAllFeedback());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedItems.length}
        onResetData={() => setIsResetModalOpen(true)}
        isOwnerAuth={isOwnerAuth}
        onOpenOwnerAuth={() => {
          if (isOwnerAuth) {
            setActiveTab('admin');
          } else {
            setIsOwnerAuthModalOpen(true);
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'feed' && (
          <DiscoveryFeed
            opportunities={opportunities}
            matches={matchesMap}
            profile={profile}
            savedItems={savedItems}
            onToggleSave={handleToggleSave}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            feedbackMap={feedbackMap}
            onQuickFeedback={handleQuickFeedback}
            onNavigateToProfile={() => {
              setActiveTab('profile');
              setProfileViewMode('builder');
            }}
            onSelectPresetProfile={handleSelectPresetProfile}
          />
        )}

        {activeTab === 'saved' && (
          <SavedOpportunitiesView
            opportunities={opportunities}
            matches={matchesMap}
            savedItems={savedItems}
            onToggleSave={handleToggleSave}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            feedbackMap={feedbackMap}
            onExploreFeed={() => setActiveTab('feed')}
          />
        )}

        {activeTab === 'profile' && (
          <div>
            {/* Sub-navigation between builder and preview */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
              <div className="flex items-center justify-center p-1 bg-slate-200/80 rounded-xl max-w-xs mx-auto">
                <button
                  type="button"
                  id="tab-profile-builder"
                  onClick={() => setProfileViewMode('builder')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    profileViewMode === 'builder'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Profile Editor
                </button>
                <button
                  type="button"
                  id="tab-profile-preview"
                  onClick={() => setProfileViewMode('preview')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    profileViewMode === 'preview'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Structured Preview
                </button>
              </div>
            </div>

            {profileViewMode === 'builder' ? (
              <ProfileBuilder
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onViewPreview={() => setProfileViewMode('preview')}
                onResetToBlank={handleResetToBlank}
                onExploreFeed={() => setActiveTab('feed')}
              />
            ) : (
              <ProfilePreview
                profile={profile}
                onEditProfile={() => setProfileViewMode('builder')}
                onExploreOpportunities={() => setActiveTab('feed')}
              />
            )}
          </div>
        )}

        {activeTab === 'recruiter' && (
          <RecruiterView
            profile={profile}
            onBackToCandidate={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'methodology' && <MethodologyView />}

        {activeTab === 'admin' && (
          isOwnerAuth ? (
            <AdminOpportunitiesView
              opportunities={opportunities}
              onRefreshOpportunities={handleRefreshOpportunities}
              onExitOwnerMode={handleExitOwnerMode}
            />
          ) : (
            <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Owner Access Required</h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Live opportunity publishing and editing is restricted exclusively to the platform owner.
              </p>
              <button
                onClick={() => setIsOwnerAuthModalOpen(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Authenticate with Owner Passcode
              </button>
            </div>
          )
        )}
      </main>

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          match={matchesMap[selectedOpportunity.id]}
          isSaved={savedItems.some((s) => s.opportunityId === selectedOpportunity.id)}
          onToggleSave={() => handleToggleSave(selectedOpportunity.id)}
          feedback={feedbackMap[selectedOpportunity.id]}
          onSaveFeedback={handleSaveFeedback}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}

      {/* Owner Authentication Modal */}
      <OwnerAuthModal
        isOpen={isOwnerAuthModalOpen}
        onSuccess={() => {
          setIsOwnerAuth(true);
          setIsOwnerAuthModalOpen(false);
          setActiveTab('admin');
        }}
        onClose={() => setIsOwnerAuthModalOpen(false)}
      />

      {/* Data Management Modal */}
      <DataResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmResetAll}
        onDataImported={handleDataImported}
      />

      {/* Accessible Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800">Beyond the Title</span>
            <span>• Multidirectional Opportunity Discovery • Personal Project</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Client-Side • Stored Locally
            </span>
            <span>•</span>
            <span>Zero Tracking</span>
            <span>•</span>
            <span>Private by Default</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
