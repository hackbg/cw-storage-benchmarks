#!/usr/bin/env bash

export NODE_OPTIONS=--openssl-legacy-provider

function build {
    if ! RUSTFLAGS='-C link-arg=-s' cargo +nightly-2023-02-07 build -p $1 --release --target wasm32-unknown-unknown ; then
        exit
    fi

    cp ./target/wasm32-unknown-unknown/release/$2.wasm ./$1.wasm
    cat ./$1.wasm | gzip -9 > ./$1.wasm.gz
    rm ./$1.wasm
}

build fadroma-bench fadroma_bench
build toolkit-bench toolkit_bench

if ! npx tsc ; then
    exit
fi

node dist/index.js
