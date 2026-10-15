import React from 'react';
import type { CandidateProfile } from '../types';
import { Shield, Briefcase, FolderGit2, GraduationCap, Heart, Edit3, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

interface ProfilePreviewProps {
  profile: CandidateProfile;
  onEditProfile: () => void;
  onExploreOpportunities: () => void;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  profile,
  onEditProfile,
  onExploreOpportunities,
}) => {
  const workCapabilities = profile.capabilities.filter((c) => c.evidenceType === 'work');
  const projectCapabilities = profile.capabilities.filter((c) => c.evidenceType === 'project');
  const learningCapabilities = profile.capabilities.filter((c) => c.evidenceType === 'learning');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Privacy Notice Banner */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-start gap-3 text-emerald-900 text-xs">
        <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Private by Default:</span> Your profile is stored locally in your browser storage. It is not uploaded to any server or shared with external parties.
        </div>
      </div>

      {/* Main Preview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-semibold tracking-wider text-indigo-300">
                  Multidirectional Candidate Profile
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Personal Project
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {profile.name || 'Anonymous Candidate'}
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                {profile.titleHeadline || 'Multidirectional Technology Professional'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onEditProfile}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* 1. Target Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Primary Career Direction
              </span>
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl">
                <span className="text-base font-bold text-indigo-950 block">
                  {profile.primaryRole || 'No primary role selected'}
                </span>
                <span className="text-xs text-indigo-700 font-medium mt-1 block">
                  Core target role • {profile.seniorityLevel} • {profile.workModePreference} Preference
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Adjacent Roles (Transferable Scope)
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.adjacentRoles && profile.adjacentRoles.length > 0 ? (
                  profile.adjacentRoles.map((adj) => (
                    <div
                      key={adj}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    >
                      {adj}
                    </div>
                  ))
                ) : (
                  <span className="text-xs italic text-slate-400">No adjacent roles selected</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Professional Work Evidence */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Capabilities Used in Professional Work ({workCapabilities.length})
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                Primary Match Evidence
              </span>
            </div>

            {workCapabilities.length === 0 ? (
              <p className="text-xs italic text-slate-400 py-2">No work-demonstrated capabilities added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workCapabilities.map((cap) => (
                  <div
                    key={cap.id}
                    className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {cap.label}
                    </div>
                    {cap.optionalContext && (
                      <p className="text-xs text-slate-600 mt-1 italic pl-5">
                        “{cap.optionalContext}”
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Project Evidence */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-blue-600" />
                Demonstrated Through Project Evidence ({projectCapabilities.length})
              </span>
              <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-medium border border-blue-200">
                Transferable Evidence
              </span>
            </div>

            {projectCapabilities.length === 0 ? (
              <p className="text-xs italic text-slate-400 py-2">No project evidence added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectCapabilities.map((cap) => (
                  <div
                    key={cap.id}
                    className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-xl"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                      <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
                      {cap.label}
                    </div>
                    {cap.optionalContext && (
                      <p className="text-xs text-slate-600 mt-1 italic pl-5">
                        “{cap.optionalContext}”
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Learning Goals */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                Currently Learning Goals ({learningCapabilities.length})
              </span>
              <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-medium border border-amber-200">
                Honest Gap Acknowledgment
              </span>
            </div>

            {learningCapabilities.length === 0 ? (
              <p className="text-xs italic text-slate-400 py-2">No learning goals declared yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {learningCapabilities.map((cap) => (
                  <div
                    key={cap.id}
                    className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                      {cap.label}
                    </div>
                    {cap.optionalContext && (
                      <p className="text-xs text-slate-600 mt-1 italic pl-5">
                        “{cap.optionalContext}”
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Creative & Additional Interests (Separate from Qualifications) */}
          <div className="p-5 bg-purple-50/50 border border-purple-200 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-purple-600" />
                Additional Creative & Personal Interests
              </span>
              <span className="text-[10px] font-semibold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                Supplementary • Non-Qualifying
              </span>
            </div>
            <p className="text-xs text-purple-800/80 mb-3">
              These personal interests provide creative context for specialized tools or creator pods, but do not imply formal technical qualification without supporting work evidence.
            </p>

            <div className="flex flex-wrap gap-2">
              {profile.additionalInterests && profile.additionalInterests.length > 0 ? (
                profile.additionalInterests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-white text-purple-900 rounded-lg text-xs font-semibold border border-purple-200 shadow-2xs"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-xs italic text-purple-400">No creative interests listed.</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 sm:px-8 py-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Profile last updated: {new Date(profile.updatedAt).toLocaleDateString()}
          </div>

          <button
            onClick={onExploreOpportunities}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Explore Opportunities for this Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
