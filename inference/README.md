# Inference Logic

This folder contains the inference logic, written in Rust and compiled to [WebAssembly (WASM)](https://webassembly.org/).

If you're looking for an explanation about _how_ the logic works, go [here](../Inference.md).

## Why Rust/WASM?

Two reasons:

1. It is much, much faster. The speed difference is negligible under normal use,
   but the "Calculate Odds" feature requires a huge amount of iterations, which is incredibly slow with JavaScript.
   I've measured it to be around 30&times; faster than the [original implementation],
   and sometimes even better when more iterations are required.

2. It's a neat experiment! I haven't used WASM before, and this felt like a good excuse.
   I also found that the change in bundle size is relatively negligible (~124 KB), espcially when compressed (~44 KB with Brotli).

## Building

This project requires [Rust](https://www.rust-lang.org/tools/install) and [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/).
Once installed, run the following in the `inference/` directory to build with optimizations:

```sh
wasm-pack build --release --target bundler
```

## License

This project is licensed under the GNU Affero General Public License, Version 3.0
([LICENSE](LICENSE) or <https://www.gnu.org/licenses/agpl-3.0.en.html>).

[original implementation]: https://github.com/MysteryBlokHed/cluecards/blob/16d7373e8dbe050d2e47bdbc0ee5a1a386a3b336/src/inference.ts
