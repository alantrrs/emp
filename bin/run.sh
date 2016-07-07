
run(){
  if [ -z "$2" ]; then
    CODE_DIR=$(pwd)
  else
    CODE_DIR=$(readlink -f $2)
  fi
  docker run -t --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $CODE_DIR:/empirical/code:ro \
    -v $EMPIRICAL_DIR/data:/empirical/data \
    -v $EMPIRICAL_DIR/workspaces:/empirical/workspaces \
    -e EMPIRICAL_API_URI=$EMPIRICAL_API_URI \
    -e EMPIRICAL_DIR=$EMPIRICAL_DIR \
    -e DEBUG=$DEBUG \
    empiricalci/emp run $1
}

pull(){
  docker run -t --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $EMPIRICAL_DIR/data:/empirical/data \
    -v $EMPIRICAL_DIR/workspaces:/empirical/workspaces \
    -e EMPIRICAL_API_URI=$EMPIRICAL_API_URI \
    -e EMPIRICAL_API_KEY=56f21e9c444d700624705d16 \
    -e EMPIRICAL_API_SECRET=e6bbfb2b-f608-48a8-8a60-c78df6c2bb97 \
    -e EMPIRICAL_DIR=$EMPIRICAL_DIR \
    -e DEBUG=$DEBUG \
    empiricalci/emp pull $1
}

listen(){
  docker run -t --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $EMPIRICAL_DIR/data:/empirical/data \
    -v $EMPIRICAL_DIR/workspaces:/empirical/workspaces \
    -e EMPIRICAL_API_URI=$EMPIRICAL_API_URI \
    -e EMPIRICAL_API_KEY=56f21e9c444d700624705d16 \
    -e EMPIRICAL_API_SECRET=e6bbfb2b-f608-48a8-8a60-c78df6c2bb97 \
    -e EMPIRICAL_DIR=$EMPIRICAL_DIR \
    -e DEBUG=$DEBUG \
    empiricalci/emp listen
}

# CLI
if [ -z "$EMPIRICAL_DIR" ]; then
  EMPIRICAL_DIR='/tmp'
  echo "WARNING: EMPIRICAL_DIR not set. Defaulting to /tmp/"
fi

if [ "$1" = "listen" ]; then
  listen
  exit
fi

if [ "$1" = "run" ]; then
  if [[ $2 =~ [a-zA-Z-]+/[a-zA-Z-]+/[a-zA-Z-]+/[a-zA-Z-]+ ]]; then
    echo "Pull"
    pull $2
    exit
  else
    echo "Run"
    # run $2 $3
    exit
  fi
fi

echo "Empirical 2016"
echo ""
echo "Use:"
echo ""
echo "./run.sh run owner/repository/experiment/push"
echo "	Fetch and run tha experiment"
echo ""
echo "./run.sh run experiment path-to-code"
echo "	Run experiment offline in path-to-code"
echo ""
echo "./run.sh listen"
echo "	Listen to incoming experiments from Empirical server"
