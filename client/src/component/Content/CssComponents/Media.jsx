import _ from "lodash";
import { css } from "styled-components";

export default function media(options, ContentCss) {
  return css`
    @media only screen and ${() => {
        _.keys(options).map(
          (prop, i) =>
            `(${prop}: ${options[prop]})${
              !_.isEqual(i + 1, _.keys(options)) ? " and " : ""
            }`
        );
      }} {
      ${ContentCss}
    }
  `;
}
