<a id="readme-top"></a>

<div align="center">
  <h1 align="center">Kopia Alternate UI</h1>
  <p align="center">
    Homelab mirror of <a href="https://github.com/joachimdalen/kopia-alternate-ui">joachimdalen/kopia-alternate-ui</a>,
    carrying fixes we run in production.
  </p>
</div>

> [!IMPORTANT]
> Not affiliated with or endorsed by the Kopia developers or the upstream author.
> Distributed under the Apache License 2.0 — see `LICENSE`.

## What this is

A static web UI for [Kopia](https://kopia.io) servers. The build output in
`dist/` is plain static files that talk to one or more Kopia servers' REST API
directly from the browser; there is no backend in this repository.

Multi-instance routing is handled by the web server serving the files: it
exposes an `instances.json` manifest at `/instances` (id, display name,
default) and one API path per instance, prefixed with the instance id. The
concrete configuration for our deployment lives in the infrastructure
repository.

## Features

- Clean UI for sources, snapshots, browse/restore, policies, tasks and repo settings
- Multi-instance: switch between Kopia servers from the top bar
- Localization (English, Norwegian)
- Per-instance login prompt on 401, credentials persisted per instance

## Fixes carried here

Keep anything that would interest upstream on a separate, clean branch off
`upstream/main` so it can be sent upstream without our local changes attached.

| Branch | What it fixes |
| --- | --- |
| `fix/snapshot-download-prefix` | Snapshot download links lacked the `/api/<instance>` prefix and returned `index.html` instead of the file (upstream #117) |
| `fix/persist-credentials` | Per-instance credentials were held in `sessionStorage`, so every new tab re-prompted for all instances; now persisted in `localStorage` |

## Development

Requires a couple of throwaway Kopia servers, configured via
[.dev/docker-compose.yml](./.dev/docker-compose.yml):

1. Uncomment the `--tls-generate-cert` argument and run `docker compose up`
2. Copy the `SERVER CERT SHA256` printed by `kopia-primary`, then comment the
   argument out again (Kopia fails to start later if it stays defined)
3. Run `kopia server user add root@kopia-secondary` inside `kopia-primary`;
   note the password you set
4. `npm install && npm run dev`
5. Log in to the first instance with `USER_ONE` / `PASSWORD_ONE`, add a
   `filesystem` repo targeting `/repository` using `PASSWORD_ONE`
6. Switch to the second instance, log in with `USER_TWO` / `PASSWORD_TWO`, and
   add a `Kopia Repository Server` repo pointing at `https://kopia-primary:51515`
   with the cert SHA from step 2

Useful commands:

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + static bundle in `dist/` |
| `npm run check` | Biome lint + format check |
| `npm run test` | Vitest |

## License

Apache License 2.0 — see `LICENSE`. Upstream work by Joachim Dalen; the changes
on top of it are ours.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
