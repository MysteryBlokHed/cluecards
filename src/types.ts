/** A way to represent the data that comes with a variant of Clue. */
export interface GameSet {
    suspects: string[];
    weapons: string[];
    rooms: string[];
}

export const enum RevealMethod {
    /** The card is in the player's own hand. */
    Self,
    /** The card was shown by another player. */
    Direct,
    /** The card was inferred through another player's response to a suggestion. */
    InferSuggestion,
}

/** The type of a given card. */
export const enum CardType {
    /** No card at all. */
    Nothing = -2,
    /** A card whose type is not known (such as one revealed to another player). */
    Unknown,
    Suspect,
    Weapon,
    Room,
}

/** A suspect/weapon/room known _not_ to be involved with the murder. */
export interface KnownInnocent {
    type: 'innocent';
    cardType: CardType;
    card: number;
    player: number;
    source: RevealMethod;
}

/** A suspect/weapon/room known _to be involved_ with the murder. */
export interface KnownGuilty {
    type: 'guilty';
    cardType: CardType;
    card: number;
}

export type Known = KnownInnocent | KnownGuilty;

/** One of potentially multiple responses to a {@link Suggestion}. */
export interface SuggestionResponse {
    /** The index of the player showing the card. */
    player: number;
    /** The type of card shown. */
    cardType: CardType;
    /** The index of the card shown, or `-1` if the card is unknown. */
    card: number;
    /** If this response was amended with new info, the source is specified here. */
    source?: RevealMethod | undefined;
}

/** A suggestion from one player to the others. */
export interface Suggestion {
    /** The index of the player suggesting. */
    player: number;
    /**
     * The indices of the cards in question.
     * Ordered so that it may be indexed by {@link CardType}, as long as it is not {@link CardType.Unknown}.
     */
    cards: [suspect: number, weapon: number, room: number];
    /** Responses given by other players. */
    responses: SuggestionResponse[];
}

/** Information about a card as it relates to a player. */
export interface PlayerHand {
    /** A set of {@link packCard packed} cards that the player has. */
    has: Set<number>;
    /** A set of {@link packCard packed} cards that the player does not have. */
    missing: Set<number>;
    /** A set of {@link packCard packed} cards that the player might have. */
    maybe: Set<number>;
    /** Associates {@link maybe maybes} to the suggestion(s) they come from. */
    maybeGroups: Record<number, Set<number>>;
}

export interface Preferences {
    firstIsSelf: boolean;
    autoSelectNone: boolean;
    autoHideImpossible: boolean;
    selectNextPlayers: boolean;
}
