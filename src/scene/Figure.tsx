import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { experience, goToSection, pointer } from '@/experience/store';
import { damp, live } from './choreography';
import { anchors, interactive } from './interaction';
import { materials } from './materials';
import { MindObjects } from './MindObjects';

/*
 * The character: a sculpted bust on a plinth. Head proportions are a slightly tall egg
 * (1 : 1.1) so the cranium can open like a lid along a cut just above the brow.
 * Values here are the character spec — change them deliberately, not incidentally.
 */
const HEAD_R = 0.62;
const HEAD_Y = 1.8;
const STRETCH = 1.1;
const CUT_THETA = 1.24;
export const CUT_Y = HEAD_R * Math.cos(CUT_THETA) * STRETCH;
const CUT_R = HEAD_R * Math.sin(CUT_THETA);

const partEnabled = () => live.params.parts > 0.6;

export function Figure() {
    return (
        <group name="character">
            <Bust />
            <Head />
        </group>
    );
}

function Bust() {
    const torso = useRef<THREE.Mesh>(null);
    useFrame(() => {
        if (!torso.current) return;
        torso.current.scale.y = live.reduced ? 1.05 : 1.05 + Math.sin(live.time * 1.1) * 0.008;
    });
    return (
        <group name="bust">
            <mesh position={[0, -0.8, 0]} material={materials.plinth} receiveShadow castShadow>
                <cylinderGeometry args={[1.18, 1.22, 1.6, 64]} />
            </mesh>
            <mesh ref={torso} material={materials.knit} scale={[1.08, 1.05, 0.64]} castShadow receiveShadow>
                <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
            <mesh position={[0, 1.12, 0]} material={materials.clay} castShadow>
                <cylinderGeometry args={[0.2, 0.23, 0.6, 32]} />
            </mesh>
            <mesh position={[0, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.knit} castShadow>
                <torusGeometry args={[0.25, 0.07, 16, 48]} />
            </mesh>
        </group>
    );
}

function Head() {
    const head = useRef<THREE.Group>(null);
    const lid = useRef<THREE.Group>(null);
    const select = useMemo(
        () => interactive({ kind: 'part', id: 'head' }, partEnabled, () => goToSection('mind')),
        []
    );

    useFrame((_, dt) => {
        const g = head.current;
        if (!g) return;
        const p = live.params;
        const track = live.reduced ? 0 : p.parts * (1 - p.profile * 0.6);
        const yaw = pointer.x * 0.28 * track + p.profile * 0.38 + p.eyeFocus * 0.14;
        // Leans into the open head, and looks down at the work the hand holds.
        const pitch = -pointer.y * 0.1 * track + p.headOpen * 0.22 + p.handRaise * 0.22;
        g.rotation.y = damp(g.rotation.y, yaw, 3, dt);
        g.rotation.x = damp(g.rotation.x, pitch, 3, dt);
        if (lid.current) {
            // The cranium lifts clear and tips back, floating above the open head.
            lid.current.rotation.x = damp(lid.current.rotation.x, -p.headOpen * 0.85, 5, dt);
            lid.current.position.y = damp(lid.current.position.y, CUT_Y + p.headOpen * 1.6, 5, dt);
        }
    });

    return (
        <group
            ref={(g) => {
                head.current = g;
                if (g) anchors.head = g;
            }}
            name="head"
            position={[0, HEAD_Y, 0]}
            {...select}
        >
            {/* Lower skull, open at the cut so the inside can be seen when the lid lifts. */}
            <mesh material={materials.clayInside} scale={[1, STRETCH, 0.98]} castShadow receiveShadow>
                <sphereGeometry args={[HEAD_R, 64, 40, 0, Math.PI * 2, CUT_THETA, Math.PI - CUT_THETA]} />
            </mesh>
            <Face />
            <Eyes />
            <mesh position={[0, CUT_Y - 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.ink}>
                <circleGeometry args={[CUT_R - 0.02, 48]} />
            </mesh>
            <MindObjects floorY={CUT_Y - 0.1} />
            {/* Lid: hinged at the back of the cut. */}
            <group ref={lid} name="cranium" position={[0, CUT_Y, -CUT_R * 0.98]}>
                <group position={[0, -CUT_Y, CUT_R * 0.98]}>
                    <mesh material={materials.clayInside} scale={[1, STRETCH, 0.98]} castShadow>
                        <sphereGeometry args={[HEAD_R, 64, 24, 0, Math.PI * 2, 0, CUT_THETA]} />
                    </mesh>
                    <Hair />
                </group>
            </group>
        </group>
    );
}

function Face() {
    return (
        <group name="face">
            {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.6, -0.04, -0.02]} scale={[0.45, 1, 0.7]} material={materials.clay} castShadow>
                    <sphereGeometry args={[0.13, 24, 16]} />
                </mesh>
            ))}
            {/* Sculpted wedge nose: bridge between the eyes, tip forward and down. */}
            <mesh position={[0, -0.075, 0.6]} rotation={[-0.5, 0, 0]} material={materials.clay} castShadow>
                <capsuleGeometry args={[0.075, 0.08, 8, 16]} />
            </mesh>
            {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.21, 0.155, 0.56]} rotation={[0.25, s * -0.25, Math.PI / 2 + s * 0.12]} material={materials.hair}>
                    <capsuleGeometry args={[0.024, 0.13, 6, 12]} />
                </mesh>
            ))}
            {/* Calm closed smile. */}
            <mesh position={[0, -0.22, 0.56]} rotation={[0, 0, -Math.PI / 2 - 0.8]} material={materials.ink}>
                <torusGeometry args={[0.08, 0.014, 8, 32, 1.6]} />
            </mesh>
        </group>
    );
}

