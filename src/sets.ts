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
    'The Black Adder Resort': {
        suspects: suspects(),
        weapons: ['Fishing Line', 'Flare Gun', 'Hammer', 'Hatchet', 'Knife', 'Poison'],
        rooms: [
            'Hidden Cove',
            'Botanical Spa',
            'Palm Lounge',
            'Concierge Station',
            'Lifeguard Post',
            'Royal Villa',
            'Infinity Pool',
            'Utility Room',
            'Observation Deck',
        ],
    },
    'Wild West': {
        suspects: suspects(),
        weapons: ['Horseshoe', 'Knife', 'Gold Nugget', 'Six Shooter', 'Whip', 'Pickaxe'],
        rooms: [
            'Graveyard',
            'Jail',
            "Sheriff's Office",
            'Bank',
            'Main Street',
            'Saloon',
            "Blacksmith's",
            'General Store',
            'Courthouse',
        ],
    },
    'Snowy Peaks': {
        suspects: suspects(),
        weapons: ['Poker', 'Icicle', 'Ski', 'Ski Pole', 'Rope', 'Ice Axe'],
        rooms: [
            'Hot Tub Room',
            'Sauna',
            'Lounge',
            'Ice Room',
            'Lift Station',
            'Observatory',
            'Boot Room',
            'Bar',
            'Bedroom',
        ],
    },
    'Egyptian Adventure': {
        suspects: suspects(),
        weapons: ['Pickaxe', 'Dagger', 'Ankh', 'Sceptre', 'Pistol', 'Khopesh'],
        rooms: [
            'Sphinx',
            'Oasis',
            'Airstrip',
            'Boat',
            'Temple',
            'Waterfall',
            'Market',
            'Tent',
            'Tomb',
        ],
    },
} as const satisfies Record<string, GameSet>;

export default SETS;
