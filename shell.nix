{ pkgs ? import <nixpkgs> {}, ... }: let name = "cw-storage-benchmarks"; in pkgs.mkShell {
  inherit name;
  nativeBuildInputs = with pkgs; [
    git nodejs nodePackages_latest.pnpm rustup
    binaryen wabt wasm-pack wasm-bindgen-cli
  ];
  shellHook = ''
    export PS1="$PS1[${name}] "
    export PATH="$PATH:$HOME/.cargo/bin:${./.}/node_modules/.bin"
  '';
}