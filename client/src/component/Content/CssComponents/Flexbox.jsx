import { css } from "chroma-js";

export default function flex(FlexOptions) {
  return css`
    display: flex;
    justify-content: ${FlexOptions.Jusc | "center"};
    align-items: ${FlexOptions.AlignItems | "center"};
    flex-flow: ${FlexOptions.FFlow | "row wrap"};
  `;
}
