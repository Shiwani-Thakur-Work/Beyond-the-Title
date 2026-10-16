/**
 * Core Domain Types & Data Contracts for Beyond the Title
 * 
 * @module types
 * @description Defines the multidirectional domain models, capability evidence structures,
 * deterministic match analysis contracts, and curated demonstration opportunity schemas.
 */

/**
 * Classification of evidence supporting a candidate's capability.
 * - 'work': Demonstrated in production work experience.
 * - 'project': Demonstrated through verified project or extracurricular work.
 * - 'learning': Active learning goal (explicitly not represented as verified experience).
 * - 'interest': Personal passion or exploratory interest (supplementary context).
 */
export type EvidenceType = 'work' | 'project' | 'learning' | 'interest';

/**
 * Individual capability entry with associated evidence classification and contextual proof.
 */
export interface CapabilityEntry {
  /** Unique capability identifier */
  id: string;
  /** Normalized name of the capability (e.g., "Requirements Documentation (PRD)", "SQL") */
  label: string;
  /** Truthful classification of how this skill was acquired or validated */
  evidenceType: EvidenceType;
  /** Optional real-world context note explaining the project, impact, or learning milestone */
  optionalContext?: string;
}

/** Supported employment work arrangements */
export type WorkMode = 'Remote' | 'Hybrid' | 'In-Person';

/** Seniority tiers for role alignment */
export type SeniorityLevel = 'Associate' | 'Mid-Level' | 'Senior' | 'Lead';

/**
 * Multidirectional Candidate Profile Model.
 * Represents a professional across their primary target role, adjacent career pivot directions,
 * evidence-graded capabilities, and personal creative interests.
 */
export interface CandidateProfile {
  /** Unique profile identifier */
  id: string;
  /** Candidate full name */
  name: string;
  /** High-level professional headline summarizing directional scope */
  titleHeadline?: string;
  /** Primary role the candidate is targeting */
  primaryRole: string;
  /** Up to three adjacent roles where transferable capabilities apply */
  adjacentRoles: string[];
  /** Structured capability profile categorized by evidence tier */
  capabilities: CapabilityEntry[];
  /** Personal creative passions or secondary interests (e.g. Voiceover, Technical Illustration) */
  additionalInterests: string[];
  /** Preferred workplace arrangement */
  workModePreference: 'Remote' | 'Hybrid' | 'In-Person' | 'Any';
  /** Target seniority level */
  seniorityLevel: SeniorityLevel;
  /** Demo privacy mode flag (ensures data remains strictly client-side) */
  visibility: 'private-demo';
  /** ISO timestamp of last update */
  updatedAt: string;
}

/**
 * Standardized descriptor of how an opportunity aligns with a candidate profile.
 * - 'Primary Role Fit': Directly matches primary career target with demonstrated skills.
 * - 'Adjacent Role Pivot': Matches an adjacent role direction via transferable capabilities.
 * - 'Hobby & Creative Exploration': Connects to candidate's creative hobbies/interests.
 * - 'Emerging Capability Match': Shares cross-functional capability overlaps without exact title match.
 * - 'Distinct Exploration': General discovery role for broader market exploration.
 */
export type FitDescriptor =
  | 'Primary Role Fit'
  | 'Adjacent Role Pivot'
  | 'Hobby & Creative Exploration'
  | 'Emerging Capability Match'
  | 'Distinct Exploration';

/**
 * User-selectable discovery lens filter.
 */
export type PathwayFilter =
  | 'all'
  | 'primary'
  | 'adjacent'
  | 'hobby'
  | 'skill-bridge';

/**
 * Opportunity Entity Contract.
 * 
 * Note on Data Provenance:
 * In this version of Beyond the Title, opportunities are curated demonstration roles
 * modeled after real-world industry job specifications from tier-one organizations.
 * They are intentionally tagged with `demoOnly: true` to prevent candidate confusion
 * regarding live external vacancy submissions.
 */
