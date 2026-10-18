#!/usr/bin/env bash
set -euo pipefail

image="${1:?An immutable image tag is required}"
app_port="${2:-3400}"
registry_user="${3:?The registry username is required}"
[[ "$image" =~ ^ghcr\.io/[a-z0-9._/-]+:sha-[a-f0-9]{40}$ ]] || { echo 'Invalid release image'; exit 1; }
[[ "$app_port" =~ ^[0-9]+$ ]] && ((app_port >= 1024 && app_port <= 65535)) || { echo 'Invalid application port'; exit 1; }
command -v docker >/dev/null || { echo 'Install Docker Engine and the Compose plugin before enabling deployment'; exit 1; }
docker compose version >/dev/null
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
command -v flock >/dev/null || { echo 'Install util-linux for the deployment lock'; exit 1; }
exec 9> deployment.lock
flock --wait 180 9

# Refuse to take over a container outside this application's Compose project.
if docker inspect gospeed-web >/dev/null 2>&1; then
  owner="$(docker inspect --format '{{ index .Config.Labels "com.docker.compose.project" }}' gospeed-web)"
  [[ "$owner" == gospeed ]] || { echo 'gospeed-web belongs to another deployment; stopping without changes'; exit 1; }
fi
previous="$(docker inspect --format '{{.Config.Image}}' gospeed-web 2>/dev/null || true)"
registry_config="$(mktemp -d)"
cleanup() { rm -f -- "$registry_config/config.json"; rmdir -- "$registry_config" 2>/dev/null || true; }
trap cleanup EXIT
export DOCKER_CONFIG="$registry_config"
IFS= read -r registry_token
[[ -n "$registry_token" ]] || { echo 'A read token for the registry is required on stdin'; exit 1; }
printf '%s' "$registry_token" | docker login ghcr.io --username "$registry_user" --password-stdin >/dev/null
unset registry_token
export GOSPEED_IMAGE="$image" GOSPEED_APP_PORT="$app_port"
docker compose --project-name gospeed --file compose.yml pull web

if docker compose --project-name gospeed --file compose.yml up --detach --wait --wait-timeout 120 web; then
  printf '%s\n' "$image" > current-image
  echo "GoSpeedRaceway is healthy on 127.0.0.1:$app_port ($image)"
else
  echo 'Release failed its health check.'
  docker compose --project-name gospeed --file compose.yml logs --tail 80 web || true
  if [[ -n "$previous" ]]; then
    echo "Restoring the previous image: $previous"
    export GOSPEED_IMAGE="$previous"
    docker compose --project-name gospeed --file compose.yml up --detach --wait --wait-timeout 120 web
  fi
  exit 1
fi
