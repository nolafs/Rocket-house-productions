export {};

// Create a type for the roles
export type Roles = 'admin' | 'member';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      status: string;
      type: string;
      role?: Roles;
    };
  }
}

declare module 'player.js';
declare module '*.png';
declare module '@madzadev/audio-player';
