# GitHub Actions and VPS delivery

Repository: `https://github.com/nameretailersinc-lgtm/gospeed`.
VPS target supplied by the user: `5.189.158.75`.

`.github/workflows/ci-cd.yml` runs on pull requests, pushes to `main` and manual requests. Official actions are pinned to verified commit SHAs.

## Checks and container release


1. Node 22 installs the lockfile with `npm ci`, then runs lint, TypeScript, unit tests and the production build.
2. Three independent browser jobs test the same production-build artifact at desktop, tablet and mobile sizes. Browser reports, screenshots and traces are retained as workflow artifacts.
3. After every check passes on `main`, the Docker image is built and smoke-tested for the homepage and icon assets. The tested image is published as `ghcr.io/nameretailersinc-lgtm/gospeed:sha-<full-commit-sha>` and `:latest` using the workflow's built-in `GITHUB_TOKEN`.
4. VPS deployment runs only after the image job succeeds and deployment is enabled as described below. Pull requests cannot publish images or deploy.

The registry release is an artifact, not a claim that the website is live. This workstation has no Docker CLI; container execution is checked by the Linux workflow. GitHub Actions results must be inspected after the first push.

## Configure the VPS

The supplied SSH target is `root` on port `22`. Confirm the Linux distribution, existing sites, available app port and domain DNS before enabling deployment. No server provisioner, firewall edit or Nginx overwrite runs automatically.

The SSH account needs Docker Engine, Docker Compose v2 with `--wait`, Bash and `flock` (util-linux), plus permission to run Docker and write `~/gospeed`. The workflow defaults to the supplied `root` account and port `22`, which can be overridden with repository variables. Root has full server privileges; a dedicated non-root deployment account with Docker access is preferable if the VPS can be configured for one.

In GitHub repository **Settings → Secrets and variables → Actions**, configure:

| Kind | Name | Value |
| --- | --- | --- |
| Variable | `VPS_HOST` | `5.189.158.75` (the workflow default) |
| Variable | `VPS_USER` | Optional override; defaults to `root` |
| Variable | `VPS_SSH_PORT` | Optional override; defaults to `22` |
| Variable | `VPS_APP_PORT` | VPS app port, default `3400` |
| Variable | `NEXT_PUBLIC_CONTACT_EMAIL` | `info@nameretailer.com` (the build default) |
| Secret | `VPS_SSH_KEY` | Dedicated private deployment key whose public key is authorized for that account |
| Secret | `VPS_KNOWN_HOSTS` | Verified OpenSSH known-hosts entry for the server and SSH port |
| Variable | `ENABLE_VPS_DEPLOY` | Leave unset until setup is complete; set to `true` for automatic deployment after successful `main` checks |

The workflow uses SSH keys, not password authentication. To enable CI/CD, authorize a dedicated deployment key for the chosen SSH account and store its private key only in the `VPS_SSH_KEY` GitHub secret. Store a verified OpenSSH host-key entry in `VPS_KNOWN_HOSTS`; compare its fingerprint with a trusted source such as the VPS console before saving it. For a nonstandard SSH port, use the `[host]:port` known-hosts format. Do not put passwords, private keys or access tokens in Git, workflow YAML or chat. The workflow deliberately refuses unknown or changed server keys.

### Create the CI SSH key and verify the server identity

On this Windows PC, in PowerShell, create a dedicated key pair (press Enter at both passphrase prompts so the noninteractive GitHub runner can use it):

```powershell
ssh-keygen -t ed25519 -C "gospeed-github-actions" -f "$HOME\.ssh\gospeed_vps"
```

Install only the **public** key on the VPS. This command prompts for the current SSH password and appends the public key to root's `authorized_keys`; the password is entered at the prompt and is not saved:

```powershell
Get-Content -Raw "$HOME\.ssh\gospeed_vps.pub" | ssh root@5.189.158.75 "umask 077; mkdir -p ~/.ssh; cat >> ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys"
```

Verify that key login works before adding it to GitHub:

```powershell
ssh -i "$HOME\.ssh\gospeed_vps" -o IdentitiesOnly=yes root@5.189.158.75
```

To pin the VPS identity safely, use the VPS provider's web console (or another already trusted session) to get its Ed25519 host-key fingerprint:

