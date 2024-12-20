# Inference Logic

This folder contains the inference logic, written in Rust and compiled to [WASM](https://webassembly.org/).

If you're looking for an explanation about _how_ the logic works, go [here](../Inference.md).

## Why Rust/WASM?

Two reasons:

1. It is much, much faster. The speed difference is negligible under normal use,
   but the "Calculate Odds" feature requires a huge amount of iterations, which is incredibly slow with JavaScript.

2. It's a neat experiment! I haven't used WASM before, and this felt like a good excuse.

This does, of course, make the website a bit heavier (the optimized WASM binary is ~125 KB before gzip),
so I'm not yet sure whether I'll actually merge this into the main branch.

## License

This project is licensed under the GNU Affero General Public License, Version 3.0
([LICENSE](LICENSE) or <https://www.gnu.org/licenses/agpl-3.0.en.html>).
