import * as THREE from 'three';

/** Mirrors the CSS tokens in src/css/main.css, plus the character-only clay tone. */
export const palette = {
    bone: '#f4f0e8',
    boneDeep: '#e2dacb',
    ink: '#191919',
    knit: '#2a2826',
    clay: '#c4875f',
    blue: '#3949ff',
    lime: '#d9ff45',
    coral: '#ff765e',
    iris: '#3a2a22'
};

/**
 * Shared, never-mutated materials. Interactive objects that change colour get their
 * own instance from `accent()` so state never leaks between objects.
 */
export const materials = {
    clay: new THREE.MeshStandardMaterial({ color: palette.clay, roughness: 0.78 }),
    clayInside: new THREE.MeshStandardMaterial({ color: palette.clay, roughness: 0.9, side: THREE.DoubleSide }),
    knit: new THREE.MeshStandardMaterial({ color: palette.knit, roughness: 1 }),
    hair: new THREE.MeshStandardMaterial({ color: palette.ink, roughness: 0.72 }),
    ink: new THREE.MeshStandardMaterial({ color: palette.ink, roughness: 0.6 }),
    plinth: new THREE.MeshStandardMaterial({ color: palette.boneDeep, roughness: 0.95 }),
    sclera: new THREE.MeshStandardMaterial({ color: '#fbf8f2', roughness: 0.35 }),
    iris: new THREE.MeshStandardMaterial({ color: palette.iris, roughness: 0.3 }),
    pupil: new THREE.MeshStandardMaterial({ color: '#0c0c0c', roughness: 0.2 }),
    lens: new THREE.MeshStandardMaterial({ color: palette.coral, roughness: 0.35, transparent: true }),
    marker: new THREE.MeshBasicMaterial({ color: palette.blue, transparent: true, opacity: 0, depthWrite: false }),
    wireLime: new THREE.MeshStandardMaterial({ color: palette.lime, roughness: 0.6, transparent: true }),
    shadow: new THREE.ShadowMaterial({ opacity: 0.12 })
};

export function accent() {
    return new THREE.MeshStandardMaterial({ color: palette.bone, roughness: 0.6 });
}

const BONE = new THREE.Color(palette.bone);
const BLUE = new THREE.Color(palette.blue);

/** Blend an accent material between resting bone and interactive blue. */
export function tintAccent(material: THREE.MeshStandardMaterial, amount: number) {
    material.color.copy(BONE).lerp(BLUE, amount);
    material.roughness = 0.6 - amount * 0.35;
}
