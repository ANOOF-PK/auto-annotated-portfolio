import Link from 'next/link';
import { journey, profile } from '@/content/site';
import { getProject } from '@/content/projects';
import { Pending } from '../primitives';
import { SceneSection } from './shared';
import css from './sections.module.css';

export function Journey() {
    return (
        <SceneSection id="journey" index="06" part="Journey — About" title="How I got here" side="left" art="bust">
            <p className={css.intro}>
                I’m {profile.name} — I go by {profile.nickname}. Design school, then a handful of very different contexts, each of which
                changed what I pay attention to. Not a ladder; a set of lenses.
            </p>
            <ol className={css.timeline}>
                {journey.map((stop) => (
                    <li key={stop.id} className={css.stop}>
                        <p className={`mono ${css.when}`}>{stop.when ?? <Pending>Dates</Pending>}</p>
                        <div>
                            <h3 className={css.place}>{stop.place}</h3>
                            <p className={css.stopRole}>{stop.role}</p>
                            <p className={css.shaped}>{stop.shaped ?? <Pending>What this shaped</Pending>}</p>
                            {stop.projects.length > 0 && (
                                <ul className={css.inlineLinks}>
                                    {stop.projects.map((slug) => {
                                        const p = getProject(slug);
                                        return p ? (
                                            <li key={slug}>
                                                <Link href={`/work/${slug}/`}>Case study: {p.title}</Link>
                                            </li>
                                        ) : null;
                                    })}
                                </ul>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </SceneSection>
    );
}
