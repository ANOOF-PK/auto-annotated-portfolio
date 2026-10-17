import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { concepts } from '@/content/site';
import type { ConceptId } from '@/content/types';
import { experience } from '@/experience/store';
import { damp, live } from './choreography';
import { emphasis, interactive } from './interaction';
import { accent, tintAccent } from './materials';

/*
 * Four concept objects that live inside the head. They share one vocabulary — bone
 * forms on an ink floor — and each answers selection with a movement that explains
 * its idea: inputs dock, a network rearranges, steps line up, layers separate.
 */
const SLOTS: Record<ConceptId, [number, number]> = {
    accessibility: [-0.24, -0.18],
    ai: [0.24, -0.18],
    workflows: [-0.24, 0.2],
    behaviour: [0.24, 0.2]
};

const enabled = () => live.params.headOpen > 0.6;

export function MindObjects({ floorY }: { floorY: number }) {
    const root = useRef<THREE.Group>(null);
    useFrame(() => {
        if (root.current) root.current.visible = live.params.headOpen > 0.02;
    });
    return (
        <group ref={root} name="mind" position={[0, floorY, 0]} visible={false}>
            {concepts.map((c) => (
                <ConceptObject key={c.id} id={c.id} />
            ))}
        </group>
    );
}

function ConceptObject({ id }: { id: ConceptId }) {
    const group = useRef<THREE.Group>(null);
    const parts = useRef<THREE.Group>(null);
    const material = useMemo(accent, []);
    useEffect(() => () => material.dispose(), [material]);
    const state = useRef({ emphasis: 0, select: 0, spin: 0 });
    const handlers = useMemo(
        () => interactive({ kind: 'concept', id }, enabled, () => experience.set({ concept: id })),
        [id]
    );
    const [x, z] = SLOTS[id];

    useFrame((_, dt) => {
        const g = group.current;
        if (!g) return;
        const s = state.current;
        const selected = experience.get().concept;
        s.emphasis = damp(s.emphasis, emphasis('concept', id, selected), 8, dt);
        s.select = damp(s.select, selected === id ? 1 : 0, 5, dt);
        s.spin += live.reduced ? 0 : dt * (0.25 + s.select * 0.35);
        tintAccent(material, s.emphasis);

        const open = live.params.headOpen;
        const others = selected && selected !== id ? 0.82 : 1;
        g.position.y = 0.07 * open + 0.2 * s.select;
        g.position.z = z + 0.1 * s.select;
        g.scale.setScalar(Math.max(1.3 * open * others * (1 + 0.35 * s.select), 0.0001));
        g.rotation.y = s.spin;
        if (parts.current) arrange(id, parts.current, s.select);
    });

    return (
        <group ref={group} position={[x, 0, z]} {...handlers}>
            {/* Generous invisible hit area so small objects are easy to target. */}
            <mesh>
                <sphereGeometry args={[0.13, 8, 8]} />
                <meshBasicMaterial visible={false} />
            </mesh>
            <group ref={parts}>
                <Shape id={id} material={material} />
            </group>
        </group>
    );
}

const roundedStep = new RoundedBoxGeometry(0.07, 0.05, 0.07, 3, 0.012);

function Shape({ id, material }: { id: ConceptId; material: THREE.Material }) {
    switch (id) {
        case 'accessibility':
            return (
                <>
                    <mesh material={material} castShadow>
                        <sphereGeometry args={[0.06, 32, 16]} />
                    </mesh>
                    <mesh material={material} castShadow>
                        <boxGeometry args={[0.04, 0.04, 0.04]} />
                    </mesh>
                    <mesh material={material} castShadow>
                        <coneGeometry args={[0.025, 0.05, 16]} />
                    </mesh>
                    <mesh material={material} castShadow>
                        <torusGeometry args={[0.02, 0.008, 8, 24]} />
                    </mesh>
                </>
            );
        case 'ai':
            return (
                <>
                    <mesh material={material} castShadow>
                        <sphereGeometry args={[0.035, 24, 12]} />
                    </mesh>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <mesh key={i} material={material} castShadow>
                            <sphereGeometry args={[0.02, 16, 8]} />
                        </mesh>
                    ))}
                    <mesh material={material} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.095, 0.003, 6, 48]} />
                    </mesh>
                </>
            );
        case 'workflows':
            return (
                <>
                    {[0, 1, 2].map((i) => (
                        <mesh key={i} geometry={roundedStep} material={material} castShadow />
                    ))}
                    <mesh material={material}>
                        <boxGeometry args={[0.24, 0.008, 0.02]} />
                    </mesh>
                </>
            );
        case 'behaviour':
            return (
                <>
                    {[0, 1, 2].map((i) => (
                        <mesh key={i} material={material} castShadow>
                            <cylinderGeometry args={[0.075 - i * 0.012, 0.075 - i * 0.012, 0.014, 40]} />
                        </mesh>
                    ))}
                </>
            );
    }
}

/** Positions each concept's sub-parts for a selection amount `a` (0 rest → 1 selected). */
function arrange(id: ConceptId, g: THREE.Group, a: number) {
    const c = g.children;
    switch (id) {
        case 'accessibility': {
            // Three different inputs dock into one form.
            const d = 0.13 - a * 0.065;
            for (let i = 1; i < 4; i++) {
                const t = (i / 3) * Math.PI * 2;
                c[i].position.set(Math.cos(t) * d, 0.02 * Math.sin(t * 2), Math.sin(t) * d);
            }
            break;
        }
        case 'ai': {
            // Scattered nodes settle into an ordered ring around a centre.
            for (let i = 1; i < 6; i++) {
                const t = (i / 5) * Math.PI * 2;
                const scatter = 1 - a;
                c[i].position.set(
                    Math.cos(t) * (0.095 - scatter * 0.03 * (i % 2)),
                    scatter * 0.05 * Math.sin(i * 2.3),
                    Math.sin(t) * (0.095 + scatter * 0.025 * (i % 3))
                );
            }
            c[6].scale.setScalar(Math.max(a, 0.0001));
            break;
        }
        case 'workflows': {
            // Disordered steps line up into a flow on a rail.
            const scattered: [number, number, number][] = [
                [-0.05, 0.03, 0.05],
                [0.06, 0.0, -0.04],
                [-0.01, 0.07, -0.01]
            ];
            for (let i = 0; i < 3; i++) {
                const [sx, sy, sz] = scattered[i];
                c[i].position.set(sx + ((i - 1) * 0.085 - sx) * a, sy * (1 - a) + 0.03 * a, sz * (1 - a));
            }
            c[3].scale.set(Math.max(a, 0.0001), 1, 1);
            break;
        }
        case 'behaviour': {
            // Stacked layers separate to show what sits underneath.
            for (let i = 0; i < 3; i++) {
                c[i].position.set(i * 0.012 * (1 - a), i * (0.016 + a * 0.05), -i * 0.01 * (1 - a));
            }
            break;
        }
    }
}
