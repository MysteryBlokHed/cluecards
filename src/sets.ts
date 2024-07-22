import type { GameSet } from './types';

const SETS = {
    Clue: {
        suspects: ['Mustard', 'White', 'Scarlett', 'Peacock', 'Plum', 'Green'],
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
        suspects: ['Scarlett', 'Peacock', 'Orchid', 'Green', 'Mustard', 'Plum'],
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
        suspects: ['Mustard', 'White', 'Brunette', 'Plum', 'Peach', 'Scarlett'],
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
        suspects: ['Mustard', 'White', 'Moriarty', 'Green', 'Peach', 'Rose'],
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
