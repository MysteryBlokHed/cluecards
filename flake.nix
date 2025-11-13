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

        commonRustArgs = {
          pname = "inference";
          version = "0.0.0";

          src = craneLib.cleanCargoSource ./inference;
          strictDeps = true;
        };

        cargoArtifacts = craneLib.buildDepsOnly (commonRustArgs // {});

        inference-clippy = craneLib.cargoClippy (commonRustArgs
          // {
            inherit cargoArtifacts;
            cargoClippyExtraArgs = "--all-targets -- --deny warnings";
          });

        inference-fmt = craneLib.cargoFmt {
          inherit (commonRustArgs) src;
        };

        inference = craneLib.buildPackage (commonRustArgs
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

        commonNodeArgs = let
          pname = "cluecards";
          version = "0.0.0";
          src = ./.;
        in {
          inherit pname version src;

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
            inherit pname version src;
            fetcherVersion = 2;
            hash = "sha256-C3sXC0vPk+Qkamia7/AdoiaxNKYxxK5WCZhAyhgl4eg=";
          };
        };

        cluecards-fmt = pkgs.stdenv.mkDerivation (finalAttrs:
          commonNodeArgs
          // {
            doCheck = true;

            # Do not patch since it may affect formatting
            postPatch = "";

            checkPhase = ''
              runHook preCheck
              pnpm prettier --check .
              runHook postCheck
            '';

            installPhase = ''touch $out'';
          });

        cluecards-lint = pkgs.stdenv.mkDerivation (finalAttrs:
          commonNodeArgs
          // {
            doCheck = true;

            checkPhase = ''
              runHook preCheck
              pnpm run check
              pnpm eslint .
              runHook postCheck
            '';

            installPhase = ''touch $out'';
          });

        cluecards-test = pkgs.stdenv.mkDerivation (finalAttrs:
          commonNodeArgs
          // {
            doCheck = true;

            checkPhase = ''
              runHook preCheck
              pnpm run test --run
              runHook postCheck
            '';

            installPhase = ''touch $out'';
          });

        cluecards = pkgs.stdenv.mkDerivation (finalAttrs:
          commonNodeArgs
          // {
            buildPhase = ''
              runHook preBuild
              pnpm run build
              runHook postBuild
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
          inherit inference-clippy inference-fmt cluecards-fmt cluecards-lint cluecards-test;
        };

        devShells.default = pkgs.mkShell {
          inputsFrom = [inference cluecards];
          packages = [toolchain];
        };
      }
    );
}
