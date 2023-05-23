# Next.js issue 48539 minimal application

## General

Minimal Next.js Web application that reproduces
[issue #48539](https://github.com/vercel/next.js/issues/48539).

Execute with one of the methods below and then open your Web Browser at
`http://127.0.0.1:3000` and login with any username and password `secret`.

## How to reproduce the error

**NOTE**: The guide below is tested on Linux system with Bash shell.

Install [curl](https://curl.se/) and launch the script latency measure script:

```Bash
./website_latency.sh http://127.0.0.1:3000 | tee -a latency.log
```

This script will loop and perform HTTP requests on the URL and print the
response code and latency information. Redirection to `latency.log` is useful
for later review.

Launch the application with Docker Compose:

```Bash
npm run start-docker
```

and after a few seconds kill the latency measure script with `CTRL + C`.

Review the latency.log and watch for the first logged request where the
`Response code:` switches from `000` to `308`. This is the first call served by
the application after launch and it will have more latency than any subsequent
call in the log. This latency can reach the scale of 2 to 5 seconds according to
application and in Cloud systems where the application is launched ON DEMAND
instead of being ready to serve, the initial overhead time cost can be
multiplied.

Example of `latency.log` on the last `000` response and the 3 first `308`
responses, while running on local Docker container:

```
Testing Website Response Time for :http://127.0.0.1:3000/

Response code:		000
Number of redirects:		0
Lookup Time:		0.000020
Connect Time:		0.000000
AppCon Time:		0.000000
Redirect Time:		0.000000
Pre-transfer Time:	0.000000
Start-transfer Time:	0.000000

Total Time:		0.000135

Testing Website Response Time for :http://127.0.0.1:3000/

Response code:		308
Number of redirects:		0
Lookup Time:		0.000020
Connect Time:		0.000102
AppCon Time:		0.000000
Redirect Time:		0.000000
Pre-transfer Time:	0.000127
Start-transfer Time:	1.785779

Total Time:		1.785845

Testing Website Response Time for :http://127.0.0.1:3000/

Response code:		308
Number of redirects:		0
Lookup Time:		0.000033
Connect Time:		0.000141
AppCon Time:		0.000000
Redirect Time:		0.000000
Pre-transfer Time:	0.000174
Start-transfer Time:	0.001954

Total Time:		0.002022

Testing Website Response Time for :http://127.0.0.1:3000/

Response code:		308
Number of redirects:		0
Lookup Time:		0.000033
Connect Time:		0.000129
AppCon Time:		0.000000
Redirect Time:		0.000000
Pre-transfer Time:	0.000166
Start-transfer Time:	0.001916

Total Time:		0.001977
```

In Google Cloud Run service, a single index request can cause the spin up of
multiple application containers (with a policy the end-user cannot control) and
the start up latency to be paid multiple times until all resources are ready for
the index page.

Check this application deployed at Cloud Run
[here](https://test-cloud-run-4lfw7hjlma-uc.a.run.app).

## Docker execution

- Run with Docker Compose: `npm run start-docker`

- Shutdown and clean up Docker Compose containers: `npm run stop-docker`

## Local execution

- Install [node.js](https://nodejs.org) version **16.X.Y LTS**. There is an
  automated script that can do that for your local account using the
  [nvm](https://github.com/nvm-sh/nvm) installer:

  ```Bash
  # This will install the proper node.js version in your account
  .github/scripts/install_nodejs.sh
  ```

  This method only works in POSIX-compliant shell (sh, dash, ksh, zsh, bash),
  in particular on these platforms: unix, macOS, and windows WSL.

  **CAUTION:** DO NOT execute the script above if you have already a proper
  `node.js` installation.

- Run local development server: `npm ci && npm run dev`
