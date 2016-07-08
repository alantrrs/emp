
set -e

VERSION="0.1"
IMAGE="empiricalci/emp:$VERSION"

run(){
  if [ -z "$1" ]; then
    echo "emp run requires at least one argument"
    echo "Usage: emp run experiment-name [path to code]"
    exit
  fi
  if [ -z "$2" ]; then
    CODE_DIR=$(pwd)
  else
    CODE_DIR=$(readlink -f $2)
  fi
  if [ -z "$EMPIRICAL_DIR" ]; then
    EMPIRICAL_DIR='/tmp'
    echo "WARNING: EMPIRICAL_DIR not set. Defaulting to /tmp/"
  fi
  docker run -t --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $CODE_DIR:/empirical/code:ro \
    -v $EMPIRICAL_DIR/data:/empirical/data \
    -v $EMPIRICAL_DIR/workspaces:/empirical/workspaces \
    -e EMPIRICAL_API_URI=$EMPIRICAL_API_URI \
    -e EMPIRICAL_DIR=$EMPIRICAL_DIR \
    -e DEBUG=$DEBUG \
    $IMAGE run $1
}

listen(){
  docker run -t --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $EMPIRICAL_DIR/data:/empirical/data \
    -v $EMPIRICAL_DIR/workspaces:/empirical/workspaces \
    -e EMPIRICAL_API_URI=$EMPIRICAL_API_URI \
    -e EMPIRICAL_API_KEY=$EMPIRICAL_API_KEY \
    -e EMPIRICAL_API_SECRET=$EMPIRICAL_API_SECRET \
    -e EMPIRICAL_DIR=$EMPIRICAL_DIR \
    -e DEBUG=$DEBUG \
    $IMAGE listen
}

# CLI
if [ -z "$EMPIRICAL_DIR" ]; then
  EMPIRICAL_DIR='/tmp'
  echo "WARNING: EMPIRICAL_DIR not set. Defaulting to /tmp/"
fi

if [ "$1" = "listen" ]; then
  listen
fi

if [ "$1" = "run" ]; then
 run $2 $3
fi 
