import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { experience, SECTIONS } from '@/experience/store';
import { damp, keyframes, live, Params, smoothstep } from './choreography';

/** Scroll distance (in viewport heights) over which one section blends into the next. */
const BLEND = 0.5;

/**
 * Owns the camera and the scroll-derived scene parameters. Nothing else moves the
 * camera, so there is exactly one writer per transform.
 */
export function Director() {
    const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
    const tops = useRef<number[]>([]);
    const rig = useMemo(
        () => ({
            pos: new THREE.Vector3(),
            look: new THREE.Vector3(),
            wantPos: new THREE.Vector3(),
            wantLook: new THREE.Vector3(),
            offset: new THREE.Vector3(),
            tmp: new THREE.Vector3(),
            frame: { x: 0.5, y: 0.5 },
            ready: false
        }),
        []
    );

    useEffect(() => {
        const measure = () => {
            tops.current = SECTIONS.map((id) => {
                const el = document.getElementById(id);
                return el ? el.getBoundingClientRect().top + window.scrollY : 0;
            });
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(document.body);
        window.addEventListener('resize', measure);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, []);

    useFrame((state, delta) => {
        const dt = Math.min(delta, 0.1);
        live.time += dt;
        const t = tops.current;
        if (t.length !== SECTIONS.length) return;

        const vh = window.innerHeight;
        const anchor = window.scrollY + vh * 0.5;

        // Continuous scene position: k + f means "f of the way from section k to k + 1".
        let s = 0;
        for (let k = 1; k < t.length; k++) {
            const x = (anchor - t[k] + vh * BLEND * 0.5) / (vh * BLEND);
            s += live.reduced ? (x >= 0.5 ? 1 : 0) : smoothstep(x);
        }
        const i = Math.min(Math.floor(s), SECTIONS.length - 2);
        const f = s - i;
        const a = keyframes[SECTIONS[i]];
        const b = keyframes[SECTIONS[i + 1]];

        for (const key in live.params) {
            const k = key as keyof Params;
            live.params[k] = THREE.MathUtils.lerp(a.params[k] ?? 0, b.params[k] ?? 0, f);
        }

        const { width, height } = state.size;
        const aspect = width / height;
        // Must match the stacked-layout media query in sections.module.css.
        live.narrow = aspect < 0.9 || width <= 760;
        const distance = Math.pow(Math.max(1, 1.1 / aspect), 0.7);
        const fa = live.narrow ? a.frameNarrow : a.frame;
        const fb = live.narrow ? b.frameNarrow : b.frame;

        rig.wantLook.fromArray(a.target).lerp(rig.tmp.fromArray(b.target), f);
        rig.offset.fromArray(a.offset).lerp(rig.tmp.fromArray(b.offset), f).multiplyScalar(distance);
        rig.wantPos.copy(rig.wantLook).add(rig.offset);
        const fx = THREE.MathUtils.lerp(fa.x, fb.x, f);
        const fy = THREE.MathUtils.lerp(fa.y, fb.y, f);

        if (!rig.ready) {
            // Start where the page is; no entrance flight.
            rig.pos.copy(rig.wantPos);
            rig.look.copy(rig.wantLook);
            rig.frame = { x: fx, y: fy };
            rig.ready = true;
        }
        const lambda = 3.2;
        rig.pos.set(damp(rig.pos.x, rig.wantPos.x, lambda, dt), damp(rig.pos.y, rig.wantPos.y, lambda, dt), damp(rig.pos.z, rig.wantPos.z, lambda, dt));
        rig.look.set(damp(rig.look.x, rig.wantLook.x, lambda, dt), damp(rig.look.y, rig.wantLook.y, lambda, dt), damp(rig.look.z, rig.wantLook.z, lambda, dt));
        rig.frame.x = damp(rig.frame.x, fx, lambda, dt);
        rig.frame.y = damp(rig.frame.y, fy, lambda, dt);

        camera.position.copy(rig.pos);
        camera.lookAt(rig.look);
        // Shift the projection so the target lands at the keyframe's screen position.
        camera.setViewOffset(width, height, width * (0.5 - rig.frame.x), height * (0.5 - rig.frame.y), width, height);

        let active = 0;
        for (let k = 0; k < t.length; k++) if (anchor >= t[k]) active = k;
        const section = SECTIONS[active];
        if (experience.get().section !== section) {
            const { hover } = experience.get();
            experience.set({ section, hover: hover?.from === 'scene' ? null : hover });
            document.body.style.cursor = '';
        }
    });

    return null;
}
