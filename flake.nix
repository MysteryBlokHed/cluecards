{
  description = "Automatic inference for interactions in Clue (Cluedo).";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    crane.url = "github:ipetkov/crane";
    fenix = {
      url = "github:nix-community/fenix/monthly";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    nixpkgs,
    flake-utils,
    crane,
    fenix,
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
        craneLib = (crane.mkLib pkgs).overrideToolchain toolchain;

        commonArgs = {
          pname = "inference";
          version = "0.0.0";

          src = craneLib.cleanCargoSource ./inference;
          strictDeps = true;
        };

        cargoArtifacts = craneLib.buildDepsOnly (commonArgs // {});

        clippy = craneLib.cargoClippy (commonArgs
          // {
            inherit cargoArtifacts;
            cargoClippyExtraArgs = "--all-targets -- --deny warnings";
          });

        inference = craneLib.buildPackage (commonArgs
          // {
            inherit cargoArtifacts;

            nativeBuildInputs = with pkgs; [wasm-pack wasm-bindgen-cli binaryen];

            doNotPostBuildInstallCargoBinaries = true;

            buildPhase = ''
              runHook preBuild
              HOME=$TMPDIR wasm-pack build --release --target bundler --out-dir $out/pkg
              runHook postBuild
            '';

            dontInstall = true;
          });

        # Build website
        cluecards = pkgs.stdenv.mkDerivation (finalAttrs: {
          pname = "cluecards";
          version = "0.0.0";

          src = ./.;

          nativeBuildInputs = [pkgs.nodejs pkgs.pnpm.configHook inference];

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
            hash = "sha256-EXYDaVbZbQpczrCYWgiNv+RqiZ5b/GvPotfoH0v/zwI=";
          };

          buildPhase = ''
            runHook preBuild
            pnpm run build
            runHook postBuild
          '';

          checkPhase = ''
            runHook preCheck
            pnpm run test -- --run
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

        packages = {
          inherit inference;
          default = cluecards;
        };

        checks = {
          inherit clippy;
        };

        devShells.default = pkgs.mkShell {
          inputsFrom = [inference cluecards];
          packages = [toolchain];
        };
      }
    );
}
