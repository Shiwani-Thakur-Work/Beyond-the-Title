/**
 * @file ProfileBuilder.tsx
 * @description Interactive multidirectional profile authoring interface.
 * 
 * Capabilities:
 * - Multidirectional Career Direction: Allows candidates to declare an anchor primary
 *   role target alongside up to three transferable adjacent roles.
 * - Tri-Tier Capability Evidence: Classifies skills by verified evidence level:
 *   1. 'work' (professional battle-tested experience)
 *   2. 'project' (side projects, open-source, or portfolio builds)
 *   3. 'learning' (active study and upskilling goals)
 * - Creative Interests & Hobbies: Structured domain affinity tagging that informs
 *   cultural alignment and creative pathway exploration without masquerading as hard qualifications.
 * - Local Sovereign Storage: Real-time synchronization to browser localStorage.
 */

import React, { useState, useEffect } from 'react';
import type { CandidateProfile, CapabilityEntry, EvidenceType, SeniorityLevel } from '../types';
import { ROLE_TAXONOMY, CREATIVE_INTEREST_SUGGESTIONS } from '../data/taxonomy';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import { Plus, X, Sparkles, Briefcase, FolderGit2, GraduationCap, Heart, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

/**
 * Properties for ProfileBuilder component.
 */
interface ProfileBuilderProps {
  /** Active candidate profile being edited */
  profile: CandidateProfile;
  /** State update dispatcher called whenever profile attributes change */
  onUpdateProfile: (updated: CandidateProfile) => void;
  /** Navigation callback to the Recruiter Perspective Preview */
  onViewPreview: () => void;
  /** Profile reset handler to restore an empty template */
  onResetToBlank: () => void;
  /** Optional navigation callback to transition directly to Discovery Feed */
  onExploreFeed?: () => void;
}

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({
  profile,
  onUpdateProfile,
  onViewPreview,
  onResetToBlank,
  onExploreFeed,
}) => {
  const [name, setName] = useState(profile.name || '');
  const [headline, setHeadline] = useState(profile.titleHeadline || '');
  const [primaryRole, setPrimaryRole] = useState(profile.primaryRole || '');
  const [adjacentRoles, setAdjacentRoles] = useState<string[]>(profile.adjacentRoles || []);
  const [capabilities, setCapabilities] = useState<CapabilityEntry[]>(profile.capabilities || []);
  const [additionalInterests, setAdditionalInterests] = useState<string[]>(profile.additionalInterests || []);
  const [workMode, setWorkMode] = useState<CandidateProfile['workModePreference']>(profile.workModePreference || 'Any');
  const [seniority, setSeniority] = useState<SeniorityLevel>(profile.seniorityLevel || 'Mid-Level');

  // Sync state whenever profile prop updates (e.g. from preset selection or import)
  useEffect(() => {
    setName(profile.name || '');
    setHeadline(profile.titleHeadline || '');
    setPrimaryRole(profile.primaryRole || '');
    setAdjacentRoles(profile.adjacentRoles || []);
    setCapabilities(profile.capabilities || []);
    setAdditionalInterests(profile.additionalInterests || []);
    setWorkMode(profile.workModePreference || 'Any');
    setSeniority(profile.seniorityLevel || 'Mid-Level');
  }, [profile]);

  // Capability form inputs
  const [newCapLabel, setNewCapLabel] = useState('');
  const [newCapEvidence, setNewCapEvidence] = useState<EvidenceType>('work');
  const [newCapContext, setNewCapContext] = useState('');

  // Custom role or interest input
  const [customAdjacent, setCustomAdjacent] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state when props change
  const currentTaxonomyMatch = ROLE_TAXONOMY.find((t) => t.role === primaryRole);

  const handleSave = () => {
    const updated: CandidateProfile = {
      ...profile,
      name,
      titleHeadline: headline,
      primaryRole,
      adjacentRoles,
      capabilities,
      additionalInterests,
      workModePreference: workMode,
      seniorityLevel: seniority,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProfile(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleAddAdjacent = (roleToAdd: string) => {
    if (!roleToAdd.trim() || adjacentRoles.includes(roleToAdd.trim())) return;
    if (adjacentRoles.length >= 3) {
      alert('You can select up to 3 adjacent roles in this MVP.');
      return;
    }
    const updated = [...adjacentRoles, roleToAdd.trim()];
    setAdjacentRoles(updated);
    onUpdateProfile({ ...profile, adjacentRoles: updated });
  };

  const handleRemoveAdjacent = (roleToRemove: string) => {
    const updated = adjacentRoles.filter((r) => r !== roleToRemove);
    setAdjacentRoles(updated);
    onUpdateProfile({ ...profile, adjacentRoles: updated });
  };

  const handleAddCapability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCapLabel.trim()) return;

    const newCap: CapabilityEntry = {
      id: `cap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      label: newCapLabel.trim(),
      evidenceType: newCapEvidence,
      optionalContext: newCapContext.trim() || undefined,
    };

    const updated = [...capabilities, newCap];
    setCapabilities(updated);
    onUpdateProfile({ ...profile, capabilities: updated });

    setNewCapLabel('');
    setNewCapContext('');
  };

  const handleRemoveCapability = (id: string) => {
    const updated = capabilities.filter((c) => c.id !== id);
    setCapabilities(updated);
    onUpdateProfile({ ...profile, capabilities: updated });
  };

  const handleAddInterest = (interest: string) => {
    if (!interest.trim() || additionalInterests.includes(interest.trim())) return;
    const updated = [...additionalInterests, interest.trim()];
    setAdditionalInterests(updated);
    onUpdateProfile({ ...profile, additionalInterests: updated });
  };

  const handleRemoveInterest = (interest: string) => {
    const updated = additionalInterests.filter((i) => i !== interest);
    setAdditionalInterests(updated);
    onUpdateProfile({ ...profile, additionalInterests: updated });
  };

  const loadPreset = (presetIndex: number) => {
    const p = SAMPLE_PROFILES[presetIndex].profile;
    setName(p.name);
    setHeadline(p.titleHeadline || '');
    setPrimaryRole(p.primaryRole);
    setAdjacentRoles(p.adjacentRoles);
    setCapabilities(p.capabilities);
    setAdditionalInterests(p.additionalInterests);
    setWorkMode(p.workModePreference);
    setSeniority(p.seniorityLevel);
    onUpdateProfile(p);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner & Quick Presets */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-900">Multidirectional Profile Builder</h1>
            </div>
            <p className="text-sm text-slate-600">
              Beyond the Title helps you represent your primary role, adjacent capabilities, and creative interests with honest evidence labels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Presets:</span>
            {SAMPLE_PROFILES.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => loadPreset(idx)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border shadow-xs transition-colors ${
                  profile.name === sample.profile.name
                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                    : 'bg-white hover:bg-slate-50 text-indigo-700 border-indigo-200'
                }`}
              >
                {sample.shortName}
              </button>
            ))}
            <button
              onClick={onResetToBlank}
              className="text-xs font-medium bg-white hover:bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg border border-rose-200 shadow-xs transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Blank Profile
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="space-y-8">
        {/* Section 1: Basic Info & Primary Role */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">1</span>
            Primary Direction & Target Role
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="cand-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                id="cand-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  onUpdateProfile({ ...profile, name: e.target.value });
                }}
                placeholder="e.g. Maya Chen"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="cand-seniority" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Seniority
              </label>
              <select
                id="cand-seniority"
                value={seniority}
                onChange={(e) => {
                  const val = e.target.value as SeniorityLevel;
                  setSeniority(val);
                  onUpdateProfile({ ...profile, seniorityLevel: val });
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 transition-colors"
              >
                <option value="Associate">Associate (0-2 years)</option>
                <option value="Mid-Level">Mid-Level (2-5 years)</option>
                <option value="Senior">Senior (5-8 years)</option>
                <option value="Lead">Lead / Principal (8+ years)</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="cand-headline" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Short Professional Headline
            </label>
            <input
              id="cand-headline"
              type="text"
              value={headline}
              onChange={(e) => {
                setHeadline(e.target.value);
                onUpdateProfile({ ...profile, titleHeadline: e.target.value });
              }}
              placeholder="e.g. Associate PM transitioning into Product Operations & Systems"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="primary-role-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Primary Role Target <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              The central role you are currently targeting. Opportunities matching this will be marked with Primary Role Fit.
            </p>

            <select
              id="primary-role-select"
              value={ROLE_TAXONOMY.some((r) => r.role === primaryRole) ? primaryRole : (primaryRole ? 'custom' : '')}
              onChange={(e) => {
                if (e.target.value !== 'custom') {
                  setPrimaryRole(e.target.value);
                  onUpdateProfile({ ...profile, primaryRole: e.target.value });
                }
              }}
              className="w-full px-3 py-2.5 text-sm bg-white border border-indigo-200 rounded-lg font-medium text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 mb-2"
            >
              <option value="">-- Select a primary role from common taxonomy --</option>
              {ROLE_TAXONOMY.map((item) => (
                <option key={item.role} value={item.role}>
                  {item.role} ({item.family})
                </option>
              ))}
              <option value="custom">-- Or type a custom target role below --</option>
            </select>

            <input
              id="cand-custom-primary-role"
              type="text"
              value={primaryRole}
              onChange={(e) => {
                setPrimaryRole(e.target.value);
                onUpdateProfile({ ...profile, primaryRole: e.target.value });
              }}
              placeholder="Or type any custom target role (e.g. Solutions Architect, UX Researcher, Technical Writer)..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500"
            />
          </div>
        </section>

        {/* Section 2: Adjacent Roles */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">2</span>
              Adjacent Professional Roles (Up to 3)
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {adjacentRoles.length}/3 selected
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4">
            Select adjacent roles where your transferable capabilities and system knowledge could fit. The matcher will look for opportunities matching these roles.
          </p>

          {/* Current Adjacent Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {adjacentRoles.length === 0 ? (
              <span className="text-xs italic text-slate-400">No adjacent roles selected yet. Pick from suggestions below.</span>
            ) : (
              adjacentRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveAdjacent(role)}
                    className="hover:text-rose-600 focus:outline-hidden"
                    title={`Remove ${role}`}
                    aria-label={`Remove ${role}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Suggestions from taxonomy */}
          {currentTaxonomyMatch && currentTaxonomyMatch.commonAdjacent.length > 0 && (
            <div className="mb-4">
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                Common adjacencies for {primaryRole}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentTaxonomyMatch.commonAdjacent.map((adj) => {
                  const isSelected = adjacentRoles.includes(adj);
                  return (
                    <button
                      key={adj}
                      type="button"
                      disabled={isSelected || adjacentRoles.length >= 3}
                      onClick={() => handleAddAdjacent(adj)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                        isSelected
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:text-indigo-600'
                      }`}
                    >
                      + {adj}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Adjacent Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customAdjacent}
              onChange={(e) => setCustomAdjacent(e.target.value)}
              placeholder="Or type a custom adjacent role..."
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500"
            />
            <button
              type="button"
              disabled={!customAdjacent.trim() || adjacentRoles.length >= 3}
              onClick={() => {
                handleAddAdjacent(customAdjacent);
                setCustomAdjacent('');
              }}
              className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-900 disabled:opacity-40"
            >
              Add Role
            </button>
          </div>
        </section>

        {/* Section 3: Capabilities & Evidence Labeling */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">3</span>
              Capabilities with Evidence Classification
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {capabilities.length} capabilities
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4">
            A key principle of Beyond the Title: explicitly distinguish verified professional work from project evidence and learning goals so recommendations are honest and transparent.
          </p>

          {/* Current Capability List */}
          <div className="space-y-2 mb-6">
            {capabilities.length === 0 ? (
              <p className="text-xs italic text-slate-400 py-3">No capabilities added yet. Add one below.</p>
            ) : (
              capabilities.map((cap) => {
                let badgeClass = 'badge-evidence-work';
                let icon = <Briefcase className="w-3.5 h-3.5" />;
                let typeLabel = 'Professional Work';

                if (cap.evidenceType === 'project') {
                  badgeClass = 'badge-evidence-project';
                  icon = <FolderGit2 className="w-3.5 h-3.5" />;
                  typeLabel = 'Project Evidence';
                } else if (cap.evidenceType === 'learning') {
                  badgeClass = 'badge-evidence-learning';
                  icon = <GraduationCap className="w-3.5 h-3.5" />;
                  typeLabel = 'Learning Goal';
                } else if (cap.evidenceType === 'interest') {
                  badgeClass = 'badge-evidence-interest';
                  icon = <Heart className="w-3.5 h-3.5" />;
                  typeLabel = 'Interest';
                }

                return (
                  <div
                    key={cap.id}
                    className="flex items-start justify-between gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:bg-white transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900">{cap.label}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${badgeClass}`}>
                          {icon}
                          {typeLabel}
                        </span>
                      </div>
                      {cap.optionalContext && (
                        <p className="text-xs text-slate-500 italic">“{cap.optionalContext}”</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCapability(cap.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove capability"
                      aria-label={`Remove capability ${cap.label}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick suggestions based on selected primary role */}
          {currentTaxonomyMatch && (
            <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                Suggested capabilities for {primaryRole}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentTaxonomyMatch.suggestedCapabilities.map((sug) => {
                  const alreadyHas = capabilities.some((c) => c.label.toLowerCase() === sug.toLowerCase());
                  if (alreadyHas) return null;
                  return (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => {
                        setNewCapLabel(sug);
                      }}
                      className="text-xs px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-md border border-slate-200 transition-colors"
                    >
                      + {sug}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Capability Form */}
          <form onSubmit={handleAddCapability} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
              Add New Capability
            </span>

            <div>
              <label htmlFor="cap-name-input" className="block text-xs font-medium text-slate-600 mb-1">
                Capability Name
              </label>
              <input
                id="cap-name-input"
                type="text"
                value={newCapLabel}
                onChange={(e) => setNewCapLabel(e.target.value)}
                placeholder="e.g. Requirements Documentation (PRD), SQL, Stakeholder Management"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-indigo-500"
              />
            </div>

            {/* Evidence Type Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Evidence Classification <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setNewCapEvidence('work')}
                  className={`p-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                    newCapEvidence === 'work'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                  Work Experience
                </button>

                <button
                  type="button"
                  onClick={() => setNewCapEvidence('project')}
                  className={`p-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                    newCapEvidence === 'project'
                      ? 'bg-blue-50 text-blue-800 border-blue-400 font-semibold shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
                  Project Evidence
                </button>

                <button
                  type="button"
                  onClick={() => setNewCapEvidence('learning')}
                  className={`p-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                    newCapEvidence === 'learning'
                      ? 'bg-amber-50 text-amber-800 border-amber-400 font-semibold shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                  Currently Learning
                </button>

                <button
                  type="button"
                  onClick={() => setNewCapEvidence('interest')}
                  className={`p-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                    newCapEvidence === 'interest'
                      ? 'bg-purple-50 text-purple-800 border-purple-400 font-semibold shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-purple-600" />
                  Personal Interest
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="cap-context-input" className="block text-xs font-medium text-slate-600 mb-1">
                Optional Context / Evidence Note
              </label>
              <input
                id="cap-context-input"
                type="text"
                value={newCapContext}
                onChange={(e) => setNewCapContext(e.target.value)}
                placeholder="e.g. Authored PRD for mobile checkout flow; or completing PostgreSQL certification"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-indigo-500"
              />
            </div>

            <div className="text-right pt-1">
              <button
                type="submit"
                disabled={!newCapLabel.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 disabled:opacity-40 transition-colors inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Capability
              </button>
            </div>
          </form>
        </section>

        {/* Section 4: Creative & Personal Interests (Visually Separate!) */}
        <section className="bg-white rounded-2xl border border-purple-200/70 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-purple-100">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">4</span>
              Additional Creative & Personal Interests
            </h2>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-200">
              Non-Qualifying
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4">
            Passions outside your primary job (e.g. voiceover, illustration, creative writing). These help surface creative software or creator-economy roles, but do not imply professional qualification without evidence.
          </p>

          {/* Current Interests */}
          <div className="flex flex-wrap gap-2 mb-4">
            {additionalInterests.length === 0 ? (
              <span className="text-xs italic text-slate-400">No creative interests added yet.</span>
            ) : (
              additionalInterests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200"
                >
                  <Heart className="w-3 h-3 text-purple-500" />
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="hover:text-rose-600 focus:outline-hidden"
                    title={`Remove ${interest}`}
                    aria-label={`Remove ${interest}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Suggestions */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-500 block mb-2">Suggestions:</span>
            <div className="flex flex-wrap gap-1.5">
              {CREATIVE_INTEREST_SUGGESTIONS.map((sug) => {
                const isSelected = additionalInterests.includes(sug);
                return (
                  <button
                    key={sug}
                    type="button"
                    disabled={isSelected}
                    onClick={() => handleAddInterest(sug)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                      isSelected
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:text-purple-700'
                    }`}
                  >
                    + {sug}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Interest Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="Or add custom interest (e.g. Synth Music, 3D Modeling)..."
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-purple-500"
            />
            <button
              type="button"
              disabled={!customInterest.trim()}
              onClick={() => {
                handleAddInterest(customInterest);
                setCustomInterest('');
              }}
              className="px-3 py-1.5 bg-purple-700 text-white rounded-lg text-xs font-medium hover:bg-purple-800 disabled:opacity-40"
            >
              Add Interest
            </button>
          </div>
        </section>

        {/* Section 5: Work Mode Preference */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">5</span>
            Work Mode Preference
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Any', 'Remote', 'Hybrid', 'In-Person'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setWorkMode(mode);
                  onUpdateProfile({ ...profile, workModePreference: mode });
                }}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                  workMode === mode
                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {mode === 'Any' ? 'Any Arrangement' : mode}
              </button>
            ))}
          </div>
        </section>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {savedNotice ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                Profile saved to browser storage!
              </span>
            ) : (
              <span>Changes are automatically saved to your browser demo storage.</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
            >
              Save Profile
            </button>
            {onExploreFeed && (
              <button
                type="button"
                onClick={() => {
                  handleSave();
                  onExploreFeed();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Save & Explore Feed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onViewPreview}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs sm:text-sm font-semibold rounded-xl hover:bg-indigo-100 transition-colors"
            >
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
