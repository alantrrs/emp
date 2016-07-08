# EMP
_Empirical Experiment Toolkit_

**emp** is a command line tool that helps you run your experiments
using the [Empirical Framework](http://empiricalci.com/docs/framework)

---

## Dependencies
The core enabling technology that's used in this framework is **Docker**. 
Docker allows us to create self-contained portable environments that work accross different platforms. 
In order to keep the dependencies  to a minmum and keep the whole environment portable, 
everything is run through Docker. The only requirement is:
- [Docker](https://docs.docker.com/engine/installation/)

## Install

### Linux & Mac
Download the launcher and make it executable
```
curl -L https://github.com/alantrrs/emp/releases/download/v0.1/run.sh -o /usr/local/bin/emp
chmod +x /usr/local/bin/emp
```

### Windows
TBD

## Configure

### Empirical directory
Empirical uses a directory to cache all the datasets downloaded and to save any files generated during the
tests or experiments. You need to set this up:
```
export EMPIRICAL_DIR=/path/to/empirical
```

## Run
Once you have defined your experiment using the [Empirical Framework](http://empiricalci.com/docs/getting-started).
You can use the tool to execute your experiment.
```
emp run experiment /path/to/project
```

