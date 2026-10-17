import type { ReactNode } from 'react';
import { experiments, concepts } from '@/content/site';
import { projects } from '@/content/projects';
import type { ArtefactShape, Depth, Status, ToSupply } from '@/content/types';
import type { Target } from '@/experience/store';
import css from './primitives.module.css';

export const statusLabel: Record<Status, string> = {
    shipped: 'Shipped',
    'in-progress': 'In progress',
    prototype: 'Prototype',
    concept: 'Concept',
    unconfirmed: 'Status to confirm'
};

export const depthLabel: Record<Depth, string> = {
    practice: 'Practice',
    exploring: 'Exploring',
    interest: 'Interest',
    'to-confirm': 'Depth to confirm'
};

export function StatusTag({ status }: { status: Status }) {
    return (
        <span className={`mono ${css.tag}`} data-status={status}>
            {statusLabel[status]}
        </span>
    );
}

/** Visible marker for material that has to come from Anoof. Never styled to look finished. */
export function Pending({ need, children }: { need?: string; children?: ReactNode }) {
    return (
        <span className={css.pending}>
            <span className="mono">To supply</span> {children ?? need}
        </span>
    );
}

export function textOr(value: string | ToSupply) {
    return typeof value === 'string' ? value : <Pending need={value.need} />;
}

/** Words for the cursor label when a 3D object is hovered. */
export function labelFor(target: Target): { title: string; hint: string } | null {
    switch (target.kind) {
        case 'part':
            return {
                head: { title: 'Head — how I think', hint: 'Go inside' },
                hands: { title: 'Hands — what I’ve built', hint: 'See the work' },
                eyes: { title: 'Eyes — what I notice', hint: 'Look closer' }
            }[target.id] ?? null;
        case 'concept': {
            const c = concepts.find((x) => x.id === target.id);
            return c ? { title: c.title, hint: 'Open' } : null;
        }
        case 'project': {
            const p = projects.find((x) => x.slug === target.id);
            return p ? { title: p.title, hint: p.organisation } : null;
        }
        case 'experiment': {
            const e = experiments.find((x) => x.id === target.id);
            return e ? { title: e.title, hint: statusLabel[e.status] } : null;
        }
        default:
            return null;
    }
}

/** Flat drawings of the hand's miniature artefacts, so lists and pages share the 3D vocabulary. */
export function ArtefactIcon({ shape, size = 40 }: { shape: ArtefactShape; size?: number }) {
    const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinejoin: 'round' as const };
    return (
        <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className={css.icon}>
            {shape === 'window' && (
                <g {...common}>
                    <rect x="6" y="9" width="28" height="21" rx="2" />
                    <path d="M6 13h28" strokeWidth="3" />
                    <circle cx="20" cy="22" r="4.5" />
                    <path d="M15 34h10" />
                </g>
            )}
            {shape === 'documents' && (
                <g {...common}>
                    <path d="M8 26l12 6 12-6-12-6z" />
                    <path d="M8 21l12 6 12-6" />
                    <path d="M8 16l12 6 12-6-12-6z" />
                    <circle cx="27" cy="6" r="2.5" />
                </g>
            )}
            {shape === 'crates' && (
                <g {...common}>
                    <rect x="9" y="20" width="10" height="10" rx="1.5" />
                    <rect x="21" y="20" width="10" height="10" rx="1.5" />
                    <rect x="15" y="9" width="10" height="10" rx="1.5" />
                    <path d="M6 33h28" strokeWidth="3" />
                </g>
            )}
            {shape === 'tiffin' && (
                <g {...common}>
                    <rect x="11" y="13" width="18" height="6" rx="2" />
                    <rect x="11" y="20" width="18" height="6" rx="2" />
                    <rect x="11" y="27" width="18" height="6" rx="2" />
                    <path d="M15 13c0-6 10-6 10 0" />
                </g>
            )}
            {shape === 'speech' && (
                <g {...common}>
                    <rect x="7" y="9" width="26" height="17" rx="5" />
                    <path d="M13 26l-2 6 7-6" />
                    <circle cx="14" cy="17.5" r="1" fill="currentColor" />
                    <circle cx="20" cy="17.5" r="1" fill="currentColor" />
                    <circle cx="26" cy="17.5" r="1" fill="currentColor" />
                </g>
            )}
            {shape === 'tablet' && (
                <g {...common}>
                    <rect x="12" y="6" width="16" height="28" rx="3" />
                    <path d="M17 30h6" />
                </g>
            )}
        </svg>
    );
}
