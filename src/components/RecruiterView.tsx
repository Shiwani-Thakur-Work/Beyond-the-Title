import React from 'react';
import type { CandidateProfile } from '../types';
import { Eye, Briefcase, FolderGit2, GraduationCap, Info, UserCheck, ArrowLeft } from 'lucide-react';

interface RecruiterViewProps {
  profile: CandidateProfile;
  onBackToCandidate: () => void;
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({
  profile,
  onBackToCandidate,
}) => {
  const workCaps = profile.capabilities.filter((c) => c.evidenceType === 'work');
  const projectCaps = profile.capabilities.filter((c) => c.evidenceType === 'project');
  const learningCaps = profile.capabilities.filter((c) => c.evidenceType === 'learning');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Info Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
              Recruiter & Hiring Manager Lens
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How Recruiters Read a Multidirectional Profile
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Traditional resumes hide adjacent capabilities under a single historical title. Beyond the Title gives hiring managers clarity by separating hard verified work experience from project evidence, learning goals, and creative interests.
          </p>
        </div>

        <button
          onClick={onBackToCandidate}
          className="self-start md:self-center px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Candidate Mode
        </button>
      </div>

      <div className="space-y-8">
        {/* Recruiter Evaluation Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{profile.name || 'Candidate Preview'}</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                  {profile.seniorityLevel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{profile.titleHeadline || 'Multidirectional Technology Professional'}</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 block">Preferred Work Mode:</span>
              <span className="text-xs font-bold text-slate-800">{profile.workModePreference}</span>
            </div>
          </div>

          {/* Quick Screening Analysis for Recruiter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
              <span className="text-xs font-bold text-emerald-900 block mb-1 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Work-Verified ({workCaps.length})
              </span>
              <p className="text-[11px] text-emerald-800">
                Skills proven in production or team employment. Safe to evaluate as core competency.
              </p>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl">
              <span className="text-xs font-bold text-blue-900 block mb-1 flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-blue-600" />
                Project-Demonstrated ({projectCaps.length})
              </span>
              <p className="text-[11px] text-blue-800">
                Skills proven through tangible side projects, portfolios, or prototypes.
              </p>
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
              <span className="text-xs font-bold text-amber-900 block mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                In Progress ({learningCaps.length})
              </span>
              <p className="text-[11px] text-amber-800">
                Declared as currently learning. Candidate does not falsely claim production mastery.
              </p>
            </div>
          </div>

          {/* Role Alignment Matrix */}
          <div className="space-y-4 pt-2">
            <div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                Declared Roles & Transferable Adjacency
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-2xs">
                  Primary: {profile.primaryRole || 'Unspecified'}
                </span>
                {profile.adjacentRoles.map((adj) => (
                  <span key={adj} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200">
                    Adjacent: {adj}
                  </span>
                ))}
              </div>
            </div>

            {/* Recruiter Insight Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                Recruiter Screening Insight
              </span>
              <p>
                If screening for a <strong>Product Operations</strong> or <strong>Technical Coordinator</strong> vacancy, this candidate possesses transferable process documentation and sprint planning skills even though their previous title was <strong>{profile.primaryRole || 'Product Manager'}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits for Hiring Managers */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            Why Multidirectional Profiles Improve Talent Discovery
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-900">Prevents False-Keyword Screening</span>
              <p className="text-slate-600">
                Traditional ATS parsers match keywords without verifying context. Evidence labeling clarifies whether a candidate has 3 years of work experience or just finished a weekend tutorial.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-900">Surfaces Hidden Talent Pools</span>
              <p className="text-slate-600">
                In high-demand fields like Product Operations, qualified talent often comes from adjacent paths (QA leads, Customer Success engineers, Project Coordinators) rather than identical titles.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
