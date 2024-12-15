# Inference

The information here isn't strictly required to use the website,
but I thought it'd be worth documenting the strategies I've come up with
to make it clearer how the website actually works.

The basic idea of the inference function is to loop through all of these inference methods,
applying the gained knowledge with each iteration, until finally no new knowledge is gained.

## Preface

It's worth noting that I have not taken any actual mathematical proofs classes or things of that nature.
I apologize if any of this is overly confusing to follow.

## Notation

Some minor remarks about notation:

$`|V|`$ represents the _size_ of a set $`V`$. For example, $`|\{1, 2, 3\}| = 3`$.\
$`\bigcup V`$ represents the _union_ of all elements in $`V`$, where $`V`$ is a set containing other sets.

## Symbols

Let $`D`$ represent the list of all possible cards in the deck.\
Let $`D_s, D_w, D_l`$ represent the deck's suspects, weapons, and locations respectively.\
$`D = D_s \cup D_w \cup D_l`$

Let $`M \subsetneq D`$ represent the three murder cards.\
More specifically, $`M = \{ s, w, l \} : s \in D_s, w \in D_w, l \in D_l`$

Let $`H = D \setminus M`$ represent all the cards in every player's hand (i.e. all the non-murder cards).\
We can also now say that $`M = D \setminus H`$.

Let $`H_n \subsetneq H`$ represent the hand of player $`n:n \in \mathbb{N}`$.\
We can also now represent $`H`$ as:\
$`H = \bigcup H_i \forall i \in \mathbb{N}`$

Let $`H^m_n \subseteq H_n : m,n \in \mathbb{N}`$ represent the cards that player $`m`$ knows are in the hand of player $`n`$.\
The contents of this set change as more knowledge is gained.\
$`H^n_n = H_n`$ since a player obviously always knows their own cards.

Let $`N^m_n \subseteq D \setminus H_n`$ represent the cards that player $`m`$ knows _are not_ in the hand of player $`n`$.\
The contents of this set change as more knowledge is gained.\
For any player $`n \implies N^n_n = D \setminus H_n`$ since they already know all the cards they could possibly have.\
By definition, $`N^m_n \cap H_n = \emptyset`$.
Therefore, for any set $`V: V \cap H_n = (V \setminus N^m_n) \cap H_n \forall m, n \in \mathbb{N}`$.\
In other words, given any set that has some intersection with a player's hand $`H_n`$ (or $`H^m_n`$),
we can always subtract $`N^m_n`$ from that set without changing the intersection.

Let $`K_n \subseteq D \setminus M`$ represent the cards that a given player $`n`$ knows for certain _not_ to be in $`M`$.\
The contents of this set change as more knowledge is gained.\
For any player $`n \implies K_n \supseteq H_n`$ since they know that their own hand cannot include murder cards.
We can also say that every player starts with $`K_n = H_n`$ (but $`K_n`$ grows throughout the game).

Let $`M_n \subseteq M`$ represent the cards a player knows for _certain_ to be in $`M`$.\
The contents of this set change as more knowledge is gained.\
Every player $`n`$ starts only by knowing only that $`M_n \cap H_n = \emptyset`$.

Let $`S_k \subsetneq D : k \in \mathbb{N}`$ represent three cards suggested by a player.\
$`S_k = \{ s, w, l \} : s \in D_s, w \in D_w, l \in D_l`$.\
In this case, $`k`$ is just a counter used to differentiate between suggestions. So the first suggestion in a game would be $`S_1`$, then $`S_2`$, and so on.

Each hand is disjoint from every other hand (the cards in each hand are unique):\
$`\forall m,n \in \mathbb{N}, m \neq n \implies H_m \cap H_n = \emptyset`$

---

For these examples, let the sub/superscript $`p`$ represent "us," or the user of the website.
For example, $`H_p`$ is _our_ hand, and $`N^p_n`$ is the set of cards _we_ know that player $`n`$ does not have.

---

## Hand disjointedness

Any time we discover some card in some player $`m`$'s hand $`c \in H_m`$ (i.e. every time the set $`H^p_m`$ is updated with a new card),
we can say $`c \in N^p_n \forall n \in \mathbb{N}, m \neq n`$,
i.e. we can say the card will not be in any other player's hand.

## Information from Suggestions