```sh
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Back in PowerShell, collect the public host key and compare the fingerprint with the trusted VPS-console result. `ssh-keyscan` only fetches a key; it does **not** verify that key:

```powershell
$knownHosts = "$HOME\.ssh\gospeed_known_hosts"
ssh-keyscan -p 22 -t ed25519 5.189.158.75 2>$null | Set-Content -Encoding ascii $knownHosts
ssh-keygen -lf $knownHosts
```

Only if the fingerprints match, copy each file's contents into its matching GitHub Actions secret:

```powershell
Get-Content -Raw "$HOME\.ssh\gospeed_vps" | Set-Clipboard
# Paste into the VPS_SSH_KEY secret, then copy the known-hosts entry:
Get-Content -Raw "$HOME\.ssh\gospeed_known_hosts" | Set-Clipboard
# Paste into the VPS_KNOWN_HOSTS secret.
```

Create the secrets in the repository's **Settings → Secrets and variables → Actions → New repository secret**. Never paste the private key into chat or commit it. The workflow currently logs in as `root`; that key grants broad server access. A dedicated, restricted deployment account is safer if you can arrange one.

For the first release, keep `ENABLE_VPS_DEPLOY` unset and run **Actions → CI / CD → Run workflow**, on `main`, selecting **Deploy to the configured VPS**. It still runs the checks before deployment. The `production` GitHub environment can also have required reviewers configured in repository settings.

## Runtime and rollback

The workflow copies `deploy/compose.yml` and `deploy/deploy.sh` into the account's `~/gospeed` folder. A temporary registry login uses the job's package-read token, then is removed. The script serializes deployments, pulls the immutable commit image before replacing the app, and waits for the container health check. If startup fails and a previous image exists, it attempts to restore that image and fails the workflow. The first release has no previous version to restore.

The Compose project is `gospeed`, with container `gospeed-web`. Deployment refuses to take over a same-named container belonging to another project. It does not prune Docker resources, modify other Compose projects or remove volumes. A successful image reference is recorded in `~/gospeed/current-image`. A Compose replacement may briefly interrupt service; zero-downtime deployment is not claimed.

The app binds to **127.0.0.1:3400 on the VPS**, not the public interface. Your reverse proxy must forward the domain to that port. `deploy/nginx.conf.example` is a reference for a dedicated virtual host; review existing configuration, run `nginx -t` and configure HTTPS before enabling the live site. If `VPS_APP_PORT` changes, update the proxy target too.

### Nginx and HTTPS

#### Point Spaceship DNS to the VPS

In Spaceship, open **Domain Manager → gospeedraceway.com → DNS / DNS Records** (menu labels may vary), then edit the existing records:

| Host / name | Type | Current value | Action |
| --- | --- | --- | --- |
| `@` | A | `66.29.148.167` | Edit this record's value to `5.189.158.75`; keep the existing 5-minute TTL. |
| `www` | CNAME | `gospeedraceway.com` | Leave it as-is; it will follow the apex domain to the new IP. |
| `ftp` | A | `66.29.148.167` | Not needed for the website. Leave it if the old hosting's FTP service is still used; otherwise remove it or update it only when you know the replacement service. |
| `webdisk` | A | `66.29.148.167` | Not needed for the website. Leave it if the old hosting's Web Disk service is still used; otherwise remove it or update it only when you know the replacement service. |
| `@` | TXT | `v=spf1 include:spf.shared.spaceship.host ~all` | Leave unchanged; it is an email-sender policy, not the website address. |

Change only the apex `@` A record for the website. Preserve any MX, DKIM, DMARC, verification, and other mail-related records not listed above. If there is an `AAAA` record for `@` or `www` pointing to the old host, check with the VPS provider before changing it; a stale IPv6 record can send some visitors to the old server. Save the DNS changes and allow time for caches to update (the listed TTL is 5 minutes, though some resolvers may take longer).

On Windows PowerShell, check the public DNS result:

```powershell
Resolve-DnsName gospeedraceway.com -Type A
Resolve-DnsName www.gospeedraceway.com -Type A
```

The result should resolve to `5.189.158.75`. Configure DNS only after the VPS app and Nginx are ready to serve the site. On an Ubuntu/Debian VPS with Nginx, inspect the active configuration before adding a site so you do not replace another site's configuration:

```sh
sudo nginx -T
sudo nano /etc/nginx/sites-available/gospeedraceway.com
```

Put the following in that new site file (also available as [`deploy/nginx.conf.example`](../deploy/nginx.conf.example)):

```nginx
server {
    listen 80;
    server_name gospeedraceway.com www.gospeedraceway.com;

    location / {
        proxy_pass http://127.0.0.1:3400;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and validate the new site, then reload Nginx:

```sh
sudo ln -s /etc/nginx/sites-available/gospeedraceway.com /etc/nginx/sites-enabled/gospeedraceway.com
sudo nginx -t
sudo systemctl reload nginx
```

If the symlink already exists, do not replace it blindly; inspect where it points. After DNS resolves to the VPS and inbound ports 80/443 are allowed, install HTTPS with Certbot on Ubuntu/Debian:

```sh
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d gospeedraceway.com -d www.gospeedraceway.com
```

The example is HTTP-only until Certbot configures TLS. Confirm HTTPS and renewal before public launch.

## Repository contents

App source, tests, public assets and deployment configuration are committed. `.env.local`, dependencies, build output and generated browser evidence stay local. The guide inventory is retained; complete browser evidence is available locally and future workflow reports are downloadable from Actions. The README remains the application documentation rather than being replaced by an empty starter.

Official references: [Node.js builds](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs), [workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data), [publishing containers with GitHub Actions](https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions).
