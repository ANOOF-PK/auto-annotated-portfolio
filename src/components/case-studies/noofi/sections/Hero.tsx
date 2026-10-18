import * as React from 'react';

import CaptionPanel from '../CaptionPanel';
import DesktopScene from '../DesktopScene';
import { MediaSlot } from '../primitives';

const META = [
    { k: 'Role', v: 'Product design + AI prototyping' },
    { k: 'Status', v: 'Working prototype; testing in progress' },
    { k: 'Platform', v: 'macOS first' },
    { k: 'Scope', v: 'Live speech capture and Hindi → English captions' }
];

// The five beats of the 40-second hero film (from the film plan).
const BEATS = [
    { t: '0:00', w: 15, title: 'The moment', line: 'The meeting is in English. Until it isn’t.' },
    { t: '0:06', w: 15, title: 'The intervention', line: 'Follow the conversation.' },
    { t: '0:12', w: 27.5, title: 'Product demo', line: 'English stays English · Hindi → English' },
    { t: '0:23', w: 22.5, title: 'Design evolution', line: 'It was keeping up.' },
    { t: '0:32', w: 20, title: 'Future direction', line: 'Easier to follow.' }
];

export default function Hero() {
    return (
        <header className="n-hero" id="top">
            <div className="n-hero__glow" aria-hidden />
            <div className="n-wrap">
                <div className="n-hero__kicker" data-reveal>
                    <span>Case study</span>
                    <span className="n-dot" />
                    <span>2026</span>
                    <span className="n-dot" />
                    <span>Personal product experiment</span>
                </div>
                <h1 className="n-hero__title">
                    <span className="n-display n-hero__word" data-reveal>
                        NooFi
                    </span>
                    <span
                        className="n-display n-hero__word n-hero__word--indent"
                        data-reveal
                        style={{ '--d': 1 } as React.CSSProperties}
                    >
                        Speaks
                        <span className="n-hero__mic" aria-hidden />
                    </span>
                </h1>
                <div className="n-hero__intro">
                    <p className="n-lede" data-reveal style={{ '--d': 2 } as React.CSSProperties}>
                        Helping people follow conversations <em>across language barriers.</em>
                    </p>
                    <p className="n-body n-mute" data-reveal style={{ '--d': 3 } as React.CSSProperties}>
                        A macOS caption overlay that turns nearby speech into readable English. Spoken English stays
                        English, and Hindi is translated, so mixed-language office conversations stay easy to follow.
                    </p>
                </div>
            </div>

            <div className="n-wrap n-wrap--wide n-hero__stage">
                <MediaSlot label="Hero film" duration="0:40">
                    <DesktopScene>
                        <CaptionPanel compact interactive={false} visibleLines={3} />
                    </DesktopScene>
                </MediaSlot>
                <ol className="n-beats" aria-label="Hero film storyboard" data-reveal>
                    {BEATS.map((b, i) => (
                        <li key={b.t} style={{ flexGrow: b.w, '--d': i } as React.CSSProperties}>
                            <span className="n-beats__bar" />
                            <span className="n-beats__t">{b.t}</span>
                            <span className="n-beats__title">{b.title}</span>
                            <span className="n-beats__line">{b.line}</span>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="n-wrap">
                <dl className="n-meta">
                    {META.map((m, i) => (
                        <div key={m.k} data-reveal style={{ '--d': i } as React.CSSProperties}>
                            <dt>{m.k}</dt>
                            <dd>{m.v}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </header>
    );
}
