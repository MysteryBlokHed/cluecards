// A game in which one maybe group is left and the player only has one unknown card
export { default as singleMaybeGroup } from './singleMaybeGroup.js';
// A game in which two maybe groups are left and the player only has two unknown cards
export { default as multiMaybeGroup } from './multiMaybeGroup.js';
// A game in which the player only has two unknown cards, and the maybe group size is three
export { default as maybeGroupMHS } from './maybeGroupMHS.js';
// A game in which we know all cards in a player's hand
export { default as maxCardCount } from './maxCardCount.js';
// A game in which we have ruled out all but three cards for a player who has a three-card hand
export { default as minCardCount } from './minCardCount.js';
// A game in which two players have the same two-card maybe group
export { default as sizeTwoMaybeGroups } from './sizeTwoMaybeGroups.js';
// A game in which all but one suspect has been proven innocent (making the final one guilty)
export { default as allButOneInnocent } from './allButOneInnocent.js';
// A game in which the guilty suspect is known, and there is only one player who doesn't have another suspect marked missing
export { default as oneWithGuilty } from './oneWithGuilty.js';
// A game in which one player is the only person not ruled out for multiple suspects
export { default as soloMultiMissingSingleCat } from './soloMultiMissingSingleCat.js';
// A game in which one player is the only person not ruled out for multiple suspects and weapons
export { default as soloMultiMissingMultiCat } from './soloMultiMissingMultiCat.js';
// A game in which there's a maybe group configuration that can only be narrowed with MHS
export { default as minimumHittingSet } from './minimumHittingSet.js';
