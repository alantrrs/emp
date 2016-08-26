# EMP [![Build Status](https://travis-ci.org/empiricalci/emp.svg)](https://travis-ci.org/empiricalci/emp)
_A Package Manager for Empirical Science_

**emp** is a command line tool that helps you run and replicate experiments
using the [Empirical Framework](https://empiricalci.com/docs/framework)

## Dependencies
One of the enabling technologies that's used in this framework is **Docker**. 
Docker allows us to create self-contained portable environments that work accross different platforms. 
- Follow [these instructions](https://docs.docker.com/engine/installation/) to install Docker

## Install

### Linux & Mac

#### Via npm
If you already have node.js installed in your computer you can install **emp** using ``npm``.
```
npm install -g empirical-cli
```

#### Docker container distribution
If you don't have node.js installed of if you have any troubles with the node distribution,
you can use **emp** as a Docker container, just by installing the launcher:
```
curl -s https://raw.githubusercontent.com/empiricalci/emp/master/install.sh | sudo sh
```

#### Windows
TBD

## Configure

### Empirical directory
Empirical uses a directory to cache all the datasets downloaded and to save any files generated during the
tests or experiments. This defaults to ``~/empirical``. You can change this by doing:
```
emp configure
```

## Authenticate with the server
Authenticating with the Empirical server allows you to save the results of your experiments
and share them with your peers.
1. If you haven't done so, sign up with GitHub for an account on [Empirical](http://empiricalci.com)
2. Set up a password on your [account page](https://empiricalci.com/account)
3. Login using the CLI: ``emp login`` will ask for your credentials and store them on your computer

## Replicate an experiment
Once authenticated, you can easily replicate an experiment by running:
```
emp replicate <experimentId>
```
This will clone the source code from GitHub, checkout the appropriate version, 
build the experiment image, download the required datasets, run the experiment, 
and save the results on your computer. All in **one single command**.

## Run your own experiments
Once you have defined your experiment using the [Empirical Framework](http://empiricalci.com/docs).
You can use the tool to execute your experiment on your own computer.
```
emp run <protocol> </path/to/code>
```
This is useful for quickly testing on your computer before saving changes to your code.

## Keep track of your experiments
In order to keep track of your experiments on the Empirical platform ([empiricalci.com](https://empiricalci.com)),
we integrate with GitHub for tracking any updates made to your research code.
Associate your repository by creating a [new project](https://empiricalci.com/projects/new).
Once you linked your project, every time that you push to that repo we'll create a new
version of your code on [empiricalci.com](https://empiricalci.com). 
Then, you have two ways to execute your experiments:

### Manual mode
You can run a specific version of the research code by doing the following:
```
emp run --save --version <SHA> <owner/project/protocol>
```
Note that you cannot run arbitray commits. Usually when pushing to GitHub,
the push contains multiple commits, but only the head commit is associated with the 
new version created on [empiricalci](https://empiricalci.com).
Therefore the given ``<SHA>`` must belong to a push's head commit.
You can review the versions with their associated commits
on [empiricalci.com/experiments](https://empiricalci.com/experiments).

To simplify things, when **emp** is run from the code directory and no ``--version`` is given,
**emp** will get the SHA of the current head commit of the code in order to retrieve the version.
This means that you can run this command right after pushing your commits to GitHub
without having to look for the commit ``<SHA>``, like this:
1. ``git push``
2. ``emp run --save <owner/project/protocol>`

### Continuous integration mode (NOT IMPLEMENTED YET)
**NOTE: This mode is still under development** 

In this mode you will be continuosly listening for updates in the GitHub repository.
Every time that a push is made to the repo, the experiments will automatically run on your 
computer and save the output to [empiricalci.com](https://empiricalci.com)
You can run experiments for all protcols in the project:i
```
emp listen <owner/project>
```
or run experiments for a specific protocol like this:
```
emp listen <owner/project/protocol>
```
Running this command will start a server on your computer that will receive updates 
every time a new push is made to the repository on GitHub.


