{
  description = "Automatic inference for interactions in Clue (Cluedo).";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    fenix = {
      url = "github:nix-community/fenix/monthly";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    nixpkgs,
    fenix,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};

        target = "wasm32-unknown-unknown";
        toolchain = with fenix.packages.${system};
          combine [
            default.toolchain
            targets.${target}.latest.rust-std
          ];

        rustPlatform = pkgs.makeRustPlatform {
          cargo = toolchain;
          rustc = toolchain;
        };

        # Build inference logic
        inference = rustPlatform.buildRustPackage {
          pname = "inference";
          version = "0.0.0";

          src = ./inference;
          cargoLock.lockFile = ./inference/Cargo.lock;

          nativeBuildInputs = with pkgs; [wasm-pack wasm-bindgen-cli binaryen];

          buildPhase = ''
            runHook preBuild
            HOME=$TMPDIR wasm-pack build --release --target bundler --out-dir $out/pkg
            # Do not run postBuild since it breaks
          '';

          dontInstall = true;
        };

        # Build website
        cluecards = pkgs.stdenv.mkDerivation (finalAttrs: {
          pname = "cluecards";
          version = "0.0.0";

          src = ./.;

          nativeBuildInputs = with pkgs; [nodejs pnpm.configHook inference];

          # Use the Nix store's inference build
          postPatch = ''
            substituteInPlace \
              test/inference.test.ts \
              test/utils.ts \
              src/inference-worker.ts \
              --replace-fail '../inference/pkg' '${inference}/pkg'
          '';

          pnpmDeps = pkgs.pnpm.fetchDeps {
            inherit (finalAttrs) pname version src;
            fetcherVersion = 2;
            hash = "sha256-w/BbuUBRB9ANyEvJRlQQSKRqOaw2NmFg5+EFmlyAqoU=";
          };

          buildPhase = ''
            runHook preBuild
            pnpm run build
            runHook postBuild
          '';

          checkPhase = ''
            runHook preCheck
            pnpm run test --run
            runHook postCheck
          '';

          installPhase = ''
            runHook preInstall

            mkdir -p $out
            cp -r dist/* $out/

            runHook postInstall
          '';
        });
      in {
        formatter = pkgs.alejandra;

        checks = {
          cluecards = cluecards.overrideAttrs {doCheck = true;};
        };

        packages = {
          inherit inference;
          default = cluecards;
        };

        devShells.default = pkgs.mkShell {
          inputsFrom = [inference cluecards];
          packages = [toolchain];
        };
      }
    );
}
