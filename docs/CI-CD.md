# GitHub Actions and VPS delivery

Repository: `https://github.com/nameretailersinc-lgtm/gospeed`.
VPS target supplied by the user: `66.29.148.167`.

`.github/workflows/ci-cd.yml` runs on pull requests, pushes to `main` and manual requests. Official actions are pinned to verified commit SHAs.

## Checks and container release

1. Node 22 installs the lockfile with `npm ci`, then runs lint, TypeScript, unit tests and the production build.
2. Three independent browser jobs test the same production-build artifact at desktop, tablet and mobile sizes. Browser reports, screenshots and traces are retained as workflow artifacts.
3. After every check passes on `main`, the Docker image is built and smoke-tested for the homepage and icon assets. The tested image is published as `ghcr.io/nameretailersinc-lgtm/gospeed:sha-<full-commit-sha>` and `:latest` using the workflow's built-in `GITHUB_TOKEN`.
4. VPS deployment runs only after the image job succeeds and deployment is enabled as described below. Pull requests cannot publish images or deploy.

The registry release is an artifact, not a claim that the website is live. This workstation has no Docker CLI; container execution is checked by the Linux workflow. GitHub Actions results must be inspected after the first push.

## Configure the VPS

Confirm the Linux distribution, SSH account/port, existing sites, available app port and domain DNS before enabling deployment. No server provisioner, firewall edit or Nginx overwrite runs automatically.

The SSH account needs Docker Engine, Docker Compose v2 with `--wait`, Bash and `flock` (util-linux), plus permission to run Docker and write `~/gospeed`. Docker access is powerful; use an account you control and a dedicated deployment key.

In GitHub repository **Settings → Secrets and variables → Actions**, configure:

| Kind | Name | Value |
| --- | --- | --- |
| Variable | `VPS_HOST` | `66.29.148.167` (the workflow default) |
| Variable | `VPS_USER` | Actual SSH deployment account; no username is assumed |
| Variable | `VPS_SSH_PORT` | SSH port, default `22` |
| Variable | `VPS_APP_PORT` | Available local app port, default `3001` |
| Variable | `NEXT_PUBLIC_CONTACT_EMAIL` | `info@nameretailer.com` (the build default) |
| Secret | `VPS_SSH_KEY` | Dedicated private deployment key whose public key is authorized for that account |
| Secret | `VPS_KNOWN_HOSTS` | Verified OpenSSH known-hosts entry for the server and SSH port |
| Variable | `ENABLE_VPS_DEPLOY` | Leave unset until setup is complete; set to `true` for automatic deployment after successful `main` checks |

Do not put passwords, private keys or access tokens in Git, workflow YAML or chat. Compare the server key fingerprint with a trusted source such as the VPS console before saving its known-hosts entry. For a nonstandard SSH port, use the `[host]:port` known-hosts format. The workflow deliberately refuses unknown or changed server keys.

For the first release, keep `ENABLE_VPS_DEPLOY` unset and run **Actions → CI / CD → Run workflow**, on `main`, selecting **Deploy to the configured VPS**. It still runs the checks before deployment. The `production` GitHub environment can also have required reviewers configured in repository settings.

## Runtime and rollback

The workflow copies `deploy/compose.yml` and `deploy/deploy.sh` into the account's `~/gospeed` folder. A temporary registry login uses the job's package-read token, then is removed. The script serializes deployments, pulls the immutable commit image before replacing the app, and waits for the container health check. If startup fails and a previous image exists, it attempts to restore that image and fails the workflow. The first release has no previous version to restore.

The Compose project is `gospeed`, with container `gospeed-web`. Deployment refuses to take over a same-named container belonging to another project. It does not prune Docker resources, modify other Compose projects or remove volumes. A successful image reference is recorded in `~/gospeed/current-image`. A Compose replacement may briefly interrupt service; zero-downtime deployment is not claimed.

The app binds to **127.0.0.1:3001 on the VPS**, not the public interface. Your reverse proxy must forward the domain to that port. `deploy/nginx.conf.example` is a reference for a dedicated virtual host; review existing configuration, run `nginx -t` and configure HTTPS before enabling the live site. If `VPS_APP_PORT` changes, update the proxy target too.

## Repository contents

App source, tests, public assets and deployment configuration are committed. `.env.local`, dependencies, build output and generated browser evidence stay local. The guide inventory is retained; complete browser evidence is available locally and future workflow reports are downloadable from Actions. The README remains the application documentation rather than being replaced by an empty starter.

Official references: [Node.js builds](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs), [workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data), [publishing containers with GitHub Actions](https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions).
