import { contactLinks, profile } from '@/content/site';
import { Pending } from '../primitives';
import { SceneToggle } from '../SiteHeader';
import { StaticFigure } from '../StaticFigure';
import css from './sections.module.css';

export function Contact() {
    return (
        <section id="contact" className={`${css.section} ${css.contact}`} aria-labelledby="contact-title">
            <div className={css.contactArt}>
                <StaticFigure variant="bust" />
            </div>
            <div className={css.contactCopy} data-occlude>
                <p className={`mono ${css.kicker}`}>
                    <span>07</span> Outside — Contact
                </p>
                <h2 id="contact-title" className={css.contactTitle} tabIndex={-1} data-section-heading>
                    Have a product problem worth thinking about?
                </h2>
                <ul className={css.contactLinks}>
                    {contactLinks.map((l) => (
                        <li key={l.label}>
                            <span className="mono">{l.label}</span>
                            {l.href ? (
                                <a href={l.href} rel="noopener" target="_blank">
                                    {l.href.replace(/^https?:\/\//, '')}
                                    <span className="visually-hidden"> (opens in a new tab)</span>
                                </a>
                            ) : (
                                <Pending need={l.need} />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <footer className={css.footer} data-occlude>
                <p className="mono">© {profile.name} · 2026</p>
                <p>The character is an original procedural sculpture — a placeholder, not a likeness.</p>
                <SceneToggle />
            </footer>
        </section>
    );
}
