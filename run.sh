#!/usr/bin/env bash

export NODE_OPTIONS=--openssl-legacy-provider

function optimize_wasm {
    cp ./target/wasm32-unknown-unknown/release/$2.wasm ./$1.wasm
    cat ./$1.wasm | gzip -9 > ./$1.wasm.gz
    rm ./$1.wasm
}

if ! RUSTFLAGS='-C link-arg=-s' cargo +nightly-2023-02-07 build --release --target wasm32-unknown-unknown ; then
    exit
fi

optimize_wasm fadroma-bench fadroma_bench
optimize_wasm toolkit-bench toolkit_bench

if ! npx tsc ; then
    exit
fi

node dist/index.js
