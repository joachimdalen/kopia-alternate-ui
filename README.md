<a id="readme-top"></a>

<div align="center">
  <!-- <a href="https://github.com/joachimdalen/kopia-alternate-ui">
    <img src="assets/logo.png" alt="Logo" width="80" height="80">
  </a> -->

  <h1 align="center">Kopia Alternate UI</h1>

  <p align="center">
    This project provides a dropin replacement for the original KopiaUI!
  </p>
</div>

> [!IMPORTANT]
> Kopia Alternate UI is not affiliated with or endorsed by the Kopia developers.

<!-- ABOUT THE PROJECT -->

## About The Project

![](./screenshots/screenshot.png)

> [!CAUTION]
> This project is under active development, even though it might be a while between commits. It should be mostly operational, but usage will determine potential bugs. Please see the [feature mapping](https://github.com/joachimdalen/kopia-alternate-ui/issues/5) issue for progress on implementing existing features.

I wanted a cleaner and easier to use UI for Kopia than the offical one. There are also some features I want to implement that is not in the official UI, such as multi server interaction, improved statistics and more.

If this project helped you or you are interested in using it, please consider giving it a ⭐️! It's the only way I will be able to see the usage of this tool and how much time should be spent improving/finishing it.

## Getting Started

### Configure instances

The support for multiple servers must currently be configured manually. We have an issue []() to have this happen automatically when the container start, and that feature will be implemented later on.

1. Create a new json file. For examples we will use `instances.json`. This file will contains all the instances you should be able to switch between.

```json
[
  {
    "id": "primary",
    "name": "docker-primary-01",
    "default": true
  },
  {
    "id": "secondary",
    "name": "docker-secondary-01",
    "default": false
  }
]
```

- `id`: Should be unique across all instances. This is the key we will route the Nginx proxy based on.
- `name`: The display name used in the dropdown in the UI
- `default`: When `true`, will be the default selected instances in the UI

2. Update the default `nginx.conf` file with new locations for your instances. During this step you will also need to decide how you want to authenticate aginst the servers. Please see [Authenticating to servers](#authenticating-to-servers) for more information.

```nginx
location /api/[SERVER-ID] {
  rewrite ^/api/[SERVER-ID]/(.*) /api/$1 break;
  proxy_pass https://[DOCKER-CONTAINEr]:51515;
  proxy_hide_header WWW-Authenticate;
  expires -1;
}
```

```yml
services:
  kopiaaltui:
    conatiner_name: kopia-ui
    image: ghcr.io/joachimdalen/kopia-alternate-ui:v0.0
    ports:
      - 8080:80
    volumes:
      - ../docker/instances.json:/app/config/instances.json:ro
      - ../docker/nginx.conf:/etc/nginx/templates/default.conf.template:ro
```

### Authenticating to servers

## Development

Add a new `.env` file with the following values and update as fitting to your setup

```env
KAU_KOPIA_ENDPOINT=http://localhost:51515
KAU_KOPIA_USERNAME=USERNAME
KAU_KOPIA_PASSWORD=SECRET_PASSWORD
```

These values are used in `vite.config.ts` to setup a proxy that handles authentication.

## License

Distributed under the Apache License 2.0 License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!--  -->
