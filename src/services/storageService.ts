import type { CandidateProfile, SavedOpportunity, RelevanceFeedback } from '../types';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

const PROFILE_KEY = 'beyond_the_title_profile_v1';
const SAVED_OPPORTUNITIES_KEY = 'beyond_the_title_saved_opps_v1';
const FEEDBACK_KEY = 'beyond_the_title_feedback_v1';

export const createBlankProfile = (): CandidateProfile => ({
  id: `profile-${Date.now()}`,
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

  saveProfile(profile: CandidateProfile): void {
    try {
      const updated = { ...profile, updatedAt: new Date().toISOString() };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  },

  resetProfileToBlank(): CandidateProfile {
    const blank = createBlankProfile();
    storageService.saveProfile(blank);
    return blank;
  },

  loadPresetProfile(index: number): CandidateProfile {
    const preset = SAMPLE_PROFILES[index]?.profile || SAMPLE_PROFILES[0].profile;
    const cloned = JSON.parse(JSON.stringify(preset));
    cloned.updatedAt = new Date().toISOString();
    storageService.saveProfile(cloned);
    return cloned;
  },

  loadProfileById(profileId: string): CandidateProfile {
    const found = SAMPLE_PROFILES.find((p) => p.id === profileId || p.profile.id === profileId);
    const target = found?.profile || SAMPLE_PROFILES[0].profile;
    const cloned = JSON.parse(JSON.stringify(target));
    cloned.updatedAt = new Date().toISOString();
    storageService.saveProfile(cloned);
    return cloned;
  },

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

  isOpportunitySaved(opportunityId: string): boolean {
    const current = storageService.getSavedOpportunities();
    return current.some((item) => item.opportunityId === opportunityId);
  },

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

  getFeedbackForOpportunity(opportunityId: string): RelevanceFeedback | undefined {
    const all = storageService.getAllFeedback();
    return all[opportunityId];
  },

  saveFeedback(feedback: RelevanceFeedback): void {
    const all = storageService.getAllFeedback();
    all[feedback.opportunityId] = feedback;
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));
    } catch (e) {
      console.error('Failed to save feedback:', e);
    }
  },

  clearAllData(): void {
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(SAVED_OPPORTUNITIES_KEY);
      localStorage.removeItem(FEEDBACK_KEY);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  },

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
};
