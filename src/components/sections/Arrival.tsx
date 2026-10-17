import { goToSection, SectionId } from '@/experience/store';
import { profile } from '@/content/site';
import { StaticFigure } from '../StaticFigure';
import { linkHover } from './shared';
import css from './sections.module.css';

const BODY_INDEX: { part: string; partId: string; label: string; to: SectionId }[] = [
    { part: 'Head', partId: 'head', label: 'How I think', to: 'mind' },
    { part: 'Hands', partId: 'hands', label: 'What I’ve built', to: 'work' },
    { part: 'Eyes', partId: 'eyes', label: 'What I notice', to: 'observations' }
];

export function Arrival() {
    return (
        <section id="arrival" className={`${css.section} ${css.arrival}`} aria-labelledby="arrival-title">
            <p className={`mono ${css.arrivalKicker}`} data-occlude>
                Inside / Outside — a portfolio you explore through a body
            </p>
            <h1 id="arrival-title" className={css.mast} tabIndex={-1} data-section-heading>
                <span>Anoof</span> <span>P K</span>
                <span className="visually-hidden">, {profile.profession}</span>
            </h1>
            <div className={css.arrivalArt}>
                <StaticFigure variant="bust" />
            </div>
            <div className={css.lead} data-occlude>
                <p className={`mono ${css.role}`}>
                    {profile.profession} · {profile.education}
                </p>
                <p className={css.statement}>{profile.statement}</p>
                <p className={css.focus}>{profile.focus}</p>
                <div className={css.actions}>
                    <a
                        className={css.primary}
                        href="#work"
                        onClick={(e) => {
                            e.preventDefault();
                            goToSection('work');
                        }}
                    >
                        See selected work
                    </a>
                    <a
                        className={css.secondary}
                        href="#mind"
                        onClick={(e) => {
                            e.preventDefault();
                            goToSection('mind');
                        }}
                    >
                        Start inside the head
                    </a>
                </div>
            </div>
            <nav className={css.bodyIndex} aria-label="The body is the index" data-occlude>
                <p className="mono">The body is the index</p>
                <ul>
                    {BODY_INDEX.map((item) => (
                        <li key={item.partId}>
                            <a
                                href={`#${item.to}`}
                                {...linkHover({ kind: 'part', id: item.partId })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToSection(item.to);
                                }}
                            >
                                <span className="mono">{item.part}</span>
                                <span>{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
                <p className={css.hint}>Point at the character, tap it, or scroll.</p>
            </nav>
        </section>
    );
}
