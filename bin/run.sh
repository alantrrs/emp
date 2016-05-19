
emp(){
  if [ -z "$1" ]; then
    echo "Make sure you are current directory is the source directory and provide an experiment name"
    echo "Use: emp experiment-name"
    exit
  fi
  if [ -z "$EMPIRICAL_DIR" ]; then
    EMPIRICAL_DIR='/tmp'
    echo "WARNING: EMPIRICAL_DIR not set. Defaulting to /tmp/"
  fi
  docker run -t --rm \
    -v  $(pwd):/empirical/code:ro \
    -v $EMPIRICAL_DIR/data:/empirical/data \
    -v $EMPIRICAL_DIR/workspaces:/empirical/workspaces \
    empiricalci/emp $1
} 

emp $1
