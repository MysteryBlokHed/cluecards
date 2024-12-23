import { CardType, type GameSet } from './types.js';

export function cardsPerHandFrac(set: GameSet, players: number) {
    return (set.suspects.length + set.weapons.length + set.rooms.length - 3) / players;
}

export function cardsPerHand(set: GameSet, players: number) {
    return Math.ceil(cardsPerHandFrac(set, players));
}

/**
 * Packs a card into a single number for easier storage + comparison
 * @param type The card type
 * @param card The card index
 */
export function packCard(type: CardType, card: number) {
    return (card << 2) | type;
}

/**
 * Unpacks a {@link packCard packed} card
 * @param packed The packed card
 */
export function unpackCard(packed: number): [type: CardType, card: number] {
    return [packed & 3, packed >> 2];
}

/**
 * Return all cards in a game set, {@link packCard packed}
 * @param set The set to use
 */
export function packSet(set: GameSet) {
    const cards: number[] = new Array(cardsPerHand(set, 1));

    let i: number;
    let j: number;
    let k: number;

    for (i = 0; i < set.suspects.length; i++) cards[i] = packCard(CardType.Suspect, i);
    for (j = 0; j < set.weapons.length; j++) cards[i + j] = packCard(CardType.Weapon, j);
    for (k = 0; k < set.rooms.length; k++) cards[i + j + k] = packCard(CardType.Room, k);

    return cards;
}

/**
 * Converts a {@link CardType} to a string (for displaying).
 * @param type The type to display
 */
export function cardTypeToString(type: CardType) {
    switch (type) {
        case CardType.Nothing:
            return 'Nothing';
        case CardType.Unknown:
            return 'Unknown';
        case CardType.Suspect:
            return 'Suspect';
        case CardType.Weapon:
            return 'Weapon';
        case CardType.Room:
            return 'Room';
    }
}

/**
 * Converts a {@link CardType} to a key for indexing certain objects.\
 * This does not apply for arrays—the enum is directly usable for them.
 * @param type The type to use as a key
 */
export function cardTypeToKey(type: CardType) {
    switch (type) {
        case CardType.Suspect:
            return 'suspects';
        case CardType.Weapon:
            return 'weapons';
        case CardType.Room:
            return 'rooms';
    }

    throw new TypeError('Type provided cannot be turned into key');
}
