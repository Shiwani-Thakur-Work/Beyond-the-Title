/**
 * @file storageService.ts
 * @description Client-side persistence layer for Beyond the Title.
 * 
 * Persistence Architecture:
 * - Browser Local Storage: All profile, saved opportunity, and relevance feedback state
 *   resides exclusively in the user's browser localStorage.
 * - Zero-Tracking & Sovereign Privacy: No cookies, fingerprinting, or external API relays.
 *   Candidates retain absolute ownership over their profile data.
 * - Demonstration Benchmark Compatibility: Supports fast loading of sample candidate
 *   profiles alongside persistent custom profile creation and JSON export/import.
 */

import type { CandidateProfile, SavedOpportunity, RelevanceFeedback, Opportunity } from '../types';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

/** Storage key for the actively loaded candidate profile */
const PROFILE_KEY = 'beyond_the_title_profile_v1';

/** Storage key specifically preserving the user's custom authored profile */
const CUSTOM_PROFILE_KEY = 'beyond_the_title_custom_profile_v1';

/** Storage key for bookmarked opportunities */
const SAVED_OPPORTUNITIES_KEY = 'beyond_the_title_saved_opps_v1';

/** Storage key for candidate relevance evaluation feedback */
const FEEDBACK_KEY = 'beyond_the_title_feedback_v1';

/** Storage key for owner-managed live opportunities */
const LIVE_OPPORTUNITIES_OVERRIDE_KEY = 'beyond_the_title_live_opps_v1';

/** Storage key for deleted opportunity IDs */
const DELETED_OPPORTUNITIES_KEY = 'beyond_the_title_deleted_opps_v1';

/** Storage key for custom owner passcode */
const OWNER_PASSCODE_KEY = 'beyond_the_title_owner_passcode_v1';

/** Default owner passcode for administrative management */
export const DEFAULT_OWNER_PASSCODE = 'beyond2026';

/** Session storage key tracking authenticated owner status in current tab */
const OWNER_SESSION_KEY = 'beyond_the_title_owner_session_v1';

/**
 * Generates an empty candidate profile schema with default settings.
 * Used when initiating a custom profile build from scratch.
 *
 * @returns A freshly initialized CandidateProfile instance.
 */
export const createBlankProfile = (): CandidateProfile => ({
  id: `profile-custom-${Date.now()}`,
  name: '',
  titleHeadline: '',
  primaryRole: '',
  adjacentRoles: [],
  capabilities: [],
  additionalInterests: [],
  workModePreference: 'Any',
  seniorityLevel: 'Mid-Level',
  visibility: 'private-demo',
  updatedAt: new Date().toISOString(),
});

