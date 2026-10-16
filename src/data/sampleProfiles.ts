import type { CandidateProfile } from '../types';

export interface SampleProfileOption {
  id: string;
  shortName: string;
  label: string;
  tagline: string;
  description: string;
  profile: CandidateProfile;
}

export const SAMPLE_PROFILES: SampleProfileOption[] = [
  {
    id: 'profile-maya-chen',
    shortName: 'Maya Chen',
    tagline: 'PM • Exploring ProdOps & Voiceover/Illustration',
    label: 'Maya Chen (Product Manager exploring Product Operations & Voice/Art)',
    description: 'Mid-level PM with strong PRD and discovery skills, looking to discover adjacent roles in ProdOps and Business Analysis, with passions in Voiceover and Technical Illustration.',
    profile: {
      id: 'profile-maya-chen',
      name: 'Maya Chen',
      titleHeadline: 'Associate PM transitioning into Product Operations & Creative Systems',
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
    id: 'profile-kiran-patel',
    shortName: 'Kiran Patel',
    tagline: 'ProdOps • Exploring Tech Coordination & Podcasting',
    label: 'Kiran Patel (Product Operations seeking Technical Coordination & Audio)',
    description: 'Operations specialist with deep process documentation and tool admin habits, exploring Technical Project Coordination and Implementation with creative interest in Podcast Production.',
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
  {
    id: 'profile-elena-rostova',
    shortName: 'Elena Rostova',
    tagline: 'Tech Coordinator • Exploring Scrum & Game Storyboarding',
    label: 'Elena Rostova (Technical Project Coordinator exploring Scrum & Game Design)',
    description: 'Project Coordinator skilled in engineering dependencies and sprint execution, looking into Scrum Master and ProdOps pivots, with creative passion in Game Design & Storyboarding.',
    profile: {
      id: 'profile-elena-rostova',
      name: 'Elena Rostova',
      titleHeadline: 'Technical Project Coordinator bridging engineering sprints and interactive media',
      primaryRole: 'Technical Project Coordinator',
      adjacentRoles: ['Scrum Master', 'Product Operations Specialist'],
      capabilities: [
        {
          id: 'cap-e1',
          label: 'Sprint Schedule Coordination',
          evidenceType: 'work',
          optionalContext: 'Orchestrated quarterly release gates across 14 distributed service squads',
        },
        {
          id: 'cap-e2',
          label: 'Issue & Dependency Tracking',
          evidenceType: 'work',
          optionalContext: 'Maintained critical-path dependency matrix in Linear for migration project',
        },
        {
          id: 'cap-e3',
          label: 'Technical Documentation',
          evidenceType: 'work',
          optionalContext: 'Drafted deployment checklists and rollback runbooks for DevOps pipelines',
        },
        {
          id: 'cap-e4',
          label: 'Risk Assessment & Mitigation',
          evidenceType: 'project',
          optionalContext: 'Led post-mortem RCA action tracking and vulnerability SLA enforcement',
        },
        {
          id: 'cap-e5',
          label: 'Cross-team Sync Facilitation',
          evidenceType: 'work',
          optionalContext: 'Chaired daily standups and bi-weekly release readiness syncs',
        },
        {
          id: 'cap-e6',
          label: 'Growth Experiment Design',
          evidenceType: 'learning',
          optionalContext: 'Studying user engagement loops and onboarding experimentation',
        },
      ],
      additionalInterests: [
        'Creative Writing & Storyboarding',
        'Game Design & Mechanics',
      ],
      workModePreference: 'Remote',
      seniorityLevel: 'Mid-Level',
      visibility: 'private-demo',
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 'profile-devon-miller',
    shortName: 'Devon Miller',
    tagline: 'Business Analyst • Exploring Solutions & Community',
    label: 'Devon Miller (Business Analyst exploring Solutions & Community Hosting)',
    description: 'Senior Business Analyst with rigorous process modeling and functional spec habits, seeking Solutions Consultant and Product Growth pivots, with passion in Community Building & Events.',
    profile: {
      id: 'profile-devon-miller',
      name: 'Devon Miller',
      titleHeadline: 'Business Analyst modeling high-throughput operational flows and ecosystems',
      primaryRole: 'Business Analyst',
      adjacentRoles: ['Solutions Consultant', 'Product Growth Specialist'],
      capabilities: [
        {
          id: 'cap-d1',
          label: 'Business Process Mapping',
          evidenceType: 'work',
          optionalContext: 'Modeled end-to-end multi-currency invoicing flow across 5 internal microservices',
        },
        {
          id: 'cap-d2',
          label: 'Requirements Gathering & Functional Specs',
          evidenceType: 'work',
          optionalContext: 'Authored 30+ functional requirement documents with state machine diagrams',
        },
        {
          id: 'cap-d3',
          label: 'Data Modeling & SQL Queries',
          evidenceType: 'work',
          optionalContext: 'Wrote complex CTE queries to reconcile payment discrepancies across DBs',
        },
        {
          id: 'cap-d4',
          label: 'Acceptance Criteria Definition',
          evidenceType: 'work',
          optionalContext: 'Defined Gherkin BDD test scenarios for automated QA pipelines',
        },
        {
          id: 'cap-d5',
          label: 'Client Onboarding Architecture',
          evidenceType: 'project',
          optionalContext: 'Designed interactive onboarding playground for pilot enterprise partners',
        },
        {
          id: 'cap-d6',
          label: 'API & Webhook Troubleshooting',
          evidenceType: 'learning',
          optionalContext: 'Learning Postman collection scripting and webhook signature verification',
        },
      ],
      additionalInterests: [
        'Community Building & Event Hosting',
        'Technical Illustration & Diagrams',
      ],
      workModePreference: 'Hybrid',
      seniorityLevel: 'Senior',
      visibility: 'private-demo',
      updatedAt: new Date().toISOString(),
    },
  },
];
