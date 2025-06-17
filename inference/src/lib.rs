#![warn(clippy::pedantic)]
#![allow(
    clippy::cast_sign_loss,
    clippy::cast_possible_truncation,
    clippy::missing_errors_doc,
    clippy::struct_field_names,
    clippy::too_many_lines
)]
use std::collections::{BTreeMap, HashSet};

use serde::{de::Visitor, Deserialize, Serialize};
use serde_wasm_bindgen::{from_value, to_value};
use wasm_bindgen::prelude::*;

/// A way to represent the data that comes with a variant of Clue.
#[derive(Clone, Debug, Eq, PartialEq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct GameSet {
    suspects: Box<[String]>,
    weapons: Box<[String]>,
    rooms: Box<[String]>,
}

/// One of potentially multiple responses to a [`Suggestion`].
/// Note that this version (i.e. the Rust struct vs the TS interface)
/// does not include the `source` key, as it is not used.
#[derive(Clone, Debug, Eq, PartialEq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct SuggestionResponse {
    /// The index of the player showing the card.
    player: usize,
    /// The type of card shown.
    card_type: i8,
    /// The index of the card shown, or `-1` if the card is unknown.
    card: Option<i8>,
}

/// A suggestion from one player to the others.
#[derive(Clone, Debug, Eq, PartialEq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct Suggestion {
    /// The index of the player suggesting.
    player: usize,
    /// The indices of the cards in question.
    /// Ordered so that it may be indexed by [`CardType`] (or at least in the TypeScript code).
    cards: [u8; 3],
    /// Responses given by other players.
    responses: Box<[SuggestionResponse]>,
}

/// Bitmask to efficiently represent a set of bytes.
#[derive(Copy, Clone, Debug, Default, Eq, PartialEq, Serialize, Hash)]
pub struct BitmaskSet(u64);

impl BitmaskSet {
    #[inline]
    #[must_use]
    pub fn new() -> Self {
        Self::default()
    }

    /// Wrapper around `.count_ones()` that also casts to usize for convenience.
    #[inline]
    #[must_use]
    pub fn len(&self) -> usize {
        self.0.count_ones() as usize
    }

    /// Whether the set has no elements.
    #[inline]
    #[must_use]
    pub fn is_empty(&self) -> bool {
        self.0 == 0
    }

    /// Adds an item to the set.
    pub fn add(&mut self, card: u8) {
        self.0 |= 1 << u64::from(card);
    }

    /// Removes an item from the set.
    pub fn remove(&mut self, card: u8) {
        self.0 &= !(1 << u64::from(card));
    }

    /// Determines whether the set contains an item.
    #[must_use]
    pub fn contains(&self, card: u8) -> bool {
        (self.0 & (1 << u64::from(card))) != 0
    }

    /// Sets this set to the union of itself and another.
    pub fn set_union(&mut self, other: &Self) {
        self.0 |= other.0;
    }

    /// Sets this set to the intersection of itself and another.
    pub fn set_intersection(&mut self, other: &Self) {
        self.0 &= other.0;
    }

    /// Removes all items in this set that are in `other`.
    pub fn set_difference(&mut self, other: &Self) {
        self.0 &= !other.0;
    }

    /// Determines whether this set has _no_ overlap with another.
    #[must_use]
    pub fn is_disjoint(&self, other: &Self) -> bool {
        self.0 & other.0 == 0
    }

    /// Iterates over the contained items.
    #[must_use]
    pub fn iter(&self) -> BitmaskSetIterator {
        BitmaskSetIterator {
            set: self.0,
            current: 0,
        }
    }
}

impl FromIterator<u8> for BitmaskSet {
    fn from_iter<T: IntoIterator<Item = u8>>(iter: T) -> Self {
        Self(
            iter.into_iter()
                .fold(0u64, |set, current| set | (1 << u64::from(current))),
        )
    }
}

impl<'de> Deserialize<'de> for BitmaskSet {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        struct BitmaskSetVisitor;

        impl<'de> Visitor<'de> for BitmaskSetVisitor {
            type Value = BitmaskSet;

            fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
                formatter.write_str("A list of bytes")
            }

            fn visit_seq<A>(self, mut seq: A) -> Result<Self::Value, A::Error>
            where
                A: serde::de::SeqAccess<'de>,
            {
                let mut card_set = BitmaskSet::new();
                while let Some(packed) = seq.next_element::<u8>()? {
                    card_set.add(packed);
                }
                Ok(card_set)
            }
        }

        deserializer.deserialize_seq(BitmaskSetVisitor)
    }
}

pub struct BitmaskSetIterator {
    set: u64,
    current: u8,
}

