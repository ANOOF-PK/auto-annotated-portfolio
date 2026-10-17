import css from './StaticFigure.module.css';

/*
 * Flat drawings of the same character for visitors without the 3D scene
 * (switched off, unsupported, failed or still loading). Same palette, same
 * proportions, same body-part story.
 */
const C = {
    bone: '#f4f0e8',
    plinth: '#e2dacb',
    ink: '#191919',
    knit: '#2a2826',
    clay: '#c4875f',
    clayDark: '#a96f4b',
    blue: '#3949ff',
    coral: '#ff765e',
    lime: '#d9ff45'
};

export type FigureVariant = 'bust' | 'mind' | 'hand' | 'eye' | 'studio';

export function StaticFigure({ variant, className = '' }: { variant: FigureVariant; className?: string }) {
    return (
        <div className={`${css.figure} ${className}`} data-variant={variant} aria-hidden="true">
            {variant === 'bust' && <Bust />}
            {variant === 'mind' && <Mind />}
            {variant === 'hand' && <Hand />}
            {variant === 'eye' && <Eye />}
            {variant === 'studio' && <Studio />}
        </div>
    );
}

function Face() {
    return (
        <g>
            <ellipse cx="200" cy="214" rx="72" ry="66" fill={C.clay} />
            <rect x="180" y="250" width="40" height="70" fill={C.clay} />
            <ellipse cx="200" cy="180" rx="78" ry="86" fill={C.clay} />
            <ellipse cx="124" cy="196" rx="9" ry="16" fill={C.clayDark} />
            <ellipse cx="276" cy="196" rx="9" ry="16" fill={C.clayDark} />
            <circle cx="172" cy="188" r="11" fill="#fbf8f2" />
            <circle cx="228" cy="188" r="11" fill="#fbf8f2" />
            <circle cx="173" cy="190" r="6" fill="#3a2a22" />
            <circle cx="229" cy="190" r="6" fill="#3a2a22" />
            <path d="M160 180 q12 -9 24 0 M216 180 q12 -9 24 0" stroke={C.clayDark} strokeWidth="5" fill="none" />
            <path d="M158 170 l26 -4 M216 166 l26 4" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
            <path d="M200 192 q-4 24 -10 30 q10 6 18 0" fill={C.clayDark} />
            <path d="M184 246 q16 12 32 0" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
    );
}

function Hair() {
    return (
        <g fill={C.ink}>
            <path d="M122 160 C118 96 160 72 204 74 C252 76 286 104 280 160 C262 128 232 120 200 124 C166 122 140 132 122 160Z" />
            <ellipse cx="214" cy="80" rx="66" ry="34" />
            <ellipse cx="178" cy="88" rx="44" ry="30" />
            <ellipse cx="244" cy="96" rx="36" ry="26" />
        </g>
    );
}

function Torso() {
    return (
        <g>
            <rect x="70" y="420" width="260" height="120" fill={C.plinth} />
            <path d="M48 420 A152 124 0 0 1 352 420 Z" fill={C.knit} />
            <ellipse cx="200" cy="300" rx="30" ry="10" fill={C.knit} />
        </g>
    );
}

