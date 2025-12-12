# Kopia Alternate UI

> [!IMPORTANT]
> Kopia Alternate UI is not affiliated with or endorsed by the Kopia developers.

This project provides a dropin replacement for the original KopiaUI.

> [!CAUTION]
> This project is under active development, even though it might be a while between commits. There is currently a bunch of features implemented, but also a lot missing. You will have to jump between the original UI and this to do full configuration.

<!-- For screenshots, please see the [screenshots](#) folder. -->

|                                       |                                  |
| ------------------------------------- | -------------------------------- |
| ![](./screenshots/snapshots.jpeg)     | ![](./screenshots/policies.jpeg) |
| ![](./screenshots/policy-editor.jpeg) | ![](./screenshots/tasks.jpeg)    |

## Getting started

Add a new `.env` file with the following values and update as fitting to your setup

```env
KAU_KOPIA_ENDPOINT=http://localhost:51515
KAU_KOPIA_USERNAME=USERNAME
KAU_KOPIA_PASSWORD=SECRET_PASSWORD
```

These values are used in `vite.config.ts` to setup a proxy that handles authentication.

<!-- ```yml
services:
  kopiaaltui:
    conatiner_name: kopia-alt-ui
    image: <github>/joachimdalen/kopia-alt-ui:v5
    ports:
      - 8080:80
    environment:
      # This endpoint should be reachable by the host
      - KAU_KOPIA_ENDPOINT=http://host.docker.internal:51515
``` -->