impl Iterator for BitmaskSetIterator {
    type Item = u8;

    fn next(&mut self) -> Option<Self::Item> {
        while self.current < 64 {
            let mut next_val = None;
            if (self.set & (1 << u64::from(self.current))) != 0 {
                next_val = Some(self.current);
            }
            self.current += 1;
            if next_val.is_some() {
                return next_val;
            }
        }
        None
    }
}

impl IntoIterator for &BitmaskSet {
    type Item = u8;
    type IntoIter = BitmaskSetIterator;

    fn into_iter(self) -> Self::IntoIter {
        BitmaskSetIterator {
            set: self.0,
            current: 0,
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerHand {
    /// A set of [packed][`pack_card`] cards that the player has.
    has: BitmaskSet,
    /// A set of [packed][`pack_card`] cards that the player does not have.
    missing: BitmaskSet,
    /// Groups potential cards for the player by suggestion.
    maybe_groups: Vec<BitmaskSet>,
}

impl TryFrom<&PlayerHand> for JsValue {
    type Error = JsValue;

    fn try_from(value: &PlayerHand) -> Result<Self, Self::Error> {
        // Convert sets
        let has_js = js_sys::Set::default();
        for value in &value.has {
            has_js.add(&JsValue::from(value));
        }
        let missing_js = js_sys::Set::default();
        for value in &value.missing {
            missing_js.add(&JsValue::from(value));
        }
        let maybe_js = js_sys::Set::default();
        for value in &value
            .maybe_groups
            .iter()
            .fold(BitmaskSet::new(), |mut union, current| {
                union.set_union(current);
                union
            })
        {
            maybe_js.add(&JsValue::from(value));
        }

        // Convert maybe groups
        let all_maybe_groups_js = js_sys::Array::default();
        for maybe_group in &value.maybe_groups {
            let maybe_group_js = js_sys::Set::default();
            for value in maybe_group {
                maybe_group_js.add(&JsValue::from(value));
            }
            all_maybe_groups_js.push(&maybe_group_js);
        }

        // Create PlayerHand object
        let player_hand_js = js_sys::Object::default();
        js_sys::Reflect::set(&player_hand_js, &JsValue::from_str("has"), &has_js)?;
        js_sys::Reflect::set(&player_hand_js, &JsValue::from_str("missing"), &missing_js)?;
        js_sys::Reflect::set(&player_hand_js, &JsValue::from_str("maybe"), &maybe_js)?;
        js_sys::Reflect::set(
            &player_hand_js,
            &JsValue::from_str("maybeGroups"),
            &all_maybe_groups_js,
        )?;

        Ok(player_hand_js.into())
    }
}

/// Information about a suspect/weapon/room and whether or not it was used for the murder.
#[derive(Clone, Debug, Eq, PartialEq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct Known {
    /// Either `"innocent"` or `"guilty"`.
    #[serde(rename = "type")]
    known_type: String,
    /// The [`CardType`].
    card_type: u8,
    /// The card ID with respect to its type (i.e. _not_ packed).
    card: u8,
    /// The index of the player that this known is from.
    player: usize,
    source: u8,
}

pub struct CardType;

impl CardType {
    pub const NOTHING: i8 = -2;
    pub const UNKNOWN: i8 = -1;
    pub const SUSPECT: i8 = 0;
    pub const WEAPON: i8 = 1;
    pub const ROOM: i8 = 2;
}

// JS functions used by the Rust code
#[wasm_bindgen]
extern "C" {
    // Console
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn js_log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn js_log_obj(s: &JsValue);

    #[wasm_bindgen(js_namespace = console, js_name = warn)]
    fn js_warn(s: &str);

    // Performance
    #[wasm_bindgen(js_namespace = performance, js_name = now)]
    fn js_now() -> f64;
}

// TypeScript types--used for documentation only
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(extends = js_sys::Array, typescript_type = "readonly Suggestion[]")]
    pub type JsReadonlySuggestions;

    #[wasm_bindgen(extends = js_sys::Array, typescript_type = "readonly Known[]")]
    pub type JsReadonlyKnowns;

    #[wasm_bindgen(extends = js_sys::Array, typescript_type = "readonly PlayerHand[]")]
    pub type JsReadonlyPlayerHands;

    #[wasm_bindgen(extends = js_sys::Object, typescript_type = "GameSet")]
    pub type JsGameSet;

    #[wasm_bindgen(extends = js_sys::Array, typescript_type = "readonly number[]")]
    pub type JsReadonlyNumbers;
}

