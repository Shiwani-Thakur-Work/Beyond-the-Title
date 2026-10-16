/**
 * @file AdminOpportunitiesView.tsx
 * @description Owner administrative dashboard for managing live and benchmark opportunities.
 * 
 * Security & Access Control:
 * - Only accessible when an authenticated OwnerSession is present.
 * - Allows the platform owner (Shiwani) to add, edit, or delete real live job opportunities.
 * - Generates clean JSON payloads to commit to the repository so live opportunities
 *   become permanently available to all public visitors.
 */

import React, { useState } from 'react';
import type { Opportunity, SeniorityLevel, WorkMode } from '../types';
import { storageService } from '../services/storageService';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Download,
  Lock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Building2,
  Key,
  X,
  Search,
} from 'lucide-react';

interface AdminOpportunitiesViewProps {
  opportunities: Opportunity[];
  onRefreshOpportunities: () => void;
  onExitOwnerMode: () => void;
}

export const AdminOpportunitiesView: React.FC<AdminOpportunitiesViewProps> = ({
  opportunities,
  onRefreshOpportunities,
  onExitOwnerMode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [roleFamily, setRoleFamily] = useState('Product Management');
  const [seniority, setSeniority] = useState<SeniorityLevel>('Mid-Level');
  const [workMode, setWorkMode] = useState<WorkMode>('Remote');
  const [location, setLocation] = useState('Remote (Worldwide)');
  const [summary, setSummary] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [pathwayCategory, setPathwayCategory] = useState<'primary' | 'adjacent' | 'hobby'>('primary');
  
  // Tag inputs (comma separated)
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requiredRoleTagsText, setRequiredRoleTagsText] = useState('');
  const [adjacentRoleTagsText, setAdjacentRoleTagsText] = useState('');
  const [requiredSkillTagsText, setRequiredSkillTagsText] = useState('');
  const [preferredSkillTagsText, setPreferredSkillTagsText] = useState('');
  const [mustHavesText, setMustHavesText] = useState('');
  const [hobbyInterestsText, setHobbyInterestsText] = useState('');

  // Passcode change modal
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');

  const resetForm = () => {
    setTitle('');
    setCompany('');
    setRoleFamily('Product Management');
    setSeniority('Mid-Level');
    setWorkMode('Remote');
    setLocation('Remote (Worldwide)');
    setSummary('');
    setApplyUrl('');
    setIsLive(true);
    setPathwayCategory('primary');
    setResponsibilitiesText('');
    setRequiredRoleTagsText('');
    setAdjacentRoleTagsText('');
    setRequiredSkillTagsText('');
    setPreferredSkillTagsText('');
    setMustHavesText('');
    setHobbyInterestsText('');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleStartCreate = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleStartEdit = (opp: Opportunity) => {
    setEditingId(opp.id);
    setTitle(opp.title);
    setCompany(opp.organisationLabel);
    setRoleFamily(opp.roleFamily);
    setSeniority(opp.seniorityLabel);
    setWorkMode(opp.workMode);
    setLocation(opp.location);
    setSummary(opp.summary);
    setApplyUrl(opp.applyUrl || '');
    setIsLive(Boolean(opp.isLive || !opp.demoOnly));
    setPathwayCategory((opp.pathwayCategory as 'primary' | 'adjacent' | 'hobby') || 'primary');
    setResponsibilitiesText(opp.responsibilities.join('\n'));
    setRequiredRoleTagsText(opp.requiredRoleTags.join(', '));
    setAdjacentRoleTagsText(opp.adjacentRoleTags.join(', '));
    setRequiredSkillTagsText(opp.requiredSkillTags.join(', '));
    setPreferredSkillTagsText(opp.preferredSkillTags.join(', '));
    setMustHavesText(opp.mustHaves.join('\n'));
    setHobbyInterestsText(opp.hobbyInterests ? opp.hobbyInterests.join(', ') : '');
    setIsEditing(true);
  };

  const parseCommaTags = (str: string) =>
    str
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const parseLineTags = (str: string) =>
    str
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSaveOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) {
      setStatusMessage({ text: 'Title and Company are mandatory.', type: 'error' });
      return;
    }

    const oppId = editingId || `opp-${Date.now()}`;
    const newOpportunity: Opportunity = {
      id: oppId,
      title: title.trim(),
      organisationLabel: company.trim(),
      roleFamily: roleFamily.trim(),
      seniorityLabel: seniority,
      workMode,
      location: location.trim(),
      summary: summary.trim(),
      responsibilities: parseLineTags(responsibilitiesText),
      requiredRoleTags: parseCommaTags(requiredRoleTagsText),
      adjacentRoleTags: parseCommaTags(adjacentRoleTagsText),
      requiredSkillTags: parseCommaTags(requiredSkillTagsText),
      preferredSkillTags: parseCommaTags(preferredSkillTagsText),
      mustHaves: parseLineTags(mustHavesText),
      hobbyInterests: parseCommaTags(hobbyInterestsText),
      pathwayCategory,
      sourceLabel: isLive ? `Live Job Listing (${company.trim()})` : `Curated Benchmark (${company.trim()})`,
      demoOnly: !isLive,
      isLive,
      applyUrl: applyUrl.trim() || undefined,
      status: 'active',
    };

    storageService.saveLiveOpportunity(newOpportunity);
    onRefreshOpportunities();
    resetForm();
    setStatusMessage({
      text: editingId ? `Updated "${newOpportunity.title}" successfully.` : `Published new live role "${newOpportunity.title}".`,
      type: 'success',
    });

    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDeleteOpportunity = (opp: Opportunity) => {
    if (window.confirm(`Are you sure you want to remove "${opp.title}" at ${opp.organisationLabel}?`)) {
      storageService.deleteLiveOpportunity(opp.id);
      onRefreshOpportunities();
      setStatusMessage({ text: `Removed "${opp.title}".`, type: 'success' });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleExportJson = () => {
    const jsonStr = storageService.exportMasterOpportunitiesJson(opportunities);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opportunities.json';
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ text: 'Exported opportunities.json successfully.', type: 'success' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode.trim().length < 4) {
      alert('Passcode must be at least 4 characters long.');
      return;
    }
    storageService.changeOwnerPasscode(newPasscode.trim());
    setShowPasscodeModal(false);
    setNewPasscode('');
    setStatusMessage({ text: 'Owner passcode successfully updated.', type: 'success' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const filteredOpportunities = opportunities.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o.title.toLowerCase().includes(q) ||
      o.organisationLabel.toLowerCase().includes(q) ||
      o.roleFamily.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner & Control Bar */}
      <div className="mb-8 p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Authenticated Owner Portal • Exclusive Access
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Live Opportunity Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            As the platform owner, only you can publish, edit, or delete live opportunities. Public visitors have read-only discovery access.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Live Role
          </button>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Download clean opportunities.json for repo commit"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>

          <button
            onClick={() => setShowPasscodeModal(true)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Change secret owner passcode"
          >
            <Key className="w-4 h-4" />
            Passcode
          </button>

          <button
            onClick={onExitOwnerMode}
            className="px-4 py-2.5 bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 border border-rose-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-4 h-4 text-rose-300" />
            Lock & Exit
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Inline Form (Create or Edit) */}
      {isEditing && (
        <section className="mb-10 bg-white rounded-3xl border border-indigo-200 p-6 sm:p-8 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Opportunity' : 'Publish New Live Opportunity'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide structured details so the matching engine can evaluate candidate profiles accurately.
              </p>
            </div>
            <button
              onClick={resetForm}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveOpportunity} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Product Operations Manager"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Linear, Notion"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Role Family
                </label>
                <input
                  type="text"
                  value={roleFamily}
                  onChange={(e) => setRoleFamily(e.target.value)}
                  placeholder="e.g. Product Management, Operations"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Seniority Level
                </label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value as SeniorityLevel)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                >
                  <option value="Entry-Level">Entry-Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Work Arrangement
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Timezone
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote (US / EMEA)"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            {/* Live Role Link & Pathway */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Direct Live Application URL (Optional)
                </label>
                <input
                  type="url"
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  placeholder="https://company.com/careers/job-id"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Enables candidates to click "Apply on Company Site" directly from detail view.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Pathway Tag
                </label>
                <select
                  value={pathwayCategory}
                  onChange={(e) => setPathwayCategory(e.target.value as 'primary' | 'adjacent' | 'hobby')}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl"
                >
                  <option value="primary">Primary Target Fit</option>
                  <option value="adjacent">Adjacent Role Pivot</option>
                  <option value="hobby">Hobby & Creative Exploration</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isLiveCheckbox"
                  checked={isLive}
                  onChange={(e) => setIsLive(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isLiveCheckbox" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Mark as Active Real-World Role (Shows "Live Role" badge rather than "Demo Benchmark")
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Role Summary
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of mission and scope..."
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            {/* Tag Sets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Required Role Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={requiredRoleTagsText}
                  onChange={(e) => setRequiredRoleTagsText(e.target.value)}
                  placeholder="e.g. Product Manager, Associate Product Manager"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Adjacent Role Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={adjacentRoleTagsText}
                  onChange={(e) => setAdjacentRoleTagsText(e.target.value)}
                  placeholder="e.g. Product Operations Specialist, Business Systems Analyst"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Required Skill Tags (Comma-separated) *
                </label>
                <input
                  type="text"
                  value={requiredSkillTagsText}
                  onChange={(e) => setRequiredSkillTagsText(e.target.value)}
                  placeholder="e.g. SQL, Process Optimization, Cross-functional Leadership"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Preferred Skill Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={preferredSkillTagsText}
                  onChange={(e) => setPreferredSkillTagsText(e.target.value)}
                  placeholder="e.g. Figma, Looker, Notion, Zapier"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Responsibilities (One per line)
                </label>
                <textarea
                  rows={3}
                  value={responsibilitiesText}
                  onChange={(e) => setResponsibilitiesText(e.target.value)}
                  placeholder="Lead operational cadence&#10;Manage sprint processes&#10;Audit tooling stack"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Must-Haves Non-Negotiables (One per line)
                </label>
                <textarea
                  rows={3}
                  value={mustHavesText}
                  onChange={(e) => setMustHavesText(e.target.value)}
                  placeholder="3+ years in product or ops&#10;Demonstrated SQL competency"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Hobby & Creative Synergies (Optional, Comma-separated)
                </label>
                <input
                  type="text"
                  value={hobbyInterestsText}
                  onChange={(e) => setHobbyInterestsText(e.target.value)}
                  placeholder="e.g. Technical Writing & Documentation, Visual Diagramming, Podcasting"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {editingId ? 'Update Role' : 'Publish Role'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Catalogue List Header & Search */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Active Opportunities Catalogue ({filteredOpportunities.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These listings power the matching feed across all candidate profiles.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title or company..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>
        </div>

        {/* Opportunity Items Table/List */}
        <div className="divide-y divide-slate-100">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">{opp.title}</span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-200">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {opp.organisationLabel}
                  </span>

                  {opp.isLive ? (
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Live Verified Role
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      Benchmark Demo
                    </span>
                  )}

                  <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                    {opp.pathwayCategory || 'Primary'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-1">{opp.summary}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>{opp.roleFamily}</span>
                  <span>•</span>
                  <span>{opp.seniorityLabel}</span>
                  <span>•</span>
                  <span>{opp.workMode} ({opp.location})</span>
                  {opp.applyUrl && (
                    <>
                      <span>•</span>
                      <a
                        href={opp.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-0.5"
                      >
                        Apply Link <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleStartEdit(opp)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteOpportunity(opp)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Passcode Modal */}
      {showPasscodeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setShowPasscodeModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Change Owner Passcode</h3>
              <button
                onClick={() => setShowPasscodeModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Set a new secret passcode to secure Owner Admin Mode on this device.
            </p>

            <form onSubmit={handleChangePasscode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  New Passcode
                </label>
                <input
                  type="text"
                  required
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasscodeModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
                >
                  Save Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