function HandShape({ x, y, flip = false, rotate = 0 }: { x: number; y: number; flip?: boolean; rotate?: number }) {
    return (
        <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${flip ? -1 : 1} 1)`}>
            <rect x="-40" y="-14" width="80" height="34" rx="16" fill={C.clay} />
            {[-30, -10, 10, 30].map((fx, i) => (
                <rect key={fx} x={fx - 8} y={-14 - (i === 1 || i === 2 ? 30 : 24)} width="16" height="36" rx="8" fill={C.clay} />
            ))}
            <rect x="34" y="-4" width="30" height="16" rx="8" fill={C.clay} transform="rotate(-25 34 4)" />
            <rect x="-30" y="18" width="60" height="22" rx="4" fill={C.knit} />
        </g>
    );
}

function Bust() {
    return (
        <svg viewBox="0 0 400 540" className={css.svg}>
            <Torso />
            <Face />
            <Hair />
            <HandShape x={40} y={330} rotate={-70} />
            <HandShape x={360} y={330} rotate={70} flip />
        </svg>
    );
}

function Mind() {
    return (
        <svg viewBox="0 0 400 420" className={css.svg}>
            <g transform="translate(0 -60)">
                <path d="M122 214 C116 300 160 350 200 350 C240 350 284 300 278 214 Z" fill={C.clay} />
                <ellipse cx="200" cy="214" rx="78" ry="20" fill={C.ink} />
                <circle cx="160" cy="206" r="10" fill={C.bone} />
                <rect x="186" y="194" width="16" height="16" rx="3" fill={C.bone} />
                <g fill={C.bone}>
                    <circle cx="228" cy="200" r="5" />
                    <circle cx="242" cy="208" r="5" />
                    <circle cx="232" cy="214" r="5" />
                </g>
                <ellipse cx="214" cy="222" rx="14" ry="4" fill={C.blue} />
                <circle cx="172" cy="262" r="10" fill="#fbf8f2" />
                <circle cx="228" cy="262" r="10" fill="#fbf8f2" />
                <circle cx="173" cy="263" r="5.5" fill="#3a2a22" />
                <circle cx="229" cy="263" r="5.5" fill="#3a2a22" />
                <g transform="rotate(-38 122 210)">
                    <path d="M122 210 C118 150 160 128 200 128 C240 128 282 150 278 210 Z" fill={C.clay} />
                    <path d="M120 198 C118 132 162 108 204 110 C250 112 284 136 280 198 C262 168 232 160 200 164 C166 162 140 172 120 198Z" fill={C.ink} />
                    <ellipse cx="214" cy="116" rx="60" ry="30" fill={C.ink} />
                </g>
            </g>
        </svg>
    );
}

function Hand() {
    const items = [
        { x: 140, y: 214 },
        { x: 200, y: 206 },
        { x: 260, y: 214 },
        { x: 200, y: 250 }
    ];
    return (
        <svg viewBox="0 0 400 400" className={css.svg}>
            <path d="M80 270 C80 236 108 226 140 226 L264 226 C296 226 322 240 322 270 C322 300 296 312 264 312 L140 312 C108 312 80 302 80 270Z" fill={C.clay} />
            {[110, 160, 210, 260].map((x, i) => (
                <rect key={x} x={x - 18} y={296} width="36" height={70 - Math.abs(i - 1.5) * 10} rx="18" fill={C.clay} />
            ))}
            <rect x="290" y="236" width="70" height="34" rx="17" fill={C.clay} transform="rotate(-20 290 250)" />
            {items.map((p, i) => (
                <rect key={i} x={p.x - 20} y={p.y - 24} width="40" height="40" rx="6" fill={i === 1 ? C.blue : C.bone} stroke={C.ink} strokeWidth="2" />
            ))}
        </svg>
    );
}

function Eye() {
    return (
        <svg viewBox="0 0 400 300" className={css.svg}>
            <path d="M40 150 Q200 20 360 150 Q200 280 40 150Z" fill={C.clay} />
            <circle cx="200" cy="150" r="84" fill="#fbf8f2" />
            <circle cx="200" cy="150" r="52" fill="#3a2a22" />
            <circle cx="200" cy="150" r="36" fill={C.coral} />
            <circle cx="200" cy="150" r="14" fill={C.ink} />
            <circle cx="200" cy="150" r="118" fill="none" stroke={C.coral} strokeWidth="4" />
            <path d="M200 10 A140 140 0 0 1 336 120" fill="none" stroke={C.coral} strokeWidth="2" />
            <path d="M40 150 Q200 40 360 150" fill="none" stroke={C.clayDark} strokeWidth="10" />
        </svg>
    );
}

function Studio() {
    return (
        <svg viewBox="0 0 400 320" className={css.svg}>
            <g fill="none" stroke="#6f8a00" strokeWidth="2">
                <rect x="40" y="70" width="180" height="26" />
                <rect x="40" y="110" width="130" height="26" />
                <rect x="40" y="150" width="156" height="26" />
                <path d="M110 176 V300" />
                <ellipse cx="300" cy="120" rx="60" ry="68" />
                <path d="M240 120 Q300 90 360 120 M240 120 Q300 150 360 120 M300 52 Q270 120 300 188 M300 52 Q330 120 300 188" />
                <path d="M300 188 V300" />
            </g>
            <path d="M20 300 H380" stroke={C.ink} strokeWidth="1" opacity="0.3" />
        </svg>
    );
}
