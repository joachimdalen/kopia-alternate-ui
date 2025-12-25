import { i18n } from "@lingui/core";

export async function dynamicActivate() {
  // @ts-expect-error Ignore these as tsc can't find them, but Vite can.
  const { messages: enMessages } = await import("./locales/en/messages.po");
  // @ts-expect-error Ignore these as tsc can't find them, but Vite can.
  const { messages: nbMessages } = await import("./locales/nb/messages.po");
  i18n.load({
    en: enMessages,
    nb: nbMessages
  });
  i18n.activate("en");
}
