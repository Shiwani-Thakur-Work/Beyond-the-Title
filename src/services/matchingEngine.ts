import type { CandidateProfile, Opportunity, MatchAnalysis } from '../types';

/**
 * Normalizes text for clean keyword/phrase overlap matching
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Checks if a candidate capability label matches a requirement tag
 */
function isCapabilityMatch(candidateLabel: string, opportunityTag: string): boolean {
  const cNorm = normalize(candidateLabel);
  const oNorm = normalize(opportunityTag);

  if (cNorm === oNorm) return true;
  // Substring or acronym matches (e.g. "prd", "sql", "jira", "sprint")
  if (cNorm.includes(oNorm) || oNorm.includes(cNorm)) return true;

  // Key phrase token overlap
  const cTokens = cNorm.split(' ').filter((w) => w.length > 2);
  const oTokens = oNorm.split(' ').filter((w) => w.length > 2);
  const common = cTokens.filter((token) => oTokens.includes(token));

  // If at least 2 significant tokens match (or 1 if tag is short)
  if (oTokens.length <= 2 && common.length >= 1) return true;
  if (common.length >= 2) return true;

  return false;
}

/**
 * Checks if a candidate role matches an opportunity role tag
 */
function isRoleMatch(candidateRole: string, roleTag: string): boolean {
  if (!candidateRole || !roleTag) return false;
  const cNorm = normalize(candidateRole);
  const rNorm = normalize(roleTag);
  return cNorm === rNorm || cNorm.includes(rNorm) || rNorm.includes(cNorm);
}