export interface Opportunity {
  /** Unique opportunity identifier */
  id: string;
  /** Job title */
  title: string;
  /** Organization label (e.g., "Stripe", "Figma", "Spotify / Audible (Demo)") */
  organisationLabel: string;
  /** Functional role family taxonomy */
  roleFamily: string;
  /** Experience seniority tier */
  seniorityLabel: SeniorityLevel;
  /** Work arrangement format */
  workMode: WorkMode;
  /** Geographic or timezone parameter */
  location: string;
  /** High-level operational summary of the role */
  summary: string;
  /** Core operational responsibilities */
  responsibilities: string[];
  /** Roles that directly qualify for this opportunity */
  requiredRoleTags: string[];
  /** Adjacent roles with recognized transferable capabilities */
  adjacentRoleTags: string[];
  /** Mandatory capabilities required for execution */
  requiredSkillTags: string[];
  /** Preferred or value-add capabilities */
  preferredSkillTags: string[];
  /** Non-negotiable prerequisite experience criteria */
  mustHaves: string[];
  /**
   * Creative or personal hobbies that have direct synergy with this role
   * (e.g. "Voiceover & Audio Narration", "Technical Illustration & Diagrams").
   */
  hobbyInterests?: string[];
  /** Primary pathway classification for discovery organization */
  pathwayCategory?: 'primary' | 'adjacent' | 'hobby' | 'hybrid';
  /** Source label indicating demonstration data provenance */
  sourceLabel: string;
  /** Explicit demonstration flag confirming listing is for testing and simulation */
  demoOnly: boolean;
}

/**
 * Locally bookmarked opportunity model.
 */
export interface SavedOpportunity {
  /** ID of the saved opportunity */
  opportunityId: string;
  /** ISO timestamp when bookmarked */
  savedAt: string;
  /** Optional user notes */
  notes?: string;
}

/** Explicit candidate relevance rating values */
export type RelevanceRating = 'relevant' | 'not-relevant' | 'unsure';

/**
 * Relevance feedback model for algorithmic audit and product discovery validation.
 */
export interface RelevanceFeedback {
  /** Associated opportunity identifier */
  opportunityId: string;
  /** Candidate subjective relevance rating */
  rating: RelevanceRating;
  /** Standardized reason code explaining the rating */
  reasonTag?: string;
  /** Free-form candidate feedback notes */
  notes?: string;
  /** ISO timestamp of submission */
  createdAt: string;
}

/**
 * Deterministic Matching Engine Output Contract.
 * Contains transparent, fully traceable breakdown of overlaps, gaps, and pathway alignment.
 */
export interface MatchAnalysis {
  /** Direct role tag overlap classification */
  roleMatch: 'primary' | 'adjacent' | 'unrelated';
  /** Name of the matched role tier */
  matchedRoleName: string;
  /** Capabilities validated through production work experience */
  matchedWorkCapabilities: string[];
  /** Capabilities validated through project evidence */
  matchedProjectCapabilities: string[];
  /** Required or preferred capabilities marked as active learning goals */
  learningCapabilities: string[];
  /** Required capabilities unrepresented in the candidate profile */
  missingRequiredCapabilities: string[];
  /** Preferred capabilities unrepresented in the candidate profile */
  missingPreferredCapabilities: string[];
  /** Overlap with creative interests or personal hobbies */
  interestOverlaps: string[];
  /** Overall fit category descriptor */
  fitDescriptor: FitDescriptor;
  /** Plain-language explanation synthesizing the match rationale */
  explanationSummary: string;
  /** Detailed caveats regarding learning bridges, missing requirements, or transferable pivots */
  detailedCaveats: string[];
  /** Boolean flag: Matches candidate's primary career target */
  isPrimaryFit: boolean;
  /** Boolean flag: Matches candidate's adjacent career pivot directions */
  isAdjacentFit: boolean;
  /** Boolean flag: Connects to candidate's creative hobbies and passions */
  isHobbyFit: boolean;
  /** Boolean flag: Bridges active learning goals or project capabilities */
  isSkillBridgeFit: boolean;
  /** Name of the matched creative hobby, if applicable */
  matchedHobbyName?: string;
  /** Name of the matched adjacent role, if applicable */
  matchedAdjacentRoleName?: string;
}

/**
 * Role Taxonomy metadata for suggestions and adjacent role mapping.
 */
export interface RoleTaxonomyOption {
  /** Role title */
  role: string;
  /** Broader role family */
  family: string;
  /** Standard adjacent roles where skills commonly transfer */
  commonAdjacent: string[];
  /** Common high-value capabilities associated with this role */
  suggestedCapabilities: string[];
}
