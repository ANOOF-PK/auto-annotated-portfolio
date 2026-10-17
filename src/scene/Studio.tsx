import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { experiments } from '@/content/site';
import type { Experiment } from '@/content/types';
import { experience } from '@/experience/store';
import { damp, live, Vec3 } from './choreography';
import { anchors, emphasis, interactive } from './interaction';
import { materials, palette } from './materials';

/*
 * The open studio around the character. Experiments are unfinished sculptures:
 * lime wireframes on simple stands, deliberately unlike the solid professional
 * artefacts on the hand.
 */
const PLACES: Record<Experiment['shape'], Vec3> = {
    captions: [3.3, 1.5, -0.9],
    head: [2.3, 2.5, -2.6]
};

export function Studio() {
    return (
        <group name="studio">
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} material={materials.shadow} receiveShadow>
                <planeGeometry args={[40, 40]} />
            </mesh>
            {experiments.map((e) => (
                <ExperimentSculpture key={e.id} experiment={e} position={PLACES[e.shape]} />
            ))}
            <PartMarker />
        </group>
    );
}

const enabled = () => live.params.studio > 0.6;

function ExperimentSculpture({ experiment, position }: { experiment: Experiment; position: Vec3 }) {
    const group = useRef<THREE.Group>(null);
    const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#7f9c00', wireframe: true, transparent: true }), []);
    useEffect(() => () => material.dispose(), [material]);
    const lime = useMemo(() => new THREE.Color(palette.lime), []);
    const ink = useMemo(() => new THREE.Color('#6f8a00'), []);
    const st = useRef({ emphasis: 0 });
    const handlers = useMemo(
        () =>
            interactive({ kind: 'experiment', id: experiment.id }, enabled, () => {
                const card = document.getElementById(`experiment-${experiment.id}`);
                card?.scrollIntoView({ behavior: live.reduced ? 'auto' : 'smooth', block: 'center' });
                card?.focus({ preventScroll: true });
            }),
        [experiment.id]
    );

    useFrame((_, dt) => {
        const g = group.current;
        if (!g) return;
        const reveal = live.params.studio;
        g.visible = reveal > 0.02;
        st.current.emphasis = damp(st.current.emphasis, emphasis('experiment', experiment.id, null), 8, dt);
        material.color.copy(ink).lerp(lime, st.current.emphasis);
        material.opacity = reveal;
        g.scale.setScalar(Math.max(0.7 + reveal * 0.3, 0.0001));
        if (!live.reduced) g.rotation.y += dt * 0.15;
    });

    return (
        <group ref={group} position={position} visible={false} {...handlers}>
            {experiment.shape === 'captions' ? (
                <group>
                    {[0.9, 0.65, 0.78].map((w, i) => (
                        <mesh key={i} material={material} position={[0, 0.3 - i * 0.2, 0]}>
                            <boxGeometry args={[w, 0.12, 0.08, 8, 1, 1]} />
                        </mesh>
                    ))}
                </group>
            ) : (
                <mesh material={material} scale={[1, 1.1, 0.98]}>
                    <icosahedronGeometry args={[0.6, 2]} />
                </mesh>
            )}
            <mesh position={[0, -0.6, 0]}>
                <sphereGeometry args={[0.8, 8, 8]} />
                <meshBasicMaterial visible={false} />
            </mesh>
            {/* Stand from the floor (y = −1.6) to just below the sculpture. */}
            <mesh material={materials.wireLime} position={[0, -(position[1] + 2.05) / 2, 0]}>
                <cylinderGeometry args={[0.012, 0.012, position[1] + 1.15, 6]} />
            </mesh>
        </group>
    );
}

/**
 * Annotation ring around the head, hands or eyes while one of them is hovered
 * (from the scene or from the HTML body index).
 */
function PartMarker() {
    const ring = useRef<THREE.Mesh>(null);
    const world = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ camera }, dt) => {
        const m = ring.current;
        if (!m) return;
        const hover = experience.get().hover;
        const part = hover?.kind === 'part' ? hover.id : null;
        const anchor = part === 'head' ? anchors.head : part === 'eyes' ? anchors.eyes : part === 'hands' ? anchors.handRight : null;
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.opacity = damp(mat.opacity, anchor ? 1 : 0, 10, dt);
        if (anchor) {
            anchor.getWorldPosition(world);
            m.position.copy(world);
            const r = part === 'head' ? 1.05 : part === 'eyes' ? 0.42 : 0.75;
            m.scale.setScalar(damp(m.scale.x, r, 10, dt));
        }
        m.quaternion.copy(camera.quaternion);
        m.visible = mat.opacity > 0.01;
    });
    return (
        <mesh ref={ring} material={materials.marker} visible={false} renderOrder={10}>
            <torusGeometry args={[1, 0.012, 8, 96]} />
        </mesh>
    );
}