#[wasm_bindgen(typescript_custom_section)]
const TYPESCRIPT: &'static str = r#"import type { Suggestion, Known, PlayerHand, GameSet } from "../../src/types.js";
import type { updateSuggestions } from "../../src/inference.js";"#;

/// Finds _all_ the minimum hitting sets for a given collection of sets.
/// A hitting set is a subset of elements such that each set in the collection
/// contains at least one element from the hitting set. A minimum hitting set
/// is one of the smallest such subsets.
///
/// Since there may be multiple minimum hitting sets, this function returns a list of them all.
///
/// If the return type is [`Some`], the first element is the size of the minimum hitting set
/// (i.e. the size that all of the contained sets have), and the [`Vec`] is the list of minimum sets.
fn find_minimum_hitting_sets(sets: &[&BitmaskSet]) -> Option<(usize, Vec<BitmaskSet>)> {
    // Get all unique elements from the collection
    let mut universe = BitmaskSet::new();
    for set in sets {
        universe.set_union(set);
    }
    let universe = universe.into_iter().collect::<Box<_>>();

    // The current list of smallest hitting sets
    let mut hitting_sets: Vec<BitmaskSet> = Vec::new();
    // The size of the current smallest hitting set
    let mut current_smallest = usize::MAX;

    let n = universe.len();
    // Generate candidate subsets using bitmasking
    for mask in 0..(1 << n) {
        let mut subset = BitmaskSet::new();
        for i in 0..n {
            if mask & (1 << i) != 0 {
                subset.add(universe[i]);
            }
        }

        // If the set is a hitting set, and is at most as large as the current smallest sets, save it
        let subset_len = subset.len();
        if subset_len <= current_smallest && sets.iter().all(|set| !set.is_disjoint(&subset)) {
            // Reset list of minimum hitting sets if we found a new smallest set
            if subset_len < current_smallest {
                current_smallest = subset_len;
                hitting_sets.clear();
            }

            hitting_sets.push(subset);
        }
    }

    if hitting_sets.is_empty() {
        None
    } else {
        Some((current_smallest, hitting_sets))
    }
}

/// Packs a card into a single integer for easier storage + comparison.
#[inline]
fn pack_card(card_type: u8, card: u8) -> u8 {
    (card << 2) | card_type
}

/// Unpacks a [packed][`pack_card`] card.
#[inline]
fn unpack_card(packed: u8) -> (u8, u8) {
    (packed & 3, packed >> 2)
}

/// Produces all cards in a game set, [packed][`pack_card`].
/// This will return identical lists for sets with the same amount of cards
/// (i.e. all standard Clue sets have the same packed form).
fn pack_set(set: &GameSet) -> Box<[u8]> {
    let suspects = (0..set.suspects.len()).map(|suspect| pack_card(0, suspect as u8));

    let weapons = (0..set.weapons.len()).map(|weapon| pack_card(1, weapon as u8));

    let rooms = (0..set.rooms.len()).map(|room| pack_card(2, room as u8));

    suspects.chain(weapons).chain(rooms).collect()
}

/// Pack the three cards from a suggestion.
fn pack_suggestions(cards: [u8; 3]) -> [u8; 3] {
    [
        pack_card(0, cards[0]),
        pack_card(1, cards[1]),
        pack_card(2, cards[2]),
    ]
}

/// Get a list of empty hands for `players` players.
fn empty_hands(players: usize) -> Box<[PlayerHand]> {
    (0..players).map(|_| PlayerHand::default()).collect()
}

/// Tries to determine guilty cards from hands by finding cards that all players are missing.
/// Cards are returned in a form similar to [`Suggestion::cards`], like `[suspect, weapon, room]`.
fn guilty_from_hands(hands: &[PlayerHand]) -> [Option<u8>; 3] {
    let mut guilty = [None, None, None];

    // Get cards all players are missing
    let all_missing: Option<BitmaskSet> = hands.iter().map(|hand| &hand.missing).fold(
        None,
        |intersection: Option<BitmaskSet>, current: &BitmaskSet| match intersection {
            Some(mut intersection) => {
                intersection.set_intersection(current);
                Some(intersection)
            }
            None => Some(*current),
        },
    );

    let Some(all_missing) = all_missing else {
        return guilty;
    };

    for packed in &all_missing {
        let (card_type, card) = unpack_card(packed);
        guilty[card_type as usize] = Some(card);
    }

    guilty
}

