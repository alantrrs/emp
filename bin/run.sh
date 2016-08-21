#!/bin/bash

set -e

VERSION="v0.1.2"
IMAGE="empiricalci/emp:$VERSION"

# Functions
launch() {
  docker run $DOCKER_RUN_OPTIONS --rm \
    $VOLUMES \
    -e HOME=$HOME \
    -e DEBUG=$DEBUG \
    $IMAGE "$@"
}

absolute_path() {
  if [ -e "$1" ]; then
    echo "$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
  fi
}

# Get configuration
EMP_CONF_FILE="$HOME/.emp/emp.env"
if [ -f "$HOME/.emp/emp.env" ]; then
  source "$HOME/.emp/emp.env"
else
  # Create default configuration
  if [ ! -d "$HOME/.emp" ]; then
    mkdir $HOME/.emp
  fi
  echo "EMPIRICAL_DIR=$HOME/empirical" > $HOME/.emp/emp.env
fi

if [ -z "$EMPIRICAL_DIR" ]; then
  EMPIRICAL_DIR="$HOME/empirical"
fi

VOLUMES="-v /var/run/docker.sock:/var/run/docker.sock"
VOLUMES="$VOLUMES -v $EMPIRICAL_DIR/data:$EMPIRICAL_DIR/data"
VOLUMES="$VOLUMES -v $EMPIRICAL_DIR/workspaces:$EMPIRICAL_DIR/workspaces"
VOLUMES="$VOLUMES -v $EMP_CONF_FILE:$EMP_CONF_FILE"

if [ "$1" = "run" ]; then
  if [ ! -z "$3" ]; then
    CODE_DIR=$(absolute_path $3)
    if [ -z $CODE_DIR ]; then 
      echo "Path doesn't exists"
      exit 0
    fi
    VOLUMES="$VOLUMES -v $CODE_DIR:$CODE_DIR:ro"
    # Replaces arg 3 by the new absolute path
    set -- "${@:1:2}" "$CODE_DIR" "${@:4}"
  fi
fi

if [ "$1" = "data" ] && [ "$2" = "hash" ]; then
  DATA_FILE=$(absolute_path $3)
  if [ -z $DATA_FILE ]; then 
    echo "Path doesn't exists"
    exit 0
  fi
  VOLUMES="$VOLUMES -v $DATA_FILE:$DATA_FILE"
fi

DOCKER_RUN_OPTIONS="-i"
if [ -t 1  ]; then
  DOCKER_RUN_OPTIONS="$DOCKER_RUN_OPTIONS -t"
fi

# Test environment
if [ "$EMPIRICAL_ENV" = "test" ]; then
  DOCKER_RUN_OPTIONS="$DOCKER_RUN_OPTIONS --net=host"
  IMAGE="empiricalci/emp:test"
fi

launch $@
