import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { experience } from '@/experience/store';
import { live } from './choreography';
import { Director } from './Director';
import { Figure } from './Figure';
import { Hands } from './Hands';
import { Studio } from './Studio';

/**
 * The WebGL layer. Loaded lazily after the HTML is readable. The canvas never takes
 * pointer events itself; they come from `eventSource` (the page root) so HTML and 3D
 * share the pointer without either blocking the other.
 */
export default function Stage({ eventSource }: { eventSource: HTMLElement }) {
    useEffect(() => {
        const sync = () => {
            live.reduced = experience.get().reducedMotion;
        };
        sync();
        return experience.subscribe(sync);
    }, []);

    const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

    return (
        <Canvas
            aria-hidden="true"
            eventSource={eventSource}
            eventPrefix="client"
            dpr={[1, coarse ? 1.5 : 1.75]}
            shadows
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.NeutralToneMapping }}
            camera={{ fov: 35, near: 0.1, far: 80, position: [1.7, 1.8, 6] }}
            onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
                gl.domElement.addEventListener('webglcontextlost', (e) => {
                    e.preventDefault();
                    experience.set({ scene: 'failed' });
                });
            }}
        >
            <Lights shadowSize={coarse ? 1024 : 2048} />
            <Director />
            <Figure />
            <Hands />
            <Studio />
            <ReadySignal />
        </Canvas>
    );
}

function Lights({ shadowSize }: { shadowSize: number }) {
    return (
        <>
            <hemisphereLight args={['#fff6ea', '#cfc5b4', 1.6]} />
            <directionalLight
                position={[-3.2, 6.5, 4.5]}
                intensity={2.6}
                castShadow
                shadow-mapSize={[shadowSize, shadowSize]}
                shadow-bias={-0.0004}
                shadow-normalBias={0.02}
                shadow-camera-left={-4.5}
                shadow-camera-right={4.5}
                shadow-camera-top={4.5}
                shadow-camera-bottom={-3}
                shadow-camera-far={20}
            />
            <directionalLight position={[4, 2.2, 3]} intensity={0.55} color="#ffe9dc" />
            <directionalLight position={[0.5, 4, -5]} intensity={1.1} color="#ffffff" />
        </>
    );
}

/** Marks the scene ready only after a frame has actually been drawn. */
function ReadySignal() {
    const frames = useRef(0);
    useFrame(() => {
        frames.current += 1;
        if (frames.current === 2) experience.set({ scene: 'ready' });
    });
    return null;
}