/// Iterative function to do repeated inference for [`infer`].
/// Originally recursive, now just separated into its own function for readability.
fn infer_iterative(
    player_card_counts: &[usize],
    set: &GameSet,
    mut hands: Box<[PlayerHand]>,
    packed_set: &[u8],
) -> Result<Box<[PlayerHand]>, String> {
    let total_cards = packed_set.len();
    let player_count = hands.len();

    let hands_ptr = hands.as_mut_ptr();

    loop {
        // If a hand changes this iteration, this variable is set to true and we loop again
        let mut hands_changed = false;

        /// A helper macro to identify whether an expression has changed the hands.
        /// The first parameter is the property to observe for changes,
        /// and the second parameter is the expression to execute.
        ///
        /// A [`Copy`] type should ideally be used.
        macro_rules! check_change {
            ($target:expr, $body:block) => {{
                let __old = $target.clone();
                $body
                if $target != __old {
                    hands_changed = true;
                }
            }};
        }

        // Hand-by-hand inferences
        for (i, hand) in hands.iter_mut().enumerate() {
            // =========================
            // If we know all but one card in a player's hand, and there exists a "maybe group"
            // which has no intersection with the "has" set,
            // then the final card must be one of the cards in the "maybe group"
            // =========================
            if hand.has.len() == player_card_counts[i] - 1 {
                let group = hand
                    .maybe_groups
                    .iter()
                    .find(|group| group.is_disjoint(&hand.has));

                if let Some(group) = group {
                    check_change!(hand.missing, {
                        hand.missing.set_union(
                            &packed_set
                                .iter()
                                .filter(|&&card| !group.contains(card) && !hand.has.contains(card))
                                .copied()
                                .collect(),
                        );
                    });
                }
            }
            // =========================
            // If the size of the minimum hitting set for a player's maybe groups
            // equals the number of unknown cards in their hand,
            // all cards that are not in any possible minimum hitting set can be eliminated.
            // This is a generalization of the previous case, but it is harder to compute so we try the former first
            // =========================
            else if hand.maybe_groups.len() >= player_card_counts[i] - hand.has.len() {
                let eligible_groups = hand
                    .maybe_groups
                    .iter()
                    .filter(|group| group.is_disjoint(&hand.has))
                    .collect::<Vec<_>>();

                if !eligible_groups.is_empty() {
                    'min_hitting_sets: {
                        let Some((min_size, min_hitting_sets)) =
                            find_minimum_hitting_sets(&eligible_groups)
                        else {
                            break 'min_hitting_sets;
                        };

                        if min_size >= player_card_counts[i] - hand.has.len() {
                            let cards_in_hand = min_hitting_sets.into_iter().fold(
                                BitmaskSet::new(),
                                |mut union, current| {
                                    union.set_union(&current);
                                    union
                                },
                            );

                            let missing_cards = packed_set
                                .iter()
                                .filter(|&&card| {
                                    !hand.has.contains(card) && !cards_in_hand.contains(card)
                                })
                                .copied();

                            check_change!(hand.missing, {
                                hand.missing.set_union(&missing_cards.collect());
                            });
                        }
                    }
                }
            }

            // =========================
            // Actions based on card count
            // =========================
            if hand.has.len() >= player_card_counts[i] {
                // If a player has all the cards allowed in their hand, check everything else off
                check_change!(hand.missing, {
                    hand.missing.set_union(
                        &packed_set
                            .iter()
                            .filter(|&&card| !hand.has.contains(card))
                            .copied()
                            .collect(),
                    );
                });
            } else if hand.missing.len() >= total_cards - player_card_counts[i] {
                // If a player has every card crossed off except for the # of cards in their hand, they must have those cards
                check_change!(hand.has, {
                    hand.has.set_union(
                        &packed_set
                            .iter()
                            .filter(|&&card| !hand.missing.contains(card))
                            .copied()
                            .collect(),
                    );
                });
            }

            // =========================
            // Make sure that no player has cards appearing in more than one list
            // =========================
            if !hand.has.is_disjoint(&hand.missing) {
                return Err(format!(
                    "Player {i} is marked as both having and not having a card"
                ));
            }

            // =========================
            // Update maybe groups
            // =========================
            let mut maybe_groups_to_delete = BitmaskSet::new();
            for (key, maybe_group) in hand.maybe_groups.iter_mut().enumerate() {
                // Remove any groups that share a card with the has set (since these groups are useless for inference)
                if !maybe_group.is_disjoint(&hand.has) {
                    maybe_groups_to_delete.add(key as u8);
                    continue;
                }

                // Remove any cards from maybe groups that are marked missing
                check_change!(*maybe_group, { maybe_group.set_difference(&hand.missing) });

                // If the group has one card, mark it as held
                if maybe_group.len() == 1 {
                    let last = unsafe { maybe_group.iter().next().unwrap_unchecked() };
                    check_change!(hand.has, { hand.has.add(last) });
                }

                // If the group is empty, mark it for deletion
                if maybe_group.is_empty() {
                    maybe_groups_to_delete.add(key as u8);
                }
            }

            if !maybe_groups_to_delete.is_empty() {
                // No need for check_change! here--if there are groups to delete,
                // then the hands obviously have changed
                hands_changed = true;

                let mut index = 0;
                hand.maybe_groups.retain(|_| {
                    let retain = !maybe_groups_to_delete.contains(index);
                    index += 1;
                    retain
                });
            }

            // =========================
            // If a player is confirmed to have a card, mark it as missing for everyone else
            // =========================
            for j in 0..player_count {
                if i == j {
                    continue;
                }

                // This needs to be unsafe because there is an active mutable borrow on `hands`
                unsafe {
                    let other_hand = &mut *hands_ptr.add(j);
                    check_change!(other_hand.missing, {
                        other_hand.missing.set_union(&hand.has);
                    });
                }
            }
        }

        // These variables are used in the inference method _after_ the following one,
        // but the immediately following method can help by adding cards
        let mut all_has_packed =
            hands
                .iter()
                .map(|hand| &hand.has)
                .fold(BitmaskSet::new(), |mut union, current| {
                    union.set_union(current);
                    union
                });

        // =========================
        // If there are two maybe groups of size 2 that are common between two players,
        // then one card in the group must be held by each player (i.e. they cannot be murder cards)
        // =========================
        let size_two_groups = hands
            .iter()
            .map(|hand| {
                hand.maybe_groups
                    .iter()
                    .filter(|group| group.len() == 2)
                    .collect::<Box<_>>()
            })
            .collect::<Box<_>>();

        for i in 0..player_count - 1 {
            if size_two_groups[i].is_empty() {
                continue;
            }

            for j in (i + 1)..player_count {
                if size_two_groups[j].is_empty() {
                    continue;
                }

                // See if any sets are the same
                for set1 in &size_two_groups[i] {
                    for set2 in &size_two_groups[j] {
                        if set1 == set2 {
                            // Get the two cards from the set
                            let mut set_iter = set1.iter();
                            let card1 = unsafe { set_iter.next().unwrap_unchecked() };
                            let card2 = unsafe { set_iter.next().unwrap_unchecked() };
                            all_has_packed.add(card1);
                            all_has_packed.add(card2);

                            // Rule the cards out for other players
                            for k in 0..player_count {
                                if i == k || j == k {
                                    continue;
                                }
                                check_change!(hands[k].missing, {
                                    // This needs to be unsafe because there is an active borrow on `hands`
                                    let missing = unsafe { &mut (*hands_ptr.add(k)).missing };
                                    missing.add(card1);
                                    missing.add(card2);
                                });
                            }
                        }
                    }
                }
            }
        }

        // =========================
        // If all but one card in a category is marked off,
        // the remaining card must be guilty
        // =========================
        let mut all_has: [BitmaskSet; 3] =
            [BitmaskSet::new(), BitmaskSet::new(), BitmaskSet::new()];
        for card in &all_has_packed {
            let (card_type, card) = unpack_card(card);
            all_has[card_type as usize].add(card);
        }

        for (card_type, cards) in all_has.iter().enumerate() {
            let cards_of_type = match card_type {
                0 => set.suspects.len(),
                1 => set.weapons.len(),
                2 => set.rooms.len(),
                _ => unreachable!(),
            };
            if cards.len() == cards_of_type - 1 {
                // Find the card not held by any player
                let card = unsafe {
                    (0..(cards_of_type as u8))
                        .find(|card| !cards.contains(*card))
                        .unwrap_unchecked()
                };
                // Mark this card as missing for all players
                let packed = pack_card(card_type as u8, card);
                for hand in &mut hands {
                    check_change!(hand.missing, { hand.missing.add(packed) });
                }
            }
        }

        // A mapping of packed cards to players who do _not_ have it
        let mut missing_map = BTreeMap::<u8, BitmaskSet>::new();
        for (player, hand) in hands.iter().enumerate() {
            for packed in &hand.missing {
                missing_map.entry(packed).or_default().add(player as u8);
            }
        }

        let guilty_is_known = guilty_from_hands(&hands);

        // =========================
        // If all but one player has a card marked missing,
        // and the guilty card for that category is known,
        // that one player must have the card
        // =========================
        if guilty_is_known[0].is_some()
            || guilty_is_known[1].is_some()
            || guilty_is_known[2].is_some()
        {
            // Iterate over cards that only one player is missing
            for (&packed, missing_players) in missing_map
                .iter()
                .filter(|(_, players)| players.len() == player_count - 1)
            {
                // Ignore if the guilty card is _not_ known for this category
                let (card_type, _) = unpack_card(packed);
                if guilty_is_known[card_type as usize].is_none() {
                    continue;
                }

                // Find the player that does not have the card marked missing
                let player = (0..player_count)
                    .find(|player| !missing_players.contains(*player as u8))
                    .unwrap();

                // Mark them as having the card
                check_change!(hands[player].has, { hands[player].has.add(packed) });
            }
        }
        if guilty_is_known[0].is_none()
            || guilty_is_known[1].is_none()
            || guilty_is_known[2].is_none()
        {
            // A map of players to the cards that only they can possibly have
            // (i.e. cards in everybody else's missing set), separated by category.
            // Note that cards in the list _ARE_ packed.
            let mut only_possible_by_type = BTreeMap::<usize, [Vec<u8>; 3]>::new();

            // Iterate over cards that only one player is missing
            for (&packed, missing_players) in missing_map
                .iter()
                .filter(|(_, players)| players.len() == player_count - 1)
            {
                // Ignore if the guilty card _is_ known for this category
                let (card_type, _) = unpack_card(packed);
                if guilty_is_known[card_type as usize].is_some() {
                    continue;
                }

                // Find the player that does not have the card marked missing
                let player = (0..player_count)
                    .find(|player| !missing_players.contains(*player as u8))
                    .unwrap();

                // If the player doesn't already have the card in their hand, count it
                if !hands[player].has.contains(packed) {
                    only_possible_by_type.entry(player).or_default()[card_type as usize]
                        .push(packed);
                }
            }

            // The lengths of each hand's "has" set
            let hand_has_lengths = hands.iter().map(|hand| hand.has.len()).collect::<Box<_>>();

            for (player, cards_by_cat) in
                // Only include players who have few enough unknown cards for the inference to work
                only_possible_by_type.into_iter().filter(|(player, cards)| {
                        let required_missing = cards[0].len().saturating_sub(1)
                            + cards[1].len().saturating_sub(1)
                            + cards[2].len().saturating_sub(1);

                        hand_has_lengths[*player] >= player_card_counts[*player] - required_missing
                    })
            {
                // Determine all cards that may only be held by this player
                let only_possible_cards = cards_by_cat
                    .iter()
                    .filter(|cards| cards.len() > 1)
                    .flatten()
                    .copied()
                    .collect::<Box<_>>();

                let new_missing = packed_set
                    .iter()
                    .filter(|&&card| {
                        !hands[player].has.contains(card) && !only_possible_cards.contains(&card)
                    })
                    .copied();

                check_change!(hands[player].missing, {
                    hands[player].missing.set_union(&new_missing.collect());
                });
            }
        }

        // Stop once nothing changes after trying inference
        if !hands_changed {
            break;
        }
    }

    Ok(hands)
}

