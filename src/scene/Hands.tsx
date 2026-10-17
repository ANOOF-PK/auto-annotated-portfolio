import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { goToSection } from '@/experience/store';
import { damp, live, Vec3 } from './choreography';
import { anchors, interactive } from './interaction';
import { materials } from './materials';
import { Artefacts } from './Artefacts';
import { FINGERS } from './anatomy';

/*
 * Oversized hands that float free of the bust (palm ≈ ⅔ head width). Local frame:
 * palm faces +y, fingers point +z, the knit cuff trails toward −z.
 * The right hand (viewer's left) carries the work.
 */
interface Pose {
    position: Vec3;
    rotation: Vec3;
    scale: number;
}

const rest: Pose = { position: [-1.3, 0.85, 0.45], rotation: [0.55, 0.25, -1.3], scale: 1 };
const work: Pose = { position: [-0.1, 1.2, 1.35], rotation: [0.14, 0, 0], scale: 1.6 };
const contact: Pose = { position: [-0.46, 0.6, 1.15], rotation: [0.12, 0.4, 0.12], scale: 1 };
/** Clasped behind the back when another part (head, eye, profile) has the stage. */
const tuck: Pose = { position: [-0.5, 0.05, -1.25], rotation: [-0.3, -0.4, -0.6], scale: 0.8 };

const mirror = (p: Pose): Pose => ({
    position: [-p.position[0], p.position[1], p.position[2]],
    rotation: [p.rotation[0], -p.rotation[1], -p.rotation[2]],
    scale: p.scale
});

const palm = new RoundedBoxGeometry(0.8, 0.22, 0.84, 4, 0.1);
const partEnabled = () => live.params.parts > 0.6;

export function Hands() {
    return (
        <>
            <Hand side="right" />
            <Hand side="left" />
        </>
    );
}

function Hand({ side }: { side: 'right' | 'left' }) {
    const group = useRef<THREE.Group>(null);
    const right = side === 'right';
    // The left hand never carries work, so its "work" pose is its rest pose.
    const poses = useMemo(
        () =>
            right
                ? { rest, work, contact, tuck }
                : { rest: mirror(rest), work: mirror(tuck), contact: mirror(contact), tuck: mirror(tuck) },
        [right]
    );
    const v = useMemo(() => {
        const vec = (a: Vec3) => new THREE.Vector3(...a);
        return {
            p: new THREE.Vector3(),
            r: new THREE.Vector3(),
            restP: vec(poses.rest.position),
            restR: vec(poses.rest.rotation),
            workP: vec(poses.work.position),
            workR: vec(poses.work.rotation),
            contactP: vec(poses.contact.position),
            contactR: vec(poses.contact.rotation),
            tuckP: vec(poses.tuck.position),
            tuckR: vec(poses.tuck.rotation)
        };
    }, [poses]);
    const handlers = useMemo(() => interactive({ kind: 'part', id: 'hands' }, partEnabled, () => goToSection('work')), []);

    useFrame((_, dt) => {
        const g = group.current;
        if (!g) return;
        const { handRaise, rest: settle, headOpen, eyeFocus, profile } = live.params;
        const away = Math.min(1, headOpen + eyeFocus + profile);
        const { p, r } = v;
        p.copy(v.restP).lerp(v.tuckP, away).lerp(v.workP, handRaise).lerp(v.contactP, settle);
        r.copy(v.restR).lerp(v.tuckR, away).lerp(v.workR, handRaise).lerp(v.contactR, settle);
        let scale = THREE.MathUtils.lerp(poses.rest.scale, poses.tuck.scale, away);
        scale = THREE.MathUtils.lerp(scale, poses.work.scale, handRaise);
        scale = THREE.MathUtils.lerp(scale, poses.contact.scale, settle);

        const bob = live.reduced ? 0 : Math.sin(live.time * 0.9 + (right ? 0 : 1.7)) * 0.03 * (1 - handRaise);
        g.position.set(damp(g.position.x, p.x, 4, dt), damp(g.position.y, p.y + bob, 4, dt), damp(g.position.z, p.z, 4, dt));
        g.rotation.set(damp(g.rotation.x, r.x, 4, dt), damp(g.rotation.y, r.y, 4, dt), damp(g.rotation.z, r.z, 4, dt));
        g.scale.setScalar(damp(g.scale.x, scale, 4, dt));
    });

    return (
        <group
            ref={(g) => {
                group.current = g;
                if (g) anchors[right ? 'handRight' : 'handLeft'] = g;
            }}
            name={right ? 'hand-r' : 'hand-l'}
            position={poses.rest.position}
            rotation={poses.rest.rotation}
            {...handlers}
        >
            <group scale={[right ? 1 : -1, 1, 1]}>
                <mesh geometry={palm} material={materials.clay} castShadow receiveShadow />
                {FINGERS.map(([x, len, curl], i) => (
                    <mesh
                        key={i}
                        position={[x, 0.06 + (Math.sin(curl) * len) / 2, 0.4 + (Math.cos(curl) * len) / 2]}
                        rotation={[Math.PI / 2 - curl, 0, 0]}
                        material={materials.clay}
                        castShadow
                    >
                        <capsuleGeometry args={[0.085, len, 8, 16]} />
                    </mesh>
                ))}
                <mesh position={[-0.46, 0.08, 0.02]} rotation={[Math.PI / 2 - 0.5, 0, 0.9]} material={materials.clay} castShadow>
                    <capsuleGeometry args={[0.095, 0.26, 8, 16]} />
                </mesh>
                <mesh position={[0, 0, -0.56]} rotation={[Math.PI / 2, 0, 0]} material={materials.knit} castShadow>
                    <cylinderGeometry args={[0.34, 0.31, 0.34, 40]} />
                </mesh>
            </group>
            {right && <Artefacts />}
        </group>
    );
}
