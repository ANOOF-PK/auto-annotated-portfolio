import { CaseStudyPart, CaseStudyPartKey, Project } from './types';

const BRIEF = 'Portfolio brief supplied by Anoof (2026)';

const supply = (need: string): CaseStudyPart => ({ status: 'to-supply', need });

/** Every part starts as an explicit gap; projects override only what is confirmed. */
function parts(overrides: Partial<Record<CaseStudyPartKey, CaseStudyPart>> = {}): Record<CaseStudyPartKey, CaseStudyPart> {
    return {
        problem: supply('Who the users were, what was going wrong for them, and why it mattered to the business.'),
        constraints: supply('Platform, policy, timeline or confidentiality constraints that shaped the work.'),
        research: supply('What was studied, with whom and how — sample sizes only if real.'),
        exploration: supply('Directions explored, sketches or prototypes, and what was learned from each.'),
        decisions: supply('Two or three decisions you made, the alternatives, and the trade-off.'),
        solution: supply('The final design, with screens you are allowed to show.'),
        evidence: supply('Whether it shipped, was tested, or stayed a proposal — and the source for that.'),
        reflection: supply('What you would do differently and what it taught you.'),
        ...overrides
    };
}

export const projects: Project[] = [
    {
        slug: 'windows-accessibility-focus-mode',
        title: 'Windows Accessibility & Focus Mode',
        organisation: 'Microsoft — Windows Accessibility',
        timeline: 'January – July 2025',
        role: 'Product design intern; graduation project',
        kind: 'professional',
        status: 'unconfirmed',
        tier: 'selected',
        summary:
            'Exploration and design for Windows accessibility and Focus Mode, carried out with the Windows Accessibility team as an internship and B.Des graduation project.',
        contribution: {
            status: 'to-supply',
            need: 'Which parts you led, which you contributed to, and who you worked with.'
        },
        themes: ['accessibility', 'behaviour'],
        artefact: 'window',
        parts: parts({
            constraints: {
                status: 'documented',
                source: BRIEF,
                body: ['Carried out inside the Windows Accessibility team, and doubled as the B.Des graduation project at IDC School of Design, IIT Bombay.']
            }
        }),
        assets: []
    },
    {
        slug: 'microsoft-365-copilot',
        title: 'Microsoft 365 Copilot',
        organisation: 'Microsoft — Microsoft 365 Copilot',
        timeline: '2024',
        role: 'Product design intern',
        kind: 'professional',
        status: 'unconfirmed',
        tier: 'selected',
        summary: 'Product design internship with the Microsoft 365 Copilot team.',
        contribution: { status: 'to-supply', need: 'The problem area you worked on and your part in it.' },
        themes: ['ai'],
        artefact: 'documents',
        parts: parts(),
        assets: []
    },
    {
        slug: 'blinkit-seller-hub',
        title: 'Seller Hub',
        organisation: 'Blinkit — B2B supply',
        timeline: '2026',
        role: 'Product designer (contract / internship)',
        kind: 'professional',
        status: 'unconfirmed',
        tier: 'selected',
        summary:
            'Seller-facing product experiences in Blinkit’s B2B supply context: seller website content, Help & Support, Profile, discoverability, and inventory and replenishment workflows.',
        contribution:
            'Worked within the team on these areas; individual feature ownership varies and is not claimed here.',
        themes: ['workflows'],
        artefact: 'crates',
        parts: parts(),
        assets: []
    },
    {
        slug: 'feeding-india-operations',
        title: 'Anganwadi operations',
        organisation: 'Feeding India, part of Eternal',
        timeline: 'July 2026 – present',
        role: 'Product designer',
        kind: 'professional',
        status: 'in-progress',
        tier: 'selected',
        summary:
            'Operational tools for food distribution and Anganwadi workflows, including experiences around proof of delivery, centre information, attendance and coordination.',
        contribution: { status: 'to-supply', need: 'Confirm the scope of each piece before it is described in detail.' },
        themes: ['workflows', 'behaviour'],
        artefact: 'tiffin',
        parts: parts(),
        assets: []
    },
    {
        slug: 'articulateme',
        title: 'ArticulateMe',
        organisation: 'Context to confirm',
        timeline: null,
        role: 'To confirm',
        kind: 'academic',
        status: 'unconfirmed',
        tier: 'supporting',
        summary: 'A project about visual speech development therapy for deaf and hard-of-hearing children.',
        contribution: { status: 'to-supply', need: 'Whether this was academic, personal or client work, and your role.' },
        themes: ['accessibility', 'behaviour'],
        artefact: 'speech',
        parts: parts(),
        assets: []
    },
    {
        slug: 'seidor-opentrends',
        title: 'Seidor Opentrends',
        organisation: 'Seidor Opentrends',
        timeline: null,
        role: 'Interaction design intern',
        kind: 'professional',
        status: 'unconfirmed',
        tier: 'supporting',
        summary: 'Interaction design internship.',
        contribution: { status: 'to-supply', need: 'Dates, the product area and what you worked on.' },
        themes: [],
        artefact: 'tablet',
        parts: parts(),
        assets: []
    }
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