/// Runs inference, but without determining the innocent cards.
/// This logic is separated because [`probabilities_recursive`] doesn't use this information,
/// so it's wasteful to generate it.
fn infer_internal(
    suggestions: &[Suggestion],
    knowns: &[Known],
    players: usize,
    player_card_counts: &[usize],
    set: &GameSet,
    first_is_self: bool,
) -> std::result::Result<Box<[PlayerHand]>, String> {
    let packed_set = pack_set(set);
    let mut starting_hands = empty_hands(players);

    // =======================
    // Non-iterative inference
    // =======================
    // Handle custom knowns
    for known in knowns {
        match known.known_type.as_str() {
            "innocent" => {
                starting_hands[known.player]
                    .has
                    .add(pack_card(known.card_type, known.card));
            }
            "guilty" => {
                let packed = pack_card(known.card_type, known.card);
                for hand in &mut starting_hands {
                    hand.missing.add(packed);
                }
            }
            _ => return Err(format!("Unexpected known type: {:?}", known.known_type)),
        }
    }

    // For the user themself, if any card is not explicitly known as innocent, they must not have it
    if first_is_self {
        // Mark as missing if they are not contained in the hand
        for &card in &packed_set {
            if !starting_hands[0].has.contains(card) {
                starting_hands[0].missing.add(card);
            }
        }
    }

    // Handle suggestions
    for suggestion in suggestions {
        // Find (packed) cards used for suggestion
        let suggestion_cards = pack_suggestions(suggestion.cards);

        for response in &suggestion.responses {
            match response.card_type {
                // A player specifically _did not_ show a card
                CardType::NOTHING => starting_hands[response.player]
                    .missing
                    .set_union(&BitmaskSet::from_iter(suggestion_cards)),

                // A player showed a card, but we do not know which
                CardType::UNKNOWN => {
                    starting_hands[response.player]
                        .maybe_groups
                        .push(BitmaskSet::from_iter(suggestion_cards));
                }

                // A player showed a card we know exactly
                _ => {
                    starting_hands[response.player].has.add(pack_card(
                        response.card_type as u8,
                        response.card.unwrap() as u8,
                    ));
                }
            }
        }
    }

    // ==============================
    // End of non-iterative inference
    // ==============================

    // Run iterative inference
    let hands = infer_iterative(player_card_counts, set, starting_hands, &packed_set)?;

    Ok(hands)
}

