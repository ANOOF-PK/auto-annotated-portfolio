import * as React from 'react';

import { Chapter } from '../primitives';

const WORKAROUNDS = [
    {
        title: 'Ask a colleague',
        text: 'Asking someone to repeat or translate interrupts the conversation for everyone.'
    },
    {
        title: 'Open a translation app',
        text: 'A second interface pulls attention away from the people you are talking with.'
    },
    { title: 'Turn on captions', text: 'Traditional captions transcribe speech in a language the user cannot read.' },
    {
        title: 'Wait for the transcript',
        text: 'Text that arrives late, flickers or keeps replacing itself is technically live but hard to follow.'
    }
];

const HERO_PRINCIPLES = [
    {
        n: '01',
        word: 'Stay present',
        text: 'Captions stay visible while the user keeps working in their meeting or other apps.'
    },
    {
        n: '02',
        word: 'Keep up',
        text: 'Text updates progressively and stays readable instead of flickering or replacing itself.'
    },
    {
        n: '03',
        word: 'Show one language',
        text: 'English-first: spoken English is preserved and Hindi is translated into English.'
    }
];

const RULEBOOK = [
    { k: 'Follow the conversation', v: 'Captions appear close enough to speech to preserve context.' },
    { k: 'One readable output', v: 'Never make the user read Hindi first and wait for it to be replaced.' },
    { k: 'Stable text', v: 'Partial captions update in place; confirmed lines settle.' },
    { k: 'Low interruption', v: 'The overlay never steals keyboard focus.' },
    { k: 'Visible control', v: 'Always know the mic is on, and stop it in one action.' },
    { k: 'Honest status', v: 'Listening, paused, stopped or error, never ambiguous.' },
    { k: 'Privacy by design', v: 'On-device preferred; any cloud step explicit and documented.' },
    { k: 'Evidence over polish', v: 'Accuracy, latency and recovery before decorative motion.' }
];

export function Workarounds() {
    return (
        <Chapter id="workarounds" index="02" label="Why workarounds fall short">
            <div className="n-wrap">
                <h2 className="n-h2 n-h2--wide" data-reveal>
                    Every existing fix asks you to <em>leave the conversation</em> to understand it.
                </h2>
                <div className="n-cards">
                    {WORKAROUNDS.map((w, i) => (
                        <article
                            key={w.title}
                            className="n-card"
                            data-reveal
                            style={{ '--d': i } as React.CSSProperties}
                        >
                            <span className="n-card__n n-display">{String(i + 1).padStart(2, '0')}</span>
                            <h3 className="n-card__title">{w.title}</h3>
                            <p className="n-card__text">{w.text}</p>
                            <span className="n-card__x" aria-hidden>
                                ×
                            </span>
                        </article>
                    ))}
                </div>
                <p className="n-note" data-reveal>
                    These are problem hypotheses from my own experience. How common and how severe they are still needs
                    validating with other people.
                </p>
            </div>
        </Chapter>
    );
}

export function Principles() {
    return (
        <Chapter id="principles" index="03" label="Design principles">
            <div className="n-wrap">
                <p className="n-kicker-lg" data-reveal>
                    The product challenge: make translated speech feel like <em>part of the conversation,</em> not a
                    separate task.
                </p>
                <ol className="n-principles">
                    {HERO_PRINCIPLES.map((p) => (
                        <li key={p.n} className="n-principle" data-reveal>
                            <span className="n-principle__n">{p.n}</span>
                            <span className="n-principle__word n-display">{p.word}</span>
                            <span className="n-principle__text">{p.text}</span>
                        </li>
                    ))}
                </ol>
                <div className="n-rulebook">
                    <h3 className="n-label" data-reveal>
                        The full rulebook
                    </h3>
                    <dl className="n-rulebook__grid">
                        {RULEBOOK.map((r, i) => (
                            <div key={r.k} data-reveal style={{ '--d': i % 4 } as React.CSSProperties}>
                                <dt>{r.k}</dt>
                                <dd>{r.v}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </Chapter>
    );
}
