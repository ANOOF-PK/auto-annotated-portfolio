import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { projects } from '@/content/projects';
import type { ArtefactShape, Project } from '@/content/types';
import { experience } from '@/experience/store';
import { damp, live, Vec3 } from './choreography';
import { FINGERTIPS } from './anatomy';
import { emphasis, interactive } from './interaction';
import { accent, materials, tintAccent } from './materials';

/*
 * Miniature product artefacts held by the right hand. Hierarchy is physical:
 * selected work stands on the palm, supporting work rests on the fingertips.
 * Coordinates are in the hand's local frame (palm top at y ≈ 0.11).
 */
const PALM_SLOTS: Vec3[] = [
    [-0.18, 0.11, -0.16],
    [0.18, 0.11, -0.16],
    [-0.18, 0.11, 0.16],
    [0.18, 0.11, 0.16]
];
const TIP_SLOTS: Vec3[] = [FINGERTIPS[0], FINGERTIPS[3]].map(([x, y, z]) => [x, y + 0.08, z] as Vec3);

const enabled = () => live.params.handRaise > 0.6;

export function Artefacts() {
    const root = useRef<THREE.Group>(null);
    const selected = projects.filter((p) => p.tier === 'selected');
    const supporting = projects.filter((p) => p.tier === 'supporting');
    useFrame(() => {
        if (root.current) root.current.visible = live.params.handRaise > 0.02;
    });
    return (
        <group ref={root} name="artefacts" visible={false}>
            {selected.slice(0, PALM_SLOTS.length).map((p, i) => (
                <Artefact key={p.slug} project={p} slot={PALM_SLOTS[i]} size={1} />
            ))}
            {supporting.slice(0, TIP_SLOTS.length).map((p, i) => (
                <Artefact key={p.slug} project={p} slot={TIP_SLOTS[i]} size={0.68} />
            ))}
        </group>
    );
}