/// This is the internal function used by [`infer`].
/// [`infer`] is just a wrapper around this function, converting its return type into JavaScript types.
fn infer_internal_with_innocents(
    suggestions: &[Suggestion],
    knowns: &[Known],
    players: usize,
    player_card_counts: &[usize],
    set: &GameSet,
    first_is_self: bool,
) -> Result<(Box<[PlayerHand]>, BitmaskSet), String> {
    let hands = infer_internal(
        suggestions,
        knowns,
        players,
        player_card_counts,
        set,
        first_is_self,
    )?;

    // All innocent cards, derived from knowns
    let mut all_known_innocents = knowns
        .iter()
        .filter_map(|known| {
            if known.known_type == "innocent" {
                Some(pack_card(known.card_type, known.card))
            } else {
                None
            }
        })
        .collect::<BitmaskSet>();

    // All innocent cards, derived from hands
    let all_hand_innocents =
        hands
            .iter()
            .map(|hand| &hand.has)
            .fold(BitmaskSet::new(), |mut union, current| {
                union.set_union(current);
                union
            });

    all_known_innocents.set_union(&all_hand_innocents);

    Ok((hands, all_known_innocents))
}

/// Create player hand info based on suggestions and other inference.
/// Related to {@link updateSuggestions} and should likely only be called from there.
/// @param suggestions The suggestions to use
/// @param knowns Any knowns to take into consideration (that are _not_ derived from suggestions)
/// @param hands The hands to update
/// @param firstIsSelf Whether the player at index 0 is the user
/// @returns {[hands: PlayerHand[], innocents: Set<number>]}
#[wasm_bindgen]
pub fn infer(
    suggestions: JsReadonlySuggestions,
    knowns: JsReadonlyKnowns,
    players: usize,
    player_card_counts: JsReadonlyNumbers,
    set: JsValue,
    first_is_self: bool,
) -> std::result::Result<js_sys::Array, JsError> {
    // Convert passed values to Rust versions
    let suggestions: Box<[Suggestion]> =
        from_value(suggestions.into()).map_err(|_| JsError::new("Failed to parse suggestions."))?;
    let knowns: Box<[Known]> =
        from_value(knowns.into()).map_err(|_| JsError::new("Failed to parse knowns."))?;
    let player_card_counts: Box<[usize]> = from_value(player_card_counts.into())
        .map_err(|_| JsError::new("Failed to parse player card counts"))?;
    #[rustfmt::skip]
    let set: GameSet =
        from_value(set).map_err(|_| JsError::new("Failed to parse set."))?;

    let (hands, innocents) = infer_internal_with_innocents(
        &suggestions,
        &knowns,
        players,
        &player_card_counts,
        &set,
        first_is_self,
    )
    .map_err(|err| JsError::new(&err))?;

    let hands_js = JsValue::from(
        hands
            .iter()
            .map(JsValue::try_from)
            .collect::<Result<Box<[_]>, _>>()
            .map_err(|_| JsError::new("Failed to convert hands into JS object."))?,
    );

    let innocents_js = js_sys::Set::default();
    for value in &innocents {
        innocents_js.add(&JsValue::from(value));
    }

    let return_js = js_sys::Array::new_with_length(2);
    return_js.set(0, hands_js);
    return_js.set(1, innocents_js.into());

    Ok(return_js)
}

