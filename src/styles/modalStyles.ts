import type { CSSProperties, ModalBaseStylesNames } from "@mantine/core";

const modalBaseStyles: Partial<Record<ModalBaseStylesNames, CSSProperties>> = {
  content: {
    display: "flex",
    flexDirection: "column"
  },
  body: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1
  }
};
export default modalBaseStyles;
