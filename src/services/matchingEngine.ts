import type { CandidateProfile, Opportunity, MatchAnalysis, FitDescriptor } from '../types';

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
  if (!candidateLabel || !opportunityTag) return false;
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
  const primaryRole = profile.primaryRole || '';
  const adjacentRoles = profile.adjacentRoles || [];
  const candidateInterests = profile.additionalInterests || [];

  // 1. Role Overlap Analysis
  let roleMatch: 'primary' | 'adjacent' | 'unrelated' = 'unrelated';
  let matchedRoleName = '';
  let matchedAdjacentRoleName = '';

  const primaryInRequired = opportunity.requiredRoleTags?.some((tag) => isRoleMatch(primaryRole, tag));
  const primaryInAdjacent = opportunity.adjacentRoleTags?.some((tag) => isRoleMatch(primaryRole, tag));

  if (primaryInRequired) {
    roleMatch = 'primary';
    matchedRoleName = primaryRole;
  } else if (primaryInAdjacent) {
    roleMatch = 'adjacent';
    matchedRoleName = `${primaryRole} (as adjacent background)`;
    matchedAdjacentRoleName = primaryRole;
  }

  // Check candidate's selected adjacent roles
  for (const adj of adjacentRoles) {
    const adjInRequired = opportunity.requiredRoleTags?.some((tag) => isRoleMatch(adj, tag));
    const adjInAdjacent = opportunity.adjacentRoleTags?.some((tag) => isRoleMatch(adj, tag));

    if (adjInRequired || adjInAdjacent) {
      if (roleMatch !== 'primary') {
        roleMatch = 'adjacent';
        matchedRoleName = adj;
      }
      matchedAdjacentRoleName = adj;
      break;
    }
  }

  // 2. Capabilities Categorization
  const workCapabilities = profile.capabilities?.filter((c) => c.evidenceType === 'work') || [];
  const projectCapabilities = profile.capabilities?.filter((c) => c.evidenceType === 'project') || [];
  const learningCapabilitiesList = profile.capabilities?.filter((c) => c.evidenceType === 'learning') || [];

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
      matchedWorkCapabilities.push(`${reqTag} (Work: "${matchedWork.label}")`);
      continue;
    }

    const matchedProject = projectCapabilities.find((c) => isCapabilityMatch(c.label, reqTag));
    if (matchedProject) {
      matchedProjectCapabilities.push(`${reqTag} (Project: "${matchedProject.label}")`);
      continue;
    }

    const matchedLearning = learningCapabilitiesList.find((c) => isCapabilityMatch(c.label, reqTag));
    if (matchedLearning) {
      learningCapabilities.push(`${reqTag} (Learning Goal: "${matchedLearning.label}")`);
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
      matchedWorkCapabilities.push(`${prefTag} (Work: "${matchedWork.label}")`);
      continue;
    }

    const matchedProject = projectCapabilities.find((c) => isCapabilityMatch(c.label, prefTag));
    if (matchedProject) {
      matchedProjectCapabilities.push(`${prefTag} (Project: "${matchedProject.label}")`);
      continue;
    }

    const matchedLearning = learningCapabilitiesList.find((c) => isCapabilityMatch(c.label, prefTag));
    if (matchedLearning) {
      learningCapabilities.push(`${prefTag} (Learning: "${matchedLearning.label}")`);
      continue;
    }

    missingPreferredCapabilities.push(prefTag);
  }

  // 3. Creative / Personal Interest & Hobby overlap
  const interestOverlaps: string[] = [];
  let matchedHobbyName: string | undefined = undefined;

  for (const interest of candidateInterests) {
    // Check against explicit opportunity hobbyInterests
    const matchesExplicitHobby = opportunity.hobbyInterests?.some((h) => isCapabilityMatch(interest, h));
    const matchesPref = allOppPreferred.some((tag) => isCapabilityMatch(interest, tag));
    const matchesReq = allOppRequired.some((tag) => isCapabilityMatch(interest, tag));
    const inSummary = normalize(opportunity.summary).includes(normalize(interest));
    const inTitle = normalize(opportunity.title).includes(normalize(interest));

    if (matchesExplicitHobby || matchesPref || matchesReq || inSummary || inTitle) {
      interestOverlaps.push(interest);
      if (!matchedHobbyName) {
        matchedHobbyName = interest;
      }
    }
  }

  const demonstratedCount = matchedWorkCapabilities.length + matchedProjectCapabilities.length;

  // 4. Calculate Pathway Flags
  const isHobbyFit: boolean = Boolean(
    interestOverlaps.length > 0 &&
    (opportunity.pathwayCategory === 'hobby' || (opportunity.hobbyInterests && opportunity.hobbyInterests.length > 0))
  );

  const isPrimaryFit: boolean = Boolean(
    roleMatch === 'primary' &&
    opportunity.pathwayCategory !== 'hobby'
  );

  const isAdjacentFit: boolean = Boolean(
    (roleMatch === 'adjacent' || !!matchedAdjacentRoleName) &&
    !isPrimaryFit &&
    opportunity.pathwayCategory !== 'hobby'
  );

  const isSkillBridgeFit: boolean = Boolean(
    demonstratedCount >= 2 || learningCapabilities.length >= 1
  );

  // 5. Determine Honest Fit Descriptor
  let fitDescriptor: FitDescriptor = 'Distinct Exploration';

  if (isHobbyFit) {
    fitDescriptor = 'Hobby & Creative Exploration';
  } else if (isPrimaryFit && demonstratedCount >= 1) {
    fitDescriptor = 'Primary Role Fit';
  } else if (isAdjacentFit) {
    fitDescriptor = 'Adjacent Role Pivot';
  } else if (demonstratedCount >= 2) {
    fitDescriptor = 'Emerging Capability Match';
  } else {
    fitDescriptor = 'Distinct Exploration';
  }

  // 6. Plain-Language Explanation Generation
  const explanationParts: string[] = [];
  const detailedCaveats: string[] = [];

  if (isHobbyFit && matchedHobbyName) {
    explanationParts.push(
      `🎨 Hobby & Passion Pathway: Discovered because your profile highlights "${matchedHobbyName}" as a creative interest. This role offers an opportunity to translate your personal passion and creative skills into real project collaboration.`
    );
  } else if (isPrimaryFit) {
    explanationParts.push(
      `🎯 Primary Direction Match: Directly targets your primary career objective as a ${primaryRole}.`
    );
  } else if (isAdjacentFit && matchedAdjacentRoleName) {
    explanationParts.push(
      `🔄 Adjacent Career Pivot: Discovered through your adjacent direction in ${matchedAdjacentRoleName}. This surfaces transferable capabilities outside conventional ${primaryRole || 'single-title'} filters.`
    );
  } else {
    explanationParts.push(
      `💡 Functional Capability Overlap: Surfaced because your demonstrated skills share functional intersections with this opportunity.`
    );
  }

  if (demonstratedCount > 0) {
    explanationParts.push(
      `Your profile demonstrates ${demonstratedCount} aligned capability with verified work and project evidence.`
    );
  }

  if (isAdjacentFit && !isHobbyFit && matchedAdjacentRoleName) {
    detailedCaveats.push(
      `Transferable Pivot: This role values your adjacent background in ${matchedAdjacentRoleName}, allowing you to pivot without starting from scratch.`
    );
  }

  if (learningCapabilities.length > 0) {
    detailedCaveats.push(
      `Learning Bridge: ${learningCapabilities.length} required capability is listed as an active learning goal on your profile, highlighting areas for continuous skill growth.`
    );
  }

  if (missingRequiredCapabilities.length > 0) {
    detailedCaveats.push(
      `Missing Requirements: This role explicitly requests ${missingRequiredCapabilities.length} requirement not represented on your profile (${missingRequiredCapabilities.slice(0, 2).join(', ')}${missingRequiredCapabilities.length > 2 ? ', etc.' : ''}).`
    );
  }

  if (interestOverlaps.length > 0 && !isHobbyFit) {
    detailedCaveats.push(
      `Creative Alignment: Touches upon your creative passion in ${interestOverlaps.join(', ')}. Note: Creative interests are noted for cultural/domain affinity and do not substitute for formal work qualifications.`
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
    isPrimaryFit,
    isAdjacentFit,
    isHobbyFit,
    isSkillBridgeFit,
    matchedHobbyName,
    matchedAdjacentRoleName,
  };
}
