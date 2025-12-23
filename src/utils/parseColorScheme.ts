import { type MantineColorScheme } from "@mantine/core";

export function parseColorScheme(theme: string): MantineColorScheme {
    if (theme !== "light" && theme !== "dark") return "light";
    return theme;
}