export function analyzeOpportunityMatch(
  profile: CandidateProfile,
  opportunity: Opportunity
): MatchAnalysis {
  // 1. Role overlap analysis
  let roleMatch: 'primary' | 'adjacent' | 'unrelated' = 'unrelated';
  let matchedRoleName = '';

  const primaryRole = profile.primaryRole || '';
  const adjacentRoles = profile.adjacentRoles || [];

  // Check primary role in required or adjacent tags
  const primaryInRequired = opportunity.requiredRoleTags.some((tag) => isRoleMatch(primaryRole, tag));
  const primaryInAdjacent = opportunity.adjacentRoleTags.some((tag) => isRoleMatch(primaryRole, tag));

  if (primaryInRequired) {
    roleMatch = 'primary';
    matchedRoleName = primaryRole;
  } else if (primaryInAdjacent) {
    roleMatch = 'adjacent';
    matchedRoleName = `${primaryRole} (as adjacent fit for ${opportunity.title})`;
  } else {
    // Check candidate's adjacent roles
    for (const adj of adjacentRoles) {
      if (opportunity.requiredRoleTags.some((tag) => isRoleMatch(adj, tag))) {
        roleMatch = 'adjacent';
        matchedRoleName = adj;
        break;
      }
      if (opportunity.adjacentRoleTags.some((tag) => isRoleMatch(adj, tag))) {
        roleMatch = 'adjacent';
        matchedRoleName = adj;
        break;
      }
    }
  }

  // 2. Capabilities Categorization
  const workCapabilities = profile.capabilities.filter((c) => c.evidenceType === 'work');
  const projectCapabilities = profile.capabilities.filter((c) => c.evidenceType === 'project');
  const learningCapabilitiesList = profile.capabilities.filter((c) => c.evidenceType === 'learning');

  const matchedWorkCapabilities: string[] = [];
  const matchedProjectCapabilities: string[] = [];
  const learningCapabilities: string[] = [];
  const missingRequiredCapabilities: string[] = [];
  const missingPreferredCapabilities: string[] = [];

  const allOppRequired = opportunity.requiredSkillTags || [];
  const allOppPreferred = opportunity.preferredSkillTags || [];

  // Evaluate Required Skills
  for (const reqTag of allOppRequired) {
    const matchedWork = workCapabilities.find((c) => isCapabilityMatch(c.label, reqTag));
    if (matchedWork) {
      matchedWorkCapabilities.push(`${reqTag} (Verified in work experience: "${matchedWork.label}")`);
      continue;
    }

    const matchedProject = projectCapabilities.find((c) => isCapabilityMatch(c.label, reqTag));
    if (matchedProject) {
      matchedProjectCapabilities.push(`${reqTag} (Demonstrated in project: "${matchedProject.label}")`);
      continue;
    }

    const matchedLearning = learningCapabilitiesList.find((c) => isCapabilityMatch(c.label, reqTag));
    if (matchedLearning) {
      learningCapabilities.push(`${reqTag} (Currently learning, not yet demonstrated in work)`);
      missingRequiredCapabilities.push(reqTag);
      continue;
    }

    // Completely unrepresented
    missingRequiredCapabilities.push(reqTag);
  }

  // Evaluate Preferred Skills
  for (const prefTag of allOppPreferred) {
    const matchedWork = workCapabilities.find((c) => isCapabilityMatch(c.label, prefTag));
    if (matchedWork) {
      matchedWorkCapabilities.push(`${prefTag} (Work experience: "${matchedWork.label}")`);
      continue;
    }

    const matchedProject = projectCapabilities.find((c) => isCapabilityMatch(c.label, prefTag));
    if (matchedProject) {
      matchedProjectCapabilities.push(`${prefTag} (Project: "${matchedProject.label}")`);
      continue;
    }

    const matchedLearning = learningCapabilitiesList.find((c) => isCapabilityMatch(c.label, prefTag));
    if (matchedLearning) {
      learningCapabilities.push(`${prefTag} (Current learning goal: "${matchedLearning.label}")`);
      continue;
    }

    missingPreferredCapabilities.push(prefTag);
  }

  // 3. Creative / Personal Interest overlap (purely supplementary, never implies job qualification)
  const interestOverlaps: string[] = [];
  for (const interest of profile.additionalInterests || []) {
    const matchesPref = allOppPreferred.some((tag) => isCapabilityMatch(interest, tag));
    const inSummary = normalize(opportunity.summary).includes(normalize(interest));
    if (matchesPref || inSummary) {
      interestOverlaps.push(interest);
    }
  }

  // 4. Determine Honest Fit Descriptor
  let fitDescriptor: MatchAnalysis['fitDescriptor'] = 'Distinct Exploration';
  if (roleMatch === 'primary' && (matchedWorkCapabilities.length + matchedProjectCapabilities.length >= 2)) {
    fitDescriptor = 'Primary Role Fit';
  } else if (roleMatch === 'adjacent' && (matchedWorkCapabilities.length + matchedProjectCapabilities.length >= 1)) {
    fitDescriptor = 'Adjacent Role Pivot';
  } else if (matchedWorkCapabilities.length + matchedProjectCapabilities.length >= 2) {
    fitDescriptor = 'Emerging Capability Match';
  } else {
    fitDescriptor = 'Distinct Exploration';
  }

  // 5. Plain Language Summary Generation
  const explanationParts: string[] = [];
  const detailedCaveats: string[] = [];

  if (roleMatch === 'primary') {
    explanationParts.push(
      `Directly aligns with your primary career goal as a ${primaryRole}.`
    );
  } else if (roleMatch === 'adjacent' && matchedRoleName) {
    explanationParts.push(
      `Discovered through your adjacent direction in ${matchedRoleName}, enabling you to leverage transferable capabilities outside conventional ${primaryRole || 'single-title'} filters.`
    );
  } else {
    explanationParts.push(
      `Surfaced because several of your demonstrated capabilities cross over with this role's functional demands.`
    );
  }

  const demonstratedCount = matchedWorkCapabilities.length + matchedProjectCapabilities.length;
  if (demonstratedCount > 0) {
    explanationParts.push(
      `Your profile demonstrates ${demonstratedCount} relevant capabilities with tangible work and project evidence.`
    );
  }

  if (learningCapabilities.length > 0) {
    detailedCaveats.push(
      `Learning Goal Note: ${learningCapabilities.length} required or preferred capability is marked as an active learning goal on your profile, rather than verified experience.`
    );
  }

  if (missingRequiredCapabilities.length > 0) {
    detailedCaveats.push(
      `Missing Requirements: This role explicitly requests ${missingRequiredCapabilities.length} capability not currently represented on your profile (${missingRequiredCapabilities.slice(0, 2).join(', ')}${missingRequiredCapabilities.length > 2 ? ', etc.' : ''}).`
    );
  }

  if (interestOverlaps.length > 0) {
    detailedCaveats.push(
      `Creative Alignment: Touches upon your creative interest in ${interestOverlaps.join(', ')}. Note: Creative interests are noted for cultural and domain affinity, but do not replace professional requirements.`
    );
  }

  return {
    roleMatch,
    matchedRoleName: matchedRoleName || primaryRole || 'Profile Capabilities',
    matchedWorkCapabilities,
    matchedProjectCapabilities,
    learningCapabilities,
    missingRequiredCapabilities,
    missingPreferredCapabilities,
    interestOverlaps,
    fitDescriptor,
    explanationSummary: explanationParts.join(' '),
    detailedCaveats,
  };
}
