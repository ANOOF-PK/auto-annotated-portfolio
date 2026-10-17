import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getProject, projects } from '@/content/projects';
import { CASE_STUDY_PARTS, Documented } from '@/content/types';
import { ArtefactIcon, Pending, StatusTag, textOr } from '@/components/primitives';
import css from '@/components/CaseStudy.module.css';

const kindLabel = { professional: 'Professional work', academic: 'Academic work', personal: 'Personal work' };

/**
 * Case studies are reading pages: no 3D, strong hierarchy, and an honest ledger of
 * what is documented and what is still missing.
 */
export default function CaseStudy({ slug }: { slug: string }) {
    const project = getProject(slug)!;
    const i = projects.indexOf(project);
    const prev = projects[(i - 1 + projects.length) % projects.length];
    const next = projects[(i + 1) % projects.length];
    const documented = CASE_STUDY_PARTS.filter(([key]) => project.parts[key].status === 'documented');
    const missing = CASE_STUDY_PARTS.filter(([key]) => project.parts[key].status === 'to-supply');

    return (
        <>
            <Head>
                <title>{`${project.title} — ${project.organisation} · Anoof P K`}</title>
                <meta name="description" content={project.summary} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <header className={css.bar}>
                <Link href="/#work" className="mono">
                    ← Inside / Outside · Work
                </Link>
            </header>
            <main className={css.page}>
                <div className={css.hero}>
                    <ArtefactIcon shape={project.artefact} size={72} />
                    <p className={`mono ${css.org}`}>{project.organisation}</p>
                    <h1 className={css.title}>{project.title}</h1>
                    <p className={css.lead}>{project.summary}</p>
                </div>

                <dl className={css.meta}>
                    <div>
                        <dt className="mono">Timeline</dt>
                        <dd>{project.timeline ?? <Pending>Dates</Pending>}</dd>
                    </div>
                    <div>
                        <dt className="mono">Role</dt>
                        <dd>{project.role}</dd>
                    </div>
                    <div>
                        <dt className="mono">Type</dt>
                        <dd>{kindLabel[project.kind]}</dd>
                    </div>
                    <div>
                        <dt className="mono">Status</dt>
                        <dd>
                            <StatusTag status={project.status} />
                        </dd>
                    </div>
                </dl>

                <section className={css.contribution} aria-labelledby="contribution">
                    <h2 id="contribution" className="mono">
                        My part, and the team’s
                    </h2>
                    <p>{textOr(project.contribution)}</p>
                </section>

                {documented.map(([key, label]) => {
                    const part = project.parts[key] as Documented;
                    return (
                        <section key={key} className={css.part} aria-labelledby={key}>
                            <h2 id={key}>{label}</h2>
                            {part.body.map((para, n) => (
                                <p key={n}>{para}</p>
                            ))}
                            <p className={`mono ${css.source}`}>Source: {part.source}</p>
                        </section>
                    );
                })}

                {project.assets.length > 0 && (
                    <section className={css.part} aria-labelledby="assets">
                        <h2 id="assets">Artefacts</h2>
                        {project.assets.map((a) => (
                            <figure key={a.src}>
                                <img src={a.src} alt={a.alt} loading="lazy" />
                                {a.caption && <figcaption>{a.caption}</figcaption>}
                            </figure>
                        ))}
                    </section>
                )}

                {missing.length > 0 && (
                    <section className={css.ledger} aria-labelledby="ledger">
                        <h2 id="ledger">Not yet documented</h2>
                        <p>
                            This case study is being written. Rather than fill these sections with guesses, they are listed with what
                            they need.
                        </p>
                        <ul>
                            {missing.map(([key, label]) => {
                                const part = project.parts[key];
                                return (
                                    <li key={key}>
                                        <strong>{label}</strong>
                                        <span>{part.status === 'to-supply' ? part.need : ''}</span>
                                    </li>
                                );
                            })}
                            {project.assets.length === 0 && (
                                <li>
                                    <strong>Screens and artefacts</strong>
                                    <span>Real screenshots or prototypes you are permitted to show. None are mocked up here.</span>
                                </li>
                            )}
                        </ul>
                    </section>
                )}

                <nav className={css.pager} aria-label="More work">
                    <Link href={`/work/${prev.slug}/`}>
                        <span className="mono">Previous</span>
                        {prev.title}
                    </Link>
                    <Link href={`/work/${next.slug}/`}>
                        <span className="mono">Next</span>
                        {next.title}
                    </Link>
                </nav>
            </main>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: projects.map((p) => ({ params: { slug: p.slug } })),
    fallback: false
});

export const getStaticProps: GetStaticProps = async ({ params }) => ({
    props: { slug: params?.slug as string }
});