/// Used by [`probabilities`] to keep track of which hand configurations have already been seen.
fn hands_to_has(hands: &[PlayerHand]) -> Box<[BitmaskSet]> {
    hands.iter().map(|hand| hand.has).collect::<Box<_>>()
}

/// This is the internal function used by [`probabilities`].
/// [`probabilities`] is just a wrapper around this function, converting its return type into JavaScript types.
#[allow(clippy::too_many_arguments)]
fn probabilities_recursive(
    suggestions: &[Suggestion],
    set: &GameSet,
    hands: &[PlayerHand],
    player_card_counts: &[usize],
    first_is_self: bool,
    knowns: &mut Vec<Known>,
    packed_set: &[u8],
    pack_offset: usize,
    seen: &mut HashSet<Box<[BitmaskSet]>>,
    limit: f64,
    occurrences: &mut BTreeMap<(u8, u8, u8), usize>,
    start: f64,
) -> Result<(), ()> {
    let player_count = hands.len();

    let all_hands_full = hands
        .iter()
        .zip(player_card_counts.iter())
        .all(|(hand, &card_count)| hand.has.len() == card_count);

    if all_hands_full {
        'hands_full: {
            let [suspect, weapon, room] = guilty_from_hands(hands);
            let Some(suspect) = suspect else {
                break 'hands_full;
            };
            let Some(weapon) = weapon else {
                break 'hands_full;
            };
            let Some(room) = room else {
                break 'hands_full;
            };

            // Do not count if this particular arrangement of cards has already been seen
            let has_only = hands_to_has(hands);
            if seen.contains(&has_only) {
                return Ok(());
            }
            seen.insert(has_only);

            *occurrences.entry((suspect, weapon, room)).or_default() += 1;
            return Ok(());
        }
    }

    for packed_index in pack_offset..packed_set.len() {
        let packed = packed_set[packed_index];

        for (player, hand) in hands.iter().enumerate() {
            if hand.has.contains(packed) || hand.missing.contains(packed) {
                continue;
            }

            let (card_type, card) = unpack_card(packed);

            // Add new known for this card
            let known = Known {
                known_type: "innocent".into(),
                card_type,
                card,
                player,
                source: 2,
            };
            knowns.push(known);

            // Run inference

            let new_hands = infer_internal(
                suggestions,
                knowns,
                player_count,
                player_card_counts,
                set,
                first_is_self,
            );

            if let Ok(new_hands) = new_hands {
                // Recurse
                probabilities_recursive(
                    suggestions,
                    set,
                    &new_hands,
                    player_card_counts,
                    first_is_self,
                    knowns,
                    packed_set,
                    packed_index,
                    seen,
                    limit,
                    occurrences,
                    start,
                )?;
                // Remove added known
                knowns.pop();
            } else if let Err(e) = new_hands {
                js_warn(&format!("Error during probabilities infer: {e}"));
            }

            // Timeout
            if js_now() - start >= limit {
                return Err(());
            }
        }
    }

    Ok(())
}

