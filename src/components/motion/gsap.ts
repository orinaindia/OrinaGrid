'use client';

/**
 * GSAP with the plugins the site uses, registered once (GSAP 3.13+ ships them all free).
 * Import gsap from here, never from 'gsap' directly, so the plugins are always registered.
 */
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, useGSAP);
gsap.defaults({ ease: 'expo.out', duration: 1 });

/** Motion only for people who have not asked their device to reduce it. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export { gsap, ScrollTrigger, SplitText, useGSAP };