Each turn, a player may have to opportunity to make a suggestion
$`S_k = \{ s, w, l \} : s \in D_s, w \in D_w, l \in D_l`$.
Then, going clockwise, players next to the suggestor will show the suggestor a card $`c \in S_k`$, if they have any such card.
If they don't have a card, then the next player must show a card if they have one.
This goes until the suggestion makes its way back to the suggestor.

This is a very important information-gathering opportunity. In terms of our sets:

- If a player $`n`$ shows a card $`c \in S_k`$, then we know that $`c \in H_n \iff S_k \cap H_n \neq \emptyset `$,
  or that at least one of the cards in the suggestion are in player $`n`$'s hand.
- If a player does _not_ show a card, then $`S_k \cap H_n = \emptyset \implies`$ we can say $`s, w, l \in N^p_n`$.

### Card shown

Imagine that a player $`m`$ proposes some suggestion $`S_k = \{ s, w, l \}`$.
If some other player $`n`$ shows a card $`c`$ to player $`m`$, we know that $`c \in H_n`$.

We can then compare the suggestion's contents to the cards we have ruled out for player $`n`$ (the set $`N^p_n`$).
As stated [earlier](#symbols), we can safely subtract $`N^p_n`$ from $`S_k`$ and the result will still intersect $`H_n`$.
This also tells us that $`c \in S_k \setminus N^p_n \because c \in H_n`$.

So we can say $`|S_k \setminus N^p_n| = 1 \iff S_k \setminus N^p_n = \{c\}`$\.
That is to say, we can discover the identity of $`c`$ when we have eliminated the possibility
of all but one card in $`S_k`$ being in player $`n`$'s hand.

This then allows us to add $`c`$ to $`H`$, $`H^p_n`$ and $`K_p`$.

In other words: if a player $`m`$ makes a suggestion and another player $`n`$ shows a card,
and we have ruled out the possibility of all but one card in the suggestion being in player $`n`$'s hand,
then we can say for certain that player $`n`$ showed that one card we have not ruled out.

### No card shown

Imagine the same setup where player $`m`$ suggests $`S_k = \{ s, w, l \}`$.
If no player shows any cards (us included), then we know for certain that
$`\forall n \in \mathbb{N}, n \neq m \implies S_k \cap H_n = \emptyset`$.
In other words, the only player who could possibly possess _any_ of the cards $`s, w, l`$ is player $`m`$.

We also then know that $`M \supseteq S_k \setminus H_m`$,
or that any suggested cards not in player $`m`$'s hand must be murder cards.
From our perspective, we can say $`M_p \supseteq S_k \cap N^p_m`$.

Furthermore, if it was us who made this suggestion, then we know which cards we don't have,
which allows us to immediately deduce that any suggested card not in our hand must be in $`M`$,
so we can say $`M_p \supseteq S_k \setminus H_p`$.

## Knowing a murder card

Note that this logic follows for all three sets $`D_s, D_w, D_l`$.
To make the explanation less wordy, the set of suspects $`D_s`$ will be used as an example.

Imagine that we have deduced a card $`c \in D_s : c \in M`$.
Since we know that $`M`$ only contains one card from each of $`D_s, D_w, D_l`$,
and $`M = D \setminus H`$, we know that $`\forall d \in D_s, d \neq c \implies d \in H`$.
In other words, every suspect in $`D_s`$ other than the murder card must be held by some player.

This can also be written as $`D_s \setminus \{c\} \subseteq H \implies D_s \setminus \{c\} \subseteq K_n`$
(we now know all suspects other than $`c`$ to be innocent).

Now, imagine some card $`d \in D_s, d \neq c`$, and that, given a player $`m`$, $`\forall n \in \mathbb{N}, n \neq m \implies d \in N^p_n`$.
That is to say, every player except for $`m`$ is known not to have $`d`$ in their hand.

Since all cards in $`H`$ must by definition be held by some player, and $`d \in H \therefore`$ some player must have $`d`$.
Because we know that all players except for $`m`$ do _not_ have $`d`$, we know that $`d \in H_m`$.

In other words: if we know the murder suspect,
and there exists some other suspect which we know to be missing from all but one player's hand,
the player whom we have not ruled out must have that suspect in their hand.

The same holds true for weapons and locations.

## Knowing all but one of a card type

As with the previous example, this explanation will use suspects,
but it works for all three sets $`D_s, D_w, D_l`$.

Recall: $`M = \{ s, w, l \} : s \in D_s, w \in D_w, l \in D_l`$ and $`H = D \setminus M`$.

If we have marked all but one suspect as innocent (i.e. $`D_s \setminus K_p = \{s\}`$),
then the suspect that we have not yet ruled out must be $`\in M`$,
because it is guaranteed that one card of each type will be in $`M`$:\
$`D_s \setminus K_p = \{s\} \iff s \in M`$.

The same holds true for weapons and locations.

## Number of cards ruled out

The number of cards in a player $`n`$'s hand (i.e. $`|H_n|`$) is public information.
While we will not immediately know $`H_n`$, we _will_ immediately know $`|H_n|`$
by paying attention as cards are dealt or counting the cards when a player holds their hand.

We can say that:\
$`|H^p_n| = |H_n| \iff H^p_n = H_n \iff N^p_n = D \setminus H_n`$\
Or, in other words: if the number of cards we know to be in $`n`$'s hand equals the total number of cards in $`n`$'s hand,
we can rule out every other card from being in $`n`$'s hand.
This is primarily useful for the fact that it increases the size of our $`N^p_n`$ list,
which is depended on by other inference techniques mentioned in this document.

In a similar vein, we can say that:\
$`|D| - |N^p_n| = |H_n| \iff H_n = D \setminus N^p_n`$\
Or, in other words: if we have ruled out every card for $`n`$ except for the number of cards equal to $`n`$'s hand size,
then $`n`$'s hand must be equal to the cards we have not yet ruled out.

## Constraints from possible suggestion cards

### The simplest case

Given some suggestion $`S_k = \{s,w,l\}`$, imagine that player $`n`$ showed some unknown card $`c`$.
As stated before, this tells us that $`c \in S_k`$ and $`c \in H_n`$.
We also know that $`c \in S_k \setminus N^p_n`$.

Let it also be given that $`S_k \cap H^p_n = \emptyset`$,
i.e. none of the suggested cards are in our model of player $`n`$'s hand.

If we have $`|H_n| - |H^p_n| = 1`$ (we know all but one card in $n$'s hand),
we can only add one more element to the set $`H^p_n`$.
We also know that $`c \in H_n`$, but $`c \not\in H^p_n`$.
This means that the last card to add to the hand _must_ be $`c`$.

This means that we can now say $`N^p_n \supseteq (D \setminus H^p_n) \setminus S_k`$,
or that we can rule out every single card except for the suggested cards
from being the last card in $`n`$'s hand.

### A more general case

The example above was for the specific case in which we know of all but one card in $`n`$'s hand.
However, the logic also works with more than one card remaining.

We are going to need to define a few new sets to properly show this.

Let $`\sum S`$ be the set of all suggestions $`S_k`$:\
$`\sum S = \{S_1, \cdots, S_k\}`$

And let $`\sum S^n`$ be the subset of all suggestions for which player $`n`$ showed a card:\
$`\sum S^n = \{ V \in \sum S : \textrm{player } n \textrm{ showed a card } c \in V \}`$\
This set has the property (mentioned [earlier](#card-shown)) that $`\forall V \in \sum S^n \implies V \cap H_n \neq \emptyset`$.

Now, we can define a new set $`C^p_n`$.
It will represent all the suggestions for which player $`n`$ showed a card,
plus some additional constraints.

First, any cards $`c`$ in a suggestion set in $`\sum S^n`$ where $`c \in N^p_n`$ will be excluded from the elements of $`C^p_n`$.
This can be expressed as such:\
$`\exists \sum S^n = \{V_1, \cdots, V_k\} \implies C^p_n = \{(V_1 \setminus N^p_n), \cdots, (V_k \setminus N^p_n)\}`$

Now, let us add two more constraints:

- $`C^p_n`$ will not contain any sets with a card we already know to be held by $`n`$ (i.e. disjoint from $`H^p_n`$).
- $`C^p_n`$ will not contain any sets of size &leq; 1.

The former condition is because if we already know of a card in a suggestion that was shown by player $`n`$,
then we already know a card $`c`$ which satisfies the condition $`c \in H_n, c \in S_k`$.
We can no longer guarantee that there is an unknown card in the set that is also in the player's hand.

The latter condition is because, if we have ruled that there is only one card in a suggestion that $`n`$ could have shown,
then, by [our first technique](#card-shown), we already know that card to be in $`n`$'s hand.

We can now redefine $`C^p_n`$ as such:\
$`\exists \sum S^n = \{V_1, \cdots, V_k\} \implies C^p_n = \{U \in \{(V_1 \setminus N^p_n), \cdots, (V_k \setminus N^p_n)\} : U \cap H^p_n = \emptyset, |U| > 1 \}`$

This has accomplished the following:

1. We have now converted each suggestion into a set of cards that the player may have
   (via the subtraction of $`N^p_n`$ from each suggestion).
2. We have excluded any such sets which contain a card we already know to be in $`H_n`$
   (via the exclusion of sets intersecting $`H^p_n`$).

The subtraction of $`N^p_n`$ from each element of $`\sum S^n `$ only removed cards that could never have been held by player $`n`$.
For each suggestion $`S_k \in \sum S^n`$, we have only removed elements $`c \in S_k : c \not\in H_n`$.
Therefore $`C^p_n`$ inherits the property of $`\sum S^n`$ that
$`\forall V \in C^p_n \implies V \cap H_n \neq \emptyset`$,
i.e. the hand must still contain at least one card from each set in $`C^p_n`$.

The exclusion of suggestions that contain a card we already know to be in player $`n`$'s hand
also means that $`C^p_n`$ only contains sets with the following properties:

1. Player $`n`$ has at least one of the cards in each set in $`C^p_n`$.
2. We do not yet know which of these cards player $`n`$ has.

This can also be expressed as:\
$`\forall V \in C^p_n \implies V \cap H^p_n = \emptyset, V \cap H_n \neq \emptyset`$

This has significant implications _when all elements of_ $`C^p_n`$ _are disjoint_,
or when the expression $`\forall U,V  \in C^p_n, U \neq V \implies U \cap V = \emptyset`$ is true.\
Note that this will _not_ always be the case.

When the above condition holds, we can say:\
$`|H_n| - |H^p_n| = |C^p_n| \iff N^p_n = D \setminus H^p_n \setminus \bigcup C^p_n`$\
In other words: if the size of our set $`C^p_n`$ is equal to the number of unknown cards in player $`n`$'s hand,
we can rule out _every single card outside of_ $`C^p_n`$ (and the cards we've already discovered) from being in player $`n`$'s hand.

This is a more general version of [the simplest case](#the-simplest-case).

#### Application 1

Let's look at a specific example to see why this is useful.

Imagine a game with only three disjoint suggestions:
$`S_1 = \{a,b,c\}, S_2 = \{d,e,f\}, S_3 = \{g,h,i\}`$ (where $`a`$ through $`i`$ are all unique).
This means that $`\sum S = \{ \{a, b, c\}, \{d, e, f\}, \{g, h, i\} \}`$.
Let us also say that for all of these suggestions, it was player $`n`$ who showed a card.
This allows us to say that $`\sum S^n = \{ \{a, b, c\}, \{d, e, f\}, \{g, h, i\} \}`$.

Now, imagine that we have deduced the following by other means:

1. In the first suggestion $`S_1`$, player $`n`$ showed the card $`a \implies a \in H^p_n`$.
2. Player $`n`$ does _not_ have the card $`d \implies d \in N^p_n`$.
3. Player $`n`$ does _not_ have the card $`g \implies g \in N^p_n`$.

Using this, we find $`C^p_n`$ to be $`C^p_n = \{ \{e, f\}, \{h, i\} \}`$.
The first suggestion $`S_1`$ was omitted entirely because it has overlap with $`H^p_n`$.
The other two suggestions $`S_2, S_3`$ had $`d`$ and $`g`$ removed from each respectively
because we know that player $`n`$ cannot have those cards.

Now, imagine that every player's hand size is known to be three cards (this is the case for a six-player game).
We already know one card in $`H_n`$ ($`a`$), so we have $`H^p_n = \{a\}`$.

Now, remember the final condition about $`C^p_n`$ when $`C^p_n`$ contains only disjoint sets:\
$`|H_n| - |H^p_n| = |C^p_n| \iff N^p_n = D \setminus H^p_n \setminus \bigcup C^p_n`$

In our case, $`|H_n| - |H^p_n| = 2 = |C^p_n|`$.
We can therefore say that $`N^p_n = D \setminus H^p_n \setminus \{e, f\} \setminus \{h, i\} `$.
We have now ruled out the possibility of every single card except for $`e, f, h, i`$ being in the rest of player $`n`$'s hand!

### The _most_ general case

It is rather unlikely in regular gameplay to end up with a set $`C^p_n`$ such that every element is disjoint,
which means that the above deduction could rarely be applied.

What we need to be able to do is, given some non-disjoint set $`C^p_n`$,
determine the _largest subset_ for which all elements are disjoint.
Luckily, this is a solved problem: finding the [maximum disjoint set](https://en.wikipedia.org/wiki/Maximum_disjoint_set) (MDS).

The MDS of a set $`V`$ will be referred to as $`\mathrm{MDS}(V)`$.
If a set $`V`$ is already disjoint $`\implies \mathrm{MDS}(V) = V`$.
We know that $`\forall V \exists \mathrm{MDS}(V) \subseteq V`$.

This allows us to further generalize the condition from the last section. Recall:\
$`|H_n| - |H^p_n| = |C^p_n| \iff N^p_n = D \setminus H^p_n \setminus \bigcup C^p_n$

Since $`\mathrm{MDS}(C^p_n) \subseteq C^p_n`$, we can rewrite the above condition as:\
$`|H_n| - |H^p_n| = |\mathrm{MDS}(C^p_n)| \iff N^p_n = D \setminus H^p_n \setminus \bigcup \mathrm{MDS}(C^p_n)`$

This version of the condition is much more likely to be applicable in a game,
and can rule out possibilities that may be harder to notice than the other inference methods.

#### Application 2

For example, imagine that we have some different game which has:

1. There exists a suggestion $`S_1 = \{a, b, c\}`$ and player $`n`$ showed a card.
2. There exists a suggestion $`S_2 = \{a, c, d\}`$ and player $`n`$ showed a card.
3. Player $`n`$ does _not_ have the card $`a`$ ($`a \in N^p_n`$).
4. Player $`n`$ _does_ have the card $`e`$ and this is the only card we know about ($`H^p_n = \{e\}`$).

This means that $`C^p_n = \{ \{ b, c \}, \{ c, d \} \}`$.
We can see that the set $`C^p_n`$ is not disjoint: the two contained sets share the card $`c`$.
So despite the fact that $`|H_n| - |H^p_n| = 2 = |C^p_n|`$,
we cannot eliminate all cards outside of $`|C^p_n|`$.

Now, let us consider $`\mathrm{MDS}(C^p_n)`$.
For this set, there are two possible MDS:
$`\{\{b, c\}\}`$ or $`\{\{c, d\}\}`$, both of size 1.
Since these are both valid MDS it does not matter which one is used.
For this example, we will take $`\mathrm{MDS}(C^p_n) = \{\{b, c\}\}`$.

We now have a disjoint set, but we still have two unknown cards and our disjoint set is only of size 1.
But what if we discover by other means that player $`n`$ has some unrelated card $`f`$?

We can now say that $`f \in H^p_n \implies H^p_n = \{a, f\}`$.
This means that $`|H_n| - |H^p_n| = 1 = |\mathrm{MDS}(C^p_n)|`$,
so we can now rule out all cards outside of $`\mathrm{MDS}(C^p_n)`$.

Recall that we took $`\mathrm{MDS}(C^p_n)`$ to be $`\{\{b, c\}\}`$.
This means that every card _**other than**_ the existing cards we know about ($`a`$ and $`f`$)
and the cards in the MDS ($`b`$ and $`c`$) _cannot_ be in $`H_n`$.

Importantly, note that this implies $`d \in N^p_n`$. Let's now take a look at $`S_2`$.
Recall: $`S_2 = \{a, c, d\}`$.
By [one of the very first inference methods](#card-shown), we know that:\
where $`v \in H_n, v \in S_k`$ is the card shown by player $`n`$ for a suggestion $`k`$:\
$`|S_k \setminus N^p_n| = 1 \iff S_k \setminus N^p_n = \{v\} \implies`$ we now know the identity of $`v`$.

We know that $`a, d \in N^p_n`$ and $`c \not\in N^p_n`$.
We also have $`a, c, d \not\in H^p_n`$.\
$`S_2 \setminus N^p_n = \{a, c, d\} \setminus \{a, d\} = \{c\}`$.

We have narrowed the possible cards for player $`n`$ in this suggestion down to a single card, $`c`$.
Had we taken the MDS to be $`\{\{c, d\}\}`$ instead, we would have arrived at the same conclusion,
just using $`S_1`$ to narrow the suggestion down to $`\{c\}`$ rather than $`S_2`$.

This inference method allowed us to deduce the final card of a player
by discovering another piece of information that may at first seem entirely unrelated.

## License

This project is licensed under the GNU Affero General Public License, Version 3.0
([LICENSE](LICENSE) or <https://www.gnu.org/licenses/agpl-3.0.en.html>).
