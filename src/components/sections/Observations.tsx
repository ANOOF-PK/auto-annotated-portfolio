import { useCallback } from 'react';
import { observations } from '@/content/site';
import type { EvidenceLevel, Observation } from '@/content/types';
import { experience, useExperience } from '@/experience/store';
import { Pending } from '../primitives';
import { SceneSection, useEscape } from './shared';
import css from './sections.module.css';

const evidenceLabel: Record<EvidenceLevel, string> = {
    observed: 'Observed directly',
    researched: 'Researched',
    tested: 'Tested',
    hypothesis: 'Hypothesis — not yet tested'
};

const FIELDS: { key: keyof Observation; label: string; question: string }[] = [
    { key: 'observation', label: 'Observation', question: 'What did I notice?' },
    { key: 'context', label: 'Context', question: 'Where does this happen, and who might be affected?' },
    { key: 'interpretation', label: 'Interpretation', question: 'Why might this matter?' },
    { key: 'improvement', label: 'Possible improvement', question: 'What would I explore?' }
];

export function Observations() {
    const selected = useExperience((s) => s.observation);
    const close = useCallback(() => experience.set({ observation: null }), []);
    useEscape(Boolean(selected), close);
    const hasReal = observations.some((o) => !o.placeholder);

    return (
        <SceneSection id="observations" index="04" part="Eyes — Observations" title="What I notice that others might miss" side="left" art="eye" tone="coral">
            <p className={css.intro}>
                Small things in real products and places — a barrier, a workaround, a pattern — and what I make of them. Every entry
                states its evidence first, so a hunch never reads as a finding.
            </p>
            {!hasReal && (
                <p className={css.notice}>
                    <Pending>Real observations. Below is the format each one will use.</Pending>
                </p>
            )}
            <ul className={css.observationList}>
                {observations.map((o) => {
                    const open = selected === o.id;
                    return (
                        <li key={o.id} className={css.observation} data-open={open}>
                            <button
                                type="button"
                                className={css.observationButton}
                                aria-expanded={open}
                                aria-controls={`${o.id}-body`}
                                onClick={() => experience.set({ observation: open ? null : o.id })}
                            >
                                <span className={`mono ${css.letter}`}>{o.title}</span>
                                <span className={css.observationTitle}>{o.placeholder ? 'Awaiting an observation' : o.observation}</span>
                                <span className={`mono ${css.evidence}`}>{o.evidence ? evidenceLabel[o.evidence] : 'Evidence: to state'}</span>
                            </button>
                            <dl id={`${o.id}-body`} className={css.observationBody} hidden={!open}>
                                <div>
                                    <dt className="mono">Evidence</dt>
                                    <dd>{o.evidence ? evidenceLabel[o.evidence] : <Pending>Observed, researched, tested or hypothesis?</Pending>}</dd>
                                </div>
                                {FIELDS.map((f) => (
                                    <div key={f.key}>
                                        <dt className="mono">{f.label}</dt>
                                        <dd>{o.placeholder ? <Pending>{f.question}</Pending> : (o[f.key] as string)}</dd>
                                    </div>
                                ))}
                            </dl>
                        </li>
                    );
                })}
            </ul>
        </SceneSection>
    );
}