/** Ink mass with a tall forward quiff and bare sides: the silhouette signature. */
function Hair() {
    // [x, y, z, radius, scale]: a forward-swept quiff built up off the crown.
    const blobs: [number, number, number, number, [number, number, number]][] = [
        [0.04, 0.6, 0.36, 0.22, [1.55, 0.75, 1]],
        [0.12, 0.72, 0.2, 0.26, [1.35, 0.8, 1.1]],
        [-0.18, 0.66, 0.16, 0.22, [1.2, 0.8, 1.15]],
        [0.0, 0.78, -0.04, 0.3, [1.45, 0.7, 1.3]],
        [0.0, 0.62, -0.32, 0.3, [1.35, 0.78, 1]],
        // Fringe sweeping across the hairline breaks the cap edge.
        [0.16, 0.44, 0.47, 0.13, [1.7, 0.55, 0.8]]
    ];
    return (
        // Tilted so the hairline rises at the front and drops toward the nape.
        <group name="hair" rotation={[-0.24, 0, 0]}>
            <mesh material={materials.hair} scale={[1.03, 1.12, 1.02]} castShadow>
                <sphereGeometry args={[HEAD_R + 0.02, 48, 24, 0, Math.PI * 2, 0, 1.12]} />
            </mesh>
            {blobs.map(([x, y, z, r, s], i) => (
                <mesh key={i} position={[x, y, z]} scale={s} material={materials.hair} castShadow>
                    <sphereGeometry args={[r, 32, 16]} />
                </mesh>
            ))}
        </group>
    );
}

function Eyes() {
    const select = useMemo(
        () => interactive({ kind: 'part', id: 'eyes' }, partEnabled, () => goToSection('observations')),
        []
    );
    return (
        <group
            name="eyes"
            position={[0, 0.03, 0.5]}
            ref={(g) => {
                if (g) anchors.eyes = g;
            }}
            {...select}
        >
            <Eye side={-1} />
            <Eye side={1} />
        </group>
    );
}

