@ECHO OFF
if "%1"=="" echo Use: emp run experiment-name [path-to-code] & exit /b
if "%1"=="run" IF NOT "%2"=="" IF NOT "%3"=="" (
	docker run -t --rm -v /var/run/docker.sock:/var/run/docker.sock^
 	 -v %3:/empirical/code:ro^
 	 -v %EMPIRICAL_DIR%/data:/empirical/data^
 	 -v %EMPIRICAL_DIR%/workspaces:/empirical/workspaces^
 	 -e EMPIRICAL_DIR=%EMPIRICAL_DIR%^
 	 -e DEBUG=dataset-cache^
 	 empiricalci/emp %2
)
if "%1"=="run" IF NOT "%2"=="" (
	docker run -t --rm^
	empiricalci/emp pull %2
)