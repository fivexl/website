#!/usr/bin/env bash

set -ex

CHECK=$(which hugo || true)

if [ ! -z "${CHECK}" ]; then
  echo "Already available at ${CHECK}"
  exit 0
fi

OS=$(uname)
if [ "${OS}" == "Darwin" ]; then
  curl -L -o hugo.tar.gz https://github.com/gohugoio/hugo/releases/download/v0.102.3/hugo_extended_0.102.3_macOS-universal.tar.gz
elif [ "${OS}" == "Linux" ]; then
  if [ "$(uname -m)" == "x86_64" ]; then
    curl -L -o hugo.tar.gz https://github.com/gohugoio/hugo/releases/download/v0.102.3/hugo_extended_0.102.3_Linux-64bit.tar.gz
  elif [ "$(uname -m)" == "arm64" ]; then
    curl -L -o hugo.tar.gz https://github.com/gohugoio/hugo/releases/download/v0.102.3/hugo_extended_0.102.3_Linux-ARM64.tar.gz
  else
    echo "${OS} $(uname -m) is not supported. go away"
    exit 1
  fi
else
  echo "${OS} is not supported. go away"
  exit 1
fi

tar xvf hugo.tar.gz hugo

sudo mv hugo /usr/bin/hugo
rm -rf hugo.tar.gz