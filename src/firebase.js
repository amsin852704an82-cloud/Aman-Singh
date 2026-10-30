// BharatConnect - Unified Firebase Re-export
// Delegates to single shared instance in src/lib/firebase.ts to prevent duplicate listeners & connection pool exhaustion.

export * from './lib/firebase';
import { app } from './lib/firebase';
export default app;