/// Determine the odds of each suspect/weapon/room being the murder cards
/// @param suggestions The amended suggestion list
/// @param set The active game set
/// @param hands Players' hands
/// @param playerCardCounts The amount of cards in each player's hands
/// @param firstIsSelf Whether the first player is the user
/// @param knowns Starting knowns
/// @param limit Milliseconds before giving up
/// @returns {Record<`${number}|${number}|${number}`, number>} A record of strings, representing a set of murder cards, to the amount of times those cards were found.
/// Formatted as `suspect|weapon|room` (unpacked), eg. `2|3|3`
#[wasm_bindgen]
pub fn probabilities(
    suggestions: JsReadonlySuggestions,
    set: JsGameSet,
    hands: JsReadonlyPlayerHands,
    player_card_counts: JsReadonlyNumbers,
    first_is_self: bool,
    knowns: JsReadonlyKnowns,
    limit: Option<f64>,
) -> Result<JsValue, JsError> {
    // Convert passed values to Rust versions
    let suggestions: Box<[Suggestion]> =
        from_value(suggestions.into()).map_err(|_| JsError::new("Failed to parse suggestions."))?;
    #[rustfmt::skip]
    let set: GameSet =
        from_value(set.into()).map_err(|_| JsError::new("Failed to parse set."))?;
    let hands: Box<[PlayerHand]> =
        from_value(hands.into()).map_err(|_| JsError::new("Failed to parse hands."))?;
    let player_card_counts: Box<[usize]> = from_value(player_card_counts.into())
        .map_err(|_| JsError::new("Failed to parse player card counts."))?;
    let mut knowns: Vec<Known> =
        from_value(knowns.into()).map_err(|_| JsError::new("Failed to parse knowns."))?;

    let packed_set = pack_set(&set);

    let mut occurrences = BTreeMap::new();

    probabilities_recursive(
        &suggestions,
        &set,
        &hands,
        &player_card_counts,
        first_is_self,
        &mut knowns,
        &packed_set,
        0,
        &mut HashSet::new(),
        limit.unwrap_or(10_000.0),
        &mut occurrences,
        js_now(),
    )
    .map_err(|()| JsError::new("Run too long, stopping..."))?;

    // Convert result to JS
    to_value(&occurrences).map_err(|_| JsError::new("Failed to convert occurrences map."))
}
