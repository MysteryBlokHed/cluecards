import type { GameSet } from './types.js';

/** Max cards per category — the inference engine packs cards into a u64 bitmask. */
export const MAX_CARDS_PER_CATEGORY = 16;

/** Structural check for untrusted data (e.g. imported strings). */
export function isGameSetShaped(value: unknown): value is GameSet {
    if (typeof value !== 'object' || value === null) return false;
    const set = value as Record<string, unknown>;
    return (['suspects', 'weapons', 'rooms'] as const).every(
        key => Array.isArray(set[key]) && (set[key] as unknown[]).every(v => typeof v === 'string'),
    );
}

/** Full game-rules validation (used to gate saving). */
export function setIsValid(set: GameSet | null): boolean {
    if (!set) return false;
    // Ensure at least 2 of each category
    if (set.suspects.length < 2 || set.weapons.length < 2 || set.rooms.length < 2) {
        return false;
    }
    // Ensure no category exceeds the engine's per-category card limit
    if (
        set.suspects.length > MAX_CARDS_PER_CATEGORY ||
        set.weapons.length > MAX_CARDS_PER_CATEGORY ||
        set.rooms.length > MAX_CARDS_PER_CATEGORY
    ) {
        return false;
    }
    // Ensure everything has a value
    if (
        set.suspects.some(val => !val) ||
        set.weapons.some(val => !val) ||
        set.rooms.some(val => !val)
    ) {
        return false;
    }
    // Ensure values are unique across all categories
    const suspectSet = new Set(set.suspects.map(val => val.trim()));
    const weaponSet = new Set(set.weapons.map(val => val.trim()));
    const roomSet = new Set(set.rooms.map(val => val.trim()));
    const totalSet = suspectSet.union(weaponSet).union(roomSet);
    if (totalSet.size !== set.suspects.length + set.weapons.length + set.rooms.length) {
        return false;
    }

    return true;
}
