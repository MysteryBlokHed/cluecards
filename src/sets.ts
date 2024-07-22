import type { GameSet } from './types';

/** Default list of suspects */
const suspects = () => ['Green', 'Plum', 'Mustard', 'Peacock', 'Scarlett', 'White'];

const SETS = {
    Clue: {
        suspects: suspects(),
        weapons: ['Candlestick', 'Dagger', 'Lead Pipe', 'Revolver', 'Rope', 'Wrench'],
        rooms: [
            'Ballroom',
            'Billiard Room',
            'Conservatory',
            'Dining Room',
            'Hall',
            'Kitchen',
            'Library',
            'Lounge',
            'Study',
        ],
    },
    'Murder Express': {
        suspects: suspects(),
        weapons: ['Lamp', 'Knife', 'Coal Shovel', 'Glass', 'Velvet Rope', 'Spanner'],
        rooms: [
            'Signal Box',
            'Lounge Car',
            'Sleeper Car',
            'Taxi Rank',
            'Concourse',
            'Station Bar',
            'Dining Car',
            'Barber Shop',
            'Engine',
        ],
    },
    'Tropical Mystery': {
        suspects: suspects(),
        weapons: ['Harpoon', 'Diving Knife', 'Oxygen Tank', 'Flare Gun', 'Spyglass', 'Oar'],
        rooms: [
            'Helicopter Pad',
            'Games Room',
            'Hot Tub',
            'Dining Room',
            'Bridge',
            'Bar',
            'Observation Bay',
            'Bedroom',
            'Lounge',
        ],
    },
    Hollywood: {
        suspects: suspects(),
        weapons: ['Award', 'Dagger', 'Lead Pipe', 'Pistol', 'Velvet Rope', 'Wrench'],
        rooms: [
            'Roman Set',
            'Sci Fi Set',
            "Director's Office",
            'Cinema',
            'Hall',
            'Dressing Room',
            'Western Set',
            'Editing Room',
            'Prop Room',
        ],
    },
} as const satisfies Record<string, GameSet>;

export default SETS;
