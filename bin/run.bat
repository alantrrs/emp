@ECHO OFF
SET "TAB=	"
if "%1"=="run" IF NOT "%2"=="" IF NOT "%3"=="" (
	docker run -t --rm -v /var/run/docker.sock:/var/run/docker.sock^
 	 -v %3:/empirical/code:ro^
 	 -v %EMPIRICAL_DIR%/data:/empirical/data^
 	 -v %EMPIRICAL_DIR%/workspaces:/empirical/workspaces^
 	 -e EMPIRICAL_DIR=%EMPIRICAL_DIR%^
 	 -e DEBUG=dataset-cache^
 	 empiricalci/emp run %2 & exit /b
)
if "%1"=="run" IF NOT "%2"=="" (
	docker run -t --rm -v /var/run/docker.sock:/var/run/docker.sock^
 	 -v %EMPIRICAL_DIR%/data:/empirical/data^
 	 -v %EMPIRICAL_DIR%/workspaces:/empirical/workspaces^
 	 -e EMPIRICAL_API_URI=%EMPIRICAL_API_URI%^
     -e EMPIRICAL_API_KEY=56f21e9c444d700624705d16^
     -e EMPIRICAL_API_SECRET=e6bbfb2b-f608-48a8-8a60-c78df6c2bb97^
 	 -e EMPIRICAL_DIR=%EMPIRICAL_DIR%^
 	 -e DEBUG=dataset-cache^
	 empiricalci/emp pull %2 & exit /b
)
if "%1"=="listen" (
	docker run -t --rm -v /var/run/docker.sock:/var/run/docker.sock^
 	 -v %EMPIRICAL_DIR%/data:/empirical/data^
 	 -v %EMPIRICAL_DIR%/workspaces:/empirical/workspaces^
 	 -e EMPIRICAL_API_URI=%EMPIRICAL_API_URI%^
     -e EMPIRICAL_API_KEY=56f21e9c444d700624705d16^
     -e EMPIRICAL_API_SECRET=e6bbfb2b-f608-48a8-8a60-c78df6c2bb97^
 	 -e EMPIRICAL_DIR=%EMPIRICAL_DIR%^
 	 -e DEBUG=dataset-cache^
	 empiricalci/emp listen & exit /b
)
:: Print usage
echo Empirical 2016
echo.
echo Use:
echo.
echo run.bat run owner/repository/experiment/push
echo %TAB%Fetch and run the experiment
echo.
echo run.bat run experiment path-to-code
echo %TAB%Run experiment offline in path path-to-code
echo %TAB%path-to-code should be in format /c/Users/user/... to be recognized by Docker
echo.
echo run.bat listen
echo %TAB%Listen to incoming experiment from Empirical server