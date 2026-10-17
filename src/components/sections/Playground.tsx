import { experiments } from '@/content/site';
import { StatusTag, textOr } from '../primitives';
import { linkHover, SceneSection } from './shared';
import css from './sections.module.css';

export function Playground() {
    return (
        <SceneSection id="playground" index="05" part="Studio — Experiments" title="What I’m curious enough to build next" side="left" art="studio" tone="lime">
            <p className={css.intro}>
                Unfinished on purpose. These are questions with something built around them — not products. Each says how far it has
                got.
            </p>
            <div className={css.experiments}>
                {experiments.map((e) => (
                    <article
                        key={e.id}
                        id={`experiment-${e.id}`}
                        className={css.experiment}
                        tabIndex={-1}
                        aria-labelledby={`experiment-${e.id}-title`}
                        {...linkHover({ kind: 'experiment', id: e.id })}
                    >
                        <div className={css.experimentHead}>
                            <h3 id={`experiment-${e.id}-title`}>{e.title}</h3>
                            <StatusTag status={e.status} />
                        </div>
                        <p className={css.question}>{e.question}</p>
                        <dl className={css.facts}>
                            <div>
                                <dt className="mono">Why it interests me</dt>
                                <dd>{textOr(e.why)}</dd>
                            </div>
                            <div>
                                <dt className="mono">Explored so far</dt>
                                <dd>{textOr(e.explored)}</dd>
                            </div>
                            <div>
                                <dt className="mono">Working / not working</dt>
                                <dd>{textOr(e.working)}</dd>
                            </div>
                            <div>
                                <dt className="mono">Next question</dt>
                                <dd>{textOr(e.next)}</dd>
                            </div>
                        </dl>
                    </article>
                ))}
            </div>
        </SceneSection>
    );
}
