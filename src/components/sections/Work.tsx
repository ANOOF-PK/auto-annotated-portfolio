import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import { projects } from '@/content/projects';
import type { Project } from '@/content/types';
import { experience, focusReturn, useExperience } from '@/experience/store';
import { ArtefactIcon, StatusTag, textOr } from '../primitives';
import { linkHover, SceneSection, useEscape } from './shared';
import css from './sections.module.css';

export function Work() {
    const selected = useExperience((s) => s.project);
    const project = projects.find((p) => p.slug === selected) ?? null;
    const close = useCallback(() => {
        experience.set({ project: null });
        const back = focusReturn.el;
        focusReturn.el = null;
        // The list re-renders when the preview closes; focus once it exists again.
        requestAnimationFrame(() => (back?.isConnected ? back : document.getElementById(`project-${selected}`))?.focus());
    }, [selected]);
    useEscape(Boolean(project), close);

    return (
        <SceneSection id="work" index="03" part="Hands — Work" title="What my hands have built" side="right" art="hand">
            {project ? (
                <ProjectPreview project={project} onClose={close} />
            ) : (
                <>
                    <p className={css.intro}>
                        Selected work stands on the palm; supporting work rests on the fingertips. Every entry says whether it shipped
                        or is still to be confirmed.
                    </p>
                    <ProjectList title="Selected" items={projects.filter((p) => p.tier === 'selected')} />
                    <ProjectList title="Supporting" items={projects.filter((p) => p.tier === 'supporting')} compact />
                </>
            )}
        </SceneSection>
    );
}

function ProjectList({ title, items, compact = false }: { title: string; items: Project[]; compact?: boolean }) {
    return (
        <div className={css.projectGroup}>
            <h3 className={`mono ${css.groupTitle}`}>{title}</h3>
            <ul className={css.projectList} data-compact={compact}>
                {items.map((p) => (
                    <li key={p.slug} className={css.projectRow}>
                        <button
                            type="button"
                            id={`project-${p.slug}`}
                            className={css.projectButton}
                            {...linkHover({ kind: 'project', id: p.slug })}
                            onClick={(e) => {
                                focusReturn.el = e.currentTarget;
                                experience.set({ project: p.slug, hover: null });
                            }}
                        >
                            <ArtefactIcon shape={p.artefact} size={compact ? 28 : 36} />
                            <span className={css.projectText}>
                                <span className={css.projectTitle}>{p.title}</span>
                                <span className={css.projectMeta}>
                                    {p.organisation}
                                    {p.timeline ? ` · ${p.timeline}` : ''}
                                </span>
                            </span>
                            <StatusTag status={p.status} />
                        </button>
                        <Link className={css.direct} href={`/work/${p.slug}/`}>
                            <span aria-hidden="true">↗</span>
                            <span className="visually-hidden">Case study: {p.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ProjectPreview({ project, onClose }: { project: Project; onClose: () => void }) {
    const heading = useRef<HTMLHeadingElement>(null);
    const i = projects.indexOf(project);
    const next = projects[(i + 1) % projects.length];

    useEffect(() => {
        heading.current?.focus({ preventScroll: true });
    }, [project.slug]);

    return (
        <div id="project-preview" className={css.preview} role="region" aria-labelledby="project-preview-title">
            <div className={css.previewBar}>
                <button type="button" className={`mono ${css.close}`} onClick={onClose}>
                    ← All work
                </button>
                <button type="button" className={`mono ${css.close}`} onClick={() => experience.set({ project: next.slug })}>
                    Next: {next.title}
                </button>
            </div>
            <p className={`mono ${css.previewOrg}`}>{project.organisation}</p>
            <h3 id="project-preview-title" ref={heading} tabIndex={-1} className={css.previewTitle}>
                {project.title}
            </h3>
            <dl className={css.metaGrid}>
                <div>
                    <dt className="mono">Timeline</dt>
                    <dd>{project.timeline ?? textOr({ status: 'to-supply', need: 'Dates' })}</dd>
                </div>
                <div>
                    <dt className="mono">Role</dt>
                    <dd>{project.role}</dd>
                </div>
                <div>
                    <dt className="mono">Status</dt>
                    <dd>
                        <StatusTag status={project.status} />
                    </dd>
                </div>
            </dl>
            <p className={css.previewSummary}>{project.summary}</p>
            <p className={css.previewContribution}>
                <span className="mono">My part</span> {textOr(project.contribution)}
            </p>
            <Link className={css.primary} href={`/work/${project.slug}/`}>
                Open case study
            </Link>
        </div>
    );
}
