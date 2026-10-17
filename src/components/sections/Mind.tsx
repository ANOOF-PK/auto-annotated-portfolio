import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import { concepts } from '@/content/site';
import { projects } from '@/content/projects';
import type { Concept, ConceptId } from '@/content/types';
import { experience, focusReturn, useExperience } from '@/experience/store';
import { depthLabel } from '../primitives';
import { linkHover, SceneSection, useEscape } from './shared';
import css from './sections.module.css';

export function Mind() {
    const selected = useExperience((s) => s.concept);
    const concept = concepts.find((c) => c.id === selected) ?? null;
    const close = useCallback(() => {
        experience.set({ concept: null });
        focusReturn.el?.focus();
        focusReturn.el = null;
    }, []);
    useEscape(Boolean(concept), close);

    return (
        <SceneSection id="mind" index="02" part="Head — Thinking" title="What goes into my thinking" side="left" art="mind">
            <p className={css.intro}>
                Four things I keep returning to. Each sits inside the head as an object; open one to see what it means to me, how
                deeply I have practised it, and where it shows up in the work.
            </p>
            <ol className={css.conceptList}>
                {concepts.map((c) => (
                    <li key={c.id}>
                        <button
                            type="button"
                            id={`concept-${c.id}`}
                            className={css.conceptButton}
                            aria-expanded={selected === c.id}
                            aria-controls="concept-detail"
                            {...linkHover({ kind: 'concept', id: c.id })}
                            onClick={(e) => {
                                focusReturn.el = e.currentTarget;
                                experience.set({ concept: selected === c.id ? null : c.id });
                            }}
                        >
                            <span className={`mono ${css.letter}`}>{c.index}</span>
                            <span className={css.conceptTitle}>{c.title}</span>
                            <span className={`mono ${css.depth}`} data-depth={c.depth}>
                                {depthLabel[c.depth]}
                            </span>
                        </button>
                    </li>
                ))}
            </ol>
            {concept && <ConceptDetail concept={concept} onClose={close} />}
        </SceneSection>
    );
}

function ConceptDetail({ concept, onClose }: { concept: Concept; onClose: () => void }) {
    const heading = useRef<HTMLHeadingElement>(null);
    const related = projects.filter((p) => p.themes.includes(concept.id));

    useEffect(() => {
        // Selected from the scene: remember the matching list button as the way back.
        if (!focusReturn.el) focusReturn.el = document.getElementById(`concept-${concept.id}`);
        heading.current?.focus({ preventScroll: true });
    }, [concept.id]);

    return (
        <div id="concept-detail" className={css.conceptDetail} data-concept={concept.id} role="region" aria-labelledby="concept-detail-title">
            <div className={css.detailHead}>
                <Motif id={concept.id} />
                <button type="button" className={`mono ${css.close}`} onClick={onClose}>
                    Close <span className="visually-hidden">{concept.title}</span>
                </button>
            </div>
            <h3 id="concept-detail-title" ref={heading} tabIndex={-1} className={css.detailTitle}>
                {concept.title}
            </h3>
            <p className={css.detailStatement}>{concept.statement}</p>
            <dl className={css.facts}>
                <div>
                    <dt className="mono">How deep</dt>
                    <dd>
                        <strong>{depthLabel[concept.depth]}.</strong> {concept.depthNote}
                    </dd>
                </div>
                <div>
                    <dt className="mono">In the head</dt>
                    <dd>{concept.metaphor}</dd>
                </div>
                <div>
                    <dt className="mono">Related work</dt>
                    <dd>
                        {related.length ? (
                            <ul className={css.inlineLinks}>
                                {related.map((p) => (
                                    <li key={p.slug}>
                                        <Link href={`/work/${p.slug}/`}>{p.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            'None linked yet.'
                        )}
                    </dd>
                </div>
            </dl>
        </div>
    );
}

/** Each concept gets its own small diagram — the flat twin of its 3D object. */
function Motif({ id }: { id: ConceptId }) {
    const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 };
    return (
        <svg className={css.motif} viewBox="0 0 160 64" aria-hidden="true">
            {id === 'accessibility' && (
                <g {...s}>
                    <circle cx="80" cy="32" r="14" />
                    <rect x="14" y="24" width="16" height="16" />
                    <path d="M136 40l8-16 8 16z" />
                    <circle cx="80" cy="6" r="4" />
                    <path d="M32 32h28M134 32h-40M80 10v8" strokeDasharray="3 3" />
                </g>
            )}
            {id === 'ai' && (
                <g {...s}>
                    {[
                        [30, 20],
                        [60, 48],
                        [96, 14],
                        [126, 44],
                        [80, 32]
                    ].map(([x, y]) => (
                        <circle key={`${x}${y}`} cx={x} cy={y} r="5" />
                    ))}
                    <path d="M30 20L80 32 60 48M96 14L80 32 126 44M30 20L60 48M96 14L126 44" />
                </g>
            )}
            {id === 'workflows' && (
                <g {...s}>
                    <rect x="10" y="20" width="28" height="24" rx="3" />
                    <rect x="66" y="20" width="28" height="24" rx="3" />
                    <rect x="122" y="20" width="28" height="24" rx="3" />
                    <path d="M38 32h28M94 32h28M60 28l6 4-6 4M116 28l6 4-6 4" />
                </g>
            )}
            {id === 'behaviour' && (
                <g {...s}>
                    <ellipse cx="80" cy="50" rx="56" ry="8" />
                    <ellipse cx="80" cy="32" rx="44" ry="7" />
                    <ellipse cx="80" cy="14" rx="32" ry="6" />
                    <path d="M36 50v-18M124 50v-18" strokeDasharray="2 3" />
                </g>
            )}
        </svg>
    );
}
