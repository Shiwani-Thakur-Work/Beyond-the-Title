import type { CandidateProfile } from '../types';

export const SAMPLE_PROFILES: { label: string; description: string; profile: CandidateProfile }[] = [
  {
    label: 'Maya Chen (Product Manager exploring Product Operations & Analytics)',
    description: 'Mid-level PM with strong PRD and stakeholder skills, looking to discover adjacent roles in ProdOps and Business Analysis while learning SQL.',
    profile: {
      id: 'profile-maya-chen',
      name: 'Maya Chen',
      titleHeadline: 'Associate PM transitioning into Product Operations & Systems',
      primaryRole: 'Product Manager',
      adjacentRoles: ['Product Operations Specialist', 'Business Analyst'],
      capabilities: [
        {
          id: 'cap-1',
          label: 'Requirements Documentation (PRD)',
          evidenceType: 'work',
          optionalContext: 'Authored 12+ PRDs for consumer mobile onboarding redesign, reducing drop-off by 14%',
        },
        {
          id: 'cap-2',
          label: 'Stakeholder Management',
          evidenceType: 'work',
          optionalContext: 'Facilitated weekly alignment across engineering, compliance, and design teams',
        },
        {
          id: 'cap-3',
          label: 'Agile Sprint Planning',
          evidenceType: 'work',
          optionalContext: 'Ran bi-weekly sprint backlog refinement and retro sessions for 8 engineers',
        },
        {
          id: 'cap-4',
          label: 'User Research & Discovery',
          evidenceType: 'project',
          optionalContext: 'Conducted 20 in-depth usability interviews for a side-project productivity app',
        },
        {
          id: 'cap-5',
          label: 'Process Documentation & Standardization',
          evidenceType: 'project',
          optionalContext: 'Created a standardized intake RFC template adopted by 3 cross-functional squads',
        },
        {
          id: 'cap-6',
          label: 'Data Modeling & SQL Queries',
          evidenceType: 'learning',
          optionalContext: 'Currently completing advanced PostgreSQL course on Mode Analytics',
        },
        {
          id: 'cap-7',
          label: 'Product Analytics & KPI Tracking',
          evidenceType: 'learning',
          optionalContext: 'Hands-on practice tracking Mixpanel funnels and cohort retention curves',
        },
      ],
      additionalInterests: [
        'Voiceover & Audio Narration',
        'Technical Illustration & Diagrams',
      ],
      workModePreference: 'Remote',
      seniorityLevel: 'Mid-Level',
      visibility: 'private-demo',
      updatedAt: new Date().toISOString(),
    },
  },
  {
    label: 'Kiran Patel (Product Operations seeking Technical Coordination)',
    description: 'Operations specialist with deep process documentation and tool admin skills, exploring Technical Project Coordination.',
    profile: {
      id: 'profile-kiran-patel',
      name: 'Kiran Patel',
      titleHeadline: 'Product Operations Specialist with strong systems and release habits',
      primaryRole: 'Product Operations Specialist',
      adjacentRoles: ['Technical Project Coordinator', 'Implementation Specialist'],
      capabilities: [
        {
          id: 'cap-k1',
          label: 'Process Documentation & Standardization',
          evidenceType: 'work',
          optionalContext: 'Standardized release checklists across 4 engineering pods',
        },
        {
          id: 'cap-k2',
          label: 'Cross-team Communication Cadence',
          evidenceType: 'work',
          optionalContext: 'Authored bi-weekly company-wide release digests with 90%+ open rate',
        },
        {
          id: 'cap-k3',
          label: 'Product Tech Stack Administration',
          evidenceType: 'work',
          optionalContext: 'Administered Jira, Linear, and Productboard for 60 product staff',
        },
        {
          id: 'cap-k4',
          label: 'Sprint Schedule Coordination',
          evidenceType: 'project',
          optionalContext: 'Coordinated cross-team launch schedule for GDPR consent migration',
        },
        {
          id: 'cap-k5',
          label: 'Issue & Dependency Tracking',
          evidenceType: 'work',
          optionalContext: 'Managed dependency board across backend and frontend squads',
        },
        {
          id: 'cap-k6',
          label: 'Requirements Documentation (PRD)',
          evidenceType: 'learning',
          optionalContext: 'Studying functional specification drafting and acceptance criteria',
        },
      ],
      additionalInterests: [
        'Podcast Production & Interviewing',
        'Visual Design & Typography',
      ],
      workModePreference: 'Hybrid',
      seniorityLevel: 'Mid-Level',
      visibility: 'private-demo',
      updatedAt: new Date().toISOString(),
    },
  },
];
