
# EMP
_Empirical Client_

**emp** is a client that connects to  **empiricalci.com** to automate running experiments in your computer

## Dependencies
The core enabling technology that's used in this framework is **Docker**. 
Docker allows us to create self-contained portable environments that work accross different platforms. 
In order to keep the dependencies  to a minmum and keep the whole environment portable, 
everything is run through Docker. The only requirements are:
- [Docker](https://docs.docker.com/engine/installation/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup
### Docker Credentials
During the workflow, emp needs to push and pull images from the [Docker Hub](https://hub.docker.com/).
You need to provide your Docker Hub credentials for the tool to be able to access it.
These credentials are usually in ``~/.docker/config.json`` after you do ``docker login``
You need to pass the credentials to the system in the form of environment variables. You can place them
in your ``~/.bashrc`` for convinience
```
export DOCKER_USER=your-docker-user
export DOCKER_AUTH='{the auth token found on ~/.docker/config.json}'
```


## Use
### Build the image
The ``node_modules/`` are built  and cached into the image. So every time you update the package.json
make sure you re-build the image:
```
docker-compose build emp
```

### Run the worker
The tool is currently implemented as a worker that will connect to a queue to get tasks. Run it by doing:
```
docker-compose up emp
```
This command will create a queue container with rabbit-mq and the emp container that runs the worker
consuming the tasks
