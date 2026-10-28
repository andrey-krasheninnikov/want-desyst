import tokens from '../tokens.json';
import './styles.css';
export { tokens };
export type Theme = 'light' | 'dark';
export { initInteractionEffects, burstConfetti } from './effects.js';
export { initBackgroundMotion } from './background.js';