export const storageService = {
  /**
   * Retrieves the current candidate profile from localStorage.
   * If no profile is present, initializes with the default sample profile (Priya Sharma)
   * to provide immediate application context without empty states.
   *
   * @returns Active CandidateProfile.
   */
  getProfile(): CandidateProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        return JSON.parse(data) as CandidateProfile;
      }
    } catch (e) {
      console.error('Failed to load profile from localStorage:', e);
    }
    // Default to the first sample profile so users immediately experience the app without a blank wall
    const defaultProfile = SAMPLE_PROFILES[0].profile;
    storageService.saveProfile(defaultProfile);
    return defaultProfile;
  },

  /**
   * Persists a candidate profile to localStorage.
   * If the profile represents a user-created profile (non-preset with a valid name),
   * also synchronizes to CUSTOM_PROFILE_KEY for persistent profile switching.
   *
   * @param profile - The CandidateProfile object to persist.
   */
  saveProfile(profile: CandidateProfile): void {
    try {
      const updated = { ...profile, updatedAt: new Date().toISOString() };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));

      // If it's a custom or modified profile, preserve it in CUSTOM_PROFILE_KEY as well
      const isPreset = SAMPLE_PROFILES.some((p) => p.profile.id === profile.id && p.profile.name === profile.name);
      if (!isPreset && profile.name.trim() !== '') {
        localStorage.setItem(CUSTOM_PROFILE_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  },

  /**
   * Retrieves the user's custom authored profile if one exists in storage.
   *
   * @returns The custom CandidateProfile or null if none is saved.
   */
  getCustomProfile(): CandidateProfile | null {
    try {
      const data = localStorage.getItem(CUSTOM_PROFILE_KEY);
      if (data) {
        return JSON.parse(data) as CandidateProfile;
      }
    } catch (e) {
      console.error('Failed to get custom profile:', e);
    }
    return null;
  },

  /**
   * Checks whether a custom candidate profile exists in localStorage.
   *
   * @returns True if a custom profile exists; otherwise false.
   */
  hasCustomProfile(): boolean {
    return Boolean(localStorage.getItem(CUSTOM_PROFILE_KEY));
  },

  /**
   * Loads the custom candidate profile into the active PROFILE_KEY slot.
   *
   * @returns The loaded CandidateProfile or null if no custom profile exists.
   */
  loadCustomProfile(): CandidateProfile | null {
    const custom = storageService.getCustomProfile();
    if (custom) {
      storageService.saveProfile(custom);
      return custom;
    }
    return null;
  },

  /**
   * Resets the active profile to an empty template and saves it to localStorage.
   *
   * @returns The newly created blank CandidateProfile.
   */
  resetProfileToBlank(): CandidateProfile {
    const blank = createBlankProfile();
    storageService.saveProfile(blank);
    return blank;
  },

  /**
   * Loads one of the pre-configured benchmark candidate personas by index.
   *
   * @param index - Index within SAMPLE_PROFILES array.
   * @returns The cloned and activated CandidateProfile.
   */
  loadPresetProfile(index: number): CandidateProfile {
    const preset = SAMPLE_PROFILES[index]?.profile || SAMPLE_PROFILES[0].profile;
    const cloned = JSON.parse(JSON.stringify(preset));
    cloned.updatedAt = new Date().toISOString();
    storageService.saveProfile(cloned);
    return cloned;
  },

  /**
   * Loads a candidate profile by identifier (e.g. preset ID or 'custom').
   *
   * @param profileId - Identifier of the target profile.
   * @returns The loaded and activated CandidateProfile.
   */
  loadProfileById(profileId: string): CandidateProfile {
    if (profileId === 'custom') {
      const custom = storageService.getCustomProfile();
      if (custom) {
        storageService.saveProfile(custom);
        return custom;
      }
    }
    const found = SAMPLE_PROFILES.find((p) => p.id === profileId || p.profile.id === profileId);
    const target = found?.profile || SAMPLE_PROFILES[0].profile;
    const cloned = JSON.parse(JSON.stringify(target));
    cloned.updatedAt = new Date().toISOString();
    storageService.saveProfile(cloned);
    return cloned;
  },

  /**
   * Retrieves all bookmarked opportunities from localStorage.
   *
   * @returns An array of SavedOpportunity records.
   */
  getSavedOpportunities(): SavedOpportunity[] {
    try {
      const data = localStorage.getItem(SAVED_OPPORTUNITIES_KEY);
      if (data) {
        return JSON.parse(data) as SavedOpportunity[];
      }
    } catch (e) {
      console.error('Failed to load saved opportunities:', e);
    }
    return [];
  },

  /**
   * Toggles the bookmark status for a specific opportunity ID.
   *
   * @param opportunityId - The target opportunity ID.
   * @returns Boolean indicating whether the item is now saved (true) or unsaved (false).
   */
  toggleSaveOpportunity(opportunityId: string): boolean {
    const current = storageService.getSavedOpportunities();
    const existingIndex = current.findIndex((item) => item.opportunityId === opportunityId);
    let isSaved = false;

    if (existingIndex >= 0) {
      current.splice(existingIndex, 1);
      isSaved = false;
    } else {
      current.push({
        opportunityId,
        savedAt: new Date().toISOString(),
      });
      isSaved = true;
    }

    try {
      localStorage.setItem(SAVED_OPPORTUNITIES_KEY, JSON.stringify(current));
    } catch (e) {
      console.error('Failed to update saved opportunities:', e);
    }
    return isSaved;
  },

  /**
   * Verifies if a given opportunity is currently bookmarked by the user.
   *
   * @param opportunityId - Target opportunity ID.
   * @returns True if bookmarked; otherwise false.
   */
  isOpportunitySaved(opportunityId: string): boolean {
    const current = storageService.getSavedOpportunities();
    return current.some((item) => item.opportunityId === opportunityId);
  },

  /**
   * Retrieves all recorded relevance feedback entries indexed by opportunity ID.
   *
   * @returns Dictionary of RelevanceFeedback records.
   */
  getAllFeedback(): Record<string, RelevanceFeedback> {
    try {
      const data = localStorage.getItem(FEEDBACK_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load feedback:', e);
    }
    return {};
  },

  /**
   * Retrieves recorded relevance feedback for a single opportunity.
   *
   * @param opportunityId - Target opportunity ID.
   * @returns RelevanceFeedback record or undefined.
   */
  getFeedbackForOpportunity(opportunityId: string): RelevanceFeedback | undefined {
    const all = storageService.getAllFeedback();
    return all[opportunityId];
  },

  /**
   * Saves or updates relevance evaluation feedback for an opportunity.
   *
   * @param feedback - The RelevanceFeedback payload.
   */
  saveFeedback(feedback: RelevanceFeedback): void {
    const all = storageService.getAllFeedback();
    all[feedback.opportunityId] = feedback;
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));
    } catch (e) {
      console.error('Failed to save feedback:', e);
    }
  },

  /**
   * Clears all application data from localStorage (profile, bookmarks, feedback).
   * Restores clean state on user confirmation.
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(CUSTOM_PROFILE_KEY);
      localStorage.removeItem(SAVED_OPPORTUNITIES_KEY);
      localStorage.removeItem(FEEDBACK_KEY);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  },

  /**
   * Serializes current profile, bookmarks, and feedback into a formatted JSON string
   * for client-side export and backup.
   *
   * @returns Formatted JSON string containing all user data.
   */
  exportDataJson(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: storageService.getProfile(),
      savedOpportunities: storageService.getSavedOpportunities(),
      feedback: storageService.getAllFeedback(),
    };
    return JSON.stringify(payload, null, 2);
  },

  /**
   * Validates and imports user data from an exported JSON backup.
   *
   * @param jsonStr - Serialized JSON string to parse and apply.
   * @returns True if import succeeded; false if malformed.
   */
  importDataJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) {
        storageService.saveProfile(parsed.profile);
      }
      if (parsed.savedOpportunities && Array.isArray(parsed.savedOpportunities)) {
        localStorage.setItem(SAVED_OPPORTUNITIES_KEY, JSON.stringify(parsed.savedOpportunities));
      }
      if (parsed.feedback && typeof parsed.feedback === 'object') {
        localStorage.setItem(FEEDBACK_KEY, JSON.stringify(parsed.feedback));
      }
      return true;
    } catch (e) {
      console.error('Failed to parse and import data:', e);
      return false;
    }
  },

  // ==========================================
  // Owner Authentication & Access Control
  // ==========================================

  /**
   * Verifies the provided passcode against the stored owner passcode or default.
   * If valid, initializes an authenticated owner session for the current browser tab.
   *
   * @param passcode - Candidate passcode entered by the user.
   * @returns True if authentication succeeded; false otherwise.
   */
  verifyOwnerPasscode(passcode: string): boolean {
    const activePasscode = localStorage.getItem(OWNER_PASSCODE_KEY) || DEFAULT_OWNER_PASSCODE;
    if (passcode.trim() === activePasscode.trim()) {
      try {
        sessionStorage.setItem(OWNER_SESSION_KEY, 'true');
      } catch (e) {
        console.error('Session storage error:', e);
      }
      return true;
    }
    return false;
  },

  /**
   * Checks whether the current user session holds verified owner administrative privileges.
   *
   * @returns True if owner session is authenticated.
   */
  isOwnerAuthenticated(): boolean {
    try {
      return sessionStorage.getItem(OWNER_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Terminates the current owner session, locking administrative controls.
   */
  logoutOwner(): void {
    try {
      sessionStorage.removeItem(OWNER_SESSION_KEY);
    } catch (e) {
      console.error('Session storage logout error:', e);
    }
  },

  /**
   * Updates the owner passcode in localStorage.
   *
   * @param newPasscode - New secret passcode.
   */
  changeOwnerPasscode(newPasscode: string): void {
    if (!newPasscode || newPasscode.trim().length < 4) return;
    localStorage.setItem(OWNER_PASSCODE_KEY, newPasscode.trim());
  },

  // ==========================================
  // Live Opportunities Management
  // ==========================================

  /**
   * Retrieves owner-authored live opportunities and modifications from localStorage.
   *
   * @returns Array of Opportunity records.
   */
  getLiveOpportunitiesOverrides(): Opportunity[] {
    try {
      const data = localStorage.getItem(LIVE_OPPORTUNITIES_OVERRIDE_KEY);
      if (data) {
        return JSON.parse(data) as Opportunity[];
      }
    } catch (e) {
      console.error('Failed to load live opportunities overrides:', e);
    }
    return [];
  },

  /**
   * Retrieves list of opportunity IDs deleted by the owner.
   *
   * @returns Set of deleted opportunity IDs.
   */
  getDeletedOpportunityIds(): string[] {
    try {
      const data = localStorage.getItem(DELETED_OPPORTUNITIES_KEY);
      if (data) {
        return JSON.parse(data) as string[];
      }
    } catch (e) {
      console.error('Failed to load deleted opportunity IDs:', e);
    }
    return [];
  },

  /**
   * Combines baseline bundled static opportunities with owner-authored live opportunities,
   * updates, and deletions.
   *
   * @param baseOpportunities - The initial catalogue bundled in opportunities.json.
   * @returns Merged array of active Opportunity items.
   */
  getEffectiveOpportunities(baseOpportunities: Opportunity[]): Opportunity[] {
    const deletedIds = new Set(storageService.getDeletedOpportunityIds());
    const overrides = storageService.getLiveOpportunitiesOverrides();

    // Map overrides by ID
    const overrideMap = new Map<string, Opportunity>();
    for (const opp of overrides) {
      overrideMap.set(opp.id, opp);
    }

    // Process base items: filter deleted, apply overrides if present
    const result: Opportunity[] = [];
    const processedIds = new Set<string>();

    for (const base of baseOpportunities) {
      if (deletedIds.has(base.id)) continue;
      if (overrideMap.has(base.id)) {
        result.push(overrideMap.get(base.id)!);
      } else {
        result.push(base);
      }
      processedIds.add(base.id);
    }

    // Append newly created owner opportunities not present in base
    for (const override of overrides) {
      if (!processedIds.has(override.id) && !deletedIds.has(override.id)) {
        result.unshift(override);
        processedIds.add(override.id);
      }
    }

    return result;
  },

  /**
   * Saves or updates a live opportunity in the owner overrides store.
   *
   * @param opportunity - The Opportunity record to persist.
   */
  saveLiveOpportunity(opportunity: Opportunity): void {
    const overrides = storageService.getLiveOpportunitiesOverrides();
    const idx = overrides.findIndex((o) => o.id === opportunity.id);

    if (idx >= 0) {
      overrides[idx] = opportunity;
    } else {
      overrides.push(opportunity);
    }

    try {
      localStorage.setItem(LIVE_OPPORTUNITIES_OVERRIDE_KEY, JSON.stringify(overrides));

      // Ensure it is removed from deleted IDs if previously soft-deleted
      const deletedIds = storageService.getDeletedOpportunityIds();
      const updatedDeleted = deletedIds.filter((id) => id !== opportunity.id);
      localStorage.setItem(DELETED_OPPORTUNITIES_KEY, JSON.stringify(updatedDeleted));
    } catch (e) {
      console.error('Failed to save live opportunity:', e);
    }
  },

  /**
   * Removes an opportunity by marking its ID as deleted in the owner store.
   *
   * @param opportunityId - The target opportunity ID.
   */
  deleteLiveOpportunity(opportunityId: string): void {
    // 1. Remove from overrides if present
    const overrides = storageService.getLiveOpportunitiesOverrides().filter((o) => o.id !== opportunityId);
    try {
      localStorage.setItem(LIVE_OPPORTUNITIES_OVERRIDE_KEY, JSON.stringify(overrides));

      // 2. Add to deleted IDs
      const deletedIds = storageService.getDeletedOpportunityIds();
      if (!deletedIds.includes(opportunityId)) {
        deletedIds.push(opportunityId);
        localStorage.setItem(DELETED_OPPORTUNITIES_KEY, JSON.stringify(deletedIds));
      }
    } catch (e) {
      console.error('Failed to delete live opportunity:', e);
    }
  },

  /**
   * Serializes the entire active effective opportunities catalogue into formatted JSON
   * so the owner can copy/commit directly to src/data/opportunities.json.
   *
   * @param opportunities - Full catalogue of active opportunities.
   * @returns Pretty-printed JSON string.
   */
  exportMasterOpportunitiesJson(opportunities: Opportunity[]): string {
    return JSON.stringify(opportunities, null, 2);
  },
};
