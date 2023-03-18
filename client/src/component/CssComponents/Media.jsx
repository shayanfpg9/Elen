import _ from "lodash";
import { css } from "styled-components";
import { getSize } from "../funcs/funcs";

export default function media(options, ContentCss) {
  return css`
    @media only screen and ${_.keys(options)
        .map((prop, i) => {
          const Size = getSize(options[prop]);
          return `(${prop}: ${
            !_.isUndefined(Size) ? Size + "px" : options[prop]
          })`;
        })
        .join(" and ")} {
      ${ContentCss}
    }
  `;
}
