// A game in which one maybe group is left and the player only has one unknown card
export { default as singleMaybeGroup } from './singleMaybeGroup.js';
// A game in which two maybe groups are left and the player only has two unknown cards
export { default as multiMaybeGroup } from './multiMaybeGroup.js';
// A game in which the player only has two unknown cards, the maybe group size is three, but the MDS size is two
export { default as maybeGroupMDS } from './maybeGroupMDS.js';
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
