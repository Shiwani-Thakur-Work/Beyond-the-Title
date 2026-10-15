// Core Domain Types for Beyond the Title MVP

export type EvidenceType = 'work' | 'project' | 'learning' | 'interest';

export interface CapabilityEntry {
  id: string;
  label: string;
  evidenceType: EvidenceType;
  optionalContext?: string;
}

export type WorkMode = 'Remote' | 'Hybrid' | 'In-Person';
export type SeniorityLevel = 'Associate' | 'Mid-Level' | 'Senior' | 'Lead';

export interface CandidateProfile {
  id: string;
  name: string;
  titleHeadline?: string;
  primaryRole: string;
  adjacentRoles: string[]; // up to 3
  capabilities: CapabilityEntry[];
  additionalInterests: string[]; // creative/personal e.g. Voice work, Painting, Technical Writing
  workModePreference: 'Remote' | 'Hybrid' | 'In-Person' | 'Any';
  seniorityLevel: SeniorityLevel;
  visibility: 'private-demo'; // Private-by-default demo behaviour
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organisationLabel: string; // clearly fictional e.g. "Apex Telemetry (Demo)"
  roleFamily: string; // e.g. "Product Management", "Product Operations", "Business Analysis"
  seniorityLabel: SeniorityLevel;
  workMode: WorkMode;
  location: string;
  summary: string;
  responsibilities: string[];
  requiredRoleTags: string[];
  adjacentRoleTags: string[];
  requiredSkillTags: string[];
  preferredSkillTags: string[];
  mustHaves: string[];
  sourceLabel: string; // "Fictional Demonstration Listing"
  demoOnly: boolean; // true
}

export interface SavedOpportunity {
  opportunityId: string;
  savedAt: string;
  notes?: string;
}

export type RelevanceRating = 'relevant' | 'not-relevant' | 'unsure';

export interface RelevanceFeedback {
  opportunityId: string;
  rating: RelevanceRating;
  reasonTag?: string;
  notes?: string;
  createdAt: string;
}

export interface MatchAnalysis {
  roleMatch: 'primary' | 'adjacent' | 'unrelated';
  matchedRoleName: string;
  matchedWorkCapabilities: string[];
  matchedProjectCapabilities: string[];
  learningCapabilities: string[];
  missingRequiredCapabilities: string[];
  missingPreferredCapabilities: string[];
  interestOverlaps: string[];
  fitDescriptor: 'Primary Role Fit' | 'Adjacent Role Pivot' | 'Emerging Capability Match' | 'Distinct Exploration';
  explanationSummary: string;
  detailedCaveats: string[];
}

export interface RoleTaxonomyOption {
  role: string;
  family: string;
  commonAdjacent: string[];
  suggestedCapabilities: string[];
}
