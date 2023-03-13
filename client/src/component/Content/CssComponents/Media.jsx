import _ from "lodash";
import { css } from "styled-components";
import useSize from "../../Hook/useSize";

export default function media(options, ContentCss) {
  return css`
    @media only screen and ${_.keys(options)
        .map((prop, i) => {
          const Size = useSize(options[prop]);
          return `(${prop}: ${!_.isUndefined(Size) ? Size : options[prop]})`;
        })
        .join(" and ")} {
      ${ContentCss}
    }
  `;
}
