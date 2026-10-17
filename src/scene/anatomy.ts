import type { Vec3 } from './choreography';

/** Finger layout in the hand's local frame: [x, length, upward curl in radians]. */
export const FINGERS: [number, number, number][] = [
    [-0.27, 0.36, 0.22],
    [-0.09, 0.4, 0.16],
    [0.09, 0.38, 0.18],
    [0.27, 0.32, 0.26]
];
export const FINGERTIPS = FINGERS.map(([x, len, curl]) => [x, 0.06 + Math.sin(curl) * len, 0.4 + Math.cos(curl) * len] as Vec3);