function Artefact({ project, slot, size }: { project: Project; slot: Vec3; size: number }) {
    const group = useRef<THREE.Group>(null);
    const material = useMemo(accent, []);
    useEffect(() => () => material.dispose(), [material]);
    const s = useRef({ emphasis: 0, select: 0, spin: 0 });
    const handlers = useMemo(
        () =>
            interactive({ kind: 'project', id: project.slug }, enabled, () => {
                experience.set({ project: project.slug });
            }),
        [project.slug]
    );

    useFrame((_, dt) => {
        const g = group.current;
        if (!g) return;
        const st = s.current;
        const current = experience.get().project;
        st.emphasis = damp(st.emphasis, emphasis('project', project.slug, current), 8, dt);
        st.select = damp(st.select, current === project.slug ? 1 : 0, 5, dt);
        st.spin = live.reduced ? 0 : st.spin + dt * 0.5 * st.select;
        tintAccent(material, st.emphasis);

        const quiet = current && current !== project.slug ? 0.78 : 1;
        const raise = live.params.handRaise;
        g.position.set(slot[0], slot[1] + 0.2 * st.select, slot[2] + 0.12 * st.select);
        g.scale.setScalar(Math.max(size * raise * quiet * (1 + 0.35 * st.select), 0.0001));
        g.rotation.y = st.spin + (1 - raise) * 0.6;
    });

    return (
        <group ref={group} position={slot} {...handlers}>
            <mesh position={[0, 0.09, 0]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshBasicMaterial visible={false} />
            </mesh>
            <Shape shape={project.artefact} material={material} />
        </group>
    );
}

const geo = {
    panel: new RoundedBoxGeometry(0.22, 0.17, 0.03, 3, 0.01),
    sheet: new RoundedBoxGeometry(0.16, 0.014, 0.2, 2, 0.005),
    crate: new RoundedBoxGeometry(0.075, 0.075, 0.075, 3, 0.012),
    bubble: new RoundedBoxGeometry(0.16, 0.11, 0.04, 3, 0.018),
    tablet: new RoundedBoxGeometry(0.12, 0.16, 0.016, 3, 0.012)
};

function Shape({ shape, material }: { shape: ArtefactShape; material: THREE.Material }) {
    const ink = materials.ink;
    switch (shape) {
        case 'window':
            return (
                <group>
                    <mesh geometry={geo.panel} material={material} position={[0, 0.1, 0]} castShadow />
                    <mesh material={ink} position={[0, 0.175, 0]}>
                        <boxGeometry args={[0.21, 0.018, 0.032]} />
                    </mesh>
                    <mesh material={ink} position={[0, 0.09, 0.018]}>
                        <torusGeometry args={[0.042, 0.008, 8, 32]} />
                    </mesh>
                    <mesh material={ink} position={[0, 0.008, 0]}>
                        <boxGeometry args={[0.09, 0.016, 0.06]} />
                    </mesh>
                </group>
            );
        case 'documents':
            return (
                <group>
                    {[-0.15, 0.05, 0.2].map((r, i) => (
                        <mesh key={i} geometry={geo.sheet} material={i === 2 ? material : ink} position={[0, 0.01 + i * 0.022, 0]} rotation={[0, r, 0]} castShadow />
                    ))}
                    <mesh material={material} position={[0.02, 0.13, 0]} castShadow>
                        <sphereGeometry args={[0.026, 24, 12]} />
                    </mesh>
                </group>
            );
        case 'crates':
            return (
                <group>
                    <mesh material={ink} position={[0, 0.008, 0]}>
                        <boxGeometry args={[0.19, 0.016, 0.19]} />
                    </mesh>
                    {(
                        [
                            [-0.042, 0.054, -0.042],
                            [0.042, 0.054, -0.042],
                            [-0.042, 0.054, 0.042],
                            [0.042, 0.054, 0.042],
                            [0, 0.132, 0]
                        ] as Vec3[]
                    ).map((p, i) => (
                        <mesh key={i} geometry={geo.crate} material={material} position={p} castShadow />
                    ))}
                </group>
            );
        case 'tiffin':
            return (
                <group>
                    {[0, 1, 2].map((i) => (
                        <mesh key={i} material={material} position={[0, 0.025 + i * 0.05, 0]} castShadow>
                            <cylinderGeometry args={[0.06, 0.06, 0.045, 32]} />
                        </mesh>
                    ))}
                    {[0, 1].map((i) => (
                        <mesh key={i} material={ink} position={[0, 0.05 + i * 0.05, 0]}>
                            <cylinderGeometry args={[0.062, 0.062, 0.006, 32]} />
                        </mesh>
                    ))}
                    <mesh material={ink} position={[0, 0.17, 0]} rotation={[0, 0, 0]}>
                        <torusGeometry args={[0.035, 0.007, 8, 24, Math.PI]} />
                    </mesh>
                </group>
            );
        case 'speech':
            return (
                <group>
                    <mesh geometry={geo.bubble} material={material} position={[0, 0.1, 0]} castShadow />
                    <mesh material={material} position={[-0.04, 0.033, 0]} rotation={[0, 0, Math.PI]}>
                        <coneGeometry args={[0.022, 0.04, 12]} />
                    </mesh>
                    {[-0.04, 0, 0.04].map((x) => (
                        <mesh key={x} material={ink} position={[x, 0.1, 0.021]}>
                            <sphereGeometry args={[0.011, 12, 8]} />
                        </mesh>
                    ))}
                </group>
            );
        case 'tablet':
            return (
                <group rotation={[-0.25, 0, 0]}>
                    <mesh geometry={geo.tablet} material={material} position={[0, 0.09, 0]} castShadow />
                    <mesh material={ink} position={[0, 0.09, 0.009]}>
                        <boxGeometry args={[0.1, 0.13, 0.002]} />
                    </mesh>
                </group>
            );
    }
}
