import { css } from "styled-components";
import { getSize } from "../funcs/funcs";

export default function media(options, ContentCss) {
  return css`
    @media only screen and ${Object.keys(options)
        .map((prop) => {
          const Size = getSize(options[prop]);
          return `(${prop}: ${
            (Size)!==undefined ? Size + "px" : options[prop]
          })`;
        })
        .join(" and ")} {
      ${ContentCss}
    }
  `;
}
