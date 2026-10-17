/** Lifecycle of a piece of work. Nothing is `shipped` without a stated source. */
export type Status = 'shipped' | 'in-progress' | 'prototype' | 'concept' | 'unconfirmed';

export type Kind = 'professional' | 'academic' | 'personal';

/** Something that must come from Anoof before it can be shown as fact. */
export interface ToSupply {
    status: 'to-supply';
    /** What material is needed, written for the person supplying it. */
    need: string;
}

export interface Documented {
    status: 'documented';
    body: string[];
    /** Where the claim comes from (brief, shipped link, research report…). */
    source: string;
}

export type CaseStudyPart = Documented | ToSupply;

export const CASE_STUDY_PARTS = [
    ['problem', 'The user and business problem'],
    ['constraints', 'Constraints and requirements'],
    ['research', 'Research and discovery'],
    ['exploration', 'Design exploration'],
    ['decisions', 'Key decisions and trade-offs'],
    ['solution', 'Final solution'],
    ['evidence', 'Testing, shipping or outcome evidence'],
    ['reflection', 'Reflection and lessons']
] as const;

export type CaseStudyPartKey = (typeof CASE_STUDY_PARTS)[number][0];

/** Which miniature artefact represents the project on the hand. */
export type ArtefactShape = 'window' | 'documents' | 'crates' | 'tiffin' | 'speech' | 'tablet';

export interface Project {
    slug: string;
    title: string;
    organisation: string;
    /** Confirmed timeline only, otherwise null. */
    timeline: string | null;
    role: string;
    kind: Kind;
    status: Status;
    /** Selected projects sit on the palm; supporting ones on the fingertips. */
    tier: 'selected' | 'supporting';
    /** One or two sentences, factual. */
    summary: string;
    /** How Anoof's contribution relates to the team's. */
    contribution: string | ToSupply;
    themes: ConceptId[];
    artefact: ArtefactShape;
    parts: Record<CaseStudyPartKey, CaseStudyPart>;
    assets: { src: string; alt: string; caption?: string }[];
}

export type ConceptId = 'accessibility' | 'ai' | 'workflows' | 'behaviour';

/** How Anoof relates to a topic — keeps interest distinct from experience. */
export type Depth = 'practice' | 'exploring' | 'interest' | 'to-confirm';

export interface Concept {
    id: ConceptId;
    index: string;
    title: string;
    /** Short statement in Anoof's voice. */
    statement: string;
    depth: Depth;
    depthNote: string;
    /** What the 3D object does, so the HTML can say it too. */
    metaphor: string;
}

export type EvidenceLevel = 'observed' | 'researched' | 'tested' | 'hypothesis';

export interface Observation {
    id: string;
    placeholder: boolean;
    title: string;
    observation: string;
    context: string;
    interpretation: string;
    improvement: string;
    evidence: EvidenceLevel | null;
}

export interface Experiment {
    id: string;
    title: string;
    status: Status;
    question: string;
    why: string | ToSupply;
    explored: string | ToSupply;
    working: string | ToSupply;
    next: string | ToSupply;
    shape: 'captions' | 'head';
}

export interface JourneyStop {
    id: string;
    place: string;
    role: string;
    when: string | null;
    /** What this context changed in how Anoof works; null until supplied. */
    shaped: string | null;
    projects: string[];
}

export interface Link {
    label: string;
    href: string | null;
    need?: string;
}
