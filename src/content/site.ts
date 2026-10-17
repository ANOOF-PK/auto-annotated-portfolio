import { Concept, Experiment, JourneyStop, Link, Observation } from './types';

export const profile = {
    name: 'Anoof P K',
    nickname: 'Noofi',
    profession: 'Product Designer',
    education: 'B.Des, IDC School of Design, IIT Bombay — 2025',
    statement: 'I design products for people navigating complex worlds.',
    /** Interests named in the brief; phrased as interests, not expertise. */
    focus: 'Accessibility, AI interfaces, B2B workflows and operational tools.'
};

export const contactLinks: Link[] = [
    { label: 'Email', href: null, need: 'Public contact address' },
    { label: 'LinkedIn', href: null, need: 'LinkedIn profile URL' },
    { label: 'Behance', href: 'https://www.behance.net/anoofpk' },
    { label: 'Previous portfolio', href: 'https://anoofpk.framer.website' },
    { label: 'Résumé', href: null, need: 'Résumé PDF' }
];

export const concepts: Concept[] = [
    {
        id: 'accessibility',
        index: 'A',
        title: 'Accessibility & inclusion',
        statement: 'A product should reshape itself around how someone can act — keyboard, voice, pointer, attention.',
        depth: 'practice',
        depthNote: 'Practised with the Windows Accessibility team and in ArticulateMe.',
        metaphor: 'A form with three different inputs docking into it.'
    },
    {
        id: 'ai',
        index: 'B',
        title: 'AI & emerging interfaces',
        statement: 'The interesting design work is in what a system shows, admits and lets you correct.',
        depth: 'practice',
        depthNote: 'Practised on Microsoft 365 Copilot; explored further in NooFi Speaks.',
        metaphor: 'A small network that rearranges itself.'
    },
    {
        id: 'workflows',
        index: 'C',
        title: 'B2B & complex workflows',
        statement: 'Sellers, field teams and operators work in systems with real stakes. Clarity is the feature.',
        depth: 'practice',
        depthNote: 'Practised at Blinkit (Seller Hub) and Feeding India (operations).',
        metaphor: 'Scattered steps that line up into a flow.'
    },
    {
        id: 'behaviour',
        index: 'D',
        title: 'Human behaviour & research',
        statement: 'What people do, and the workarounds they invent, says more than what they report.',
        depth: 'to-confirm',
        depthNote: 'How this shows up in your work — methods, studies — is still to be supplied.',
        metaphor: 'Layers that separate to show what sits underneath.'
    }
];

const PLACEHOLDER = 'To supply: a real example.';

export const observations: Observation[] = [1, 2, 3].map((n) => ({
    id: `observation-${n}`,
    placeholder: true,
    title: `Observation ${String(n).padStart(2, '0')}`,
    observation: PLACEHOLDER,
    context: 'Where it happens and who it affects.',
    interpretation: 'Why it might matter.',
    improvement: 'What you would explore.',
    evidence: null
}));

export const experiments: Experiment[] = [
    {
        id: 'noofi-speaks',
        title: 'NooFi Speaks',
        status: 'concept',
        question: 'Can live captions do more than transcribe — help someone follow, catch up and take part in a meeting?',
        why: { status: 'to-supply', need: 'What drew you to this problem.' },
        explored: { status: 'to-supply', need: 'Sketches, flows or prototypes made so far.' },
        working: { status: 'to-supply', need: 'What is promising and what is not.' },
        next: { status: 'to-supply', need: 'The next question you want to test.' },
        shape: 'captions'
    },
    {
        id: 'inside-outside',
        title: 'INSIDE / OUTSIDE',
        status: 'prototype',
        question: 'Can a portfolio be explored through a body — and still get a recruiter to a case study in one click?',
        why: 'A static biography flattens how a designer thinks. A body gives each part of the practice a place.',
        explored:
            'A procedural sculpted bust in real-time 3D whose head, hands and eyes are navigation, with a full HTML equivalent for every interaction.',
        working:
            'The mapping reads quickly and every scene has an accessible path. The character is still a placeholder, not a likeness.',
        next: 'Replace the placeholder with a modelled character, and test discovery time with recruiters.',
        shape: 'head'
    }
];

export const journey: JourneyStop[] = [
    {
        id: 'idc',
        place: 'IDC School of Design, IIT Bombay',
        role: 'B.Des',
        when: 'Graduated 2025',
        shaped: 'Design education; graduation project carried out with Microsoft Windows Accessibility.',
        projects: []
    },
    {
        id: 'microsoft-copilot',
        place: 'Microsoft — Microsoft 365 Copilot',
        role: 'Product design intern',
        when: '2024',
        shaped: 'AI-powered product experiences.',
        projects: ['microsoft-365-copilot']
    },
    {
        id: 'microsoft-a11y',
        place: 'Microsoft — Windows Accessibility',
        role: 'Product design intern, graduation project',
        when: 'Jan – Jul 2025',
        shaped: 'Accessibility and inclusive design at platform scale.',
        projects: ['windows-accessibility-focus-mode']
    },
    {
        id: 'blinkit',
        place: 'Blinkit',
        role: 'Product designer (contract / internship)',
        when: '2026',
        shaped: 'B2B seller workflows in a supply chain.',
        projects: ['blinkit-seller-hub']
    },
    {
        id: 'feeding-india',
        place: 'Feeding India, part of Eternal',
        role: 'Product designer',
        when: 'Jul 2026 – present',
        shaped: 'Operational tools for real-world service delivery.',
        projects: ['feeding-india-operations']
    },
    {
        id: 'seidor',
        place: 'Seidor Opentrends',
        role: 'Interaction design intern',
        when: null,
        shaped: null,
        projects: ['seidor-opentrends']
    }
];
