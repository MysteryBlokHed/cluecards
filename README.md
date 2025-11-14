# Cluecards

<https://clue.adamts.me>

Automatic inference for interactions in [Clue (Cluedo)](https://en.wikipedia.org/wiki/Cluedo).

## How does it work?

If you're interested in a written explanation for the inference methods I've discovered while creating this website,
I've done my best to document them [here](./Inference.md).
You don't need to read it to use the website, but it might be interesting.

## Folder structure

| Folder    | Purpose                                                            |
| :-------- | :----------------------------------------------------------------- |
| inference | Rust WebAssembly implementation of the site's inference logic.     |
| public    | Static website assets.                                             |
| scripts   | Convenience scripts for testing/development.                       |
| src       | Source code for the UI and the TypeScript portions of the website. |
| test      | Unit and integration tests for the inference logic.                |

## Building

### Nix

A [Nix](https://nixos.org/) flake is available to build the project in release mode.
To use it, run:

```sh
$ nix build
```

The build website's static files will be available at `./result`.

### Manually

The inference logic must be built _before_ the rest of the website.
Instructions are available [here](./inference/README.md).

After that, this project requires pnpm v9.
After installing [Node.js](https://nodejs.org/en/download/package-manager), run the following in the project directory:

```sh
corepack enable
corepack install
```

Then, to build for release:

```sh
pnpm run build
```

## License

This project is licensed under the GNU Affero General Public License, Version 3.0
([LICENSE](LICENSE) or <https://www.gnu.org/licenses/agpl-3.0.en.html>).
