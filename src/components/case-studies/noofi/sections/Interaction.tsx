import * as React from 'react';
import { useCallback, useState } from 'react';

import CaptionPanel, { PanelStatus } from '../CaptionPanel';
import DesktopScene from '../DesktopScene';
import { Chapter, Tag } from '../primitives';

const STEPS = [
    {
        n: '01',
        title: 'Start listening',
        text: 'The user starts the microphone themselves and can always see that it is on.'
    },
    {
        n: '02',
        title: 'Capture speech',
        text: 'The app listens to the room through the Mac microphone. Silence produces no invented text.'
    },
    {
        n: '03',
        title: 'Show English',
        text: 'English speech is kept as it is. Hindi arrives already in English, never as Hindi first.'
    },
    {
        n: '04',
        title: 'Follow along',
        text: 'Recent lines stay in view and older lines fade back instead of piling up into a transcript.'
    }
];

const STATES = [
    { k: 'Idle', signal: 'Mic off · Start', tone: 'ghost' },
    { k: 'Permission needed', signal: 'Explains the setting, offers retry', tone: 'ghost' },
    { k: 'Listening', signal: 'Persistent mic indicator', tone: 'amber' },
    { k: 'Caption updating', signal: 'Partial line style, may revise', tone: 'default' },
    { k: 'Caption committed', signal: 'Stable line, stays put', tone: 'default' },
    { k: 'Paused', signal: 'Label + resume control', tone: 'ghost' },
    { k: 'Stopped', signal: 'Mic off, session reviewable', tone: 'ghost' },
    { k: 'Error', signal: 'Plain text + recovery action', tone: 'hi' }
] as const;

export default function Interaction() {
    const [step, setStep] = useState(0);

    const onProgress = useCallback(
        ({ status, committed, partial }: { status: PanelStatus; committed: number; partial: boolean }) => {
            if (status !== 'listening') setStep(0);
            else if (committed === 0 && !partial) setStep(0);
            else if (committed < 1) setStep(1);
            else if (committed < 3) setStep(2);
            else setStep(3);
        },
        []
    );

    return (
        <Chapter id="interaction" index="04" label="The interaction" className="n-chapter--stage">
            <div className="n-wrap">
                <h2 className="n-h2 n-h2--wide" data-reveal>
                    One small window. <em>One readable language.</em>
                </h2>
            </div>
            <div className="n-wrap n-wrap--wide n-interaction">
                <ol className="n-steps">
                    {STEPS.map((s, i) => (
                        <li
                            key={s.n}
                            className={`n-step ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}
                        >
                            <span className="n-step__n">{s.n}</span>
                            <div>
                                <h3 className="n-step__title">{s.title}</h3>
                                <p className="n-step__text">{s.text}</p>
                            </div>
                        </li>
                    ))}
                </ol>
                <div className="n-interaction__stage" data-reveal>
                    <DesktopScene>
                        <CaptionPanel onProgress={onProgress} />
                    </DesktopScene>
                    <div className="n-legend">
                        <Tag>EN</Tag> English, kept as spoken
                        <Tag tone="hi">HI → EN</Tag> Hindi, shown only in English
                        <span className="n-legend__partial">Italic</span> partial line, may still revise
                    </div>
                </div>
            </div>

            <div className="n-wrap">
                <div className="n-states">
                    <h3 className="n-label" data-reveal>
                        Every state, designed
                    </h3>
                    <ul className="n-states__grid">
                        {STATES.map((s, i) => (
                            <li
                                key={s.k}
                                className={`n-state n-state--${s.tone}`}
                                data-reveal
                                style={{ '--d': i % 4 } as React.CSSProperties}
                            >
                                <span className="n-state__glyph" aria-hidden />
                                <span className="n-state__k">{s.k}</span>
                                <span className="n-state__v">{s.signal}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="n-note" data-reveal>
                        Status never relies on colour alone. Every state has a word for it: “Listening”, “Paused”,
                        “Microphone access needed”.
                    </p>
                </div>
            </div>
        </Chapter>
    );
}
