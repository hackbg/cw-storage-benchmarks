#!/usr/bin/env bash

docker run -it --rm -p 9091:9091 -p 26657:26657 -p 1317:1317 -p 5000:5000 \
  --name localsecret ghcr.io/scrtlabs/localsecret:v1.9.0-beta.5