function Eye({ side }: { side: -1 | 1 }) {
    const look = useRef<THREE.Group>(null);
    const pupil = useRef<THREE.Mesh>(null);
    const lid = useRef<THREE.Mesh>(null);
    const lens = useRef<THREE.Group>(null);
    const blink = useRef({ next: 2 + Math.random() * 3, t: -1 });
    const toCamera = useMemo(() => new THREE.Vector3(), []);
    /** The observing eye is the character's left (+x), nearest the observations camera. */
    const observer = side === 1;

    useFrame(({ camera }, dt) => {
        const p = live.params;
        const g = look.current;
        if (g?.parent) {
            // Follow the pointer, or meet the visitor's gaze when the eye has the stage.
            const tracking = live.reduced ? 0 : 1;
            g.parent.worldToLocal(toCamera.copy(camera.position));
            const yawCam = Math.atan2(toCamera.x, toCamera.z);
            const pitchCam = -Math.atan2(toCamera.y, Math.hypot(toCamera.x, toCamera.z));
            const yaw = THREE.MathUtils.lerp(pointer.x * 0.32 * tracking, yawCam, p.eyeFocus);
            const pitch = THREE.MathUtils.lerp(-pointer.y * 0.22 * tracking, pitchCam, p.eyeFocus);
            g.rotation.y = damp(g.rotation.y, THREE.MathUtils.clamp(yaw, -0.45, 0.45), 8, dt);
            g.rotation.x = damp(g.rotation.x, THREE.MathUtils.clamp(pitch, -0.35, 0.35), 8, dt);
        }
        const focusPulse = experience.get().observation ? 0.35 : 0;
        const dilation = observer ? 1 + p.eyeFocus * (0.7 - focusPulse) : 1;
        if (pupil.current) {
            const s = damp(pupil.current.scale.x, dilation, 4, dt);
            pupil.current.scale.set(s, s, 1);
        }
        if (lens.current) {
            const target = observer ? p.eyeFocus : 0;
            const s = damp(lens.current.scale.x, target * (1 - focusPulse * 0.4), 4, dt);
            lens.current.scale.setScalar(Math.max(s, 0.0001));
            lens.current.visible = s > 0.01;
            lens.current.rotation.z += live.reduced ? 0 : dt * 0.25;
        }
        if (lid.current) {
            const b = blink.current;
            let close = 0;
            if (!live.reduced && p.eyeFocus < 0.5) {
                if (live.time > b.next && b.t < 0) b.t = 0;
                if (b.t >= 0) {
                    b.t += dt;
                    close = Math.sin(Math.min(b.t / 0.16, 1) * Math.PI);
                    if (b.t > 0.16) {
                        b.t = -1;
                        b.next = live.time + 3 + Math.random() * 4;
                    }
                }
            }
            lid.current.rotation.x = 0.22 + close * 1.35 - p.eyeFocus * 0.1;
        }
    });

    return (
        <group position={[side * 0.21, 0, 0]}>
            <mesh material={materials.sclera}>
                <sphereGeometry args={[0.095, 32, 24]} />
            </mesh>
            <group ref={look}>
                <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.iris}>
                    <sphereGeometry args={[0.097, 32, 8, 0, Math.PI * 2, 0, 0.55]} />
                </mesh>
                <mesh ref={pupil} position={[0, 0, 0.0005]} rotation={[Math.PI / 2, 0, 0]} material={materials.pupil}>
                    <sphereGeometry args={[0.0975, 32, 8, 0, Math.PI * 2, 0, 0.24]} />
                </mesh>
            </group>
            <mesh ref={lid} material={materials.clay} rotation={[0.22, 0, 0]}>
                <sphereGeometry args={[0.103, 32, 12, 0, Math.PI * 2, 0, 1.25]} />
            </mesh>
            {/* Coral lens rings: the eye becoming an optical instrument. */}
            <group ref={lens} position={[0, 0, 0.13]} scale={0.0001} visible={false}>
                <mesh material={materials.lens}>
                    <torusGeometry args={[0.15, 0.008, 12, 64]} />
                </mesh>
                <mesh material={materials.lens} position={[0, 0, 0.06]}>
                    <torusGeometry args={[0.2, 0.004, 8, 64, Math.PI * 1.6]} />
                </mesh>
            </group>
        </group>
    );
}
